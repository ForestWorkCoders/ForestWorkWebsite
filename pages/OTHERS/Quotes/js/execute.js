const parentElement = document.querySelector('.container');

fetch('../json/quote.json')
  .then(response => response.json())
  .then(data => {
    data.forEach((item) => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');

      const imgElement = document.createElement('img');
      imgElement.setAttribute('src', item.image);
      imgElement.setAttribute('alt', '');
      imgElement.classList.add('logo');
      productElement.appendChild(imgElement);

      const productInfoElement = document.createElement('div');
      productInfoElement.classList.add('product__info');
      productElement.appendChild(productInfoElement);

      item.messages.forEach((message) => {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        productInfoElement.appendChild(messageElement);
      });

      const usernameElement = document.createElement('h2');
      usernameElement.classList.add('fw-bold');
      usernameElement.textContent = `—— ${item.username}`;
      productInfoElement.appendChild(usernameElement);

      parentElement.appendChild(productElement);
    });
  })
  .catch(error => console.error(error));
