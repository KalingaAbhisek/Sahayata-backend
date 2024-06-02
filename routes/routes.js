const express = require('express')
const router = express.Router();
const apiController = require('../controller/controller.js')

router.get('/data', apiController.contestApi)
      .get('/dsa/:topic',apiController.youtubeApi)
      .get('/notice',apiController.noticeApi)

exports.router = router