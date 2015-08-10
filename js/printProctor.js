var proctor_id = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {   
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
        window.open('home.html', '_self');
        return false;
    });
    
    $('#nav_logout').click(function() { 
        localStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
});

////////////////////////////////////////////////////////////////////////////////
function defaultHideDisalbe() {
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
        $('#comments').html(result[0]['Comments'].replace(/\n/g, "<br>"));
        $('#inst_phone').html(result[0]['InstPhone']);
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