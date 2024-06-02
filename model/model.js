const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment-timezone');

// const convertUtcToIst = async (utcDate) => {
//   const date = new Date(utcDate);
//   const offsetIST = 5.5 * 60 * 60 * 1000;
//   let istDate = new Date(date.getTime() + offsetIST);
//   istDate = istDate.toLocaleString("en-IN",{
//     timeZone: 'Asia/Kolkata',
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true,
//     weekday: 'short'
//   });
//   istDate = istDate.replace('am', 'AM').replace('pm', 'PM');
//   return istDate;
// }

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

cron.schedule('*/10 * * * *', async () => {
    try {
      const response = await axios.get(API_URL);
      const responseData = response.data.objects;
      const finalResponse = await responseData.map((data)=>{
        const startDate = moment.utc(data.start).tz(`${moment.tz.guess(true)}`).format("dddd, MMMM Do YYYY, h:mm:ss a");
        const endDate = moment.utc(data.end).tz(`${moment.tz.guess(true)}`).format("dddd, MMMM Do YYYY, h:mm:ss a");
        const obj = JSON.parse(JSON.stringify(data));
        obj.start = startDate;
        obj.end = endDate;
        return obj;
      })
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
