var proctor_id = "";

var stu_email = "";
var date_submitted = "";

var inst_name = "";
var inst_email = "";
var section_num = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        defaultHideDisalbe();
        getURLParameters();
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
        window.open('home.html', '_self');
        return false;
    });
    
    $('#nav_logout').click(function() { 
        var parent_site = sessionStorage.getItem('m_parentSite');
        sessionStorage.clear();
        window.open(parent_site, '_self');
        return false;
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
        db_updateProctorStatus(proctor_id, 7, "DateDSPSReview2");
        db_insertProctorLog(proctor_id, localStorage.getItem('ls_dsps_proctor_loginDisplayName'), 3, 7);
        
        var note = "DSPS 2 Review Accepted";
        var dsps_comments = $('#dsps_comments').val();
        if (dsps_comments !== "") {
            note += "\nComments: " + textReplaceApostrophe(dsps_comments);
        }       
        db_insertTransaction(proctor_id, localStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        sendEmailToInstructorReview2Accept();
        sendEmailToStudentAccepted();
        
        $('#mod_dialog_box_header').html("Complete");
        $('#mod_dialog_box_body').html("DSPS 2 Review has been Accepted");
        $('#mod_dialog_box').modal('show');
    });
    
    // deny button click ///////////////////////////////////////////////////////
    $('#btn_cancel').click(function() { 
        $(this).prop("disabled", true);
        db_updateProctorStatus(proctor_id, 3, "DateDSPSReview2");
        db_insertProctorLog(proctor_id, localStorage.getItem('ls_dsps_proctor_loginDisplayName'), 3, 3);
        
        var note = "DSPS 2 Review Canceled";
        var dsps_comments = $('#dsps_comments').val();
        if (dsps_comments !== "") {
            note += "\nComments: " + textReplaceApostrophe(dsps_comments);
        }
        db_insertTransaction(proctor_id, localStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        sendEmailToInstructorReview2Canceled();
        sendEmailToStudentCancel();
        
        $('#mod_dialog_box_header').html("Complete");
        $('#mod_dialog_box_body').html("DSPS 2 Review has been Canceled");
        $('#mod_dialog_box').modal('show');
    });
    
    // dialog ok click /////////////////////////////////////////////////////////
    $('#mod_dialog_btn_ok').click(function() { 
        window.open('home.html', '_self');
        return false;
    });
    
    // auto size
    $('#comments').autosize();
    $('#dsps_comments').autosize();
    
    // datepicker
    $('#test_date').datepicker();
    
    // timepicker
//    $('#test_time').timepicker();
});

////////////////////////////////////////////////////////////////////////////////
function defaultHideDisalbe() {
    $('#mod_dialog_box').modal('hide');
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
        if (result[0]['AltMedia'] === "1") {
            $("#ckb_alt_media").prop('checked', true);
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
//        if (result[0]['Scantron'] === "1") {
//            $("#ckb_scantron").prop('checked', true);
//        }
//        if (result[0]['WrittenExam'] === "1") {
//            $("#ckb_written_exam").prop('checked', true);
//        }
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
        var exampdf_id = result[0]['ExamPDFID'];
        var file_name = result[0]['FileName'];
        
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
function sendEmailToStudentAccepted() {
    var subject = "Test proctoring request confirmation";
    var message = "Dear " + $('#stu_name').html() + ",<br><br>";
    message += "Your test proctoring request that was submitted on <b>" + date_submitted + "</b> has been approved<br><br>";
    
    message += "Instructor Name: <b>" + inst_name + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br>";
    message += "Time allotted in class: <b>" + $('#allow_min').html() + "</b> minutes<br><br>";
    
    message += "This is a reminder that you are scheduled to have the above exam proctored in DSPS. Please arrive 15 minutes early and bring a valid picture ID";
    
    // testing
    proc_sendEmail("stafftest@ivc.edu", $('#stu_name').html(), subject, message);
//    proc_sendEmail(stu_email, $('#stu_name').html(), subject, message);
}

function sendEmailToStudentCancel() {
    var subject = "Test proctoring request has been Denied";
    var message = "Dear " + $('#stu_name').html() + ",<br><br>";
    message += "Your test proctoring request that was submitted on <b>" + date_submitted + "</b> has been <b>canceled;</b><br>";
    message += "Please contact the DSPS office as soon as possible regarding your request at 949.451.5630 or ivcdsps@ivc.edu<br>";
    message += "DSPS office hours are Monday through Thursday 8 AM - 5 PM, and Friday 8 AM - 3 PM<br><br>";
    
    message += "Instructor Name: <b>" + inst_name + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br>";
    message += "Time allotted in class: <b>" + $('#allow_min').html() + "</b> minutes<br><br>";
    
    // testing
    proc_sendEmail("stafftest@ivc.edu", $('#stu_name').html(), subject, message);
//    proc_sendEmail(stu_email, $('#stu_name').html(), subject, message);
}

function sendEmailToInstructorReview2Accept() {
    var subject = "Proctor Request 2 Review Accept";
    var message = "Dear " + inst_name + ",<br><br>";
    message += "Proctor test request DSPS 2 Review has been Accepted<br><br>";
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    message += "Comments:<br>" + $('#dsps_comments').val().replace(/\n/g, "<br>");
    
    // testing
    proc_sendEmail("deantest@ivc.edu", inst_name, subject, message);
//    proc_sendEmail(inst_email, inst_name, subject, message);
}

function sendEmailToInstructorReview2Canceled() {
    var subject = "Proctor Request 2 Review Canceled";
    var message = "Dear " + inst_name + ",<br><br>";
    message += "Proctor test request DSPS 2 Review has been Canceled<br><br>";
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br><br>";
    
    message += "Comments:<br>" + $('#dsps_comments').val().replace(/\n/g, "<br>");
    
    // testing
    proc_sendEmail("deantest@ivc.edu", inst_name, subject, message);
//    proc_sendEmail(inst_email, inst_name, subject, message);
}