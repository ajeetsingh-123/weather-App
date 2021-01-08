require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");
var qs = require('querystring');
//const http = require('http').createServer(app);

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
//   let temperature = tempVal.replace("{%tempval%}",(orgVal.main.temp- 273.15).toFixed(2));
//   temperature = temperature.replace("{%tempmin%}", ( orgVal.main.temp_min- 273.15).toFixed(2));
//   temperature = temperature.replace("{%tempmax%}", ( orgVal.main.temp_max- 273.15).toFixed(2));
  let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  // var loc=req.body.loc; 
  //  console.log(loc)
  request.post('/', {form:{id:'loc'}})
  if (req.url == "/") {
    requests(
      `http://api.openweathermap.org/data/2.5/weather?q=hyderabad&appid=50e0e742859a371cbb864a29af9560c5&units=metric`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        console.log("connected");
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end("something went wrong");
      });
  } else {
    res.end("Location is not found");
  }
});

server.listen(8000, ()=>{
    console.log("server started");
});
