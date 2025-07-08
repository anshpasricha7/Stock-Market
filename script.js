const apiKey = `d1khuahr01qt8foon0q0d1khuahr01qt8foon0qg`;
const symbols = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA',
  'META', 'NVDA', 'NFLX', 'INTC', 'IBM'
];

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

// Load immediately on page load
loadStockPrices();

// Then refresh every 60 seconds
setInterval(loadStockPrices, 60000);
