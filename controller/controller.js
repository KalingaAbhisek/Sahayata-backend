const db = require('../model/model')
const axios = require('axios')
const Contest = db.Contest;
const dsaData = require('../dsa.json')
const Data = db.Data;
exports.contestApi = async(req,res) => {
    try {
        const contests = await Contest.find().lean();
        res.json(contests);
    } catch (error) {
        console.error('Error retrieving contests:', error);
        res.status(500).send('Error retrieving contests');
    }
}

exports.noticeApi = async(req,res) => {
    try {
        const data = await Data.find().lean();
        res.json(data);
    } catch (error) {
        console.error('Error retrieving notice api:', error);
        res.status(500).send('Error retrieving notice api');
    }
}

exports.youtubeApi = async(req, res) => {
    try{
        // console.log(req.body)
        // const {playlistId}= req.body;
        const topic = req.params['topic'];
        const playlistId = dsaData[topic];
        let allVideos = [];
        let nextPageToken = null;
        do{
        const resp = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`,{
            params: {
            part: 'snippet',
            maxResults: 50,
            playlistId: playlistId,
            key: process.env.YOUTUBE_API_KEY,
            pageToken: nextPageToken,
            }
        });
        allVideos.push(resp.data);
        // allVideos=allVideos.concat(resp.data.items)
        nextPageToken = resp.data.nextPageToken;
        }
        while(nextPageToken);
        res.json(allVideos);
    }
    catch (error) {
        console.error('Error retrieving youtube api:', error);
        res.status(500).send('Error retrieving youtube api');
    }
}