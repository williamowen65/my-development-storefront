// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener("DOMContentLoaded", () => {

    Array.from(document.querySelectorAll('#pricingModelForm input'))
        .forEach(e => {

            e.addEventListener('change', () => {

                // enable button
                document.querySelector("#selectPriceModel").classList.remove("disabled")
            })
        })
})


// Globally available methods


// Makes fetch request and adds element to dom
// empties out the target element with new contents.
function replaceContentWithPartialView(url, targetElementId, cb) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(targetElementId).innerHTML = html;

            cb();

        })
        .catch(error => console.error('Error fetching partial view:', error));
}


function setupTooltip(productId) {
    const button = document.querySelector(`#tooltip-button-${productId}`)
    const tooltip = document.querySelector(`#tooltip-${productId}`)

    const events = [
        //['mouseenter', showTooltip],
        //['mouseleave', hideTooltip],
        //['focus', showTooltip],
        ['blur', hideTooltip],
        ['click', showTooltip]
    ]

     events.forEach(([event, listener]) => {
         button.addEventListener(event, () => {
             // close existing tool tips
             Array.from(document.querySelectorAll('.tooltip2')).forEach(el => {
                 el.style.display = 'none'
             })
             listener();
         });
        });
 
    function update() {
        FloatingUIDOM.computePosition(button, tooltip).then(({ x, y }) => {
            Object.assign(tooltip.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        });

    }

    function showTooltip() {
        tooltip.style.display = 'block';
        update();
    }

    function hideTooltip() {
        tooltip.style.display = '';
    }
}




function updateImagePreview() {
    const newImageInput = document.querySelector('#new-image-input');
    const imgEl = document.querySelector('#edit-current-image');
    const fileNameEl = document.querySelector("#edit-current-image-file-name");


    const file = newImageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imgEl.src = e.target.result;
            fileNameEl.textContent = file.name;
        };
        reader.readAsDataURL(file);
    }
}

const cookieName = 'merch-cart'

function addItemToCart(data) {
    console.log("to add to cart", { data });

    // Retrieve the current cart from cookies
    let cart = JSON.parse(getCookie(cookieName) || "[]");

    // Only save the data that matters in order to keep a low data footprint on cookies 4kb limit.
    // Add the new item to the cart
    cart.push({
        ProductId: data.productId,
        Price: data.price,
    });

    // Save the updated cart back to cookies
    setCookie(cookieName, JSON.stringify(cart), 7);

    displayCart();
}

// Helper function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Helper function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


// Displays cart if there are contents in it
function displayCart() {

    // Retrieve the current cart from cookies
    let cart = JSON.parse(getCookie(cookieName) || "[]");

    // Check if the cart is empty
    if (cart.length === 0) {
        console.log("The cart is empty.");
    } else {
        // Mention cart details on nav bar
        //"Cart: # pending items"
        const targetEl = document.querySelector('#cart-details');
        targetEl.innerHTML = `<a href="merch-cart" class="btn btn-primary btn-sm">Merch Cart: ${cart.length} Pending Items</a>`;
    }
}


