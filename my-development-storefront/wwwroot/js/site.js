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


    document.querySelector('#offers').addEventListener("click", (e) => {

        if (e.target.closest(".breadcrumb") && e.target.closest('.breadcrumb-item:not(.active)')) {
            // navigate back to part of other offers
            resetOffers()
        }
    })
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
                        link ="no link text"
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


    // Create an "on modal open event"
    // IF there is form content in the modal confirm the user wants to close the modal and lose data.
    // Modal form change tracking and confirmation on close
    const modals = document.querySelectorAll('.modal');
    Array.from(modals).forEach(modal => {
          // Check if the modal has inputs
          modal.addEventListener("hide.bs.modal", (e) => {
              const hasInputs = modal.querySelectorAll('input, textarea, select').length > 0;
              if (hasInputs) {
                  const userConfirmed = confirm("Do you wish to close the contact form?");
                  if (!userConfirmed) {
                      e.preventDefault(); // Prevent the modal from closing
                  }
              }
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



