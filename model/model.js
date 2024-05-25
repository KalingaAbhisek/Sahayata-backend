const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');

// Connect to MongoDB
// Define a Mongoose schema
const contestSchema = new mongoose.Schema({
    event: String,
    start: Date,
    end: Date,
    host: String,
    resource: String,
    href: String,
  });
  
const Contest = mongoose.model('Contest', contestSchema);
exports.db = (API_URL)=>{
    mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_APP_NAME}.zhsxrdu.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_DB_APP_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

cron.schedule('* * * * *', async () => {
    try {
      const response = await axios.get(API_URL);
      const responseData = response.data.objects;
  
       // Process the response and save it to MongoDB
      await Contest.deleteMany();
      console.log('Previous data from MongoDB is deleted');
      await Contest.insertMany(responseData);
      console.log('API response saved to MongoDB');
    } catch (error) {
      console.error('Error fetching and saving API response:', error);
    }
  });
}

exports.Contest = Contest;
