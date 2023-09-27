$(document).ready(function () {
    // Function to generate card elements
    function generateCards(data) {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            const username = data[i].username;
            const image = data[i].image;
            const messages = data[i].messages;

            // Generate message HTML
            let messagesHTML = '';
            for (let j = 0; j < messages.length; j++) {
                messagesHTML += `<p class="card-text">${messages[j]}</p>`;
            }

            html += `<div class="row">
                        <div class="col-lg-4 col-md-6 mb-3">
                            <div class="card border border-secondary shadow-0 " style="background-color:#fefefe;">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-lg-4 col-md-6 col-sm-4 text-left">
                                            <img class="" src="${image}" alt="${username}" width="128px">
                                        </div>
                                        <div class="col-lg-8 col-md-6 col-sm-8">
                                            ${messagesHTML}
                                        </div>
                                    </div>
                                </div>
                                <div class="card-header" style="background-color:#fefefe;"><p class="text-right">—— <b>${username}</b></p></div>
                            </div>
                        </div>
                    </div>`;
        }

        return html;
    }

    // Fetch the JSON data and populate the container with the generated cards
    fetch('pages/OTHERS/Quotes/json/quote.json')
        .then(response => response.json())
        .then(data => {
            const quotesData = data;
            $('#quoteContainer').html(generateCards(quotesData));
        })
        .catch(error => console.error('Error fetching JSON:', error));
});