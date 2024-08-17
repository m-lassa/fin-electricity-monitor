import express from "express";
import bodyParser from "body-parser";
import fetchElectricityPrices from './services/energyService.js';
import cron from 'node-cron';
import axios from 'axios';

const app = express();
const port = 3000;

let cachedPrices = null;

app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: true }));  

app.get("/", async (req, res) => {

    res.render("index.ejs"); 
    
  });

  app.get("/info", async (req, res) => {

     res.render("info.ejs"); 
     
   });

  app.get('/hinnat', async (req, res) => {


    if (cachedPrices) {
      res.send(cachedPrices);
  } else {
      // Fetch prices if not cached yet
      const prices = await fetchElectricityPrices();
      cachedPrices = prices;
      res.send(prices);
  }
    
});  

cron.schedule('0 0 * * *', async () => {
    try {
      // Fetch electricity prices asynchronously
      cachedPrices = await fetchElectricityPrices();
        console.log('Electricity prices updated:', cachedPrices);


    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  });

  // Middleware to handle 404 errors
app.use((req, res, next) => {

    const data = {
            status: 404, 
            message: "Not Found"
     };
    res.render("error.ejs", data);
});


  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });