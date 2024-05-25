const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.REACT_APP_PORT_BACKEND;
const API_KEY = process.env.REACT_APP_CONTEST_API_KEY; 
// Your API key
const API_URL = `https://clist.by:443/api/v4/contest/?limit=1000&upcoming=true&username=adskguest&api_key=${API_KEY}`

const router = require('./routes/routes')
const model = require('./model/model')
model.db(API_URL);
// const allowedOrigins = [ 'http://localhost:3000','https://sahayata-app-1.web.app/','https://sahayata-app-1.firebaseapp.com/','https://us-central1-sahayata-app-1.cloudfunctions.net/'];

app.use(cors({ origin: true }));
// app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json()) 
app.use('/api',router.router)



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

