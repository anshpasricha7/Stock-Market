const apiKey = `d1khuahr01qt8foon0q0d1khuahr01qt8foon0qg`;

const input=document.querySelector('.search_bar');
const searchBtn=document.querySelector('.search');
const container = document.querySelector('.result_container');

searchBtn.addEventListener('click', function() {
    const value=(input.value).toLowerCase().trim();
    fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
      const symbol = data.filter(function(item){
        let tofindfrom=item.description.replace(/\s+/g, '').substring(0,value.length).toLowerCase();
        return tofindfrom === value;
      });
     container.innerHTML = ''; // Clear previous results
       container.innerHTML=`<h1>${symbol[0].description}</h1>`;
        
        

      return symbol[0].symbol;

    })
    .then(function(symbol){
        return fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
      
        
       
        const price = document.createElement('div');
  price.innerHTML = `Price (c): <span>${data.c}</span>`;
  container.appendChild(price);

  const high = document.createElement('div');
  high.innerHTML = `High (h): <span>${data.h}</span>`;
  container.appendChild(high);

  const low = document.createElement('div');
  low.innerHTML = `Low (l): <span>${data.l}</span>`;
  container.appendChild(low);

  const open = document.createElement('div');
  open.innerHTML = `Open (o): <span>${data.o}</span>`;
  container.appendChild(open);

  const prevClose = document.createElement('div');
  prevClose.innerHTML = `Previous Close (pc): <span>${data.pc}</span>`;
  container.appendChild(prevClose);

 

    })

 
});

const resetbtn = document.querySelector('.reset');

resetbtn.addEventListener('click', function() {
    input.value = '';
    document.querySelector('.result_container').innerHTML = ''; // Clear results
});