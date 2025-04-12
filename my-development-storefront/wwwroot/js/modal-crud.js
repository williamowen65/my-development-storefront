$(document).ready(function () {
    $('#createGeneralContactBtn').click(function () {
        $.get('/Home/CreateContact', function (data) {
            $('#modalContent').html(data);
            $('#formModal').modal('show');
        });
    });

    //$(document).on('submit', '#yourForm', function (e) {
    //    e.preventDefault();
    //    var form = $(this);
    //    $.ajax({
    //        type: form.attr('method'),
    //        url: form.attr('action'),
    //        data: form.serialize(),
    //        success: function (res) {
    //            if (res.success) {
    //                $('#formModal').modal('hide');
    //            } else {
    //                $('#modalContent').html(res);
    //                $.validator.unobtrusive.parse('#yourForm');
    //            }
    //        }
    //    });
    //});
});