const express = require("express");
const app = express();
const fs = require("fs");
const mongodb = require('mongodb');
const url = 'mongodb://localhost:27017'; 

app.get("/", function (req, res) {
  mongodb.MongoClient.connect(url, function (error, client) {
    if (error) {
      res.status(500).json(error);
     
      return;
    }


    // Check for range headers to find our start time
   // const r= req.headers.range;
   
    const range = req.headers.range || "bytes=1-";
    if (!range) {
      res.status(400).send("Requires Range header");

    }


    const db = client.db('grid_file');
    // GridFS Collection
    db.collection('fs.files').findOne({filename:"myvideo1.mp4"},function(err, video){
   // db.collection('fs.files').find({}).toArray(function(err, video) {
      
      //console.log("videos data--**--------------------",video)
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      //const videoSize = video.length;
          const videoSize = video.length;
         
      //const start = Number(range.replace(/\D/g, ""));
      const end = videoSize-1 ;
     const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
  
     

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
     
      
      const downloadStream = bucket.openDownloadStreamByName('myvideo1.mp4', {
        start
      });

      // Finally pipe vlog to response
      downloadStream.pipe(res);
    });
  });
});
app.listen(5000, function () {                       //go to 127.0.0.1:5000
  console.log("Listening on port 5000!");

});