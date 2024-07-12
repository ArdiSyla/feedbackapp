const Service = require('../models/servicemodel');
const ServiceStatistic = require('../models/serviceStatisticsmodel');

async function getServiceUsageStatistics(req, res) {
    try {
        // Number of services offered
        const numberOfServices = await Service.countDocuments({});

        // Most popular services based on user interactions
        const popularServices = await Service.aggregate([
            { $group: {
                _id: '$category', // Grouping by service category
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 }},
            { $limit: 5 }
        ]);

        // Transform popularServices to match the schema
        const formattedPopularServices = popularServices.map(service => ({
            category: service._id,
            count: service.count
        }));

        // Services offered per company
        const servicesPerCompany = await Service.aggregate([
            { $lookup: {
                from: 'companies',
                localField: 'company',
                foreignField: '_id',
                as: 'companyDetails'
            }},
            { $unwind: '$companyDetails' },
            { $group: {
                _id: '$companyDetails.name',
                services: { $push: '$name' }
            }}
        ]);

        // Transform servicesPerCompany to match the schema
        const formattedServicesPerCompany = servicesPerCompany.map(company => ({
            companyName: company._id,
            services: company.services
        }));

        // Trends in service usage over time
        const serviceUsageTrends = await Service.aggregate([
            { $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' }},
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 }}
        ]);

        // Transform serviceUsageTrends to match the schema
        const formattedServiceUsageTrends = serviceUsageTrends.map(trend => ({
            month: trend._id,
            count: trend.count
        }));

        // Construct the data object to be saved
        const serviceStatisticsData = {
            numberOfServices,
            popularServices: formattedPopularServices,
            servicesPerCompany: formattedServicesPerCompany,
            serviceUsageTrends: formattedServiceUsageTrends
        };

        // Save statistics to database
        const savedServiceStatistics = await ServiceStatistic.create(serviceStatisticsData);

        // Respond with the saved statistics
        res.json(savedServiceStatistics);
    } catch (error) {
        console.error('Error fetching/service usage statistics:', error);
        res.status(500).send('Internal Server Error: ' + error.message); // Provide more detailed error message
    }
}

async function deleteServiceStatisticsById(req, res) {
    const { id } = req.params;

    try {
        const deletedStatistics = await ServiceStatistic.findByIdAndDelete(id);

        if (!deletedStatistics) {
            return res.status(404).send('Statistics not found');
        }

        res.status(200).json({ message: 'Statistics deleted successfully', deletedStatistics });
    } catch (error) {
        console.error('Error deleting statistics:', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
}

module.exports = {
    getServiceUsageStatistics,
    deleteServiceStatisticsById
};