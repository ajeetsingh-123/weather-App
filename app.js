require('dotenv').config();
const fs = require("fs");
var requests = require("requests");
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({
  extended:true
}));

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  if(!orgVal.name)
  {
    console.log("please enter valid location")
    return ;
  }
 
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
  //${process.env.APPID}
  app.get('/', (req, res)=>{
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
         res.end();
        });
    })
    app.post('/', (req, res)=>{
      loc = req.body.loc
      console.log(loc)
      requests(
        `http://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=50e0e742859a371cbb864a29af9560c5&units=metric`
      )
        .on("data", (chunk) => {
          const objdata = JSON.parse(chunk);
          const arrData = [objdata];
          // console.log(arrData[0].main.temp)
         
          if(arrData[0].cod=='404'){
           res.write(arrData[0].message);   
         }
         else{
          const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        console.log("connected");
         }
        })
        .on("end", (err) => {
          if (err) return console.log("connection closed due to errors", err);
          res.end();
        });
    })

app.listen(8000, ()=>{
    console.log("server started");
});
