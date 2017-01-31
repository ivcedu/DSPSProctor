var proctor_id = "";

var stu_email = "";
var date_submitted = "";

var inst_name = "";
var inst_email = "";
var section_num = "";

var str_img = "";

var new_date = "";
var new_time = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) { 
        getURLParameters();
        // email link validation
        if (!emailLinkValidation()) {
            sessionStorage.setItem('ls_dsps_review_step', "Complete");
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
    
    // complete button click ///////////////////////////////////////////////////
    $('#btn_complete').click(function() { 
        $(this).prop("disabled", true);
        if (!updateProctorTestDateTime()) {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error UPDATE TEST DATETIME";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        if (!db_updateProctorStatus(proctor_id, 4, "DateDSPSComplete")) {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error UPDATE PROCTOR STATUS - COMPLETED";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        if (!db_updateProctorStep(proctor_id, 4, "DateDSPSComplete")) {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error UPDATE PROCTOR STEP";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        if (db_insertProctorLog(proctor_id, textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginDisplayName')), 4, 4) === "") {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error INSERT PROCTOR LOG - COMPLETED";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        
        var note = "DSPS Complete";
        var dsps_comments = $('#dsps_comments').val();
        if (dsps_comments !== "") {
            note += "\nComments: " + textReplaceApostrophe(dsps_comments);
        }
        if (db_insertTransaction(proctor_id, textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginDisplayName')), note) === "") {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error INSERT TRANSACTION - COMPLETED";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        sendEmailToInstructorCompleted();
        
        $('#mod_dialog_box_header').html("Complete");
        $('#mod_dialog_box_body').html("DSPS Complete");
        $('#mod_dialog_box').modal('show');
    });
    
    // no show button click ////////////////////////////////////////////////////
    $('#btn_no_show').click(function() { 
        $(this).prop("disabled", true);
        if (!db_updateProctorStatus(proctor_id, 2, "DateDSPSComplete")) {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error UPDATE PROCTOR STATUS - NO SHOW";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        if (!db_updateProctorStep(proctor_id, 3, "DateInstReview")) {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error UPDATE PROCTOR STEP - REVIEW 2";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        if (db_insertProctorLog(proctor_id, textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginDisplayName')), 4, 5) === "") {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error INSERT PROCTOR LOG - NO SHOW";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        
        var note = "DSPS Student No Show and send back to DSPS Review 2";
        var dsps_comments = $('#dsps_comments').val();
        if (dsps_comments !== "") {
            note += "\nComments: " + textReplaceApostrophe(dsps_comments);
        }
        if (db_insertTransaction(proctor_id, textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginDisplayName')), note) === "") {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error INSERT TRANSACTION - NO SHOW";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        sendEmailToInstructorNoShow();
        
        $('#mod_dialog_box_header').html("Complete");
        $('#mod_dialog_box_body').html("DSPS Student No Show");
        $('#mod_dialog_box').modal('show');
    });
    
    // exam not received button click //////////////////////////////////////////
    $('#btn_no_exam').click(function() { 
        $(this).prop("disabled", true);
        
        var cur_date = new Date();
        cur_date.setDate(cur_date.getDate()+1);
        $('#mod_new_test_date').datepicker( "option", "minDate", cur_date);
        
        $('#mod_new_date_time_box').modal('show');
        $(this).prop("disabled", false);
    });
    
    // mod new date time save click ////////////////////////////////////////////
    $('#mod_new_dt_btn_save').click(function() { 
        new_date = $('#mod_new_test_date').val();
        new_time = $('#mod_new_test_time').val();
        
        if (!db_updateProctorTestDT(proctor_id, new_date, new_time)) {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error UPDATE NEW TEST DATETIME";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        if (db_insertProctorLog(proctor_id, textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginDisplayName')), 4, 9) === "") {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error INSERT PROCTOR LOG - NEW TEST DATETIME";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        
        var note = "DSPS Exam Not Received and rescheduled";
        var dsps_comments = $('#dsps_comments').val();
        if (dsps_comments !== "") {
            note += "\nComments: " + textReplaceApostrophe(dsps_comments);
        }
        if (db_insertTransaction(proctor_id, textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginDisplayName')), note) === "") {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error INSERT TRANSACTION - NEW TEST DATETIME";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        sendEmailToInstructorExamNotReceived();
        sendEmailToStudentExamNotReceived();
        
        window.open('adminHome.html', '_self');
        return false;
    });
    
    // exam status update button click /////////////////////////////////////////
    $('#btn_exam_update').click(function() {
        var exam_received = $('#exam_status_list').val();
        if (!db_updateInstFormExamReceived(proctor_id, exam_received)) {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error UPDATE EXAM STATUS";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        var note = "Exam status updated to " + (exam_received === "1" ? "Received" : "Not Received");
        if (db_insertTransaction(proctor_id, textReplaceApostrophe(sessionStorage.getItem('ls_dsps_proctor_loginDisplayName')), note) === "") {
            var str_msg = "DSPS Complete: " + proctor_id + " DB system error INSERT TRANSACTION - UPDATE EXAM STATUS";
            sendEmailToDeveloper(str_msg);
            alert(str_msg + ", please contact IVC Tech Support at 949.451.5696");
            sessionStorage.clear();
            window.open("Login.html", '_self');
            return false;
        }
        getTransactionHistory();
        alert("Exam status has been updated");
        if (exam_received === "1") {
            $('#btn_no_exam').hide();
        }
        else {
            $('#btn_no_exam').show();
        }
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
    
    // selectpicker
    $('.selectpicker').selectpicker();
    
    // datepicker
    $('#test_date').datepicker();
    $('#mod_new_test_date').datepicker();
    
    // timepicker
    $('#mod_new_test_time').timepicker({template: 'modal'});
});

////////////////////////////////////////////////////////////////////////////////
function emailLinkValidation() {
    var result = new Array();
    result = db_getProctor(proctor_id);
    
    if (result.length === 1) {
        var step_id = result[0]['StepID'];
        var status_id = result[0]['StatusID'];
        
        if (step_id === "4" && status_id === "2") {
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
    $('#mod_new_date_time_box').modal('hide');
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
        $('#test_time').timepicker({defaultTime: result[0]['TestTime']});
        $("#comments").html(result[0]['Comments'].replace(/\n/g, "<br>")).css({height: 'auto'});
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
        if (result[0]['ExamReceived'] === "1") {
            $('#btn_no_exam').hide();
            $('#exam_status_list').val("1");
            $('#exam_status_list').selectpicker('refresh');
        }
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
            $('#exam_type').html("Attachment");
            $('input[name=rdo_exam][value=1]').prop('checked', true);
            getExamPDFList();
        }
        else {
            $('#exam_type').html("Drop Off");
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
    
    $("#transaction_history").html("");
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
    return db_updateProctorTestDT(proctor_id, test_date, test_time);
}

////////////////////////////////////////////////////////////////////////////////
function capture() {    
    html2canvas($('body')).then(function(canvas) { str_img = canvas.toDataURL(); });
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailToTechSupport() {
    var subject = "Request for New Ticket";
    var message = "New tickert has been requested from <b>" + sessionStorage.getItem('ls_dsps_proctor_loginDisplayName') + "</b> (" + sessionStorage.getItem('ls_dsps_proctor_loginEmail') + ")<br><br>";
    message += "Application Web Site: <b>DSPS Complete</b><br><br>";
    message += "<b>Problems:</b><br>" + $('#mod_tech_problems').val().replace(/\n/g, "<br>");
//    message += "<img src='cid:screen_shot'/>";    
    var img_base64 = str_img.replace("data:image/png;base64,", "");
    return proc_sendEmailToTechSupport("presidenttest@ivc.edu", "Do Not Reply", "", "", subject, message, img_base64);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sendEmailToDeveloper(str_msg) {
    proc_sendEmail("ykim160@ivc.edu", "Rich Kim", "DSPS Complete: DB System Error", str_msg);
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailToInstructorCompleted() {
    var subject = "Test Proctoring Request: Completed";
    var message = "Dear " + inst_name + ",<br><br>";
    message += "Proctor test request has been completed<br><br>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br>" + $('#dsps_comments').val().replace(/\n/g, "<br>") + "<br><br>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    // demo setup
//    proc_sendEmail("deantest@ivc.edu", inst_name, subject, message);
    proc_sendEmail(inst_email, inst_name, subject, message);
}

function sendEmailToInstructorNoShow() {
    var subject = "Test Proctoring Request: No Show";
    var message = "Dear " + inst_name + ",<br><br>";
    message += "The student below did not show up for this exam<br><br>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br>" + $('#dsps_comments').val().replace(/\n/g, "<br>") + "<br><br>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    // demo setup
//    proc_sendEmail("deantest@ivc.edu", inst_name, subject, message);
    proc_sendEmail(inst_email, inst_name, subject, message);
}

function sendEmailToInstructorExamNotReceived() {
    var subject = "Proctor Request Exam Not Received";
    var message = "Dear " + inst_name + ",<br><br>";
    message += "We did not received your exam for<br><br>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br>" + $('#dsps_comments').val().replace(/\n/g, "<br>") + "<br><br>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";

    message += "It has been rescheduled for (<b>" + new_date + " " + new_time + "</b>) please attach or drop off exam before this scheduled date/time.<br>";
    message += "Please click below to download the exam, drop the exam off at SSC 170, or contact DSPS at (949)451-5630 or at dspstesting@ivc.edu<br><br>";
    
    var str_url = location.href;
    str_url = str_url.replace("dspsReview_1.html", "instructorReview.html");
    message += "<a href='" + str_url + "'>" + section_num + "</a>";
    
    // demo setup
//    proc_sendEmail("deantest@ivc.edu", inst_name, subject, message);
    proc_sendEmail(inst_email, inst_name, subject, message);
}

function sendEmailToStudentExamNotReceived() {
    var subject = "Proctor Request Exam Not Received";
    var message = "Dear " + $('#stu_name').html() + ",<br><br>";
    message += "We did not receive the exam from your instructor.<br>";
    message += "It has been rescheduled for (<b>" + new_date + " " + new_time + "</b>)<br><br>";
    
//    if ($('#dsps_comments').val() !== "") {
//        message += "<b>Comments:</b><br>" + $('#dsps_comments').val().replace(/\n/g, "<br>") + "<br><br>";
//    }
    
    message += "Instructor Name: <b>" + inst_name + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br>";
    message += "Time allotted in class: <b>" + $('#allow_min').html() + "</b> minutes<br><br>";
    
    message += "Thank you!";

    var cal_title = "DSPS Exams Test: " + $('#stu_name').html() + " (" + $('#course_id').html() + ")";
    var db_start_date = convertStringDateTimeToDBDateFormat(new_date, new_time, "");
    var db_end_date = convertStringDateTimeToDBDateFormat(new_date, new_time, $('#allow_min').html());
    
    // demo setup
//    proc_sendEmailWithCalendar("stafftest@ivc.edu", $('#stu_name').html(), subject, message, db_start_date, db_end_date, cal_title, "SSC 171", "DSPS Test Schedule");
    proc_sendEmailWithCalendar(stu_email, $('#stu_name').html(), subject, message, db_start_date, db_end_date, cal_title, "SSC 171", "DSPS Test Schedule");
}