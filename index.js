const express = require('express');
const app = express();
const mongoose = require('mongoose');
const customerRoutes = require('./routes/customerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const analyticsDataRoutes = require('./routes/analyticsDataRoutes');
const customerSupportRatingRoutes = require('./routes/customerSupportRatingRoutes');
const questionnaireRoutes = require('./routes/questionnaireRoutes');
const responseRoutes = require('./routes/responseRoutes');
const companyRoutes = require('./routes/companyRoutes');
const questionRoutes = require('./routes/questionRoutes');
const reportsController = require('./controllers/reportsController');


app.use(express.json());

app.use('/customers', customerRoutes);
app.use('/services', serviceRoutes);
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/analyticsdata', analyticsDataRoutes);
app.use('/customersupportratings', customerSupportRatingRoutes);
app.use('/questionnaires', questionnaireRoutes);
app.use('/responses', responseRoutes);
app.use('/company', companyRoutes);
app.use('/question', questionRoutes);
app.use('/api', reportsController);


mongoose.connect('mongodb://localhost:27017/feedbackApp').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => console.error('Error connecting to MongoDB:', err));
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

