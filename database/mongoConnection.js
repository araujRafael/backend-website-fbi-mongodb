const dotenv = require('dotenv')
dotenv.config()

const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/noderest", {
  // useMongoClient:true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("MongoDb Connected");
});

// mongoose.Promise = global.Promise;

module.exports = { mongoose }