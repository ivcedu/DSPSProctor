var proctor_id = "";
var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {        
        defaultHideDisalbe();
        getURLParameters();
        
        setProctorLog();
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
        var result = new Array();
        result = db_getAdmin(sessionStorage.getItem('ls_dsps_proctor_loginEmail'));
        
        if (result.length === 1) {
            window.open('adminHome.html', '_self');
            return false;
        }
        else {
            window.open('instructorHome.html', '_self');
            return false;
        }
    });
    
    $('#nav_reports').click(function() { 
        var result = new Array();
        result = db_getAdmin(sessionStorage.getItem('ls_dsps_proctor_loginEmail'));
        
        if (result.length === 1) {            
            if (sessionStorage.getItem('ls_dsps_report_referrer') === "rptNoExamList.html") {
                window.open('rptNoExamList.html', '_self');
                return false;
            }
            else if (sessionStorage.getItem('ls_dsps_report_referrer') === "rptAdminHistory.html") {
                window.open('rptAdminHistory.html', '_self');
                return false;
            }
        }
        else {
            if (sessionStorage.getItem('ls_dsps_report_referrer') === "rptInstructorHistory.html") {
                window.open('rptInstructorHistory.html', '_self');
                return false;
            }
        }
    });

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
    
    // complete button click ///////////////////////////////////////////////////
    $('#btn_complete').click(function() { 
        if ($('#dsps_comments').val().replace(/\s+/g, '') === "") {
            swal("Error!", "Please specify reasons for complete under Comments", "error");
            return false;
        }
        
        $(this).prop("disabled", true);
        db_updateProctorStatus(proctor_id, 4, "DateInstReview");
        db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 2, 4);
        
        var note = "Instructor Review stage has been change to Completed";
        var dsps_comments = $.trim($('#dsps_comments').val());
        note += "\nComments: " + dsps_comments;
        db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        db_deleteExamPDFAll(proctor_id);
        
        window.open('adminHome.html', '_self');
        return false;
    });
    
    // cancel button click /////////////////////////////////////////////////////
    $('#btn_cancel').click(function() { 
        if ($('#dsps_comments').val().replace(/\s+/g, '') === "") {
            swal("Error!", "Please specify reasons for cancel under Comments", "error");
            return false;
        }
        
        $(this).prop("disabled", true);
        db_updateProctorStatus(proctor_id, 10, "DateInstReview");
        db_insertProctorLog(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), 2, 10);
        
        var note = "Instructor Review stage has been change to Canceled";
        var dsps_comments = $.trim($('#dsps_comments').val());
        note += "\nComments: " + dsps_comments;
        db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        db_deleteExamPDFAll(proctor_id); 
        
        window.open('adminHome.html', '_self');
        return false;
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ivc tech support click //////////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() { 
        if (!appSystemTechSupport("Application Web Site: DSPS Exams - Print Proctor<br/><br/>", $('#mod_tech_problems').val(), str_img)) {
            $('#mod_tech_support').modal('hide');
            var str_subject = "DSPS Exam: IVC Tech Support Request Error";
            var str_msg = "Print Proctor: IVC tech support request error";
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
    $('#dsps_comments').autosize();
    $('#mod_tech_problems').autosize();
    
    // tooltip popover
    $('#nav_capture').popover({content:"Report a Bug", placement:"bottom"});
});

////////////////////////////////////////////////////////////////////////////////
function defaultHideDisalbe() {    
    if (sessionStorage.getItem('ls_dsps_report_referrer') === "rptAdminHistory.html" 
            || sessionStorage.getItem('ls_dsps_report_referrer') === "rptInstructorHistory.html"
            || sessionStorage.getItem('ls_dsps_report_referrer') === "rptNoExamList.html") {
        $('#nav_icon_reports').show();
    }
    
    $('#se_option').hide();
    $('#cal_type').hide();
    $('#cal_type_other').hide();
    $('#sel_internet').hide();
}

////////////////////////////////////////////////////////////////////////////////
function setProctorLog() {
    var result = new Array();
    result = db_getProctorLog(proctor_id);
    
    var html = "";
    for(var i = 0; i < result.length; i++) {
        html += "<div class='row-fluid'>";
        html += "<div class='span3' style='padding-top: 5px;'>" + result[i]['Step'] + "</div>";
        html += "<div class='span3' style='padding-top: 5px;'>" + result[i]['LoginUser'] + "</div>";
        html += "<div class='span3' style='padding-top: 5px;'>" + result[i]['Status'] + "</div>";
        html += "<div class='span3' style='padding-top: 5px;'>" + convertDBDateTimeToString(result[i]['DTStamp']) + "</div>";
        html += "</div>";
    }
    $("#proctor_log").append(html);
}

function setProctor() {
    var result = new Array();
    result = db_getProctor(proctor_id);
    
    if (result.length === 1) {
        $('#stu_name').html(result[0]['StuName']);
        $('#stu_id').html(result[0]['StuID']);
        $('#inst_name').html(result[0]['InstName']);
        $('#course_id').html(result[0]['CourseID']);
        $('#test_date').html(result[0]['TestDate']);
        $('#test_time').html(result[0]['TestTime']);
        $('#comments').html(result[0]['Comments'].replace(/\n/g, "<br/>")).css({height: 'auto'});
        $('#inst_phone').html(result[0]['InstPhone']);
        
        // set admin option for complete and cancel instructor review
        var result2 = new Array();
        result2 = db_getAdmin(sessionStorage.getItem('ls_dsps_proctor_loginEmail'));
        if (result2.length === 1 && result[0]['StepID'] === "2" && result[0]['StatusID'] === "2") {
            $('#admin_section').show();
        }
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
        }
        else {
            $("#rdo_exam_attach").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
            $("#rdo_exam_drop_off").append("<i class='ion-android-radio-button-on' style='font-size: 20px;'></i>");
        }
    }
    else {
        $("#rdo_exam_attach").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#rdo_exam_drop_off").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        
        $("#ckb_mailbox").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#ckb_prof_pu").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#ckb_faculty").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#ckb_stu_delivery").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#ckb_scan_email").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
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
    else {
        $("#rdo_notes_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#rdo_notes_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        
        $("#rdo_book_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#rdo_book_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        
        $("#rdo_calculator_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#rdo_calculator_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>"); 
        
        $("#rdo_dictionary_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#rdo_dictionary_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        
        $("#rdo_scratch_paper_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#rdo_scratch_paper_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        
        $("#rdo_scantron_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#rdo_scantron_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        
        $("#rdo_computer_yes").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
        $("#rdo_computer_no").append("<i class='ion-android-radio-button-off' style='font-size: 20px;'></i>");
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
function capture() {    
    html2canvas($('body')).then(function(canvas) { str_img = canvas.toDataURL(); });
}