var proctor_id = "";
var m_start = false;

var stu_email = "";
var date_submitted = "";

var inst_name = "";
var inst_email = "";
var inst_phone = "";
var section_num = "";

var m_file_name = "";
var m_base64_data = "";

var target;
var spinner;
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {
        target = $('#spinner')[0];
        spinner = new Spinner();
        
        defaultHideDisalbe();
        
        getSEOption();
        getCalType();
        getInternet();
        getIVCBLDList();
        
        getURLParameters();
        setProctor();
        setAccom();
        setInstForm();
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
    
    // exam radio button check event ///////////////////////////////////////////
    $('input[name=rdo_exam]').change(function() {
        var select = $(this).val();
        if (select === "1") {
            $('#exam_attachment').show();
        }
        else {
            $('#exam_attachment').hide();
            $('#attachment_file').filestyle('clear');
        }
    });

    // mailbox check event /////////////////////////////////////////////////////
    $('#ckb_mailbox').change(function() {
        if ($(this).is(':checked')) {
            $('#cbo_mail_bld').prop('disabled', false);
            $('#cbo_mail_bld').selectpicker('refresh');
            $('#bldg').prop('readonly', false);
        }
        else {
            $('#cbo_mail_bld').prop('disabled', true);
            $('#cbo_mail_bld').selectpicker('refresh');
            $('#bldg').val("");
            $('#bldg').prop('readonly', true);
        }
    });
    
    // faculty office check event //////////////////////////////////////////////
    $('#ckb_faculty').change(function() {
        if ($(this).is(':checked')) {
            $('#cbo_faculty_bld').prop('disabled', false);
            $('#cbo_faculty_bld').selectpicker('refresh');
            $('#office').prop('readonly', false);
        }
        else {
            $('#cbo_faculty_bld').prop('disabled', true);
            $('#cbo_faculty_bld').selectpicker('refresh');
            $('#office').val("");
            $('#office').prop('readonly', true);
        }
    });
    
    // scan and email check event //////////////////////////////////////////////
    $('#ckb_scan_email').change(function() {
        if ($(this).is(':checked')) {
            $('#sel_se_option').show();
        }
        else {
            $('#sel_se_option').hide();
            $('#se_option').val("1");
            $('#se_option').selectpicker('refresh');
        }
    });
    
    // calculator radio button check event /////////////////////////////////////
    $('input[name=rdo_calculator]').change(function() {
        var select = $(this).val();
        if (select === "1") {
            $('#sel_cal_type').show();
        }
        else {
            $('#sel_cal_type').hide();
            $('#cal_type').val("1");
            $('#cal_type').selectpicker('refresh');
            $('#sel_cal_other').hide();
            $('#cal_type_other').val("");
        }
    });
    
    // calculator type change event ////////////////////////////////////////////
    $('#cal_type').change(function() {
        var select = $(this).val();
        if (select === "3") {
            $('#cal_type_other').val("");
            $('#sel_cal_other').show();
        }
        else {
            $('#sel_cal_other').hide();
        }
    });
    
    // computer radio button check event ///////////////////////////////////////
    $('input[name=rdo_computer]').change(function() {
        var select = $(this).val();
        if (select === "1") {
            $('#sel_internet').show();
        }
        else {
            $('#sel_internet').hide();
            $('#internet_access').val("1");
            $('#internet_access').selectpicker('refresh');
        }
    });
    
    // file //////////////////////////////////////////////////////////////////// 
    $('#attachment_file').change(function() {
        if (getPDFAttachmentInfo()) {
            $('#add_file').prop('disabled', false);
        }
        else {
            $('#add_file').prop('disabled', true);
        }
    });
    
    // add file button click ///////////////////////////////////////////////////
    $('#add_file').click(function() {
        startSpin();        
        setTimeout(function() {      
            addExamPDF();
            stopSpin();
        }, 1000);
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
    
    // remove file button click ////////////////////////////////////////////////    
    $(document).on('click', 'button[id^="btn_delete_exampdf_id"]', function() {
        var exampdf_id = $(this).attr('id').replace("btn_delete_exampdf_id", "");
        removeExamPDF(exampdf_id);
    });
    
    // accept button click /////////////////////////////////////////////////////
    $('#btn_accept').click(function() { 
        $(this).prop("disabled", true);
        updateProctorInstructorPhone();
        
        insertInstForm();
        insertExamGuide();
        
        db_updateProctorStep(proctor_id, 3, "DateInstReview");
        db_insertProctorLog(proctor_id, localStorage.getItem('ls_dsps_proctor_loginDisplayName'), 2, 7);
        
        var note = "Instructor Review Accepted";
        var dsps_comments = $('#dsps_comments').val();
        if (dsps_comments !== "") {
            note += "\nComments: " + textReplaceApostrophe(dsps_comments);
        } 
        db_insertTransaction(proctor_id, localStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        sendEmailToDSPS_2();
        
        $('#mod_dialog_box_header').html("Complete");
        $('#mod_dialog_box_body').html("Instructor Review has been Accepted");
        $('#mod_dialog_box').modal('show');
    });
    
    // deny button click ///////////////////////////////////////////////////////
    $('#btn_cancel').click(function() { 
        $(this).prop("disabled", true);
        db_updateProctorStatus(proctor_id, 3, "DateInstReview");
        db_insertProctorLog(proctor_id, localStorage.getItem('ls_dsps_proctor_loginDisplayName'), 2, 3);
        
        var note = "Instructor Review Canceled";
        var dsps_comments = $('#dsps_comments').val();
        if (dsps_comments !== "") {
            note += "\nComments: " + textReplaceApostrophe(dsps_comments);
        } 
        db_insertTransaction(proctor_id, localStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        sendEmailToStudentDeny();
        
        $('#mod_dialog_box_header').html("Complete");
        $('#mod_dialog_box_body').html("Instructor Review has been Canceled");
        $('#mod_dialog_box').modal('show');
    });
    
    // dialog ok click /////////////////////////////////////////////////////////
    $('#mod_dialog_btn_ok').click(function() { 
        window.open('home.html', '_self');
        return false;
    });
    
    // selectpicker
    $('.selectpicker').selectpicker();
    
    // auto size
    $('#comments').autosize();
    $('#dsps_comments').autosize();
});

////////////////////////////////////////////////////////////////////////////////
function startSpin() {
    spinner.spin(target);
}

function stopSpin() {
    spinner.stop();
}

////////////////////////////////////////////////////////////////////////////////
function defaultHideDisalbe() {
    $('#mod_dialog_box').modal('hide');
    $('#exam_attachment').hide();
    $('#sel_se_option').hide();
    $('#sel_cal_type').hide();
    $('#sel_cal_other').hide();
    $('#sel_internet').hide();
    
    $('#add_file').prop('disabled', true);
}

////////////////////////////////////////////////////////////////////////////////
function getSEOption() {
    var result = new Array();
    result = db_getSEOption();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['SEOptionID'] + "'>" + result[i]['SEOption'] + "</option>";
    }
    
    $('#se_option').append(html);
    $('#se_option').selectpicker('refresh');
}

function getCalType() {
    var result = new Array();
    result = db_getCalType();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['CalTypeID'] + "'>" + result[i]['CalType'] + "</option>";
    }
    
    $('#cal_type').append(html);
    $('#cal_type').selectpicker('refresh');
}

function getInternet() {
    var result = new Array();
    result = db_getInternet();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['InternetID'] + "'>" + result[i]['Internet'] + "</option>";
    }
    
    $('#internet_access').append(html);
    $('#internet_access').selectpicker('refresh');
}

function getIVCBLDList() {
    var result = new Array();
    result = db_getIVCBLDList();
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['IVCBLDID'] + "'>" + result[i]['BLDCode'] + "</option>";
    }
    
    $('#cbo_mail_bld').append(html);
    $('#cbo_mail_bld').selectpicker('refresh');
    $('#cbo_faculty_bld').append(html);
    $('#cbo_faculty_bld').selectpicker('refresh');
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
        $('#test_date').html(result[0]['TestDate']);
        $('#test_time').html(result[0]['TestTime']);
        $('#comments').html(result[0]['Comments'].replace(/\n/g, "<br>"));
        
        stu_email = result[0]['StuEmail'];
        inst_name = result[0]['InstName'];
        inst_email = result[0]['InstEmail'];
        inst_phone = result[0]['InstPhone'];
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
        if (result[0]['Scantron'] === "1") {
            $("#ckb_scantron").prop('checked', true);
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
//        if (result[0]['WrittenExam'] === "1") {
//            $("#ckb_written_exam").prop('checked', true);
//        }
//        if (result[0]['Distraction'] === "1") {
//            $("#ckb_distraction").prop('checked', true);
//        }
        if (result[0]['Distraction'] === "1") {
            $("#ckb_distraction").prop('checked', true);
        }
        if (result[0]['Other'] === "1") {
            $("#ckb_other").prop('checked', true);
        }
        $('#txt_other').html(result[0]['txtOther']);
        if (result[0]['Scribe'] === "1") {
            $("#ckb_scribe").prop('checked', true);
        }
    }
}

function setInstForm() {
    var result = new Array();
    result = db_getInstForm(proctor_id);
    
    if (result.length === 1) {
        m_start = true;
        $('#allow_min').val(result[0]['TAllotMin']);
        $('#inst_phone').val(inst_phone);
        if (result[0]['Mailbox'] === "1") {
            $("#ckb_mailbox").prop('checked', true);
            $('#cbo_mail_bld').val(result[0]['MailBuilding']);
            $('#bldg').val(result[0]['Bldg']);
        }
        if (result[0]['ProfessorPU'] === "1") {
            $("#ckb_prof_pu").prop('checked', true);
        }
        if (result[0]['Faculty'] === "1") {
            $("#ckb_faculty").prop('checked', true);
            $('#cbo_faculty_bld').val(result[0]['FacultyBuilding']);
            $('#office').val(result[0]['Office']);
        }
        if (result[0]['StuDelivery'] === "1") {
            $("#ckb_stu_delivery").prop('checked', true);
        }
        if (result[0]['ScanEmail'] === "1") {
            $("#ckb_scan_email").prop('checked', true);
            
            $('#se_option').show();
            $('#se_option').val(result[0]['SEOption']);
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
        html += "<button class='btn btn-danger span2' id='btn_delete_exampdf_id" + exampdf_id + "'>Remove File</button>";
        html += "</div>";
    }
    $('#exam_list').append(html);
}

////////////////////////////////////////////////////////////////////////////////
function updateProctorInstructorPhone() {
    var inst_phone = textReplaceApostrophe($('#inst_phone').val());
    return db_updateProctorInstPhone(proctor_id, inst_phone);
}

function insertInstForm() {
    var allow_min = textReplaceApostrophe($('#allow_min').val());
    var mailbox = $('#ckb_mailbox').is(':checked');
    var mail_bld_id = $('#cbo_mail_bld').val();
    var bldg = textReplaceApostrophe($('#bldg').val());
    var prof_pu = $('#ckb_prof_pu').is(':checked');
    var faculty = $('#ckb_faculty').is(':checked');
    var faculty_bld_id = $('#cbo_faculty_bld').val();
    var office = textReplaceApostrophe($('#office').val());
    var stu_delivery = $('#ckb_stu_delivery').is(':checked');
    var scan_email = $('#ckb_scan_email').is(':checked');
    var se_option_id = $('#se_option').val();
    var exam_attach = $('input[name="rdo_exam"]:checked').val();

    if (m_start) {
        return db_updateInstForm(proctor_id, allow_min, mailbox, mail_bld_id, bldg, prof_pu, faculty, faculty_bld_id, office, stu_delivery, scan_email, se_option_id, exam_attach);
    }
    else {
        return db_insertInstForm(proctor_id, allow_min, mailbox, mail_bld_id, bldg, prof_pu, faculty, faculty_bld_id, office, stu_delivery, scan_email, se_option_id, exam_attach);
    }
}

function insertExamGuide() {
    var notes = $('input[name="rdo_notes"]:checked').val();
    var book = $('input[name="rdo_book"]:checked').val();
    var calculator = $('input[name="rdo_calculator"]:checked').val();
    var cal_type_id = $('#cal_type').val();
    var cal_type_other = textReplaceApostrophe($('#cal_type_other').val());
    var dictionary = $('input[name="rdo_dictionary"]:checked').val();
    var scratch_paper = $('input[name="rdo_scratch_paper"]:checked').val();
    var scantron = $('input[name="rdo_scantron"]:checked').val();
    var computer = $('input[name="rdo_computer"]:checked').val();
    var internet_id = $('#internet_access').val();
    
    if (m_start) {
        return db_updateExamGuide(proctor_id, notes, book, calculator, cal_type_id, cal_type_other, dictionary, scratch_paper, scantron, computer, internet_id);
    }
    else {
        return db_insertExamGuide(proctor_id, notes, book, calculator, cal_type_id, cal_type_other, dictionary, scratch_paper, scantron, computer, internet_id);
    }
}

////////////////////////////////////////////////////////////////////////////////
function getPDFAttachmentInfo() {
    var file = $('#attachment_file').get(0).files[0];
    var f_name = file.name.replace(/#/g, "");
    
    if (typeof file !== "undefined") {
        var f_extension = getFileExtension(f_name);
        if (f_extension !== "pdf") {
            alert("Only PDF file can be upload");
            $('#attachment_file').filestyle('clear');
            return false;
        } 
        else {   
            if (file.size >= 2000000) {
                alert("Attached file size is too big, max. file size allow is 5Mb or less");
                $('#attachment_file').filestyle('clear');
                return false;
            }
            else {
                convertPDFtoBase64();
                return true;
            }
        }
    }
    else {
        return false;
    }
}

function convertPDFtoBase64() {
    var file = $('#attachment_file').get(0).files[0];
    m_file_name = file.name.replace(/#/g, "");
    var reader = new FileReader();
    
    reader.onloadend = function () {
        m_base64_data = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    } 
}

function addExamPDF() {    
    var exampdf_id = db_insertExamPDF(proctor_id, m_file_name, m_base64_data);
    addPDFFileToExamList(exampdf_id);
    $('#attachment_file').filestyle('clear');
}

function addPDFFileToExamList(id) {  
    var html = "<div class='row-fluid' id='row_exampdf_id" + id + "'>";
    html += "<div class='span9' style='padding-top: 5px'><a href=# id='exampdf_id_" + id + "'>" + m_file_name + "</a></div>";
    html += "<button class='btn btn-danger span2' id='btn_delete_exampdf_id" + id + "'>Remove File</button>";
    html += "</div>";
    
    $('#exam_list').append(html);
}

function removeExamPDF(id) {
    db_deleteExamPDF(id);
    $('#row_exampdf_id' + id).remove();
}

function removeAllExamPDF() {
    db_deleteExamPDFAll(proctor_id);
    $('#exam_list').empty();
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
function sendEmailToDSPS_2() {
    var subject = "Proctor Test Instructor Review Accepted";
    var message = "Dear Angie Bates,<br><br>";
    message += "Instructor review has been Accepted<br><br>";
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br>";
    message += "Instructor Name: <b>" + inst_name + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').html() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').html() + "</b><br><br>";
    
    message += "Please click below ticket # to open DSPS 2 review page<br><br>";
    message += "<a href='" + location.href + "'>" + section_num + "</a><br><br>";
    
    // testing
    proc_sendEmail("vptest@ivc.edu", "Angie Bates", subject, message);
//    proc_sendEmail("abates@ivc.edu", "Angie Bates", subject, message);
}

function sendEmailToStudentDeny() {
    var subject = "Test proctoring request has been Denied";
    var message = "Dear " + $('#stu_name').html() + ",<br><br>";
    message += "Your test proctoring request that was submitted on <b>" + date_submitted + "</b> has been <b>denied;</b><br>";
    message += "Please contact the DSPS office as soon as possible regarding your request at 949.451.5630 or ivcdsps@ivc.edu<br>";
    message += "DSPS office hours are Monday through Thursday 8 AM - 5 PM, and Friday 8 AM - 3 PM<br><br>";
    
    message += "Instructor Name: <b>" + inst_name + "</b><br>";
    message += "Ticket #: <b>" + section_num + "</b><br>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br>";
    message += "Test Date: <b>" + $('#test_date').html() + "</b><br>";
    message += "Test Time: <b>" + $('#test_time').html() + "</b><br><br>";
    
    // testing
    proc_sendEmail("stafftest@ivc.edu", $('#stu_name').html(), subject, message);
//    proc_sendEmail(stu_email, $('#stu_name').html(), subject, message);
}