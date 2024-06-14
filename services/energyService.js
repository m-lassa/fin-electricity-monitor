import axios from 'axios';
import moment from 'moment';
import xml2js from 'xml2js';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';

const apiUrl = 'https://web-api.tp.entsoe.eu/api';  
const apiKey = process.env.ENTSOE_API_KEY;

const buildRequestUri = () => {
    const today = moment();
    const periodStart = today.format('YYYYMMDD') + '0000';
    const periodEnd = today.format('YYYYMMDD') + '2300';

    const documentType = 'A44'; // Day-ahead Prices
    const inDomain = '10YFI-1--------U'; // Finland's bidding zone code
    const outDomain = '10YFI-1--------U'; // Same as inDomain for day-ahead prices

    const requestUri = `${apiUrl}?securityToken=${apiKey}&documentType=${documentType}&in_Domain=${inDomain}&out_Domain=${outDomain}&periodStart=${periodStart}&periodEnd=${periodEnd}`;
    
    return requestUri;
};

const fetchElectricityPrices =  async () => {
    
        const uri = buildRequestUri();

        const response =  await axios.get(uri);

   //     axios.get(uri)
  //.then(response => {

        const doc = new DOMParser().parseFromString(response.data, 'text/xml');
        const pointElements = doc.getElementsByTagName('Point');
        const points = xpath.select('//Point', doc);

        const prices = [];
        for (let i = 0; i < pointElements.length; i++) {
          const priceAmountElement = pointElements[i].getElementsByTagName('price.amount')[0];
          if (priceAmountElement) {
            let priceAmount = priceAmountElement.textContent.trim();
            priceAmount /= 1000;
            priceAmount *= 1.24;
            priceAmount = Math.round(priceAmount*10000)/100;
            prices.push(priceAmount);
          }
        }
        // Print the extracted prices
        //console.log(prices);
        return prices;
  //})
  //.catch(error => {
  //  console.error('Error making request:', error);
  //});
  
};


export default fetchElectricityPrices;
