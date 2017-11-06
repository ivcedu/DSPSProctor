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
            sessionStorage.setItem('ls_dsps_review_step', "Review 1");
            window.open('emailAccessError.html', '_self');
            return false;
        }
        
        setProctor();
        setAccom();
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
    // logout click ////////////////////////////////////////////////////////////
    $('#nav_logout').click(function() { 
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // ivc tech click //////////////////////////////////////////////////////////
    $('#nav_capture').click(function() { 
        capture();
        $('#mod_tech_problems').val("").trigger('autosize.resize');
        $('#mod_tech_img_screen').prop('src', str_img);
        $('#mod_tech_support').modal('show');
    });
    
    // accept button click /////////////////////////////////////////////////////
    $('#btn_accept').click(function() { 
        $(this).prop("disabled", true);
        if (!updateProctorTestDateTime()) {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error UPDATE TEST DATETIME";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        if (!db_updateProctorStatus(proctor_id, 2, "DateDSPSReview1")) {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error UPDATE PROCTOR STATUS - ACCEPT";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        if (!db_updateProctorStep(proctor_id, 2, "DateDSPSReview1")) {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error UPDATE PROCTOR STEP";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        if (db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 1, 7) === "") {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error INSERT PROCTOR LOG - ACCEPT";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        
        var note = "DSPS Review 1 Accepted";
        var dsps_comments = $('#dsps_comments').val();
        if (dsps_comments !== "") {
            note += "\nComments:\n" + dsps_comments;
        } 
        if (db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note) === "") {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error INSERT TRANSACTION - ACCEPT";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        sendEmailToInstructor();
        
        swal({  title: "Complete!",
                text: "DSPS Review 1 has been Accepted",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK",
                closeOnConfirm: false },
                function() {
                    window.open('adminHome.html', '_self');
                    return false;
                });
    });
    
    // dialog deny yes button click ////////////////////////////////////////////
    $('#btn_deny').click(function() { 
        $('#mod_deny_box').modal('hide');
        if ($('#dsps_comments').val().replace(/\s+/g, '') === "") {
            swal("Error!", "Please specify reasons for denial under Comments", "error"); 
            return false;
        }
        
        $(this).prop("disabled", true);
        if (!db_updateProctorStatus(proctor_id, 3, "DateDSPSReview1")) {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error UPDATE PROCTOR STATUS - DENY";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        if (db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 1, 3) === "") {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error INSERT PROCTOR LOG - DENY";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        
        var note = "DSPS Review 1 Denied";
        var dsps_comments = $('#dsps_comments').val();
        note += "\nComments:\n" + dsps_comments;
        if (db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note) === "") {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error INSERT TRANSACTION - DENY";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        sendEmailToStudentDeny();
        
        swal({  title: "Complete!",
                text: "DSPS Review 1 has been Denied",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK",
                closeOnConfirm: false },
                function() {
                    window.open('adminHome.html', '_self');
                    return false;
                });
    });
    
    // cancel button click ///////////////////////////////////////////////////////
    $('#btn_cancel').click(function() { 
        if ($('#dsps_comments').val().replace(/\s+/g, '') === "") {
            swal("Error!", "Please specify reasons for cancel under Comments", "error");
            return false;
        }
        
        $(this).prop("disabled", true);
        if (!db_updateProctorStatus(proctor_id, 10, "DateDSPSReview1")) {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error UPDATE PROCTOR STATUS - CANCEL";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        if (db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 1, 10) === "") {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error INSERT PROCTOR LOG - CANCEL";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        
        var note = "DSPS Review 1 Canceled";
        var dsps_comments = $('#dsps_comments').val();
        note += "\nComments:\n" + dsps_comments;
        if (db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note) === "") {
            var str_msg = "DSPS Review 1: " + proctor_id + " DB system error INSERT TRANSACTION - CANCEL";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        sendEmailToStudentCanceled();
        
        swal({  title: "Complete!",
                text: "DSPS Review 1 has been Canceled",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK",
                closeOnConfirm: false },
                function() {
                    window.open('adminHome.html', '_self');
                    return false;
                });
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ivc tech support click //////////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() { 
        if (!appSystemTechSupport("Application Web Site: DSPS Exams - DSPS Review 1<br/><br/>", $('#mod_tech_problems').val(), str_img)) {
            $('#mod_tech_support').modal('hide');
            var str_subject = "DSPS Exam: IVC Tech Support Request Error";
            var str_msg = "DSPS Review 1: IVC tech support request error";
            sendEmailToDeveloper(str_subject, str_msg);
            swal("Error!", str_msg + "\nplease contact IVC Tech Support at 949.451.5696", "error");
            return false;
        }
        
        swal("Success!", "Your request has been submitted successfully", "success");
        $('#mod_tech_support').modal('hide');
    });
    
    $('#mod_tech_img_screen').click(function() {
        if (str_img !== "") {
            $.fancybox.open({ href : str_img });
        }
    });
    
    // get screen shot image ///////////////////////////////////////////////////
    html2canvas($('body'), {
        onrendered: function(canvas) { str_img = canvas.toDataURL("image/jpg"); }
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // auto size
    $('#comments').autosize();
    $('#dsps_comments').autosize();
    $('#mod_tech_problems').autosize();
    
    // datepicker
    $('#test_date').datepicker();
    
    // tooltip popover
    $('#nav_capture').popover({content:"Report a Bug", placement:"bottom"});
});

////////////////////////////////////////////////////////////////////////////////
function emailLinkValidation() {
    var result = new Array();
    result = db_getProctor(proctor_id);
    
    if (result.length === 1) {
        var step_id = result[0]['StepID'];
        var status_id = result[0]['StatusID'];
        
        if (step_id === "1" && status_id === "1") {
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
        $('#comments').html(result[0]['Comments'].replace(/\n/g, "<br/>")).css({height: 'auto'});
        
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
            $("#ckb_time_one_half").append("<i class='ion-android-checkbox' style='font-size: 20px;'></i>");
        }
        else {
            $("#ckb_time_one_half").append("<i class='ion-android-checkbox-outline-blank' style='font-size: 20px;'></i>");
        }
        if (result[0]['DoubleTime'] === "1") {
            $("#ckb_double_time").append("<i class='ion-android-checkbox' style='font-size: 20px;'></i>");
        }
        else {
            $("#ckb_double_time").append("<i class='ion-android-checkbox-outline-blank' style='font-size: 20px;'></i>");
        }
        if (result[0]['Reader'] === "1") {
            $("#ckb_reader").append("<i class='ion-android-checkbox' style='font-size: 20px;'></i>");
        }
        else {
            $("#ckb_reader").append("<i class='ion-android-checkbox-outline-blank' style='font-size: 20px;'></i>");
        }
        if (result[0]['EnlargeExam'] === "1") {
            $("#ckb_enlarge_exam").append("<i class='ion-android-checkbox' style='font-size: 20px;'></i>");
        }
        else {
            $("#ckb_enlarge_exam").append("<i class='ion-android-checkbox-outline-blank' style='font-size: 20px;'></i>");
        }
        if (result[0]['UseOfComp'] === "1") {
            $("#ckb_user_of_comp").append("<i class='ion-android-checkbox' style='font-size: 20px;'></i>");
        }
        else {
            $("#ckb_user_of_comp").append("<i class='ion-android-checkbox-outline-blank' style='font-size: 20px;'></i>");
        }
        if (result[0]['Scribe'] === "1") {
            $("#ckb_scribe").append("<i class='ion-android-checkbox' style='font-size: 20px;'></i>");
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
            $('#cbo_scribe_list').html("<b><i>" + scribe_html + "</i></b>");
        }
        else {
            $("#ckb_scribe").append("<i class='ion-android-checkbox-outline-blank' style='font-size: 20px;'></i>");
        }
        if (result[0]['Distraction'] === "1") {
            $("#ckb_distraction").append("<i class='ion-android-checkbox' style='font-size: 20px;'></i>");
        }
        else {
            $("#ckb_distraction").append("<i class='ion-android-checkbox-outline-blank' style='font-size: 20px;'></i>");
        }
        if (result[0]['Other'] === "1") {
            $("#ckb_other").append("<i class='ion-android-checkbox' style='font-size: 20px;'></i>");
        }
        else {
            $("#ckb_other").append("<i class='ion-android-checkbox-outline-blank' style='font-size: 20px;'></i>");
        }
        $('#txt_other').html(result[0]['txtOther']);
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

        html += login_name + " : " + dt_stamp + "<br/>" + note.replace(/\n/g, "<br/>") + "<br/><br/>";
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sendEmailToInstructor() {
    var subject = "Test Proctoring Request: New";
    var message = "Dear " + inst_name + ",<br/><br/>";
    message += "A new DSPS test proctoring request has been submitted, reviewed and accepted by DSPS.<br/><br/>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br/>" + $('#dsps_comments').val().replace(/\n/g, "<br/>") + "<br/><br/>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br/>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br/>";
    message += "Ticket #: <b>" + section_num + "</b><br/>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br/>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br/>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br/><br/>";
    
    var str_url_instructor = location.href;
    str_url_instructor = str_url_instructor.replace("dspsReview_1.html", "instructorReview.html");
    var str_url_login = location.href;
    str_url_login = str_url_login.replace("dspsReview_1.html", "Login.html");
    
    message += "Select <a href='" + str_url_instructor + "'>Quick Link #" + section_num + "</a> to process this exam. Once you have \"submitted\" your review you must log into the ";
    message += "<a href='" + str_url_login + "'>DSPS Exam portal</a> for further action, as the \"Quick Link\" will no longer be accessible.<br/><br/>";
    message += "If you need further instructions go to: <a href='http://students.ivc.edu/dsps/Documents/DSPS%20Test%20Proctoring%20Guidelines%20for%20Instructors.pdf'>DSPS Test Proctoring Guidelines.</a><br/><br/>";
    
    proc_sendEmail(inst_email, inst_name, subject, message);
}

function sendEmailToStudentDeny() {
    var subject = "Test proctoring request has been Denied";
    var message = "Dear " + $('#stu_name').html() + ",<br/><br/>";
    message += "Your test proctoring request that was submitted on <b>" + date_submitted + "</b> has been <b>Denied;</b><br/><br/>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br/>" + $('#dsps_comments').val().replace(/\n/g, "<br/>") + "<br/><br/>";
    }
    
    message += "Please contact the DSPS office as soon as possible regarding your request at 949.451.5630 or ivcdspsexams@ivc.edu<br/>";
    message += "DSPS office hours are Monday through Thursday 8 AM - 7 PM, and Friday 8 AM - 5 PM<br/><br/>";
    
    message += "Instructor Name: <b>" + inst_name + "</b><br/>";
    message += "Ticket #: <b>" + section_num + "</b><br/>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br/>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br/>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br/><br/>";

    proc_sendEmail(stu_email, $('#stu_name').html(), subject, message);
}

function sendEmailToStudentCanceled() {
    var subject = "Test proctoring request has been Canceled";
    var message = "Dear " + $('#stu_name').html() + ",<br/><br/>";
    message += "Your test proctoring request that was submitted on <b>" + date_submitted + "</b> has been <b>Canceled;</b><br/><br/>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br/>" + $('#dsps_comments').val().replace(/\n/g, "<br/>") + "<br/><br/>";
    }
    
    message += "Instructor Name: <b>" + inst_name + "</b><br/>";
    message += "Ticket #: <b>" + section_num + "</b><br/>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br/>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br/>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br/><br/>";

    proc_sendEmail(stu_email, $('#stu_name').html(), subject, message);
}