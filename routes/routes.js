const express = require('express')
const router = express.Router();
const apiController = require('../controller/controller.js')

router.get('/data', apiController.contestApi)
      .post('/youtube',apiController.youtubeApi)

exports.router = router