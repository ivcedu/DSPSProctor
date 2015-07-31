var proctor_id = "";
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
    });
    
    $('#nav_logout').click(function() { 
        localStorage.clear();
        window.open('Login.html', '_self');
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
            removeAllExamPDF();
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
        }
        else {
            window.open(exam_pdf, '_blank');
        }
    });
    
    // remove file button click ////////////////////////////////////////////////
    $(document).on('click', 'button[id^="btn_delete_exampdf_id"]', function() {
        var exampdf_id = $(this).attr('id').replace("btn_delete_exampdf_id", "");
        removeExamPDF(exampdf_id);
    });
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
    $('#exam_attachment').hide();
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
        if (result[0]['Other'] === "1") {
            $("#ckb_other").prop('checked', true);
        }
        $('#txt_other').html(result[0]['txtOther']);
        if (result[0]['Scribe'] === "1") {
            $("#ckb_scribe").prop('checked', true);
        }
        if (result[0]['Scantron'] === "1") {
            $("#ckb_scantron").prop('checked', true);
        }
        if (result[0]['WrittenExam'] === "1") {
            $("#ckb_written_exam").prop('checked', true);
        }
    }
}

function setInstForm() {
    var result = new Array();
    result = db_getInstForm(proctor_id);
    
    if (result.length === 1) {
        $('#allow_min').html(result[0]['TAllotMin']);
        if (result[0]['Mailbox'] === "1") {
            $("#ckb_mailbox").prop('checked', true);
        }
        $('#bldg').html(result[0]['Bldg']);
        if (result[0]['ProfessorPU'] === "1") {
            $("#ckb_prof_pu").prop('checked', true);
        }
        if (result[0]['Faculty'] === "1") {
            $("#ckb_faculty").prop('checked', true);
        }
        $('#office').html(result[0]['Office']);
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
        var exampdf_id = result[0]['ExamPDFID'];
        var file_name = result[0]['FileName'];
        
        html = "<div class='row-fluid' id='row_exampdf_id" + exampdf_id + "'>";
        html += "<div class='span9' style='padding-top: 5px'><a href=# id='exampdf_id_" + exampdf_id + "'>" + file_name + "</a></div>";
        html += "<button class='btn btn-danger span2' id='btn_delete_exampdf_id" + exampdf_id + "'>Remove File</button>";
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
    
    for (var i = 0; i < result.length; i++) {
        var dt_stamp = convertDBDateTimeToString(result[i]['DTStamp']);
        var login_name = result[i]['LoginName'];
        var note = result[i]['Note'];

        var html = login_name + " : " + dt_stamp + "<br>" + note.replace(/\n/g, "<br>") + "<br><br>";
        $("#transaction_history").append(html);
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

function addExamPDF() {    
    var exampdf_id = db_insertExamPDF(proctor_id, m_file_name, m_base64_data);
    addPDFFileToExamList(exampdf_id);
    $('#attachment_file').filestyle('clear');
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