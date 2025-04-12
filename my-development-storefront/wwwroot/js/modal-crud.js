$(document).ready(function () {
    $('*[open-sesame]').click(function (e) {
        const target = e.target.getAttribute('open-sesame')
        $.get(target, function (data) {
            const modal = $("#modal-1");
            const modalContent = modal.find('#modal-1-content');
            if (modalContent.length) {
                modalContent.html(data); // Set the child content
                // Use Bootstrap's shown.bs.modal event instead of setTimeout
                modal.one('shown.bs.modal', function () {
                    const inputs = modal.find('input, textarea, select');
                    const firstInput = inputs.get(0);
                    // focus the first input
                    if (firstInput) {
                        firstInput.focus();
                    }

                    setFormSubmissionListener(modal)
                });

                modal.modal('show'); // Show the modal
              
            } else {
                console.error("Modal content element not found!");
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Error handler
            console.error("Request failed:", textStatus, errorThrown);
        });
    });

    function setFormSubmissionListener(modal) {

        const form = modal.find('form').get(0)
        console.log({form})
        if (form) {
            // Set lisetner
            $(form).on('submit', function(e) {

                e.preventDefault();

                var form = $(this)
                const data = form.serialize()
                console.log({ form, data })
                $.ajax({
                    type: form.attr('method'),
                    url: form.attr('action'),
                    data: form.serialize(),
                    success: function (res) {
                        if (res.success) {

                            alert("successs")
                            modal.modal('hide');
                        } else {
                            modal.find('.modal-content').html(res);
                        }
                    }
                });

             
            })

        }
    }


    //const modals = document.querySelectorAll('.modal');
    //Array.from(modals).forEach(modal => {
    //    // Check if the modal has inputs
    //    modal.addEventListener("hide.bs.modal", (e) => {
    //        const hasInputs = modal.querySelectorAll('input, textarea, select').length > 0;
    //        if (hasInputs) {
    //            const userConfirmed = confirm("Do you wish to close the contact form?");
    //            if (!userConfirmed) {
    //                e.preventDefault(); // Prevent the modal from closing
    //            }
    //        }
    //    })
    //})
 
      
});