var proctor_id = "";

var stu_email = "";
var date_submitted = "";

var inst_name = "";
var inst_email = "";
var section_num = "";

var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        getURLParameters();
        // email link validation
        if (!emailLinkValidation()) {
            sessionStorage.setItem('ls_dsps_review_step', "Review 2");
            window.open('emailAccessError.html', '_self');
            return false;
        }
        
        defaultHideDisalbe();
        setProctor();
        setAccom();
        setInstForm();
        setExamGuide();
        getTransactionHistory();
    }
    else {
        sessionStorage.setItem('ls_dsps_url_param', location.href);
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
function getURLParameters() {
    var searchStr = location.search;
    var searchArray = new Array();
    while (searchStr!=='') {
        var name, value;
        // strip off leading ? or &
        if ((searchStr.charAt(0)==='?')||(searchStr.charAt(0)==='&')) {
            searchStr = searchStr.substring(1,searchStr.length);
        }
        // find name
        name = searchStr.substring(0,searchStr.indexOf('='));
        // find value
        if (searchStr.indexOf('&')!==-1) {
            value = searchStr.substring(searchStr.indexOf('=')+1,searchStr.indexOf('&'));
        }
        else {
            value = searchStr.substring(searchStr.indexOf('=')+1,searchStr.length);
        }
        // add pair to an associative array
        value = value.replace("%20", " ");
        searchArray[name] = value;
        // cut first pair from string
        if (searchStr.indexOf('&')!==-1) {
            searchStr =  searchStr.substring(searchStr.indexOf('&')+1,searchStr.length);
        }
        else {
            searchStr = '';
        }
    }
    
    proctor_id = searchArray['proctor_id'];
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
    
    // exam pdf click event ////////////////////////////////////////////////////
    $(document).on('click', 'a[id^="exampdf_id_"]', function() {
        var exampdf_id = $(this).attr('id').replace("exampdf_id_", "");
        
        var result = new Array();
        result = db_getExamPDF(exampdf_id);
        var file_name = result[0]['FileName'];
        var exam_pdf = result[0]['ExamPDF'];

        var curBrowser = bowser.name;
        if (curBrowser === "Internet Explorer") {
            var blob = b64toBlob(exam_pdf, 'application/pdf');
            window.saveAs(blob, file_name);
            return false;
        }
        else {
            window.open(exam_pdf, '_blank');
            return false;
        }
    });
    
    // accept button click /////////////////////////////////////////////////////
    $('#btn_accept').click(function() { 
        $(this).prop("disabled", true);
        updateProctorTestDateTime();
        db_updateProctorStep(proctor_id, 4, "DateDSPSReview2");
        db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 3, 7);
        
        var note = "DSPS Review 2 Accepted";
        var dsps_comments = $('#dsps_comments').val();
        if (dsps_comments !== "") {
            note += "\nComments: " + textReplaceApostrophe(dsps_comments);
        }       
        db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        sendEmailToInstructorReview2Accept();
        sendEmailToStudentAccepted();
        
        $('#mod_dialog_box_header').html("Complete");
        $('#mod_dialog_box_body').html("DSPS Review 2 has been Accepted");
        $('#mod_dialog_box').modal('show');
    });
    
    // deny button click ///////////////////////////////////////////////////////
    $('#btn_deny').click(function() { 
        if ($('#dsps_comments').val().replace(/\s+/g, '') === "") {
            alert("Please specify reasons for denial under Comments");
            return false;
        }
        
        $(this).prop("disabled", true);
        db_updateProctorStatus(proctor_id, 3, "DateDSPSReview2");
        db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 3, 3);
        
        var note = "DSPS Review 2 Denied";
        var dsps_comments = $('#dsps_comments').val();
        note += "\nComments: " + textReplaceApostrophe(dsps_comments);
        db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        sendEmailToInstructorReview2Denied();
        sendEmailToStudentCancel();
        
        $('#mod_dialog_box_header').html("Complete");
        $('#mod_dialog_box_body').html("DSPS Review 2 has been Denied");
        $('#mod_dialog_box').modal('show');
    });
    
    // cancel button click ///////////////////////////////////////////////////////
    $('#btn_cancel').click(function() { 
        if ($('#dsps_comments').val().replace(/\s+/g, '') === "") {
            alert("Please specify reasons for cancel under Comments");
            return false;
        }
        
        $(this).prop("disabled", true);
        db_updateProctorStatus(proctor_id, 10, "DateDSPSReview2");
        db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 3, 10);
        
        var note = "DSPS Review 2 Canceled";
        var dsps_comments = $('#dsps_comments').val();
        note += "\nComments: " + textReplaceApostrophe(dsps_comments);
        db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        sendEmailToStudentCanceled();
        sendEmailToInstructorCanceled();
        
        $('#mod_dialog_box_header').html("Complete");
        $('#mod_dialog_box_body').html("DSPS Review 2 has been Canceled");
        $('#mod_dialog_box').modal('show');
    });
    
    // dialog ok click /////////////////////////////////////////////////////////
    $('#mod_dialog_btn_ok').click(function() { 
        window.open('adminHome.html', '_self');
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
    
    // auto size
    $('#comments').autosize();
    $('#dsps_comments').autosize();
    
    // datepicker
    $('#test_date').datepicker();
    
    // timepicker
//    $('#test_time').timepicker();
});

////////////////////////////////////////////////////////////////////////////////
function emailLinkValidation() {
    var result = new Array();
    result = db_getProctor(proctor_id);
    
    if (result.length === 1) {
        var step_id = result[0]['StepID'];
        var status_id = result[0]['StatusID'];
        
        if (step_id === "3" && status_id === "2") {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////
function defaultHideDisalbe() {
    $('#mod_dialog_box').modal('hide');
    $('#mod_tech_support').modal('hide');
    $('#se_option').hide();
    $('#cal_type').hide();
    $('#cal_type_other').hide();
    $('#sel_internet').hide();
}

////////////////////////////////////////////////////////////////////////////////
function setProctor() {
    var result = new Array();
    result = db_getProctor(proctor_id);
    
    if (result.length === 1) {
        $('#stu_name').html(result[0]['StuName']);
        $('#stu_id').html(result[0]['StuID']);
        $('#inst_name').html(result[0]['InstName']);
        $('#course_id').html(result[0]['CourseID']);
        $('#test_date').val(result[0]['TestDate']);
        
//        $('#test_time').val(result[0]['TestTime']);
        $('#test_time').timepicker({defaultTime: result[0]['TestTime']});
        
        $('#comments').html(result[0]['Comments'].replace(/\n/g, "<br>"));
        $('#inst_phone').html(result[0]['InstPhone']);
        
        stu_email = result[0]['StuEmail'];
        inst_name = result[0]['InstName'];
        inst_email = result[0]['InstEmail'];
        section_num = result[0]['SectionNum'];
        date_submitted = convertDBDateTimeToString(result[0]['DateSubmitted']);
    }
}

function setAccom() {
    var result = new Array();
    result = db_getAccom(proctor_id);
    
    if (result.length === 1) {
        if (result[0]['TimeOneHalf'] === "1") {
            $("#ckb_time_one_half").prop('checked', true);
        }
        if (result[0]['DoubleTime'] === "1") {
            $("#ckb_double_time").prop('checked', true);
        }
        if (result[0]['Reader'] === "1") {
            $("#ckb_reader").prop('checked', true);
        }
        if (result[0]['EnlargeExam'] === "1") {
            $("#ckb_enlarge_exam").prop('checked', true);
        }
        if (result[0]['UseOfComp'] === "1") {
            $("#ckb_user_of_comp").prop('checked', true);
        }
        if (result[0]['Scribe'] === "1") {
            $("#ckb_scribe").prop('checked', true);
            var ckb_scantron = result[0]['Scantron'];
            var ckb_written_exam = result[0]['WrittenExam'];
            var scribe_html = "";
            if (ckb_scantron === "1" && ckb_written_exam === "0") {
                scribe_html = "Scantron Only";
            }
            else if (ckb_scantron === "0" && ckb_written_exam === "1") {
                scribe_html = "Written Exam";
            }
            else {
                scribe_html = "Scantron and Written Exam";
            }
            $('#cbo_scribe_list').html(scribe_html);
        }
        if (result[0]['Distraction'] === "1") {
            $("#ckb_distraction").prop('checked', true);
        }
        if (result[0]['Other'] === "1") {
            $("#ckb_other").prop('checked', true);
        }
        $('#txt_other').html(result[0]['txtOther']);
    }
}

function setInstForm() {
    var result = new Array();
    result = db_getInstForm(proctor_id);
    
    if (result.length === 1) {
        $('#allow_min').html(result[0]['TAllotMin']);      
        if (result[0]['Mailbox'] === "1") {
            $("#ckb_mailbox").prop('checked', true);
            $('#cbo_mail_bld').html(result[0]['MailBuilding']);
            $('#bldg').html(result[0]['Bldg']);
        }
        if (result[0]['ProfessorPU'] === "1") {
            $("#ckb_prof_pu").prop('checked', true);
        }
        if (result[0]['Faculty'] === "1") {
            $("#ckb_faculty").prop('checked', true);
            $('#cbo_faculty_bld').html(result[0]['FacultyBuilding']);
            $('#office').html(result[0]['Office']);
        }
        if (result[0]['StuDelivery'] === "1") {
            $("#ckb_stu_delivery").prop('checked', true);
        }
        if (result[0]['ScanEmail'] === "1") {
            $("#ckb_scan_email").prop('checked', true);
            
            $('#se_option').show();
            $('#se_option').html(result[0]['SEOption']);
        }
        if (result[0]['ExamAttach'] === "1") {
            $('input[name=rdo_exam][value=1]').prop('checked', true);
            getExamPDFList();
        }
        else {
            $('input[name=rdo_exam][value=0]').prop('checked', true);
        }
    }
}

function getExamPDFList() {    
    var result = new Array();
    result = db_getExamPDFList(proctor_id);
    
    $('#exam_list').empty();
    var html = "";
    for (var i = 0; i < result.length; i++) {
        var exampdf_id = result[i]['ExamPDFID'];
        var file_name = result[i]['FileName'];
        
        html += "<div class='row-fluid' id='row_exampdf_id" + exampdf_id + "'>";
        html += "<div class='span9' style='padding-top: 5px'><a href=# id='exampdf_id_" + exampdf_id + "'>" + file_name + "</a></div>";
        html += "</div>";
    }
    $('#exam_list').append(html);
}

function setExamGuide() {
    var result = new Array();
    result = db_getExamGuide(proctor_id);
    
    if (result.length === 1) {
        if (result[0]['Notes'] === "1") {
            $('input[name=rdo_notes][value=1]').prop('checked', true); 
        }
        else {
            $('input[name=rdo_notes][value=0]').prop('checked', true); 
        }
        if (result[0]['Book'] === "1") {
            $('input[name=rdo_book][value=1]').prop('checked', true); 
        }
        else {
            $('input[name=rdo_book][value=0]').prop('checked', true); 
        }
        if (result[0]['Calculator'] === "1") {
            $('input[name=rdo_calculator][value=1]').prop('checked', true); 
            
            $('#cal_type').show();
            $('#cal_type').html(result[0]['CalType']);
            
            $('#cal_type_other').show();
            $('#cal_type_other').html(result[0]['CalTypeOther']);
        }
        else {
            $('input[name=rdo_calculator][value=0]').prop('checked', true); 
        }
        if (result[0]['Dictionary'] === "1") {
            $('input[name=rdo_dictionary][value=1]').prop('checked', true); 
        }
        else {
            $('input[name=rdo_dictionary][value=0]').prop('checked', true);
        }
        if (result[0]['ScratchPaper'] === "1") {
            $('input[name=rdo_scratch_paper][value=1]').prop('checked', true); 
        }
        else {
            $('input[name=rdo_scratch_paper][value=0]').prop('checked', true);
        }
        if (result[0]['Scantron'] === "1") {
            $('input[name=rdo_scantron][value=1]').prop('checked', true);
        }
        else {
            $('input[name=rdo_scantron][value=0]').prop('checked', true);
        }
        if (result[0]['Computer'] === "1") {
            $('input[name=rdo_computer][value=1]').prop('checked', true);
            
            $('#sel_internet').show();
            $('#internet_access').html(result[0]['Internet']);
        }
        else {
            $('input[name=rdo_computer][value=0]').prop('checked', true);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
function getTransactionHistory() {
    var result = new Array();
    result = db_getTransaction(proctor_id);
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        var dt_stamp = convertDBDateTimeToString(result[i]['DTStamp']);
        var login_name = result[i]['LoginName'];
        var note = result[i]['Note'];

        html += login_name + " : " + dt_stamp + "<br>" + note.replace(/\n/g, "<br>") + "<br><br>";
    }
    $("#transaction_history").append(html);
}

////////////////////////////////////////////////////////////////////////////////
function updateProctorTestDateTime() {
    var test_date = $('#test_date').val();
    var test_time = $('#test_time').val();
    db_updateProctorTestDT(proctor_id, test_date, test_time);
}

////////////////////////////////////////////////////////////////////////////////
function capture() {    
    html2canvas($('body')).then(function(canvas) { str_img = canvas.toDataURL(); });
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailToTechSupport() {
    var subject = "Request for New Ticket";
    var message = "New tickert has been requested from <b>" + sessionStorage.getItem('ls_dsps_proctor_loginDisplayName') + "</b> (" + sessionStorage.getItem('ls_dsps_proctor_loginEmail') + ")<br><br>";
    message += "Application Web Site: <b>DSPS 2 Review</b><br><br>";
    message += "<b>Problems:</b><br>" + $('#mod_tech_problems').val().replace(/\n/g, "<br>");
//    message += "<img src='cid:screen_shot'/>";    
    var img_base64 = str_img.replace("data:image/png;base64,", "");
    return proc_sendEmailToTechSupport("presidenttest@ivc.edu", "Do Not Reply", "", "", subject, message, img_base64);
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailToStudentAccepted() {
    var subject = "Test proctoring request confirmation";
    var message = "Dear " + $('#stu_name').html() + ",<br><br>";
    message += "Your test proctoring request that was submitted on <b>" + date_submitted + "</b> has been approved<br><br>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br>" + $('#dsps_comments').val().replace(/\n/g, "<br>") + "<br><br>";
    }
    
    message += "Instructor Name: <b>" + inst_name + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br>";
    message += "Time allotted in class: <b>" + $('#allow_min').html() + "</b> minutes<br><br>";

    message += "This is a reminder that you are scheduled to have the above exam proctored in DSPS. Please arrive 15 minutes early and bring a valid picture ID";

    var cal_title = "DSPS Exams Test: " + $('#stu_name').html() + " (" + $('#course_id').html() + ")";
    var db_start_date = convertStringDateTimeToDBDateFormat($('#test_date').val(), $('#test_time').val(), "");
    var db_end_date = convertStringDateTimeToDBDateFormat($('#test_date').val(), $('#test_time').val(), $('#allow_min').html());
    
    // testing
//    proc_sendEmailWithCalendar("stafftest@ivc.edu", $('#stu_name').html(), subject, message, db_start_date, db_end_date, cal_title, "SSC 171", "DSPS Test Schedule");
    proc_sendEmailWithCalendar(stu_email, $('#stu_name').html(), subject, message, db_start_date, db_end_date, cal_title, "SSC 171", "DSPS Test Schedule");
}

function sendEmailToStudentCancel() {
    var subject = "Test proctoring request has been Denied";
    var message = "Dear " + $('#stu_name').html() + ",<br><br>";
    message += "Your test proctoring request that was submitted on <b>" + date_submitted + "</b> has been <b>Denied;</b><br><br>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br>" + $('#dsps_comments').val().replace(/\n/g, "<br>") + "<br><br>";
    }
    
    message += "Please contact the DSPS office as soon as possible regarding your request at 949.451.5630 or ivcdspsexams@ivc.edu<br>";
    message += "DSPS office hours are Monday through Thursday 8 AM - 5 PM, and Friday 8 AM - 3 PM<br><br>";
    
    message += "Instructor Name: <b>" + inst_name + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br>";
    message += "Time allotted in class: <b>" + $('#allow_min').html() + "</b> minutes<br><br>";
    
    // testing
//    proc_sendEmail("stafftest@ivc.edu", $('#stu_name').html(), subject, message);
    proc_sendEmail(stu_email, $('#stu_name').html(), subject, message);
}

function sendEmailToInstructorReview2Accept() {
    var subject = "Proctor Request 2 Review Accept";
    var message = "Dear " + inst_name + ",<br><br>";
    message += "Proctor test request DSPS Review 2 has been Accepted<br><br>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br>" + $('#dsps_comments').val().replace(/\n/g, "<br>") + "<br><br>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    // testing
//    proc_sendEmail("deantest@ivc.edu", inst_name, subject, message);
    proc_sendEmail(inst_email, inst_name, subject, message);
}

function sendEmailToInstructorReview2Denied() {
    var subject = "Proctor Request 2 Review Denied";
    var message = "Dear " + inst_name + ",<br><br>";
    message += "Proctor test request DSPS Review 2 has been Denied<br><br>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br>" + $('#dsps_comments').val().replace(/\n/g, "<br>") + "<br><br>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    // testing
//    proc_sendEmail("deantest@ivc.edu", inst_name, subject, message);
    proc_sendEmail(inst_email, inst_name, subject, message);
}

function sendEmailToStudentCanceled() {
    var subject = "Test proctoring request has been Canceled";
    var message = "Dear " + $('#stu_name').html() + ",<br><br>";
    message += "Your test proctoring request that was submitted on <b>" + date_submitted + "</b> has been <b>Canceled;</b><br><br>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br>" + $('#dsps_comments').val().replace(/\n/g, "<br>") + "<br><br>";
    }
    
    message += "Instructor Name: <b>" + inst_name + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    // testing
//    proc_sendEmail("stafftest@ivc.edu", $('#stu_name').html(), subject, message);
    proc_sendEmail(stu_email, $('#stu_name').html(), subject, message);
}

function sendEmailToInstructorCanceled() {
    var subject = "Test proctoring request has been Canceled";
    var message = "Dear " + inst_name + ",<br><br>";
    message += "Proctor test request DSPS Review 2 has been Canceled<br><br>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br>" + $('#dsps_comments').val().replace(/\n/g, "<br>") + "<br><br>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    // testing
//    proc_sendEmail("deantest@ivc.edu", $('#stu_name').html(), subject, message);
    proc_sendEmail(stu_email, $('#stu_name').html(), subject, message);
}