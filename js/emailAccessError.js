////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    var step = sessionStorage.getItem('ls_dsps_review_step');
    var err_msg = "DSPS " + step + " process has been completed";
    $('#err_msg').html(err_msg);
};