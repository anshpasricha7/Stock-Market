const apiKey=`d1khuahr01qt8foon0q0d1khuahr01qt8foon0qg`;
const symbols = [
  'AAPL',     // Apple
  'MSFT',     // Microsoft
  'GOOGL',    // Alphabet (Google)
  'AMZN',     // Amazon
  'TSLA',     // Tesla
  'META',     // Meta (Facebook)
  'NVDA',     // Nvidia
  'NFLX',     // Netflix
  'INTC',     // Intel
  'IBM'       // IBM
];


const stocks = document.querySelector(`.stock_list`);

setInterval(() => {
  stocks.innerHTML = "";
  // Create an array of fetch promises
  const fetches = symbols.map(symbol =>
    fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
      .then(response => response.json())
      .then(data => ({ symbol, price: (data && typeof data.c !== "undefined") ? data.c : "N/A" }))
  );

  // Wait for all fetches to complete
  Promise.all(fetches).then(results => {
    results.forEach(stockData => {
      const stock = document.createElement("div");
      stock.innerHTML = `<span class="symbol">${stockData.symbol}</span>: <span class="price">${stockData.price}</span><br><br>`;
      stocks.append(stock);
    });
  });
}, 5000);