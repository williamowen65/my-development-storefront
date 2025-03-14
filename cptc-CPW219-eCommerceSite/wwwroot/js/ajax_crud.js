
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
            const contentType = response.headers.get('Content-Type');
            $("#create-modal").modal('hide')
            if (contentType && contentType.includes('application/json')) {
                jsonResponse = await response.json();
                // Add the new product to the table
                var newRow = `<tr>
                        <td>${jsonResponse.product.name}</td>
                        <td>${jsonResponse.product.description}</td>
                        <td>${jsonResponse.product.price}</td>
                        <td>${jsonResponse.product.imagePath}</td>
                        <td>
                            <a asp-action="MerchEditor_Edit" asp-route-id="${jsonResponse.product.productId}">Edit</a> |
                            <a asp-action="Details" asp-route-id="${jsonResponse.product.productId}">Details</a> |
                            <a asp-action="Delete" asp-route-id="${jsonResponse.product.productId}">Delete</a>
                        </td>
                    </tr>`;
                $('table tbody').append(newRow);
            } else {
                const text = await response.text()

                // replace html, with field validation errors populated
                $("#create").get(0).innerHTML = text;
                $("#create-modal").modal('show')

            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    });
}


function initEditForm() {
    $('#edit-modal').modal('show')
}

