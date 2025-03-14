
function initCreateForm() {
    $('#create-modal').modal('show')

    // Set listener on create form

    $('#create-merch').on('submit', async function (e) {
        e.preventDefault();
        var formData = new FormData(this);


        try {
            const response = await fetch('/merch-editor', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log({ response })

            const text = await response.text()

            $("#create-modal").modal('hide')

            console.log({ text })

            // replace html
            $("#create").get(0).innerHTML = text;
            $("#create-modal").modal('show')



            //const jsonResponse = await response.json();

            //if (jsonResponse.success) {
            //    // Handle success
            //    console.log('Product created successfully:', jsonResponse.product);
            //} else {
            //    // Handle validation errors
            //    var validationSummary = $('#create-merch *[asp-validation-summary="ModelOnly"]');
            //    validationSummary.html('');
            //    console.log({validationSummary})
            //    jsonResponse.errors.forEach(error => {
            //        var errorItem = $('<div>').text(error);
            //        validationSummary.append(errorItem);
            //    });
            //    console.error('Validation errors:', jsonResponse.errors);
            //}
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }


        //fetch('@Url.Action("MerchEditor_Create", "Home")', {
        //    method: 'POST',
        //    body: formData
        //})
        //    .then(response => {
        //        console.log({ response })
        //        return response.json()
        //    })
        //    .then(data => {
        //        if (data.success) {
        //            // Close the modal
        //            $('#create-modal').modal('hide');

        //            // Add the new product to the table
        //            var newRow = `<tr>
        //                    <td>${data.product.name}</td>
        //                    <td>${data.product.description}</td>
        //                    <td>${data.product.price}</td>
        //                    <td>${data.product.imagePath}</td>
        //                    <td>
        //                        <a asp-action="Edit" asp-route-id="${data.product.productId}">Edit</a> |
        //                        <a asp-action="Details" asp-route-id="${data.product.productId}">Details</a> |
        //                        <a asp-action="Delete" asp-route-id="${data.product.productId}">Delete</a>
        //                    </td>
        //                </tr>`;
        //            $('table tbody').append(newRow);

        //            // Show success message
        //            alert('Product created successfully!');
        //        } else {
        //            // Handle validation errors
        //            var validationSummary = $('[asp-validation-summary="ModelOnly"]');
        //            validationSummary.html('');
        //            data.errors.forEach(error => {
        //                var errorItem = $('<div>').text(error);
        //                validationSummary.append(errorItem);
        //            });
        //        }
        //    })
        //    .catch(error => {
        //        console.error('Error:', error);
        //    });

    });
}