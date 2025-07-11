

const apiKey = `d1khuahr01qt8foon0q0d1khuahr01qt8foon0qg`;

fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`)
  .then(res => res.json())
  .then(data => console.log(data));

const symbols = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA',
  'META', 'NVDA', 'NFLX', 'INTC', 'IBM'
];

const stockHistory = {};
const maxPoints = 20; // Store last 20 minutes

symbols.forEach(symbol => {
  stockHistory[symbol] = { labels: [], data: [] };
});

const stocks = document.querySelector(`.stock_list`);

function loadStockPrices() {
  stocks.innerHTML = ""; // Clear old content

  const fetches = symbols.map(function(symbol){
    return fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
      .then(response => response.json())
      .then(data => ({
        symbol,
        price: (data && typeof data.c !== "undefined") ? data.c : "N/A"
      }))
    }
  );

  Promise.all(fetches).then(results => {
    results.forEach(stockData => {
      const stock = document.createElement("div");
      stock.innerHTML = `<span class="symbol">${stockData.symbol}</span>: <span class="price">${stockData.price}</span><br><br>`;
      stocks.append(stock);
    });
  });
}



//Chart 
const ctx = document.getElementById('myChart').getContext('2d');

const stockChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // time labels
    datasets: [{
      label: '',
      data: [],
      borderColor: 'lime',
      fill: false
    }]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      x: {
        title: { display: true, text: 'Time' }
      },
      y: {
        title: { display: true, text: 'Price ($)' },
        beginAtZero: false
      }
    }
  }
});

let selectedSymbol = null;




// Load immediately on page load
let index=0;
const companies = document.querySelector(`.companies`);
loadStockPrices();
symbols.forEach(function(symbol){
  const company = document.createElement("button");
  company.className = `company-button`;
  company.id = `index-${index++}`;
  company.innerHTML = `${symbol}`;
  companies.append(company);

  // 🧠 Add click listener for chart
company.addEventListener('click', function () {
  selectedSymbol = symbol;

  const history = stockHistory[symbol];

  stockChart.data.labels = [...history.labels];
  stockChart.data.datasets[0].data = [...history.data];
  stockChart.data.datasets[0].label = symbol;
  stockChart.update();
});


});

function fetchAndUpdateChart() {
  if (!selectedSymbol || !stockHistory[selectedSymbol]) return;

  const history = stockHistory[selectedSymbol];

  stockChart.data.labels = [...history.labels];           // All times
  stockChart.data.datasets[0].data = [...history.data];   // All prices
  stockChart.data.datasets[0].label = selectedSymbol;
  stockChart.update();
}






function updateAllChartData() {
  const now = new Date().toLocaleTimeString();

  symbols.forEach(symbol => {
    fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        const price = data.c;

        if (!stockHistory[symbol]) {
          stockHistory[symbol] = { labels: [], data: [] };
        }

        stockHistory[symbol].labels.push(now);
        stockHistory[symbol].data.push(price);

        if (stockHistory[symbol].labels.length > maxPoints) {
          stockHistory[symbol].labels.shift();
          stockHistory[symbol].data.shift();
        }

        // If this is the selected symbol, update chart live
        if (symbol === selectedSymbol) {
          stockChart.data.labels = [...stockHistory[symbol].labels];
          stockChart.data.datasets[0].data = [...stockHistory[symbol].data];
          stockChart.update();
        }
      });
  });
}


// Run every 60 seconds
setInterval(updateAllChartData, 60000);
updateAllChartData(); // Initial load

setInterval(loadStockPrices, 60000);

document.querySelector(`.search`).addEventListener('click', function() {
   window.open('search_stock_page.html', '_blank');
});

