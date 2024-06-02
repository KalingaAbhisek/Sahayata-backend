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
    start: String,
    end: String,
    host: String,
    resource: String,
    href: String,
  });
  
const Contest = mongoose.model('Contest1', contestSchema);

const dataSchema = new mongoose.Schema({
  title: String,
  link: String,
  date: Date
});

const Data = mongoose.model('webscrape data', dataSchema);
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

cron.schedule('*/2 * * * *', async () => {
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
      console.log('Previous data for contest from MongoDB is deleted');
      await Contest.insertMany(finalResponse);
      console.log('API response for contest saved to MongoDB');
    } catch (error) {
      console.error('Error fetching and saving API response:', error);
    }
  });

  cron.schedule('*/2 * * * *', async () => {
      try {
        const response = await axios.get('https://soa.ac.in/iter');
        const html = response.data;
        const $ = cheerio.load(html);
        const scrapedData = [];
        $('.sqs-gallery-meta-container').each((index, element) => {
          const title = $(element).find('.summary-title-link').text();
          const link = $(element).find('.summary-title-link').attr('href');
          const date = new Date($(element).find('.summary-metadata-item--date').attr('datetime'));
          scrapedData.push({ title, link, date });
      });

        await Data.deleteMany();
        console.log('Previous data for webscrape from MongoDB is deleted');
        await Data.insertMany(scrapedData);
        console.log('Data scraped and stored in MongoDB');
    } catch (error) {
        console.error('Error scraping data:', error);
    }
  });
}


exports.Data = Data;
exports.Contest = Contest;
