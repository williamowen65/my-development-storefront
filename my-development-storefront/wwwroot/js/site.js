// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


document.addEventListener("DOMContentLoaded", () => {

    // Set up offer section accordion listener
    setUpAccordionListener();

    initializeCardHeaderPosition();

    initializePricingPlanLinks()
    initializeOffersSection();
})


function setUpAccordionListener() {


    // Offers section listener on ".option-level-1"
    document.body.addEventListener('click', (e) => {
        if (e.target.closest(".option-level-1 .accordion-button")) {
            // Show the selected option at col 12 and hide the other .option-level-1
            // Show the selected option at col 12 and hide the other .option-level-1
            const clickedOption = e.target.closest(".option-level-1");
            const allOptions = document.querySelectorAll(".option-level-1");


            // Alter text seen in the dom per setting, over a back button.
            // (Back button) My Offers > Premium Web Services
            const accordianItem = e.target.closest('.accordion-item').getAttribute("data-item-type")

            const breadcrumb = document.querySelector("#offers .breadcrumb")


            // Are we opening or closing?
            const isOpening = !clickedOption.classList.contains("selected-option");

            if (isOpening) {

                // Hide all other options
                allOptions.forEach(option => {
                    if (option !== clickedOption) {
                        option.style.display = "none";
                    }
                });

                // Make the selected option full width
                clickedOption.classList.remove("col-md-6"); // Remove any existing column classes
                clickedOption.classList.add("col-md-12"); // Add full width class

                // Optional: Add a "selected" class for styling
                clickedOption.classList.add("selected-option");

                let link;
                switch (accordianItem) {
                    case 'premium':
                        link = "Premium Services"
                        break;
                    case 'barter':
                        link = "Barter"
                        break
                    default:
                        link = "no link text"
                }

                // Update Breadcrumb
                breadcrumb.innerHTML = `
          <li class="breadcrumb-item fs-5">My Offers</li>
<li class="breadcrumb-item active fs-5" aria-current="page" data-option-type="${accordianItem}">${link}</li>
            `
            } else {
                resetOffers()
            }
        }
    })
}

function initializeOffersSection() {


    // Additional logic for resetting offers section
    const offerSection = document.querySelector('#offers')
    if (offerSection) {

        offerSection.addEventListener("click", (e) => {
            if (e.target.closest(".breadcrumb") && e.target.closest('.breadcrumb-item:not(.active)')) {
                // navigate back to part of other offers
                resetOffers()
            }
        })
    }
    function resetOffers() {

        const breadcrumb = document.querySelector("#offers .breadcrumb")
        const allOptions = document.querySelectorAll(".option-level-1");
        // Show all options again
        allOptions.forEach(option => {
            option.style.display = "";
            // Restore the column width class
            option.classList.remove("col-md-12");
            option.classList.add("col-md-6");

            // Make sure both options are closed
            option.querySelector('.accordion-collapse').classList.remove("show")

            // Remove the selected class
            option.classList.remove("selected-option");
            // Update Breadcrumb
            breadcrumb.innerHTML = `
              <li class="breadcrumb-item active">My Offers</li>
                `

            const container = document.querySelector('#offers')

            //// Get the position of the top of the container
            const containerTop = container.getBoundingClientRect().top + window.scrollY - 90;

            // Scroll to place it at the top of the view
            window.scrollTo({
                top: containerTop,
                behavior: 'smooth'
            });

        });
    }

}

function initializeCardHeaderPosition() {
    // Set card header position based on website-header
    updateCardHeaderPosition();

    // This listener is meant to capture horizontal resize of window, which may resize the header
    // Update on window resize to maintain correct positioning
    window.addEventListener('resize', updateCardHeaderPosition);
}


function initializePricingPlanLinks() {
    // Add click event for footer pricing link (Also opens up premium offers if it closed on on another page.)
    const footerPricingLink = document.querySelector('footer .pricing a');
    if (footerPricingLink) {
        footerPricingLink.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToPremiumOffers();
        });
    }

    // Setup for handling pricing link from other pages
    // Check URL for pricing-plans query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('section') && urlParams.get('section') === 'pricing-plans') {
        scrollToPremiumOffers();
    }
}


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


// Set the cookie on the server side
function addItemToCart(data) {
    const jsonPayload = JSON.stringify({
        ProductId: data.productId
    })
    console.log("to add to cart", { data, jsonPayload });

    fetch('/api/add-item-to-cart/' + data.productId)
        .then(response => response.json())
        .then(result => {
            console.log('Item added to cart:', result);
            displayCart();
        })
        .catch(error => console.error('Error adding item to cart:', error));
}

function deleteCartItem(event, productId) {
    // Retrieve the current cart from cookies
    let cart = JSON.parse(getCookie(cookieName) || "[]");

    // Remove the productId from the cart array
    const index = cart.indexOf(productId);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    // Update the cookie with the new cart array
    setCookie(cookieName, JSON.stringify(cart), 7);

    // Update the cart display
    displayCart();

    const cartItemEl = event.target.closest(".cart-item")
    const quantityEl = cartItemEl.querySelector('.quantity')

    const quantity = Number(quantityEl.innerText);

    if (quantity > 1) {
        // decrement
        quantityEl.innerText = quantity - 1;
    } else {
        // remove element
        cartItemEl.remove()

        const merchCartBody = document.querySelector('.merch-cart-body')

        if (merchCartBody.innerHTML.trim() == "") {
            merchCartBody.innerHTML = '<td colspan="6" id="empty-merch-cart">Your cart is empty</td>';
        }

    }




}

// Helper function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

// Helper function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            const decodedValue = decodeURIComponent(c.substring(nameEQ.length, c.length));
            return decodedValue;
        }
    }
    return null;
}

// Displays cart if there are contents in it
function displayCart() {
    // Retrieve the current cart from cookies
    let cart = JSON.parse(getCookie(cookieName) || "[]");
    console.log("display cart ", { cart, cookieName })
    const targetEl = document.querySelector('#cart-details');
    // Check if the cart is empty
    if (cart.length === 0) {
        console.log("The cart is empty.");
        targetEl.innerHTML = ""
    } else {
        // Mention cart details on nav bar
        //"Cart: # pending items"
        targetEl.innerHTML = `<a href="merch-cart" class="btn btn-primary btn-sm mt-2" title="Your cart is stored in local cookies">Merch Cart: ${cart.length} Pending Items</a>`;
    }
}

// Updates card-header top position dynamically based on website-header height
function updateCardHeaderPosition() {
    const websiteHeader = document.querySelector('#website-header');
    const cardHeader = document.querySelector('#offers-card-header');
    if (websiteHeader && cardHeader) {
        const headerHeight = websiteHeader.offsetHeight;
        cardHeader.style.top = `${headerHeight}px`;
    }
}

// Scrolls to premium offers section and opens the premium accordion
function scrollToPremiumOffers() {
    const offersSection = document.querySelector('#offers');
    if (!offersSection) return;

    // First check if we need to reset the view
    const activeSection = offersSection.querySelector('.selected-option');
    const breadcrumbItem = offersSection.querySelector('.breadcrumb-item:not(.active)');

    // If another section is open (not premium) or if barter section is open
    if (activeSection && activeSection.querySelector('.accordion-item[data-item-type="barter"]')) {
        // Click on the "My Offers" breadcrumb to reset the view
        if (breadcrumbItem) {

            // NOTE: This element has its own scroll behavior
            breadcrumbItem.click(); // we don't want that, but we quickly jump into a different scroll 
            continueToShowPremium(); // don't need to wait for the reset, just continue to show premium
        } else {
            continueToShowPremium();
        }
    } else {
        continueToShowPremium();
    }

    function continueToShowPremium() {
        // Scroll to offers section
        const premiumButton = document.querySelector('.accordion-item[data-item-type="premium"] .accordion-button');
        if (premiumButton && !premiumButton.closest('.option-level-1').classList.contains('selected-option')) {
            premiumButton.click();
        }

        // After premium section is open, scroll to pricing plan title
        setTimeout(() => {
            const pricingPlanTitle = document.querySelector('.pricing-plan-title');
            if (pricingPlanTitle) {
                const elementPosition = pricingPlanTitle.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - 150, // Apply offset for better viewing
                    behavior: 'smooth'
                });
            }
        }, 500); // Delay to allow premium section to open
    }
}



