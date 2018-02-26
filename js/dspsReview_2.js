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
    $('#nav_logout').click(function() { 
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // ivc tech click //////////////////////////////////////////////////////////
    $('#nav_capture').click(function() { 
        capture();
        $('#mod_tech_problems').val("").trigger('autosize.resize');
        $('#mod_tech_support').modal('show');
    });
    
    // exam pdf click event ////////////////////////////////////////////////////
    $(document).on('click', 'a[id^="exampdf_id_"]', function() {
        var exampdf_id = $(this).attr('id').replace("exampdf_id_", "");
        var result = new Array();
        result = db_getExamPDF(exampdf_id);
        
        if (result[0]['FileLinkName'] !== null) {
            var url_pdf = "attach_files/" + result[0]['FileLinkName'];
            window.open(url_pdf, '_blank');
            return false;
        }
    });
    
    // accept button click /////////////////////////////////////////////////////
    $('#btn_accept').click(function() { 
        $(this).prop("disabled", true);
        if(!updateProctorTestDateTime()) {
            var str_msg = "DSPS Review 2: " + proctor_id + " DB system error UPDATE TEST DATETIME";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        if (!db_updateProctorStep(proctor_id, 4, "DateDSPSReview2")) {
            var str_msg = "DSPS Review 2: " + proctor_id + " DB system error UPDATE PROCTOR STEP";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        if (db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 3, 7) === "") {
            var str_msg = "DSPS Review 2: " + proctor_id + " DB system error INSERT PROCTOR LOG - ACCEPT";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        
        var note = "DSPS Review 2 Accepted";
        var dsps_comments = $('#dsps_comments').val();
        if (dsps_comments !== "") {
            note += "\nComments:\n" + dsps_comments;
        }       
        if (db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note) === "") {
            var str_msg = "DSPS Review 2: " + proctor_id + " DB system error INSERT TRANSACTION - ACCEPT";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        sendEmailToInstructorReview2Accept();
        sendEmailToStudentAccepted();
        
        swal({  title: "Complete!",
                text: "DSPS Review 2 has been Accepted",
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
        if ($('#dsps_comments').val().replace(/\s+/g, '') === "") {
            swal("Error!", "Please specify reasons for denial under Comments", "error"); 
            return false;
        }

        $(this).prop("disabled", true);
        if (!db_updateProctorStatus(proctor_id, 3, "DateDSPSReview2")) {
            var str_msg = "DSPS Review 2: " + proctor_id + " DB system error UPDATE PROCTOR STATUS - DENY";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        if (db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 3, 3) === "") {
            var str_msg = "DSPS Review 2: " + proctor_id + " DB system error INSERT PROCTOR LOG - DENY";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        
        var note = "DSPS Review 2 Denied";
        var dsps_comments = $('#dsps_comments').val();
        note += "\nComments:\n" + dsps_comments;
        if (db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note) === "") {
            var str_msg = "DSPS Review 2: " + proctor_id + " DB system error INSERT TRANSACTION - DENY";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        sendEmailToInstructorReview2Denied();
        sendEmailToStudentCancel();
        removeAttacheFiles();
        db_deleteExamPDFAll(proctor_id);
        
        swal({  title: "Complete!",
                text: "DSPS Review 2 has been Denied",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK",
                closeOnConfirm: false }, function() {
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
        if (!db_updateProctorStatus(proctor_id, 10, "DateDSPSReview2")) {
            var str_msg = "DSPS Review 2: " + proctor_id + " DB system error UPDATE PROCTOR STATUS - CANCEL";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        if (db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 3, 10) === "") {
            var str_msg = "DSPS Review 2: " + proctor_id + " DB system error INSERT PROCTOR LOG - CANCEL";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
       
        var note = "DSPS Review 2 Canceled";
        var dsps_comments = $('#dsps_comments').val();
        note += "\nComments:\n" + dsps_comments;
        if (db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note) === "") {
            var str_msg = "DSPS Review 2: " + proctor_id + " DB system error INSERT TRANSACTION - CANCEL";
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        sendEmailToStudentCanceled();
        sendEmailToInstructorCanceled();
        removeAttacheFiles();
        db_deleteExamPDFAll(proctor_id);
        
        swal({  title: "Complete!",
                text: "DSPS Review 2 has been Canceled",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK",
                closeOnConfirm: false }, function() {
                    window.open('adminHome.html', '_self');
                    return false;
                });
    });
       
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ivc tech support click //////////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() {
        if ($.trim($('#mod_tech_problems').val()) === "") {
            swal("Error!", "Please describe your technical issue", "error");
            return false;
        }
        
        if (!appSystemTechSupport("Application Web Site: DSPS Exams - DSPS Review 2<br/><br/>", $('#mod_tech_problems').val(), str_img)) {
            $('#mod_tech_support').modal('hide');
            var str_subject = "DSPS Exam: IVC Tech Support Request Error";
            var str_msg = "DSPS Review 2: IVC tech support request error";
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
        $('#comments').html(result[0]['Comments'].replace(/\n/g, "<br/>")).css({height: 'auto'});
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

function setInstForm() {
    var result = new Array();
    result = db_getInstForm(proctor_id);
    
    if (result.length === 1) {
        $('#allow_min').html(result[0]['TAllotMin']);      
        if (result[0]['Mailbox'] === "1") {
            $("#ckb_mailbox").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            
            $('#cbo_mail_bld').html(result[0]['MailBuilding']);
            $('#bldg').html(result[0]['Bldg']);
        }
        else {
            $("#ckb_mailbox").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        }
        if (result[0]['ProfessorPU'] === "1") {
            $("#ckb_prof_pu").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
        }
        else {
            $("#ckb_prof_pu").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        }
        if (result[0]['Faculty'] === "1") {
            $("#ckb_faculty").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            $('#cbo_faculty_bld').html(result[0]['FacultyBuilding']);
            $('#office').html(result[0]['Office']);
        }
        else {
            $("#ckb_faculty").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        }
        if (result[0]['StuDelivery'] === "1") {
            $("#ckb_stu_delivery").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
        }
        else {
            $("#ckb_stu_delivery").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        }
        if (result[0]['ScanEmail'] === "1") {
            $("#ckb_scan_email").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            $('#se_option').show();
            $('#se_option').html("<b><i>" + result[0]['SEOption'] + "</i></b>");
        }
        else {
            $("#ckb_scan_email").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        }
        if (result[0]['ExamAttach'] === "1") {
            $("#rdo_exam_attach").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            $("#rdo_exam_drop_off").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            getExamPDFList();
        }
        else {
            $("#rdo_exam_attach").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            $("#rdo_exam_drop_off").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
        }
    }
}

function getExamPDFList() {    
    var result = new Array();
    result = db_getExamPDFList(proctor_id);
    
    $('#exam_list').empty();
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<div class='row-fluid' id='row_exampdf_id" + result[i]['ExamPDFID'] + "'>";
        html += "<div class='span9' style='padding-top: 5px'><a href=# id='exampdf_id_" + result[i]['ExamPDFID'] + "'>" + result[i]['FileName'] + "</a></div>";
        html += "</div>";
    }
    $('#exam_list').append(html);
}

function setExamGuide() {
    var result = new Array();
    result = db_getExamGuide(proctor_id);
    
    if (result.length === 1) {
        if (result[0]['Notes'] === "1") {
            $("#rdo_notes_yes").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            $("#rdo_notes_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        }
        else {
            $("#rdo_notes_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            $("#rdo_notes_no").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
        }
        if (result[0]['Book'] === "1") {
            $("#rdo_book_yes").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            $("#rdo_book_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        }
        else {
            $("#rdo_book_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            $("#rdo_book_no").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
        }
        if (result[0]['Calculator'] === "1") {
            $("#rdo_calculator_yes").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            $("#rdo_calculator_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            
            $('#cal_type').show();
            $('#cal_type').html("<b><i>" + result[0]['CalType'] + "</i></b>");
            
            $('#cal_type_other').show();
            $('#cal_type_other').html("<b><i>" + result[0]['CalTypeOther'] + "</i></b>");
        }
        else {
            $("#rdo_calculator_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            $("#rdo_calculator_no").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>"); 
        }
        if (result[0]['Dictionary'] === "1") {
            $("#rdo_dictionary_yes").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            $("#rdo_dictionary_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        }
        else {
            $("#rdo_dictionary_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            $("#rdo_dictionary_no").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>"); 
        }
        if (result[0]['ScratchPaper'] === "1") {
            $("#rdo_scratch_paper_yes").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            $("#rdo_scratch_paper_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        }
        else {
            $("#rdo_scratch_paper_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            $("#rdo_scratch_paper_no").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
        }
        if (result[0]['Scantron'] === "1") {
            $("#rdo_scantron_yes").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            $("#rdo_scantron_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        }
        else {
            $("#rdo_scantron_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            $("#rdo_scantron_no").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
        }
        if (result[0]['Computer'] === "1") {
            $("#rdo_computer_yes").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
            $("#rdo_computer_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            
            $('#sel_internet').show();
            $('#internet_access').html("<b><i>" + result[0]['Internet'] + "</i></b>");
        }
        else {
            $("#rdo_computer_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            $("#rdo_computer_no").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function removeAttacheFiles() {
    var result = new Array();
    result = db_getExamPDFList(proctor_id);
    for (var i = 0; i < result.length; i++) {
        var file_link_name = result[i]["FileLinkName"];
        if (file_link_name !== null && file_link_name.indexOf("ief_") !== 0) {
            deleteAttachFile(file_link_name);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function capture() {    
    html2canvas($('body')).then(function(canvas) { 
        str_img = canvas.toDataURL(); 
        $('#mod_tech_img_screen').prop('src', str_img);
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sendEmailToStudentAccepted() {
    var subject = "Test proctoring request confirmation";
    var message = "Dear " + $('#stu_name').html() + ",<br/><br/>";
    message += "Your test proctoring request that was submitted on <b>" + date_submitted + "</b> has been <b>approved</b><br/><br/>";
    
    message += "This is a reminder that you are scheduled to have the exam below proctored by DSPS. Please arrive 10 minutes early and bring a valid picture ID. ";
    message += "The testing room is scent free environment. DO NOT wear any scented perfumes, lotions, colognes etc. If this test proctoring request is no longer ";
    message += "needed or your exams has been moved contact DSPS at 949-451-5630 or ivcdspsexams@ivc.edu.<br/><br/>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br/>" + $('#dsps_comments').val().replace(/\n/g, "<br/>") + "<br/><br/>";
    }
    
    message += "Instructor Name: <b>" + inst_name + "</b><br/>";
    message += "Ticket #: <b>" + section_num + "</b><br/>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br/>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br/>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br/>";
    message += "Time allotted in class: <b>" + $('#allow_min').html() + "</b> minutes<br/><br/>";

    var cal_title = "DSPS Exams Test: " + $('#stu_name').html() + " (" + $('#course_id').html() + ")";
    var db_start_date = convertStringDateTimeToDBDateFormat($('#test_date').val(), $('#test_time').val(), "");
    var db_end_date = convertStringDateTimeToDBDateFormat($('#test_date').val(), $('#test_time').val(), $('#allow_min').html());

    proc_sendEmailWithCalendar(stu_email, $('#stu_name').html(), subject, message, db_start_date, db_end_date, cal_title, "SSC 171", "DSPS Test Schedule");
}

function sendEmailToStudentCancel() {
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
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br/>";
    message += "Time allotted in class: <b>" + $('#allow_min').html() + "</b> minutes<br/><br/>";

    proc_sendEmail(stu_email, $('#stu_name').html(), subject, message);
}

function sendEmailToInstructorReview2Accept() {
    var subject = "Test Proctoring Confirmation";
    var message = "Dear " + inst_name + ",<br/><br/>";
    message += "The test proctoring request below has been accepted and confirmed.<br/><br/>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br/>" + $('#dsps_comments').val().replace(/\n/g, "<br/>") + "<br/><br/>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br/>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br/>";
    message += "Ticket #: <b>" + section_num + "</b><br/>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br/>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br/>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br/><br/>";

    proc_sendEmail(inst_email, inst_name, subject, message);
}

function sendEmailToInstructorReview2Denied() {
    var subject = "Proctor Request 2 Review Denied";
    var message = "Dear " + inst_name + ",<br/><br/>";
    message += "Proctor test request DSPS Review 2 has been Denied<br/><br/>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br/>" + $('#dsps_comments').val().replace(/\n/g, "<br/>") + "<br/><br/>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br/>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br/>";
    message += "Ticket #: <b>" + section_num + "</b><br/>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br/>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br/>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br/><br/>";

    proc_sendEmail(inst_email, inst_name, subject, message);
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

function sendEmailToInstructorCanceled() {
    var subject = "Test proctoring request has been Canceled";
    var message = "Dear " + inst_name + ",<br/><br/>";
    message += "Proctor test request DSPS Review 2 has been Canceled<br/><br/>";
    
    if ($('#dsps_comments').val() !== "") {
        message += "<b>Comments:</b><br/>" + $('#dsps_comments').val().replace(/\n/g, "<br/>") + "<br/><br/>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br/>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br/>";
    message += "Ticket #: <b>" + section_num + "</b><br/>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br/>";
    message += "Test Date: <b>" + $('#test_date').val() + "</b><br/>";
    message += "Test Time: <b>" + $('#test_time').val() + "</b><br/><br/>";

    proc_sendEmail(stu_email, $('#stu_name').html(), subject, message);
}