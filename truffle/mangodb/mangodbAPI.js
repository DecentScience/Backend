/**
 * Created by christianraemy on 31.08.17.
 */

/**
 * Created by christianraemy on 31.08.17.
 */

var http = require('http');
var MongoClient = require('mongodb').MongoClient;

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var Web3 = require('web3');
//Load the query String module
var queryString = require('querystring');

var app = express();

var url = "mongodb://localhost:27017/mydb";

/*MongoClient.connect(url, function(err, db) {
 if (err) throw err;
 console.log("Database created!");
 db.close();
 });

 MongoClient.connect(url, function(err, db) {
 if (err) throw err;
 db.createCollection("sensors", function(err, res) {
 if (err) throw err;
 console.log("Collection created!");
 db.close();
 });
 });*/

app.post('/mongoDB/store/:location/:contractAddress', function (req, res) {

  MongoClient.connect(url, function( err, db) {
    if (err) throw err
    var myobj = { name: req.params.location, address: req.params.contractAddress }
    db.collection('sensors').insertOne(myobj, function(err, res) {
      if (err) throw err
      console.log('1 sensor inserted in mangodb')
      db.close()
    })
  })

  res.status(200).send('Data Inserted');
});



app.get('/mongoDB/getContractAddress/:location', function (req, res) {
  var results;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var query = { name: req.params.location };
    db.collection("sensors").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.status(200).send(result);
      db.close();

    });
  });
})

app.get('*', function (req, res) {
  var timestamp = new Date().getTime();
  var timestampStr = new Date(timestamp).toLocaleString();
  console.log(timestampStr + ': Unrecognised API call from: ' + req.connection.remoteAddress);
  res.status(404).send('Unrecognised API call');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*app.use(function (err, req, res, next) {
 if (req.xhr) {
 var timestamp = new Date().getTime();
 var timestampStr = new Date(timestamp).toLocaleString();
 console.log(timestampStr + ': problematic request from: ' + req.connection.remoteAddress);
 res.status(500).send('Oops, Something went wrong!');
 } else {
 next(err);
 }
 });*/

app.listen(3000);

console.log('App Server running at port 3000');
