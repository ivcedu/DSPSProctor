var m_ar_courses = [];

var proctor_id = "";
var course_id = "";
var section_num = "";

var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {        
        $('#mod_dialog_box').modal('hide');
        $('#mod_tech_support').modal('hide');
        setDatePickerMinDate();
        getStudentInfo();
        getStudentCourseInfo();
    }
    else {
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() { 
    $('#nav_capture').click(function() { 
        capture();
        $('#mod_tech_problems').val("");
        $('#mod_tech_img_screen').prop('src', str_img);
        $('#mod_tech_support').modal('show');
    });
    
    $('#inst_list').change(function() {
        var inst_name = $(this).val();
        setCourseInfo(inst_name);
    });
    
    // other check event ///////////////////////////////////////////////////////
    $('#ckb_other').change(function() {
        if ($(this).is(':checked')) {
            $('#txt_other').prop('readonly', false);
        }
        else {
            $('#txt_other').val("");
            $('#txt_other').prop('readonly', true);
        }
    });
    
    // other check event ///////////////////////////////////////////////////////
    $('#ckb_scribe').change(function() {
        if ($(this).is(':checked')) {
//            $('#ckb_scantron').prop('disabled', false);
//            $('#ckb_written_exam').prop('disabled', false);
            $('#cbo_scribe_list').prop('disabled', false);
            $('#cbo_scribe_list').selectpicker('refresh');
            $('#ckb_distraction').prop('disabled', false);
        }
        else {
//            $("#ckb_scantron").prop('checked', false);
//            $("#ckb_written_exam").prop('checked', false);
//            $("#ckb_distraction").prop('checked', false);
//            $('#ckb_scantron').prop('disabled', true);
//            $('#ckb_written_exam').prop('disabled', true);
//            $('#ckb_distraction').prop('disabled', true);
            $('#cbo_scribe_list').prop('disabled', true);
            $('#cbo_scribe_list').val('scantron_only');
            $('#cbo_scribe_list').selectpicker('refresh');
            $('#ckb_distraction').prop('disabled', true);
            $("#ckb_distraction").prop('checked', false);
        }
    });
    
    // submit button click /////////////////////////////////////////////////////
    $('#btn_cancel').click(function() { 
        var parent_site = sessionStorage.getItem('m_parentSite');
        sessionStorage.clear();
        window.open(parent_site, '_self');
        return false;
    });
    
    // submit button click /////////////////////////////////////////////////////
    $('#btn_submit').click(function() {
        $(this).prop("disabled", true);
        proctor_id = insertProctor();
        insertAccom(proctor_id);
        db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), "Proctor request submitted");
        db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 6, 1);
        
        sendEmailToDSPS_1();
        sendEmailToStudent();
        
        $('#mod_dialog_box_header').html("Complete");
        $('#mod_dialog_box_body').html("Your request has been submitted successfully.<br><br>Thank you");
        $('#mod_dialog_box').modal('show');
    });
    
    // dialog ok click /////////////////////////////////////////////////////////
    $('#mod_dialog_btn_ok').click(function() { 
        sessionStorage.clear();
        window.open('Login.html', '_self');
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
    
//    $('#mod_tech_img_screen').click(function() {
//        if (str_img !== "") {
//            $.fancybox.open({ href : str_img });
//        }
//    });
    
    // get screen shot image ///////////////////////////////////////////////////
    html2canvas($('body'), {
        onrendered: function(canvas) { str_img = canvas.toDataURL("image/jpg"); }
    });
    
    // popover
    $('#nav_capture').popover({content:"Contact IVC Tech Support", placement:"right"});
    
    // auto size
    $('#comments').autosize();
    $('#mod_dialog_comments').autosize();
    
    // selectpicker
    $('.selectpicker').selectpicker();
    
    // datepicker
    $('#test_date').datepicker();
    
    // timepicker
    $('#test_time').timepicker();
});

////////////////////////////////////////////////////////////////////////////////
function setDatePickerMinDate() {
    var cur_date = new Date();
    cur_date.setDate(cur_date.getDate()+7);
    $('#test_date').datepicker( "option", "minDate", cur_date);
}

function getStudentInfo() {
    var stu_name = sessionStorage.getItem('ls_dsps_proctor_loginDisplayName');
    var stu_id = sessionStorage.getItem('ls_dsps_proctor_loginID');
    $('#stu_name').val(stu_name);
    $('#stu_id').val(stu_id);
}

function getStudentCourseInfo() {
    var stu_id = sessionStorage.getItem('ls_dsps_proctor_loginID');
    var cur_term = tardis_getCurrentTerm();
    
    // testing
    stu_id = "1029202";
    
    var html = "";
    var result = new Array(); 
    result = tardis_getStudentCourseList(stu_id, cur_term);
    if (result.length !== 0) {
        for(var i = 0; i < result.length; i++) {             
            var ar_crs = new Array();
            ar_crs.push(result[i]['InstructorName'], result[i]['InstructorUID'], result[i]['CourseID'], result[i]['SectionNum']);
            m_ar_courses.push(ar_crs);
            
            html += "<option value='" + result[i]['InstructorName'] + "'>" + result[i]['InstructorName'] + "</option>";
        }
    }
    
    $('#inst_list').append(html);
    $('#inst_list').selectpicker('refresh');
}

////////////////////////////////////////////////////////////////////////////////
function setCourseInfo(inst_name) {
    $('#course_list').empty();
    var html = "";
    
    if (inst_name === "Select...") {
        html += "<option value='Select...'>Select...</option>";
    }
    else {
        for(var i = 0; i < m_ar_courses.length; i++) {
            if (m_ar_courses[i][0] === inst_name) {            
                html += "<option value='" + m_ar_courses[i][2] + "'>" + m_ar_courses[i][2] + "</option>";
            }
        }
    }
    
    $('#course_list').append(html);
    $('#course_list').selectpicker('refresh');
}

////////////////////////////////////////////////////////////////////////////////
function getInstructorID(inst_name) {
    for(var i = 0; i < m_ar_courses.length; i++) {
        if (m_ar_courses[i][0] === inst_name) {
            return m_ar_courses[i][1];
        }
    }
}

function getSectionNum(course_id) {
    for(var i = 0; i < m_ar_courses.length; i++) {
        if (m_ar_courses[i][2] === course_id) {
            return m_ar_courses[i][3];
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
function insertProctor() {    
    var stu_name = textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'));
    var stu_email = textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginEmail'));
    var stu_ID = textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginID'));
    
    var sel_inst = $('#inst_list').val();
    var inst_id = getInstructorID(sel_inst);
    var ldap_result = new Array();
    ldap_result = ldap_getUser(inst_id);
    var inst_name = ldap_result[0];
    var inst_email = ldap_result[1];
    
    course_id = $('#course_list').val();
    section_num = getSectionNum(course_id);
    
    var test_date = $('#test_date').val();
    var test_time = $('#test_time').val();
    var comments = textReplaceApostrophe($('#comments').val());
    
    return db_insertProctor(stu_name, stu_email, stu_ID, inst_name, inst_email, course_id, section_num, test_date, test_time, comments);
}

function insertAccom(proctor_id) {
    var time_one_half = $('#ckb_time_one_half').is(':checked');
    var double_time = $('#ckb_double_time').is(':checked');
    var alt_media = $('#ckb_alt_media').is(':checked');
    var reader = $('#ckb_reader').is(':checked');
    var enlarge_exam = $('#ckb_enlarge_exam').is(':checked');
    var user_of_comp = $('#ckb_user_of_comp').is(':checked');

    var scantron = false;
    var written_exam = false;
    var scribe = $('#ckb_scribe').is(':checked');
    if (scribe) {
        if ($('#cbo_scribe_list').val() === "scantron_only") {
            scantron = true;
        }
        else if ($('#cbo_scribe_list').val() === "written_exam") {
            written_exam = true;
        }
        else {
            scantron = true;
            written_exam = true;
        }
    }
//    var scantron = $('#ckb_scantron').is(':checked');
//    var written_exam = $('#ckb_written_exam').is(':checked');
    var other = $('#ckb_other').is(':checked');
    var txt_other = textReplaceApostrophe($('#txt_other').val());
    var distraction = $('#ckb_distraction').is(':checked');
    
    return db_insertAccom(proctor_id, time_one_half, double_time, alt_media, reader, enlarge_exam, user_of_comp, other, txt_other, scribe, scantron, written_exam, distraction);
}

////////////////////////////////////////////////////////////////////////////////
function capture() {    
    html2canvas($('body')).then(function(canvas) { str_img = canvas.toDataURL(); });
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailToTechSupport() {
    var subject = "Request for New Ticket";
    var message = "New tickert has been requested from <b>" + sessionStorage.getItem('ls_dsps_proctor_loginDisplayName') + "</b> (" + sessionStorage.getItem('ls_dsps_proctor_loginEmail') + ")<br><br>";
    message += "Application Web Site: <b>New Proctor Request</b><br><br>";
    message += "<b>Problems:</b><br>" + $('#mod_tech_problems').val().replace(/\n/g, "<br>");
//    message += "<img src='cid:screen_shot'/>";    
    var img_base64 = str_img.replace("data:image/png;base64,", "");
    return proc_sendEmailToTechSupport("presidenttest@ivc.edu", "Do Not Reply", "", "", subject, message, img_base64);
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailToDSPS_1() {
    var subject = "New Test Request";
    var message = "Dear Angie Bates,<br><br>";
    message += "A test proctoring request has been submitted to DSPS.<br><br>";
    
    message += "Student Name: <b>" + $('#stu_name').val() + "</b><br>";
    message += "Student ID: <b>" + $('#stu_id').val() + "</b><br>";
    message += "Instructor Name: <b>" + $('#inst_list').val() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_list').val() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    var str_url = location.href;
    str_url = str_url.replace("newProctor.html", "dspsReview_1.html");
    message += "Please click below ticket # to open DSPS 1 review page<br><br>";
    message += "<a href='" + str_url + "?proctor_id=" + proctor_id + "'>" + section_num + "</a><br><br>";
    
    // testing
    proc_sendEmail("vptest@ivc.edu", "Angie Bates", subject, message);
//    proc_sendEmail("abates@ivc.edu", "Angie Bates", subject, message);
}

function sendEmailToStudent() {
    var email = sessionStorage.getItem('ls_dsps_proctor_loginEmail');
    var name = sessionStorage.getItem('ls_dsps_proctor_loginDisplayName');
    
    var subject = "DSPS Test Proctoring Request";
    var message = "Dear " + name + ",<br><br>";
    message += "Your test proctoring request that was submitted on <b>" + new Date().toLocaleString() + "</b> is being processed and an email has been sent to your instructor for their approval.<br><br>";    
    
    message += "Instructor Name: <b>" + $('#inst_list').val() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_list').val() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    // testing
    email = "stafftest@ivc.edu";
    proc_sendEmail(email, name, subject, message);
}