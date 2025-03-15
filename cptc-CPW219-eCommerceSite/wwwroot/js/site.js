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


