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