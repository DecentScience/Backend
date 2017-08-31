var GrovePi = require('node-grovepi').GrovePi
var IOTA = require('iota.lib.js')
var i2c = require('i2c-bus');
var sleep = require('sleep');
var Commands = GrovePi.commands
var Board = GrovePi.board
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital
var AirQualityAnalogSensor = GrovePi.sensors.AirQualityAnalog
var DHTDigitalSensor = GrovePi.sensors.DHTDigital
var LightAnalogSensor = GrovePi.sensors.LightAnalog
var DigitalButtonSensor = GrovePi.sensors.DigitalButton
var LoudnessAnalogSensor = GrovePi.sensors.LoudnessAnalog
var RotaryAngleAnalogSensor = GrovePi.sensors.RotaryAnalog
var DustDigitalSensor = GrovePi.sensors.dustDigital
var led = new GrovePi.sensors.DigitalOutput(3);
const parseJson = require('parse-json');
var board
var iota
var messageTrytes

var ip = require('ip')
var os = require("os");
var hostname = os.hostname();

var DISPLAY_RGB_ADDR = 0x62;
var DISPLAY_TEXT_ADDR = 0x3e;

function setRGB(i2c1, r, g, b) {
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,0,0)
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,1,0)
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,0x08,0xaa)
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,4,r)
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,3,g)
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,2,b)
}

function textCommand(i2c1, cmd) {
  i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x80, cmd);
}

function setText(i2c1, text) {
  textCommand(i2c1, 0x01) // clear display
  sleep.usleep(50000);
  textCommand(i2c1, 0x08 | 0x04) // display on, no cursor
  textCommand(i2c1, 0x28) // 2 lines
  sleep.usleep(50000);
  var count = 0;
  var row = 0;
  for(var i = 0, len = text.length; i < len; i++) {
    if(text[i] === '\n' || count === 16) {
      count = 0;
      row ++;
        if(row === 2)
          break;
      textCommand(i2c1, 0xc0)
      if(text[i] === '\n')
        continue;
    }
    count++;
    i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x40, text[i].charCodeAt(0));
  }
}

var config = {
  sensorboxID: 'OCHJGBBPGODBELYDLBWHAHRTJ9KLIR9PVHBXNYO9ZEULQYXVCDIHWTFBGQCB9VCIWKESGANXQAOYJOGOWYLYBVXRP9',
  lat: '53.5586526',
  lon: '9.6476349'
}

var testOptions = {
  acceleration: false,
  ultrasonic: false, // D3
  airQuality: true, // A1
  dhtDigital: true, // D2
  lightAnalog: false,
  digitalButton: false,
  loudnessAnalog: true, // A2
  rotaryAngle: false,
  dust: false,
  customAccelerationReading: false
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// IOTA stuff here

var seed = 'BVENQWWDWLKBFRZJJYADNPVE9NNSMUYDAQQZLRLZSEFSQAHNFVNGWTTJPKGQJHFYMAVJRFQCGUPAMBLHZ'
var address = 'ZUBIVOTOZNKXKCSPVNWTLPFFMYNEKVJQSHRAJYZVNZIGWQZQVLZOVWEVFTGFQEIEQSMUIPZPEUMHKEQED'

var iota = new IOTA({
    'provider': 'http://52.58.212.188:14700'
});

function getAdress() {
  // Deterministically generates a new address for the specified seed with a checksum
  iota.api.getNewAddress( seed, { 'checksum': true }, function( e, address ) {
      if (!e) {
          console.log("Generated new address: ", address)
          address = address
      } else {
          console.log("Something went wrong: ", e);
      }
  })
}

function sendIOTA(sensor, value, cb) {
  // iota.api.getNodeInfo(function(error, success) {
  //   if (error) {
  //       console.error(error);
  //   } else {
  //       console.log(success);
  //   }
  // })
  // the message which we will send with the transaction
  var messageToSend = {
  "sensorboxID": config.sensorboxID, // Thats the IOTA key
  "sensors": {
    "name": sensor,
    "data": {
      "name": sensor,
      "value": value
    },
  },
    "geo_lat": config.lat,
    "geo_lon": config.lon
  }
  // Stringify to JSON
  var messageStringified = JSON.stringify(messageToSend);
  console.log(messageStringified);
  // Convert the string to trytes
  messageTrytes = iota.utils.toTrytes(messageStringified);
  console.log('Message to send: ', messageTrytes); //ODGABDPCADTCGADBGANBCDADXCBDXCZCGAQAGAADTCGDGDPCVCTCGADBGAWBMDEAUCXCFDGDHDEAADTCGDGDPCVCTCEAGDTCBDHDEAKDXCHDWCEASBYBCCKBSAGAQD
  console.log('In Bytes: ', iota.utils.fromTrytes(messageTrytes));
  // here we define the transfers object, each entry is an individual transaction
  var transfer = [{
      'address': config.sensorboxID,
      'value': 0,
      'message': messageTrytes
  }]
  // We send the transfer from this seed, with depth 4 and minWeightMagnitude 9 = because tesnet // 15 = main net
  iota.api.sendTransfer(seed, 4, 9, transfer, function(e, bundle) {
      if (e) cb("Error: " + e);
      cb("Successfully sent your transfer: " + JSON.stringify(bundle));
      changeLED(sensor + ' \n' + value, 55, 255, 55);
  })

}

var arr = [];
function getIOTA() {
      //console.log("inside interval..");
      iota.api.findTransactions({addresses: [address]}, function(e, res) {
        if (e) throw e;
        //console.log("Result ", res);
        iota.api.getTransactionsObjects(res, function(e, res) {
            if (e) throw e;
            //onsole.log(res);
            for (var i = 0; i < res.length-1; i++) {
              if (arr.indexOf(res[i].hash) > -1) {
                  }
              else {
                var result = res[i].signatureMessageFragment;
                //console.log("data before substring file: ", result);
                result = result.substring(0, result.indexOf('99'));
                //console.log("data after substring file: ", result);
                result = iota.utils.fromTrytes(result);
                //console.log("dats file: ", result);
                var data = JSON.parse(result);
                var json = {
                "sensorboxID": res[i].address, // Thats the IOTA key
                "ETHcontract": '0x0ETHADDRESS', // The contract to pay
                "sensors": {
                  "name": data.sensors.name,
                  "value": data.sensors.value,
                  "timestamp": res[i].timestamp
                  }
                }
                console.log(JSON.stringify(json));
                arr.push(res[i].hash);
          }
        }
      })
    })
    setTimeout(getIOTA, 10000);
}

function changeLED(text, r, g, b) {
  var i2c1 = i2c.openSync(1); // LED display
  //setText(i2c1,hostname+' \n'+ip.address());
  setRGB(i2c1, r, g, b);
  setText(i2c1, text);
  led.turnOn();
  sleep.sleep(0.5);
  setRGB(i2c1, 55, 55, 55);
  setText(i2c1, '');
  led.turnOff();
  i2c1.closeSync();
}

function start() {
  console.log('starting')

  board = new Board({
    debug: true,
    onError: function (err) {
      console.log('TEST ERROR')
      console.log(err)
    },
    onInit: function (res) {
      if (res) {

        console.log('GrovePi Version :: ' + board.version())

        // Airquality sensor stuff
        if (testOptions.airQuality) {
          var airQualitySensor = new AirQualityAnalogSensor(1)
          // Analog Port 1
          // Air Quality Sensor
          console.log('AirQuality Analog Sensor (60sec)')
          airQualitySensor.on('change', function (res) {
            console.log('AirQuality: ', res);
            sendIOTA("AirQuality", res, function (res) {
                console.log(res);
            });
          })
          airQualitySensor.watch(9000)
        }

        if (testOptions.dhtDigital) {
          var dhtSensor = new DHTDigitalSensor(2, DHTDigitalSensor.VERSION.DHT22, DHTDigitalSensor.CELSIUS)
          // Digital Port 2
          // DHT Sensor
          console.log('DHT Digital Sensor (start watch - 60sec interval)')
          dhtSensor.on('change', function (res) {
            console.log(typeof res);
            sendIOTA("Temperature", res[0], function (res) {
                console.log(res);
            });
            sendIOTA("Humidity", res[1], function (res) {
                console.log(res);
            });
            console.log('DHT onChange value=' + res)
          })
          dhtSensor.watch(13000) // milliseconds
        }

        if (testOptions.loudnessAnalog) {
          var loudnessSensor = new LoudnessAnalogSensor(2)
          //Analog Port 2
          // Loudness Sensor
          console.log('Loudness Analog Sensor (start monitoring - reporting results every 60s)')
          loudnessSensor.start()
          setInterval(loudnessSensorGetAvgMax, 17000, loudnessSensor)
        }

        if (testOptions.dust) {
          var dustSensor = new DustDigitalSensor(2)
          //digital port 2
          // Dust Digital Sensor
          console.log('Dust Digital Sensor (start monitoring - reporting results every 60s)')
          //we must get results every 30 seconds
          dustSensor.start()
          setInterval(dustSensorGetAvgMax, 30 * 1000, dustSensor)
        }

        if (testOptions.customAccelerationReading) {
          // Custom external reading
          console.log('Custom external reading')
          console.log('customAccelerationReading()::' + customAccelerationReading())
        }
      } else {
        console.log('TEST CANNOT START')
      }
    }
  })
  board.init()
}

function loudnessSensorGetAvgMax(loudnessSensor) {
  var val = loudnessSensor.readAvgMax()
  sendIOTA("loudnessSensor", val.avg, function (res) {
      console.log(res);
  });
  console.log('Loudness avg value=' + val.avg + ' and max value=' + val.max)
};


function dustSensorGetAvgMax(dustSensor) {
  var val = dustSensor.readAvgMax()
  //avg and max will be the same in this test
  //since we're gathering them over 30 seconds
  //but that's the same pediod this loop runs
  sendIOTA("dustSensor", val.avg, function (res) {
      console.log(res);
  });
  console.log('Dust avg value=' + val.avg + ' and max value=' + val.max)
}

function AirQualityGet(val) {
  //avg and max will be the same in this test
  //since we're gathering them over 30 seconds
  //but that's the same pediod this loop runs
  sendIOTA("airQualitySensor", val, function (res) {
      console.log(res);
  });
  console.log('airQuality value=' + val)
}

function customAccelerationReading() {
  var write = board.writeBytes(Commands.acc_xyz.concat([Commands.unused, Commands.unused, Commands.unused]))
  if (write) {
    board.wait(100)
    board.readByte()
    var bytes = board.readBytes()
    if (bytes instanceof Buffer) {
      var x = bytes[1] > 32 ? -(bytes[1] - 224) : bytes[1]
      var y = bytes[2] > 32 ? -(bytes[2] - 224) : bytes[2]
      var z = bytes[3] > 32 ? -(bytes[3] - 224) : bytes[3]
      return [x, y, z]
    } else {
      return false
    }
  } else {
    return false
  }
}

function onExit(err) {
  console.log('ending')
  board.close()
  process.removeAllListeners()
  process.exit()
  if (typeof err != 'undefined')
    console.log(err)
}

// starts the test

switch (process.argv[2]) {
  case "sensor":
    start()
    break;
  case "getdata":
    getIOTA()
    break;
  case "getaddress":
    getAdress()
    break;
}

//start()
//testIOTA()
//getIOTA()
//getAdress()
// catches ctrl+c event
process.on('SIGINT', onExit)
