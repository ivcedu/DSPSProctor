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
    
    // time and one half check event ///////////////////////////////////////////
    $('#ckb_time_one_half').change(function() {
        if ($(this).is(':checked')) {
            $('#ckb_double_time').prop('checked', false);
        }
    });
    
    // double time check event /////////////////////////////////////////////////
    $('#ckb_double_time').change(function() {
        if ($(this).is(':checked')) {
            $('#ckb_time_one_half').prop('checked', false);
        }
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
            $('#cbo_scribe_list').prop('disabled', false);
            $('#cbo_scribe_list').selectpicker('refresh');
        }
        else {
            $('#cbo_scribe_list').prop('disabled', true);
            $('#cbo_scribe_list').val('scantron_only');
            $('#cbo_scribe_list').selectpicker('refresh');
        }
    });
    
    // submit button click /////////////////////////////////////////////////////
    $('#btn_cancel').click(function() { 
        sessionStorage.clear();
        window.open("Login.html", '_self');
        return false;
    });
    
    // submit button click /////////////////////////////////////////////////////
    $('#btn_submit').click(function() {        
        var err = formValidation();
        if (err !== "") {
            alert(err);
            return false;
        }
        else {
            $(this).prop("disabled", true);
            var n_result = insertProctor();
            if (n_result === -1) {
                var str_msg = "DSPS Exam Request: AD system error";
                sendEmailToDeveloper(str_msg);
                alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
                sessionStorage.clear();
                window.open("Login.html", '_self');
                return false;
            }
            else if (n_result === 0) {
                var str_msg = "DSPS Exam Request: DB system error INSERT PROCTOR";
                sendEmailToDeveloper(str_msg);
                alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
                sessionStorage.clear();
                window.open("Login.html", '_self');
                return false;
            }
            else {
                if (!insertAccom(proctor_id)) {
                    var str_msg = "DSPS Exam Request: " + proctor_id + " DB system error INSERT ACCOM";
                    sendEmailToDeveloper(str_msg);
                    alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
                    sessionStorage.clear();
                    window.open("Login.html", '_self');
                    return false;
                }
                else {
                    if (db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), "Proctor request submitted") === "") {
                        var str_msg = "DSPS Exam Request: " + proctor_id + " DB system error INSERT TRANSACTION";
                        sendEmailToDeveloper(str_msg);
                        alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
                        sessionStorage.clear();
                        window.open("Login.html", '_self');
                        return false;
                    }
                    if (db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 6, 1) === "") {
                        var str_msg = "DSPS Exam Request: " + proctor_id + " DB system error INSERT PROCTOR LOG";
                        sendEmailToDeveloper(str_msg);
                        alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
                        sessionStorage.clear();
                        window.open("Login.html", '_self');
                        return false;
                    }

                    sendEmailToDSPS_1();
                    sendEmailToStudent();

                    $('#mod_dialog_box_header').html("Complete");
                    $('#mod_dialog_box_body').html("Your request has been submitted successfully.<br><br>Thank you");
                    $('#mod_dialog_box').modal('show');
                }
            }
        }
    });
    
    // dialog ok click /////////////////////////////////////////////////////////
    $('#mod_dialog_btn_ok').click(function() { 
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // modal submit button click ///////////////////////////////////////////////
//    $('#mod_tech_btn_submit').click(function() { 
//        if (sendEmailToTechSupport()) {
//            $('#mod_tech_support').modal('hide');
//            alert("Your request has been submitted successfully");
//        }
//        else {
//            $('#mod_tech_support').modal('hide');
//            alert("Sending email error!");
//        }
//    });
    
//    $('#mod_tech_img_screen').click(function() {
//        if (str_img !== "") {
//            $.fancybox.open({ href : str_img });
//        }
//    });
    
    // get screen shot image ///////////////////////////////////////////////////
//    html2canvas($('body'), {
//        onrendered: function(canvas) { str_img = canvas.toDataURL("image/jpg"); }
//    });
    
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
//    $('#test_time').timepicker();
    
    $('#test_time').timepicker().on('changeTime.timepicker', function(e) {    
        var h= e.time.hours;
        var m= e.time.minutes;
        var mer= e.time.meridian;
        //convert hours into minutes
        m+=h*60;
        //10:15 = 10h*60m + 15m = 615 min
        if(mer === 'AM' && m < 480) {
            $('#test_time').timepicker('setTime', '8:00 AM');
        }
        else if (mer === 'PM' && m > 360 && m < 720) {
            $('#test_time').timepicker('setTime', '6:00 PM');
        }
    });
    
    $('#div_stu_name').popover({content:"student name field", placement:"bottom"});
    $('#div_stu_id').popover({content:"student ID field", placement:"bottom"});
    $('#div_inst_list').popover({content:"instructor name drop down list", placement:"bottom"});
    $('#div_course_list').popover({content:"course drop down list", placement:"bottom"});
    $('#dev_test_date').popover({content:"test date field", placement:"bottom"});
    $('#test_time').popover({content:"time of exam field", placement:"bottom"});
    $('#test_time_icon').popover({content:"time of exam selection button", placement:"bottom"});
    $('#dev_time_one_half').popover({content:"time and one half check box field", placement:"bottom"});
    $('#dev_double_time').popover({content:"double time check box field", placement:"bottom"});
    $('#dev_reader').popover({content:"reader check box field", placement:"bottom"});
    $('#dev_enlarge_exam').popover({content:"enlarge exam check box field", placement:"bottom"});
    $('#dev_user_of_comp').popover({content:"use of computer check box field", placement:"bottom"});
    $('#dev_scribe').popover({content:"scribe check box field", placement:"bottom"});
    $('#div_scribe_list').popover({content:"scribe drop down list", placement:"bottom"});
    $('#dev_distraction').popover({content:"distraction reduced environment check box field", placement:"bottom"});
    $('#dev_other').popover({content:"other check box field", placement:"bottom"});
    $('#dev_text_other').popover({content:"other text input field", placement:"bottom"});
    $('#dev_comments').popover({content:"comments text input field", placement:"bottom"});
});

////////////////////////////////////////////////////////////////////////////////
function formValidation() {
    var err = "";
    
    if ($('#inst_list').val() === "Select...") {
        err += "Instructor's name is a required field\n";
    }
    if ($('#course_list').val() === "Select...") {
        err += "Course is a required field\n";
    }
    if ($('#test_date').val() === "") {
        err += "Test date is a required field\n";
    }

    return err;
}

////////////////////////////////////////////////////////////////////////////////
function setDatePickerMinDate() {
    var cur_date = new Date();
    cur_date.setDate(cur_date.getDate()+7);
    
    var max_date = new Date(cur_date);
    max_date.setMonth(max_date.getMonth()+1);
    
    $('#test_date').datepicker( "option", "minDate", cur_date);
    $('#test_date').datepicker( "option", "maxDate", max_date);
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
    $('#new_protor_title').html("Test Proctoring Request (" + getCurrentSemester(cur_term) + ")");
    
    var html = "";
    var result = new Array(); 
    result = tardis_getStudentCourseList(stu_id, cur_term);
    if (result.length !== 0) {
        for(var i = 0; i < result.length; i++) { 
            var inst_duplicate = false;
            $.each(m_ar_courses, function(index) {
                var ar_inst = m_ar_courses[index];
                if (!$.inArray(result[i]['InstructorName'], ar_inst)) {
                    inst_duplicate = true;
                }
            });
            
            var ar_crs = new Array();
            ar_crs.push(result[i]['InstructorName'], result[i]['InstructorUID'], result[i]['CourseID'], result[i]['SectionNum']);
            m_ar_courses.push(ar_crs);
            
            if (!inst_duplicate) {
                html += "<option value='" + result[i]['InstructorName'] + "'>" + result[i]['InstructorName'] + "</option>";
            }
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
    var stu_fname = textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginFName'));
    var stu_lname = textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginLName'));
    
    var sel_inst = $('#inst_list').val();
    var inst_id = getInstructorID(sel_inst);
    
    var ldap_result = new Array();
    ldap_result = ldap_getUser(inst_id);
    if (ldap_result.length === 0) {
        ldap_result = ldap_getUserSaddleback(inst_id);
    }
    
    if (ldap_result.length === 0) {
        return -1;
    }
    else {
        var inst_name = textReplaceApostrophe(ldap_result[0]);
        var inst_email = textReplaceApostrophe(ldap_result[1]);
        var inst_fname = textReplaceApostrophe(ldap_result[2]);
        var inst_lname = textReplaceApostrophe(ldap_result[3]);

        course_id = $('#course_list').val();
        section_num = getSectionNum(course_id);

        var test_date = $('#test_date').val();
        var test_time = $('#test_time').val();
        var comments = textReplaceApostrophe($('#comments').val());

        proctor_id = db_insertProctor(stu_name, stu_email, stu_ID, inst_name, inst_email, course_id, section_num, test_date, test_time, comments);
        if (proctor_id === "") {
            return 0;
        }
        else {
            var proctor_name_id = db_insertProctorName(proctor_id, stu_fname, stu_lname, inst_fname, inst_lname);
            if (proctor_name_id === "") {
                return 0;
            }
            else {
                return Number(proctor_id);
            }
        }
    }
}

function insertAccom(proctor_id) {
    var time_one_half = $('#ckb_time_one_half').is(':checked');
    var double_time = $('#ckb_double_time').is(':checked');
    var alt_media = false;
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

    var other = $('#ckb_other').is(':checked');
    var txt_other = textReplaceApostrophe($('#txt_other').val());
    var distraction = $('#ckb_distraction').is(':checked');
    
    var accom_id = db_insertAccom(proctor_id, time_one_half, double_time, alt_media, reader, enlarge_exam, user_of_comp, other, txt_other, scribe, scantron, written_exam, distraction);
    if (accom_id === "") {
        return false;
    }
    else {
        return true;
    }
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sendEmailToDeveloper(str_msg) {
    proc_sendEmail("ykim160@ivc.edu", "Rich Kim", "DSPS New Proctor: DB System Error", str_msg);
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailToDSPS_1() {
    var subject = "New Test Request";
    var message = "Dear Angie Bates,<br><br>";
    message += "A test proctoring request has been submitted to DSPS.<br><br>";
    
    if ($('#comments').val() !== "") {
        message += "<b>Student Comments:</b><br>" + $('#comments').val().replace(/\n/g, "<br>") + "<br><br>";
    }
    
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
    
    // demo setup
//    proc_sendEmail("presidenttest@ivc.edu", "DSPS Exams", subject, message);
    proc_sendEmail("ivcdspsexams@ivc.edu", "DSPS Exams", subject, message);
}

function sendEmailToStudent() {
    var email = sessionStorage.getItem('ls_dsps_proctor_loginEmail');
    var name = sessionStorage.getItem('ls_dsps_proctor_loginDisplayName');
    
    var subject = "DSPS Test Proctoring Request";
    var message = "Dear " + name + ",<br><br>";
//    var cur_date = new Date().toLocaleString();
    var str_cur_date = getCurrentDateTimeString();
    
    message += "Your test proctoring request that was submitted on <b>" + str_cur_date + "</b> is <b>being processed</b> and an email has been sent to your instructor for their approval.<br>";    
    message += "An email confirming or denying your exam will be sent to you. If this test has been changed, canceled, or your class was dropped contact DSPC immediately<br><br>";
    message += "Instructor Name: <b>" + $('#inst_list').val() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_list').val() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    // demo setup
//    proc_sendEmail("stafftest@ivc.edu", name, subject, message);
    proc_sendEmail(email, name, subject, message);
}