var proctor_id = "";
var m_total_page = 0;

var inst_name = "";
var section_num = "";

var target;
var spinner;

var str_img = "";
var master = false;

var inst_exam_file_id = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) { 
        target = $('#spinner')[0];
        spinner = new Spinner();
        setAdminOption();
        defaultHideDisalbe();
        getURLParameters();
//        setProctorLog();
        setProctor();
        setAccom();
        setInstForm();
        setExamGuide();
        getTransactionHistory();
        getInstructorExamList();
        initializeTable();
    }
    else {
        sessionStorage.setItem('ls_dsps_url_param', location.href);
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_exam_list").tablesorter({ });
}

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
        if (master) {
            window.open('adminHome.html', '_self');
            return false;
        }
        else {
            window.open('instructorHome.html', '_self');
            return false;
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
    
    // exam radio button check event ///////////////////////////////////////////
    $('input[name=rdo_exam]').change(function() {
        var select = $(this).val();
        if (select === "1") {
            getExamPDFList();
            $('#exam_attachment').show();
        }
        else {
            $('#exam_list').empty();
            $('#exam_attachment').hide();
            $('#attachment_file').filestyle('clear');
        }
    });
    
    // file //////////////////////////////////////////////////////////////////// 
    $('#attachment_file').change(function() {
        if (getPDFAttachmentInfo()) {
            var file = $('#attachment_file').get(0).files[0];
            var f_name = file.name.replace(/#/g, "").replace(/'/g, "");
            f_name = removeDiacritics (f_name);
            
            var file_data = new FormData();
            file_data.append("files[]", file, f_name); 
            m_total_page = pdfGetTotalPages(file_data);
            if (m_total_page === 0) {
                swal("Error!", "Your PDF file are not correctly formatted. please verify your pdf file again", "error");
                $('#attachment_file').filestyle('clear');
                return false;
            }
            else {
                startSpin();        
                setTimeout(function() {
                    if (!addExamPDF(f_name)) {
                        var str_msg = "DSPS Instructor Review: " + proctor_id + " DB system error INSERT EXAM PDF FILE";
                        return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
                    }
                    stopSpin();
                }, 1500);
            }
        }
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
    
    // remove file button click ////////////////////////////////////////////////
    $(document).on('click', 'button[id^="btn_delete_exampdf_id"]', function() {
        var exampdf_id = $(this).attr('id').replace("btn_delete_exampdf_id", "");
        var file_name = $('#exampdf_id_' + exampdf_id).html();
        
        var result = new Array();
        result = db_getExamPDF(exampdf_id);
        
        removeExamPDF(exampdf_id, result[0]['FileLinkName']);
        var note = "Test exam: " + file_name + " has been deleted";
        db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
    });
    
    // save button click ///////////////////////////////////////////////////////
    $('#btn_save').click(function() { 
        var exam_attach = $('input[name="rdo_exam"]:checked').val();
        db_updateInstFormExamAttach(proctor_id, exam_attach);
        
        var note = "";
        if (exam_attach === "1") {
            updateInstFormExamReceived();
            note = "Instructor update test exam option to Exam Attachment";
        }
        else {
            db_updateInstFormExamReceived(proctor_id, "0");
            note = "Instructor update test exam option to Exam Drop Off";
        }
        
        var inst_comments = $('#inst_comments').val();
        if (inst_comments !== "") {
            note += "\nComments:\n" + inst_comments;
        } 
        if (note !== "") {
            db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        }
        
        sendEmailToDSPSTestExamChange();        
        swal({  title: "Saved!",
                text: "Test exam option has been saved",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK",
                closeOnConfirm: false },
                function() {
                    window.open('instructorHome.html', '_self');
                    return false;
                });
    });
    
    // close button click //////////////////////////////////////////////////////
    $('#btn_close').click(function() {        
        if (master) {
            window.open('adminHome.html', '_self');
            return false;
        }
        else {
            window.open('instructorHome.html', '_self');
            return false;
        }
    });
    
    // exam folder button click ////////////////////////////////////////////////
    $('#btn_exam_folder').click(function() { 
        inst_exam_file_id = "";
        $('tbody tr').css('background-color', '');
        $('#mod_exam_folder').modal('show');
    });
    
    // table row exam file click ///////////////////////////////////////////////
    $('table').on('click', 'tr', function() {        
        inst_exam_file_id = $(this).attr('id').replace("select_inst_exam_file_id_", "");        
        $(this).css('background-color', '#CCCCFF');
        $(this).siblings().css('background-color', '');
    });
    
    // modal exam folder select button click ///////////////////////////////////
    $('#mod_exam_folder_select').click(function() {
        if (inst_exam_file_id === "") {
            swal("Error", "Please select exam file from the list", "error");
            return false;
        }
        if (!addExamPDFInstructorList()) {
            var str_msg = "DSPS Instructor Review: DB system error INSERT EXAM_PDF ProctorID - " + proctor_id + " InstExamFileID - " + inst_exam_file_id;            
            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
        }
        $('#mod_exam_folder').modal('hide');
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ivc tech support click //////////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() { 
        if (!appSystemTechSupport("Application Web Site: DSPS Exams - Instructor Exam Update<br/><br/>", $('#mod_tech_problems').val(), str_img)) {
            $('#mod_tech_support').modal('hide');
            var str_subject = "DSPS Exam: IVC Tech Support Request Error";
            var str_msg = "Instructor Exam Update: IVC tech support request error";
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
    $('#inst_comments').autosize();
    $('#mod_tech_problems').autosize();
});

////////////////////////////////////////////////////////////////////////////////
function setAdminOption() {   
    if (sessionStorage.getItem('ls_dsps_proctor_loginEmail') === "ykim160@ivc.edu") {
        master = true;
    }
}

////////////////////////////////////////////////////////////////////////////////
function startSpin() {
    spinner.spin(target);
}

function stopSpin() {
    spinner.stop();
}

////////////////////////////////////////////////////////////////////////////////
function defaultHideDisalbe() {
    $('#se_option').hide();
    $('#cal_type').hide();
    $('#cal_type_other').hide();
    $('#sel_internet').hide();
}

////////////////////////////////////////////////////////////////////////////////
//function setProctorLog() {
//    var result = new Array();
//    result = db_getProctorLog(proctor_id);
//    
//    var html = "";
//    for(var i = 0; i < result.length; i++) {
//        html += "<div class='row-fluid'>";
//        html += "<div class='span3' style='padding-top: 5px;'>" + result[i]['Step'] + "</div>";
//        html += "<div class='span3' style='padding-top: 5px;'>" + result[i]['LoginUser'] + "</div>";
//        html += "<div class='span3' style='padding-top: 5px;'>" + result[i]['Status'] + "</div>";
//        html += "<div class='span3' style='padding-top: 5px;'>" + convertDBDateTimeToString(result[i]['DTStamp']) + "</div>";
//        html += "</div>";
//    }
//    $("#proctor_log").append(html);
//}

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
        
        inst_name = result[0]['InstName'];
        section_num = result[0]['SectionNum'];
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
            $('input[name=rdo_exam][value=1]').prop('checked', true);
            $('#exam_attachment').show();
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
        html += "<div class='span1 text-center'><button class='btn btn-mini btn-warning' id='btn_delete_exampdf_id" + exampdf_id + "'><i class='icon-trash icon-white'></i></button></div>";
        html += "<div class='span11'><a href=# id='exampdf_id_" + exampdf_id + "'>" + file_name + "</a></div>";
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
function getPDFAttachmentInfo() {
    var file = $('#attachment_file').get(0).files[0];
    var f_name = file.name.replace(/#/g, "");
    
    if (typeof file !== "undefined" && file !== null) {
        var f_extension = getFileExtension(f_name);
        if (f_extension !== "pdf") {
            swal("Error!", "Only PDF file can be upload", "error");
            $('#attachment_file').filestyle('clear');
            return false;
        } 
        else {   
            if (file.size >= 3000000) {
                swal("Error!", "Attached file size is too big, max. file size allow is 3Mb or less", "error");
                $('#attachment_file').filestyle('clear');
                return false;
            }
            else {
                return true;
            }
        }
    }
    else {
        return false;
    }
}

function addExamPDF(file_name) {
    var exampdf_id = db_insertExamPDF(proctor_id, file_name, "");
    if (exampdf_id === "") {
        return false;
    }
    var php_flname = exampdf_id + "_fileIndex_" + file_name;
    
    var file = $('#attachment_file').get(0).files[0];
    var file_data = new FormData();
    file_data.append("files[]", file, php_flname);
    if (!uploadAttachFile(file_data)) {
        return false;
    }
    else {
        var note = "Test exam: " + file_name + " has been attached";
        db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        $('#attachment_file').filestyle('clear');
        addPDFFileToExamList(exampdf_id, file_name);
        return true;
    }
}

function addPDFFileToExamList(id, file_name) {  
    var html = "<div class='row-fluid' id='row_exampdf_id" + id + "'>";
    html += "<div class='span1 text-center'><button class='btn btn-mini btn-warning' id='btn_delete_exampdf_id" + id + "'><i class='icon-trash icon-white'></i></button></div>";
    html += "<div class='span11'><a href=# id='exampdf_id_" + id + "'>" + file_name + "</a></div>";
    html += "</div>";
    
    $('#exam_list').append(html);
}

function removeExamPDF(id, file_link_name) {
    db_deleteExamPDF(id);
    if (file_link_name !== null && file_link_name.indexOf("ief_") !== 0) {
        deleteAttachFile(file_link_name);
    }
    
    $('#row_exampdf_id' + id).remove();
}

function removeAllExamPDF() {
    db_deleteExamPDFAll(proctor_id);
    $('#exam_list').empty();
}

function updateInstFormExamReceived() {
    var result = new Array();
    result = db_getExamPDFList(proctor_id);
    if (result.length >= 1 ) {
        db_updateInstFormExamReceived(proctor_id, "1");
    }
    else {
        db_updateInstFormExamReceived(proctor_id, "0");
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getInstructorExamList() {
    var result = new Array(); 
    result = db_getInstExamFileByEmail(sessionStorage.getItem('ls_dsps_proctor_loginEmail'));
    
    $('#body_tr').empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setInstExamFileListHTML(result[i]['Semester'], result[i]['CourseID'], result[i]['SectionNum'], result[i]['FileName'], result[i]['InstExamFileID']);
    }
    $("#body_tr").append(body_html);
}

function setInstExamFileListHTML(semester, course, ticket, exam_file, inst_exam_file_id) {
    var tbl_html = "<tr class='form-horizontal' id='select_inst_exam_file_id_" + inst_exam_file_id +  "'>";
    tbl_html += "<td class='span2'>" + semester + "</td>";
    tbl_html += "<td class='span2'>" + course + "</td>";
    tbl_html += "<td class='span1'>" + ticket + "</td>";
    tbl_html += "<td class='span7'>" + exam_file + "</a></td>";
    tbl_html += "</tr>";
    return tbl_html;
}

function addExamPDFInstructorList() {
    var result = new Array();
    result = db_getInstExamFileByID(inst_exam_file_id);
    if (result.length === 1) {
        var exampdf_id = db_insertExamPDFInstructorList(proctor_id, result[0]['FileName'], result[0]['FileLinkName']);
        if (exampdf_id === "") {
            return false;
        }
        var note = "Test exam: " + result[0]['FileName'] + " has been attached from instructor exam folder";
        db_insertTransaction(proctor_id, sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'), note);
        addPDFFileToExamList(exampdf_id, result[0]['FileName']);
        return true;
    }
    else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////
function capture() {    
    html2canvas($('body')).then(function(canvas) { str_img = canvas.toDataURL(); });
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailToDSPSTestExamChange() {
    var subject = "Proctor Test Instructor Exam Update";
    var message = "Dear Angie Bates,<br/><br/>";
    message += "Instructor changed test exam option.<br/><br/>";
    
    if ($('#inst_comments').val() !== "") {
        message += "<b>Comments:</b><br/>" + $('#inst_comments').val().replace(/\n/g, "<br/>") + "<br/><br/>";
    }
    
    message += "Student Name: <b>" + $('#stu_name').html() + "</b><br/>";
    message += "Student ID: <b>" + $('#stu_id').html() + "</b><br/>";
    message += "Instructor Name: <b>" + inst_name + "</b><br/>";
    message += "Ticket #: <b>" + section_num + "</b><br/>";
    message += "Course: <b>" + $('#course_id').html() + "</b><br/>";
    message += "Test Date: <b>" + $('#test_date').html() + "</b><br/>";
    message += "Test Time: <b>" + $('#test_time').html() + "</b><br/><br/>";
    
    var str_url = location.href;
    str_url = str_url.replace("instructorReview.html", "dspsReview_2.html");
    message += "Please click below ticket # to open DSPS 2 review page<br/><br/>";
    message += "<a href='" + str_url + "'>" + section_num + "</a><br/><br/>";

    proc_sendEmail("ivcdspsexams@ivc.edu", "DSPS Exams", subject, message);
}