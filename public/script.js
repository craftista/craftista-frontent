document.addEventListener("DOMContentLoaded", function() {
  let currentItems = 6; // starting number of items to display

  fetch('/api/products')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Render initial batch of products
      renderProducts(data.slice(0, currentItems));

      // Remove loading message
      document.getElementById('loading-message').style.display = 'none';

      // Set up infinite scroll
      window.addEventListener('scroll', function() {
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
          currentItems += 6; // add 6 more items each time
          renderProducts(data.slice(0, currentItems));
        }
      });
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  // Fetch and display service status
  fetchServiceStatus();
});

function renderProducts(products) {
  // Logic to display products on the page
  const productContainer = document.getElementById('products');
  productContainer.innerHTML = ''; // clear the existing items before appending
  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
      <h3>${product.name}</h3>
      <img src="${product.image_url}" alt="${product.name}" />
      <p>${product.description}</p>
    `;
    productContainer.appendChild(productElement);
  });
}

function fetchServiceStatus() {
  fetch('/api/service-status')
    .then(response => response.json())
    .then(data => {
      renderServiceStatus(data);
    })
    .catch((error) => {
      console.error('Error fetching service status:', error);
    });
}

function renderServiceStatus(status) {
  const statusGrid = document.getElementById('status-grid');
  statusGrid.innerHTML = ''; // clear the existing items
  
  Object.keys(status).forEach(service => {
    const statusBox = document.createElement('div');
    statusBox.className = `status-box ${status[service]}`;
    statusBox.innerHTML = `
      <h4>${capitalizeFirstLetter(service)}</h4>
      <p>${capitalizeFirstLetter(status[service])}</p>
    `;
    statusGrid.appendChild(statusBox);
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}




