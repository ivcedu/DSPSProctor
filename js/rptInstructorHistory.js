var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        $('#mod_tech_support').modal('hide');
        getDefaultStartEndDate();
        getInstProctorCompleteList($('#start_date').val(), $('#end_date').val());
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
        window.open('instructorHome.html', '_self');
        return false;
    });
    
    $('#nav_logout').click(function() { 
        sessionStorage.clear();
        window.open("Login.html", '_self');
        return false;
    });
    
    $('#nav_capture').click(function() { 
        capture();
        $('#mod_tech_problems').val("");
        $('#mod_tech_img_screen').prop('src', str_img);
        $('#mod_tech_support').modal('show');
    });
    
    //filter button click //////////////////////////////////////////////////////
    $('#btn_filter').click(function() {
        getInstProctorCompleteList($('#start_date').val(), $('#end_date').val());
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
    $('#start_date').datepicker();
    $('#end_date').datepicker();
});

////////////////////////////////////////////////////////////////////////////////
function getDefaultStartEndDate() {
    $('#start_date').datepicker( "setDate", getCurrentFirstDayOfMonth() );
    $('#end_date').datepicker( "setDate", getCurrentLastDayOfMonth() );
}

////////////////////////////////////////////////////////////////////////////////
function getInstProctorCompleteList(start_date, end_date) {
    var result = new Array(); 
    result = db_getInstProctorCompleteList(sessionStorage.getItem('ls_dsps_proctor_loginEmail'), start_date, end_date);
    
    $('#body_tr').empty();
    if (result.length !== 0) {
        var body_html = "";
        for(var i = 0; i < result.length; i++) { 
            body_html += setAdminProctorCompleteListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuName'], 
                                                         result[i]['Status'], result[i]['Step'], convertDBDateTimeToString(result[i]['TestDT']));
        }
        $("#body_tr").append(body_html);
    }
}

function setAdminProctorCompleteListHTML(proctor_id, section_num, course_id, stu_name, status, step, test_dt) {
    var tbl_html = "<tr>";    
    tbl_html += "<td class='span1'><a href=# id='proctor_id_" + proctor_id +  "'>" + section_num + "</a></td>";
    tbl_html += "<td class='span2'>" + course_id + "</td>";
    tbl_html += "<td class='span3'>" + stu_name + "</td>";
    tbl_html += "<td class='span2' id='status_" + proctor_id + "'>" + status + "</td>";
    tbl_html += "<td class='span2' id='step_" + proctor_id + "'>" + step + "</td>";
    tbl_html += "<td class='span2'>" + test_dt + "</td>";
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
    message += "Application Web Site: <b>Instructor Complete History</b><br><br>";
    message += "<b>Problems:</b><br>" + $('#mod_tech_problems').val().replace(/\n/g, "<br>");
    var img_base64 = str_img.replace("data:image/png;base64,", "");
    return proc_sendEmailToTechSupport("presidenttest@ivc.edu", "Do Not Reply", "", "", subject, message, img_base64);
}