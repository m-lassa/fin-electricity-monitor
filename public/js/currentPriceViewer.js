document.addEventListener('DOMContentLoaded', function() {
    fetch('/hinnat')
        .then(response => response.json())
        .then(prices => {
            const currentHour = new Date().getHours();
            const currentHourPrice = prices[currentHour - 1]; // Assuming the first element is for 0:00-1:00, and so on.
            document.getElementById('currentPriceContainer').innerHTML = `Sähkön hinta nyt: <span style="color: #ded116;"> ${currentHourPrice.toFixed(2)} </span>  snt/kWh (sis. 24% ALV)`;
        })
        .catch(error => {
            console.error('Error fetching the prices:', error);
            document.getElementById('currentPriceContainer').textContent = 'Unavailable'; // Handle errors or missing data
        });
});