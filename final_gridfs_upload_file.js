const express = require("express");
const app = express();
const fs = require("fs");
const mongodb = require('mongodb');
const url = 'mongodb://localhost:27017';


//app.get("/", function (req, res) {
 //res.sendFile(__dirname + "/index.html");

//});
//console.log(__dirname);
// Sorry about this monstrosity -- just for demo purposes
app.get('/', function (req, res) {
  mongodb.MongoClient.connect(url, function (error, client) {
    if (error) {
      res.json(error);
console.log("client",client);

      return;
    }
console.log(client);
    // connect to the videos database
    const db = client.db('grid_file');
//console.log("error,,,,,,,,,,,,,,,,,,");

    // Create GridFS bucket to upload a large file
    const bucket = new mongodb.GridFSBucket(db);

    // create upload stream using GridFS bucket
    const videoUploadStream = bucket.openUploadStream('myvideo1.mp4');// is not actuall file only file name 

    // You can put your file instead of bigbuck.mp4
    const videoReadStream = fs.createReadStream('myvideo1.mp4'); //actual file 

    // Finally Upload!
    videoReadStream.pipe(videoUploadStream);

    // All done!
    res.status(200).send("Done...");
  });
});

app.listen(5000, function () {
  console.log("Listening on port 8000!");
});