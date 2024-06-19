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
  /* const prices = await fetchElectricityPrices();

    const data = {
        prices: prices
    };
    res.send(prices);*/


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
      //const prices = await fetchElectricityPrices();
      cachedPrices = await fetchElectricityPrices();
        console.log('Electricity prices updated:', cachedPrices);
      
      // Log the fetched prices
      //console.log('Prices fetched:', prices);

      // Send the prices to the /prices endpoint
    //const response = await axios.post('http://localhost:3000/hinnat', { prices });

    // Log the response from the server
    //console.log('Response from server:', response.data);

      // Update the graph or store the prices in a database
      // (This part depends on how you handle the fetched prices)


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


/*
// Middleware to authenticate users
function authenticate(req, res, next) {
    // Check if the user is authenticated
    // For example, you can check for a valid session, token, or other authentication mechanism
    //const isAuthenticated = req.session && req.session.user;
    const isAuthenticated = false;

    if (isAuthenticated) {
        // If the user is authenticated, proceed to the next middleware or route handler
        next();
    } else {
        // If the user is not authenticated, return a 401 Unauthorized error
        res.status(401).json({ error: 'Unauthorized' });
    }
}
    */


  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });