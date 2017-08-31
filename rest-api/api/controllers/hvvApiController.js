'use strict';
var IOTA = require('iota.lib.js')
var seed = 'BVENQWWDWLKBFRZJJYADNPVE9NNSMUYDAQQZLRLZSEFSQAHNFVNGWTTJPKGQJHFYMAVJRFQCGUPAMBLHZ';
//var seed = 'YFVQGQQXUSP9PMJYGNKHNETXYTVDDAAUZU9DMUOUHMVXGIZOQWQJJS9M9IDYSQQLVBFTVCY9MQWBSVOLC';
var iota = new IOTA({
    'provider': 'http://52.58.212.188:14700'
});

function makeSeed() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";

  for (var i = 0; i < 81; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

exports.getAddress = function(req, res) {
  console.log(req.params);
  // Deterministically generates a new address for the specified seed with a checksum
  iota.api.getNewAddress( req.params.Seed, { 'checksum': true }, function( e, add ) {
      if (!e) {
          console.log("Generated new address: ", add)
          console.log("Used Seed: ", req.params.Seed)
          res.send("IOTA Address: " + add + " Used Seed: " + req.params.Seed);
      } else {
          console.log("Something went wrong: ", e);
      }
  })
}

exports.getData = function(req, cb) {
  //console.log("inside interval..");
  // req is a array with IOTA adresses
  var arr = [];
  var output = [];
  console.log(req.body);
  console.log(typeof req.body);
  iota.api.findTransactions(req.body, function(e, res) {
    if (e) throw e;
    console.log("Result ", res);
    iota.api.getTransactionsObjects(res, function(e, res) {
        if (e) throw e;
        console.log("res ", res);
        for (var i = 0; i < res.length; i++) {
            var result = res[i].signatureMessageFragment;
            console.log("data before substring file: ", result);
            result = result.substring(0, result.indexOf('99'));
            console.log("data after substring file: ", result);
            result = iota.utils.fromTrytes(result);
            console.log("dats file: ", result);
            var payload = JSON.parse(result);
            var json = {
            "sensorboxID": res[i].address, // Thats the IOTA key
            "sensors": {
              "name": payload.sensors.name,
              "data": payload.sensors.data,
              "timestamp": res[i].timestamp
            },
            "geo_lat": payload.geo_lat,
            "geo_lon": payload.geo_lon
            }
            console.log(JSON.stringify(json));
            output.push(json);
        }
    cb.send(output);
    })
})
}

exports.postData = function(req, cb) {
  req = req.body;
  console.log(req);
  var messageToSend = {
      "sensorboxID": req.sensorboxID, // Thats the IOTA key
      "sensors": {
        "name": req.sensors.name,
        "data": req.sensors.data,
      },
      "geo_lat": req.geo_lat,
      "geo_lon": req.geo_lon
  };
  // Stringify to JSON
  var messageStringified = JSON.stringify(messageToSend);
  console.log(messageStringified);
  // Convert the string to trytes
  var messageTrytes = iota.utils.toTrytes(messageStringified);
  console.log('Message to send: ', messageTrytes); //ODGABDPCADTCGADBGANBCDADXCBDXCZCGAQAGAADTCGDGDPCVCTCGADBGAWBMDEAUCXCFDGDHDEAADTCGDGDPCVCTCEAGDTCBDHDEAKDXCHDWCEASBYBCCKBSAGAQD
  console.log('In Bytes: ', iota.utils.fromTrytes(messageTrytes));
  // here we define the transfers object, each entry is an individual transaction
  var transfer = [{
      'address': req.sensorboxID,
      'value': 0,
      'message': messageTrytes
  }]
  console.log(transfer);
  // We send the transfer from this seed, with depth 4 and minWeightMagnitude 9 = because tesnet // 15 = main net
  iota.api.sendTransfer(seed, 4, 9, transfer, function(e, bundle) {
      if (e) return cb.send("Error: " + e);
      cb.send("Successfully sent your transfer: " + bundle);
  })
}
