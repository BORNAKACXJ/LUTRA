(function() {
    // Create the calculator's HTML structure
    const calculatorHtml = `
        <div class="form-container">
            <h2>Wat kun je besparen op lozingsheffing?</h2>
            <div style="display: none;">
                <label for="nameField">Uw bedrijfsnaam</label>
                <input type="text" id="nameField" name="nameField" autocomplete="off">
            </div>
            <div class="form-group">
                <label for="pollutionUnits">Hoeveel vervuilingseenheden loos je?</label>
                <input type="number" id="pollutionUnits" name="pollutionUnits" placeholder="Liters per jaar" inputmode="numeric" required>
            </div>
            <div class="form-group">
                <label for="postcode">Wat is je postcode?</label>
                <input type="text" id="postcode" name="postcode" placeholder="4521AA" maxlength="6" required>
                <div class="calc__alert">De ingevoerde postcode is niet bekend of onjuist. Controleer de postcode en probeer het opnieuw.</div>
            </div>
            <button class="btn" onclick="calculate()">Bereken</button>
            <div id="loading">
                <div class="wave">
                    <div class="wave-dot"></div>
                    <div class="wave-dot"></div>
                    <div class="wave-dot"></div>
                    <div class="wave-dot"></div>
                    <div class="wave-dot"></div>
                    <div class="wave-dot"></div>
                </div>
                <p style="margin-top: 0;">Besparing berekenen...</p>
            </div>
            <div id="result">
                <p>Potenti&euml;le besparingen per jaar:</p>
                <h2 id="potentialSavings"></h2>
                <p class="addion">Een flink bedrag. Want met een eigen afvalwaterzuivering bespaar je 70% tot 80% op je huidige heffing. De investering verdien je meestal binnen 3 jaar terug.<br /><br /></p>
                <a href="https://www.lutra.nu/contact" target="_blank" class="btn orange">Neem contact met ons op</a>
            </div>
        </div>
    `;

    // Inject the calculator's HTML into the container with the attribute `attr-calculator="yes"`
    const calculatorContainer = document.querySelector('[attr-calculator="yes"]');
    if (calculatorContainer) {
        calculatorContainer.innerHTML = calculatorHtml;
    }

    // Add styles to the page
    const styles = document.createElement('style');
    styles.innerHTML = `


        .form-container {
    width: 100%;
    margin: 64px auto;
    padding: 20px;
    /* border: 1px solid #ccc; */
    border-radius: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: white;
    box-sizing: border-box;
        }

        h2 {
            margin: 0;
            padding: 0;
            margin-bottom: 16px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            opacity: 0.8;
        }

        input[type="text"], input[type="number"] {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
            font-family: inherit;
            border-radius: 8px;
            border: 1px solid currentColor;
            color: inherit;
            font-size: 18px;
        }

        input[type="text"]::placeholder, input[type="number"]::placeholder {
            color: currentColor;
            opacity: 0.2;
        }

        input[type="text"]:hover::placeholder, input[type="number"]:hover::placeholder {
            opacity: 0.6;
        }

        .btn {
            width: 100%;
            padding: 10px;
            background-color: #83e080;
            
            border: none;
            cursor: pointer;
            font-family:inherit;

            font-size: 18px;
            color: inherit;
            border-radius: 8px;
        }

        .btn:hover {
            background-color: #98ea96;
        }

        .btn.orange {
            background-color: #ee9538;
            color: white;
            font-weight: bold;
                display: block;
    box-sizing: border-box;
    text-decoration: none;
        }

        .btn.orange:hover {
            background-color: #ed802c;
        }

        /* Wave dot animation */
        #loading {
            display: none;
            margin-top: 20px;
            text-align: center;
            position: relative;
        }

        .wave {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60px;
        }

        .wave-dot {
            width: 12px;
            height: 12px;
            margin: 0 5px;
            border-radius: 50%;
            background-color: #3498db; /* Blue dots */
            animation: wave 0.8s infinite ease-in-out;
        }

        .wave-dot:nth-child(1) { animation-delay: 0s; }
        .wave-dot:nth-child(2) { animation-delay: 0.1s; }
        .wave-dot:nth-child(3) { animation-delay: 0.2s; }
        .wave-dot:nth-child(4) { animation-delay: 0.3s; }
        .wave-dot:nth-child(5) { animation-delay: 0.4s; }
        .wave-dot:nth-child(6) { animation-delay: 0.5s; }

        @keyframes wave {
            0%, 100% { transform: translateY(0) translateX(0); opacity:1; }
            50% { transform: translateY(-16px) translateX(-4px); opacity:0.8; } /* Creates the wave effect */
        }

        #result {
            display: none;
            margin-top: 32px;
            text-align: center;
        }

        #potentialSavings {
            font-size: 28px;
        }

        .addion {
            font-size: 14px;
            margin-bottom: 0;
        }

    .small-decimal {
        font-size: 0.6em;
        vertical-align: top;
        margin-top: 3px;
        display: inline-block;
    }

    .calc__alert {
        position: relative;
        width: 100%;
        box-sizing: border-box;

        border-radius: 4px;
        background-color: #FAC898;
        color: #7f3805;

        font-size: 13px;
        line-height: 15px;

        padding: 8px;

        margin-top: 8px;

        display: none;
    }
    `;
    document.head.appendChild(styles);

    // Define the calculate function and related logic here
    window.calculate = function() {
    const nameField = document.getElementById('nameField').value;
    const postcodeField = document.getElementById('postcode');
    const pollutionUnitsField = document.getElementById('pollutionUnits');

    const postcode = postcodeField.value.trim();
    const pollutionUnits = parseInt(pollutionUnitsField.value.trim(), 10);

    // Reset any previous error states
    postcodeField.style.border = '';
    pollutionUnitsField.style.border = '';

    // Check the honeypot field for spam detection
    if (nameField) {
        console.warn('Spam detected. Submission blocked.');
        return; // Stop execution if the honeypot field is filled
    }

    // Validation: Check if postcode or pollution units are empty
    let hasError = false;
    if (!postcode) {
        postcodeField.style.border = '2px solid red';
        hasError = true;
    }
    if (isNaN(pollutionUnits) || pollutionUnits <= 0) {
        pollutionUnitsField.style.border = '2px solid red';
        hasError = true;
    }

    if (hasError) {
        //console.warn('Please fill in all required fields.');
        return; // Stop execution if there are validation errors
    }

    // Show loading animation
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.querySelector('.calc__alert').style.display = 'none';

    // Simulate API call and calculation (replace with your actual API/call to searchPostcode function)
    setTimeout(() => {
        searchPostcode(postcode, pollutionUnits); // Call the function that does the real calculation
    }, 1000); // Simulated delay for the calculation
}


    // Your previous function integrated here
function searchPostcode(postcode, pollutionUnits) {
    const postcodeJsonUrl = 'https://joranbackx.nl/lab/lutra/postcode.json';
    const gemeenteJsonUrl = 'https://joranbackx.nl/lab/lutra/gemeente.json';
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-9btR_TTTmlESMcw7mg3EZrUc1thUlf6uDCRYns313GY9HB4HbdW4tvKQLxIteJDGssZ2SM9kx_rC/pub?gid=0&single=true&output=csv';

    // Fetch the gemcode and waterschap details (as explained before)
    fetch(postcodeJsonUrl, {  })
        .then(response => response.json())
        .then(data => {
            const gemcode = data[postcode];

            if (gemcode) {
                searchWaterschapCode(gemcode, pollutionUnits);
            } else {
                document.querySelector('.calc__alert').style.display = 'block';
                document.getElementById('loading').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching postcode data:', error);
            document.querySelector('.calc__alert').style.display = 'block';
            document.getElementById('loading').style.display = 'none';
        });
}

function searchWaterschapCode(gemcode, pollutionUnits) {
    const gemeenteJsonUrl = 'https://joranbackx.nl/lab/lutra/gemeente.json';

    fetch(gemeenteJsonUrl, {  })
        .then(response => response.json())
        .then(data => {
            const gemeente = data.find(item => item.Gemcode == gemcode);

            if (gemeente && gemeente.WaterschapCode) {
                fetchAndCalculate(gemeente.WaterschapCode, pollutionUnits);
            } else {
                alert('No matching WaterschapCode found.');
            }
        })
        .catch(error => {
            console.error('Error fetching waterschap data:', error);
        });
}

function fetchAndCalculate(waterschapCode, pollutionUnits) {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-9btR_TTTmlESMcw7mg3EZrUc1thUlf6uDCRYns313GY9HB4HbdW4tvKQLxIteJDGssZ2SM9kx_rC/pub?gid=0&single=true&output=csv';

    fetch(csvUrl, {  })
        .then(response => response.text())
        .then(csv => {
            const rows = csv.split('\n');

            rows.forEach(row => {
                const [a, b, c] = row.split(','); // a = WaterschapCode, b = Waterschap Name, c = Fee per unit

                if (parseInt(a.trim(), 10) === parseInt(waterschapCode, 10)) {
                    const feePerUnit = parseFloat(c.trim()); // Fee per pollution unit
                    const totalCost = pollutionUnits * feePerUnit;
                    const potentialSavings = totalCost * 0.75;

                    // Hide loading animation
                    document.getElementById('loading').style.display = 'none';

                    // Show result
                    let formattedNumber = potentialSavings.toFixed(2).split('.');
                    let integerPart = formattedNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots as thousands separator
                    let decimalPart = formattedNumber[1]; // Get the decimal part

                    // Insert into HTML with smaller decimals
                    document.getElementById('potentialSavings').innerHTML = `&euro;${integerPart},<span class="small-decimal">${decimalPart}</span>`;
                    document.getElementById('result').style.display = 'block';

                    // Send data to IFTTT
                    sendToIFTTT(postcode, potentialSavings, pollutionUnits);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
}


function sendToIFTTT(postcode, result, pollutionUnits) {
    const postcodeValue = document.getElementById('postcode').value;
    const pollutionUnitsValue = parseInt(document.getElementById('pollutionUnits').value);

    // Format the result with a comma instead of a decimal point
    const formattedResult = result.toFixed(2).replace('.', ',');

    // Create a custom timestamp in the desired format
    const date = new Date();
    const options = { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = date.toLocaleString('en-US', options).replace(',', ''); // Remove the comma after the day

    const iftttBaseUrl = 'https://maker.ifttt.com/trigger/save__calc/with/key/e8zvpEX5Ba90Q6ZTNhvqpDKhIiAwz1UfZpNNxG8PJm_';
    const url = `${iftttBaseUrl}?value1=${encodeURIComponent(postcodeValue)}&value2=${encodeURIComponent(pollutionUnitsValue)}&value3=${encodeURIComponent(`${formattedResult}`)}&value4=${encodeURIComponent(formattedDate)}`;

    fetch(url, {
        method: 'GET',
        mode: 'no-cors'
    })
    .then(() => {
        console.log('Result has been successfully calculated');
    })
    .catch(error => {
        console.error('Request failed:', error);
    });
}

})();
