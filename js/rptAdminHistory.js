var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {  
        $('#mod_tech_support').modal('hide');
        getAdminProctorCompleteList("All", "");
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#proctor_list").tablesorter({ });
}

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {  
    $('#nav_home').click(function() { 
        window.open('adminHome.html', '_self');
        return false;
    });
    
    $('#nav_logout').click(function() { 
        var parent_site = sessionStorage.getItem('m_parentSite');
        sessionStorage.clear();
        window.open(parent_site, '_self');
        return false;
    });
    
    $('#nav_capture').click(function() { 
        capture();
        $('#mod_tech_problems').val("");
        $('#mod_tech_img_screen').prop('src', str_img);
        $('#mod_tech_support').modal('show');
    });
    
    // search option change event //////////////////////////////////////////////
    $('#search_option').change(function() {
        if ($(this).val() === "All") {
            $('#search_field').val("");
            $('#search_field').prop('readonly', true);
        }
        else {
            $('#search_field').prop('readonly', false);
        }
    });
    
    //refresh button click /////////////////////////////////////////////////////
    $('#btn_refresh').click(function() { 
        var search_field = $('#search_option').val();
        var value = $('#search_field').val();
        getAdminProctorCompleteList(search_field, value);
    });
    
    // table row open resource form click //////////////////////////////////////
    $('table').on('click', 'a[id^="proctor_id_"]', function(e) {
        e.preventDefault();
        var proctor_id = $(this).attr('id').replace("proctor_id_", "");
        var str_url = location.href;
        sessionStorage.setItem('ss_dsps_proctor_referrer', str_url);
        window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
        return false;
    });
    
    // table row restart button click //////////////////////////////////////////
//    $('table').on('click', 'button[id^="btn_restart_"]', function(e) {
//        e.preventDefault();
//        var proctor_id = $(this).attr('id').replace("btn_restart_", "");
//        window.open('restartProctor.html?proctor_id=' + proctor_id, '_self');
//        return false;
//    });
    
    // modal submit button click ///////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() { 
        if (sendEmailToTechSupport()) {
            $('#mod_tech_support').modal('hide');
            alert("Your request has been submitted successfully");
        }
        else {
            $('#mod_tech_support').modal('hide');
            alert("Sending email error!");
        }
    });
    
    // get screen shot image ///////////////////////////////////////////////////
    html2canvas($('body'), {
        onrendered: function(canvas) { str_img = canvas.toDataURL("image/jpg"); }
    });
    
    // popover
    $('#nav_capture').popover({content:"Contact IVC Tech Support", placement:"bottom"});
    
    // selectpicker
    $('.selectpicker').selectpicker();
    
    // datepicker
    $('#mod_test_date').datepicker();
});

////////////////////////////////////////////////////////////////////////////////
function getAdminProctorCompleteList(search_field, value) {
    var result = new Array(); 
    result = db_getAdminProctorCompleteList(search_field, value);
    
    $('#body_tr').empty();
    if (result.length !== 0) {
        var body_html = "";
        for(var i = 0; i < result.length; i++) { 
            body_html += setAdminProctorCompleteListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['InstName'], result[i]['StuID'], result[i]['StuName'], 
                                                         result[i]['Step'], result[i]['Status'], result[i]['StatusID']/*, convertDBDateTimeToString(result[i]['DateSubmitted'])*/);
        }
        $("#body_tr").append(body_html);
    }
}

function setAdminProctorCompleteListHTML(proctor_id, section_num, course_id, int_name, stu_ID, stu_name, step, status, status_id/*, date_submitted*/) {
    var tbl_html = "<tr class='form-horizontal'>";
    tbl_html += "<td class='span1'><a href=# id='proctor_id_" + proctor_id +  "'>" + section_num + "</a></td>";
    tbl_html += "<td class='span2'>" + course_id + "</td>";
    tbl_html += "<td class='span2'>" + int_name + "</td>";
    tbl_html += "<td class='span2'>" + stu_ID + "</td>";
    tbl_html += "<td class='span3'>" + stu_name + "</td>";
    tbl_html += "<td class='span2' id='step_" + proctor_id + "'>" + step + "</td>";
    tbl_html += "<td class='span2'>" + status + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function capture() {    
    html2canvas($('body')).then(function(canvas) { str_img = canvas.toDataURL(); });
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailToTechSupport() {
    var subject = "Request for New Ticket";
    var message = "New tickert has been requested from <b>" + sessionStorage.getItem('ls_dsps_proctor_loginDisplayName') + "</b> (" + sessionStorage.getItem('ls_dsps_proctor_loginEmail') + ")<br><br>";
    message += "Application Web Site: <b>DSPS Complete History</b><br><br>";
    message += "<b>Problems:</b><br>" + $('#mod_tech_problems').val().replace(/\n/g, "<br>");
    var img_base64 = str_img.replace("data:image/png;base64,", "");
    return proc_sendEmailToTechSupport("presidenttest@ivc.edu", "Do Not Reply", "", "", subject, message, img_base64);
}