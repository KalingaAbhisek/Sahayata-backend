const express = require('express')
const router = express.Router();
const apiController = require('../controller/controller.js')

router.get('/data', apiController.contestApi)
      .post('/youtube',apiController.youtubeApi)
      .get('/notice',apiController.noticeApi)

exports.router = router