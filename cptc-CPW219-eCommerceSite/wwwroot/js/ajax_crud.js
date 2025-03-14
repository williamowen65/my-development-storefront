function initCreateForm() {
    $('#create-modal').modal('show')

    // Set listener on create form

    $('#create-merch').on('submit', async function (e) {
        e.preventDefault();
        // disable the create button to prevent duplicates
        $("#create-modal button[type=submit]").attr("disabled", true)

        var formData = new FormData(this);

        try {
            const response = await fetch('/merch-editor', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const contentType = response.headers.get('Content-Type');
          
            if (contentType && contentType.includes('application/json')) {

                jsonResponse = await response.json();
              

                // Show success message

                $('#create-feedback').text("Success creating a new product!")

                setTimeout(() => {
                    $("#create-modal").modal('hide')
                    // Add the new product to the table
                    $('table tbody').append(jsonResponse.productRow);
                }, 3000)

            } else {
                $("#create-modal").modal('hide')
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
