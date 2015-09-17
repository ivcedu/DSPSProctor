var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {   
        $('#mod_dialog_box').modal('hide');
        $('#mod_tech_support').modal('hide');
        $('#login_name').html(sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'));
        getAdminProctorList("All", "");
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#dsps_1_list").tablesorter({ });
    $("#dsps_2_list").tablesorter({ });
    $("#inst_review_list").tablesorter({ });
    $("#dsps_complete_list").tablesorter({ });
}

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {    
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
    
    // report - all history click //////////////////////////////////////////////
    $('#nav_rpt_all').click(function() { 
        window.open('rptAdminHistory.html', '_self');
        return false;
    });
    
    // filter option change event //////////////////////////////////////////////
    $('#filter_option').change(function() {
        switch ($(this).val()) {
            case "All":
                $('#review_1_section').show();
                $('#instructor_section').show();
                $('#review_2_section').show();
                $('#complete_section').show();
                break;
            case "Review 1":
                $('#review_1_section').show();
                $('#instructor_section').hide();
                $('#review_2_section').hide();
                $('#complete_section').hide();
                break;
            case "Instructor":
                $('#review_1_section').hide();
                $('#instructor_section').show();
                $('#review_2_section').hide();
                $('#complete_section').hide();
                break;
            case "Review 2":
                $('#review_1_section').hide();
                $('#instructor_section').hide();
                $('#review_2_section').show();
                $('#complete_section').hide();
                break;
            case "Complete":
                $('#review_1_section').hide();
                $('#instructor_section').hide();
                $('#review_2_section').hide();
                $('#complete_section').show();
                break;
            default:
                break;
        }
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
    
    // search button click /////////////////////////////////////////////////////
    $('#btn_search').click(function() { 
        var search_option = $('#search_option').val();
        var search_value = $('#search_field').val().trim();
        getAdminProctorList(search_option, search_value);
    });
    
    // table row open resource form click //////////////////////////////////////
    $('table').on('click', 'a[id^="proctor_id_"]', function(e) {
        e.preventDefault();
        var proctor_id = $(this).attr('id').replace("proctor_id_", "");
        var step = $('#step_' + proctor_id).html();
        
        switch (step) {
            case "Review 1":
                window.open('dspsReview_1.html?proctor_id=' + proctor_id, '_self');
                break;
            case "Instructor Review":
                var str_url = location.href;
                sessionStorage.setItem('ss_dsps_proctor_referrer', str_url);
                window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
                break;
            case "Review 2":
                window.open('dspsReview_2.html?proctor_id=' + proctor_id, '_self');
                break;
            case "Complete":
                window.open('dspsComplete.html?proctor_id=' + proctor_id, '_self');
                break;
            default:
                var str_url = location.href;
                sessionStorage.setItem('ss_dsps_proctor_referrer', str_url);
                window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
                break;
        }
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
});

////////////////////////////////////////////////////////////////////////////////
function getAdminProctorList(search_option, search_value) {
    var result = new Array(); 
    result = db_getAdminProctorList(search_option, search_value);
    
    $('#dsps_1_body_tr').empty();
    $('#dsps_2_body_tr').empty();
    $('#inst_review_body_tr').empty();
    $('#dsps_complete_body_tr').empty();
    
    var dsps_1_body_html = "";
    var dsps_2_body_html = "";
    var inst_review_body_html = "";
    var dsps_complete_body_html = "";
    for(var i = 0; i < result.length; i++) { 
        switch(result[i]['Step']) {
            case "Review 1":
                dsps_1_body_html += setAdminProctorListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuName'], 
                                                            result[i]['Status'], result[i]['InstName'], convertDBDateTimeToString(result[i]['DateSubmitted']), result[i]['Step']);
                break;
            case "Review 2":
                dsps_2_body_html += setAdminProctorListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuName'], 
                                                            result[i]['Status'], result[i]['InstName'], convertDBDateTimeToString(result[i]['DateSubmitted']), result[i]['Step']);
                break;
            case "Instructor Review":
                inst_review_body_html += setAdminProctorListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuName'], 
                                                                result[i]['Status'], result[i]['InstName'], convertDBDateTimeToString(result[i]['DateSubmitted']), result[i]['Step']);
                break;
            case "Complete":
                dsps_complete_body_html += setAdminProctorListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuName'], 
                                                                result[i]['Status'], result[i]['InstName'], convertDBDateTimeToString(result[i]['DateSubmitted']), result[i]['Step']);
                break;
            default:
                break;
        }
        
    }
    $("#dsps_1_body_tr").append(dsps_1_body_html);
    $("#dsps_2_body_tr").append(dsps_2_body_html);
    $("#inst_review_body_tr").append(inst_review_body_html);
    $("#dsps_complete_body_tr").append(dsps_complete_body_html);
}

function setAdminProctorListHTML(proctor_id, section_num, course_id, stu_name, status, instructor, date_submitted, step) {
    var tbl_html = "<tr>";
    tbl_html += "<td class='span1'><a href=# id='proctor_id_" + proctor_id +  "'>" + section_num + "</a></td>";
    tbl_html += "<td class='span2'>" + course_id + "</td>";
    tbl_html += "<td class='span3'>" + stu_name + "</td>";
    tbl_html += "<td class='span2'>" + instructor + "</td>";
    tbl_html += "<td class='span2' id='status_" + proctor_id + "'>" + status + "</td>";
    tbl_html += "<td class='span2'>" + date_submitted + "</td>";
    tbl_html += "<td class='span1' style='display: none;' id='step_" + proctor_id + "'>" + step + "</td>";
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
    message += "Application Web Site: <b>Home</b><br><br>";
    message += "<b>Problems:</b><br>" + $('#mod_tech_problems').val().replace(/\n/g, "<br>");
//    message += "<img src='cid:screen_shot'/>";    
    var img_base64 = str_img.replace("data:image/png;base64,", "");
    return proc_sendEmailToTechSupport("presidenttest@ivc.edu", "Do Not Reply", "", "", subject, message, img_base64);
}