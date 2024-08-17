// get the current date
const today = new Date();

// localize and format the date to Finnish
const formattedDate = new Intl.DateTimeFormat('fi-FI', {
    weekday: 'short',
    day: 'numeric', // day of the month
    month: 'long', // full month name
    year: 'numeric' // full year
}).format(today);


    document.addEventListener('DOMContentLoaded', function() {
        fetch('/hinnat')
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('electricityPricesChart').getContext('2d');

                const currentHour = new Date().getHours();

                const highlightIndex = currentHour - 1 ; // Subtract 1 if data array starts at 1:00 as 0

                // Create an array for the backgroundColors
                const backgroundColors = data.map((_, index) => index === highlightIndex ? '#ded116' : 'rgba(54, 162, 234, 0.2)');

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.map((_, index) => `${index+1}:00`),

                        datasets: [{
                            label: 'snt/kWh',
                            data: data,
                            //backgroundColor: 'rgba(54, 162, 234, 0.2)',
                            backgroundColor: backgroundColors,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    plugins: {

                        tooltip: {
                            callbacks: {

                                label: function(tooltipItem, chart) {
                                    const datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                                    const value = tooltipItem.yLabel;

                                    // Calculate the interval based on the tooltipItem's index
                                    const hour = tooltipItem.index + 1; 
                                    const startHour = hour - 1; // Start of the interval
                                    const endHour = hour; // End of the interval
                                    // Format the interval string, e.g., "12:00-13:00"
                                    const interval = `${startHour}:00-${endHour}:00`;

                                    return `${datasetLabel} for ${interval}: €${value} per kWh`;

                                }
                            }
                        }

                    },
                    options: {

                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {
                                    legend: {
                                        display: false,
                                        labels: {
                                            //color: 'white'
                                        }
                                    }
                                    ,

                                    },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                                    //color: 'white',
                                                    display: false
                                },
                                title: {
                                    display: !isMobile(),
                                    text: 'Hinta (snt/kWh)',
                                    fontColor: 'white',
                                    color: 'white',
                                    font: {
                                    size: 15,
                                    }
                                }
                            },
                            x: {
                                ticks: {
                                        color: 'white',
                                },
                                title: {
                                    display: true,
                                    text: formattedDate,
                                    fontColor: 'white',
                                    color: 'white',
                                    font: {
                                    size: 17,
                                    }
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Virhe:', error));
    });


    function isMobile() {
        return window.innerWidth <= 768; 
    }