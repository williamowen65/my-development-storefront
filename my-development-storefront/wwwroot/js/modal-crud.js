$(document).ready(function () {
    
    window.openSesame = function(e) {
        let target;

        console.log(e, );
        if (e.originalEvent) {
            target = e.currentTarget.getAttribute('open-sesame');
        } else if (typeof e === "string") {
            target = e;
        }

        // Ensure the target is an absolute path by adding a leading slash if it doesn't have one
        if (target && !target.startsWith('/') && !target.startsWith('http')) {
            target = '/' + target;
        }

        $.get(target, function (data) {
            const modal = $("#modal-1");
            const modalContent = modal.find('#modal-1-content');
            if (modalContent.length) {

                // TODO: Update html without destroying select2

                modalContent.html(data); // Set the child content

                // Use Bootstrap's shown.bs.modal event
                modal.one('shown.bs.modal', function () {
                    setForm()
                });

                if (modal.hasClass('show')) {
                    setForm()
                }


                function setForm() {
                    const inputs = modal.find('input, textarea, select');
                    const firstInput = inputs.get(0);
                    // focus the first input
                    if (firstInput) {
                        firstInput.focus();
                    }

                    setFormSubmissionListener(modal);
                }

                // Add event handler to clean up when the modal is hidden
                modal.one('hidden.bs.modal', function () {
                    // Optional: Clear modal content when closed
                    // modalContent.html('');
                });

                modal.modal('show'); // Show the modal
            } else {
                console.error("Modal content element not found!");
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Error handler
            console.error("Request failed:", textStatus, errorThrown);
        });
    }


    // Use proper event delegation with on() method
    $(document).on('click', '*[open-sesame]', openSesame);

    
    function setFormSubmissionListener(modal) {
        const form = modal.find('form').get(0);
        console.log({ form });
        if (form) {
            // Remove any existing handlers to prevent duplicates
            $(form).off('submit').on('submit', function (e) {
                e.preventDefault();

                var form = $(this);
                const data = form.serialize();
                console.log({ form, data });

                $.ajax({
                    type: form.attr('method'),
                    url: form.attr('action'),
                    data: form.serialize(),
                    success: function (res) {
                        if (res.success) {
                            alert("successs");
                            modal.modal('hide');
                        } else {
                            modal.find('.modal-content').html(res);
                        }
                    }
                });
            });
        }
    }
});


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