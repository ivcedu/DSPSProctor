var target;
var spinner;

var cur_term = "";
var cur_semester = "";

var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) { 
        target = $('#spinner')[0];
        spinner = new Spinner();
        getInitializeData();
        getInstructorCourseInfo();
        getInstExamFileList();
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_exam_list").tablesorter({ });
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
        $('#mod_tech_img_screen').prop('src', str_img);
        $('#mod_tech_support').modal('show');
    });
  
    // add exam button click ////////////////////////////////////////////////////
    $('#btn_add_exam').click(function() { 
        clearModalSection();
        $('#mod_dialog_box').modal('show');
    });
    
    // table row exam file link click ///////////////////////////////////////////
    $('table').on('click', 'a[id^="open_inst_exam_file_id_"]', function() {
        var inst_exam_file_id = $(this).attr('id').replace("open_inst_exam_file_id_", "");
        var result = new Array();
        result = db_getInstExamFileByID(inst_exam_file_id);
        
        if (result.length === 1) {
            var url_pdf = "attach_files/" + result[0]['FileLinkName'];
            window.open(url_pdf, '_blank');
            return false;
        }
    });
    
    // table row delete button click ////////////////////////////////////////////
    $('table').on('click', 'a[id^="delete_inst_exam_file_id_"]', function() {
        var inst_exam_file_id = $(this).attr('id').replace("delete_inst_exam_file_id_", "");
        var result = new Array();
        result = db_getInstExamFileByID(inst_exam_file_id);

        if (result.length === 1) {
            if (isExamPDFExist(result[0]['FileLinkName'])) {
                return false;
            }
            swal({ title: "Are you sure?", 
                    text: "You will not be able to recover this exam file!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false }, 
                    function() {   
                        if (!db_deleteInstExamFile(inst_exam_file_id)) {
                            var str_msg = "DSPS Instructor Exam File: DB system error DELETE INST_EXAM_FILE - " + inst_exam_file_id;
                            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
                        }
                        if (!deleteAttachFile(result[0]['FileLinkName'])) {
                            var str_msg = "DSPS Instructor Exam File: delete file error - " + result[0]['FileLinkName'];
                            return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
                        }
                        getInstExamFileList();
                        swal("Deleted!", "Your exam file has been deleted.", "success");  
                    }
                );
        }
    });

    // mod course list change event /////////////////////////////////////////////
    $('#mod_course_list').change(function() {
        $('#mod_ticket').html("<b>" + $(this).val() + "</b>");
    });
    
    // modal save button click //////////////////////////////////////////////////
    $('#mod_btn_save').click(function() { 
        var course = $('#mod_course_list option:selected').text();
        var ticket = $('#mod_course_list').val();
        
        if (getPDFAttachmentInfo()) {
            var file = $('#mod_exam_file').get(0).files[0];
            var f_name = file.name.replace(/#/g, "").replace(/'/g, ""); 
            
            var file_data = new FormData();
            file_data.append("files[]", file, f_name); 
            var t_page = pdfGetTotalPages(file_data);
            if (t_page === 0) {
                swal("Error!", "Your PDF file are not correctly formatted. please verify your pdf file again", "error");
                $('#mod_exam_file').filestyle('clear');
                return false;
            }
            else {  
                startSpin();
                setTimeout(function() {
                    var inst_exam_file_id = addInstExamFile(course, ticket, f_name);
                    if (inst_exam_file_id === "") {
                        stopSpin();
                        var str_msg = "DSPS Instructor Exam File: DB system error INSERT INST_EXAM_FILE";
                        return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
                    }
                    if (!uploadInstructorExamFile(inst_exam_file_id, file)) {
                        stopSpin();
                        var str_msg = "DSPS Instructor Exam File: Upload file error";
                        return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
                    }
                    if (!updateInstExamFile(inst_exam_file_id, file)) {
                        stopSpin();
                        var str_msg = "DSPS Instructor Exam File: DB system error UPDATE INST_EXAM_FILE - " + inst_exam_file_id;
                        return dbSystemErrorHandling("DSPS Exam: DB System Error", str_msg);
                    }
                    getInstExamFileList();
                    stopSpin();
                    $('#mod_dialog_box').modal('hide');
                }, 1500);
            }
        }
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ivc tech support click //////////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() { 
        if (!appSystemTechSupport("Application Web Site: DSPS Exams - Instructor Exam List<br/><br/>", $('#mod_tech_problems').val(), str_img)) {
            $('#mod_tech_support').modal('hide');
            var str_subject = "DSPS Exam: IVC Tech Support Request Error";
            var str_msg = "Instructor Exam List: IVC tech support request error";
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
    $('#mod_tech_problems').autosize();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function startSpin() {
    spinner.spin(target);
}

function stopSpin() {
    spinner.stop();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getInitializeData() {
    cur_term = tardis_getCurrentTerm();
    cur_semester = getCurrentSemester(cur_term);
    $('#mod_semester').html(cur_semester);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function clearModalSection() {
    $('#mod_course_list').val("0");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getInstructorCourseInfo() {
    var arr_email = sessionStorage.getItem('ls_dsps_proctor_loginEmail').split("@");
    var inst_uid = arr_email[0];
    
    var result = new Array();
    result = tardis_getInstructorCourseList(inst_uid, cur_term);
    var html = "";
    for(var i = 0; i < result.length; i++) {
        html += "<option value='" + result[i]['SectionNum'] + "'>" + result[i]['CourseID'] + "</option>";
    }
    $('#mod_course_list').append(html);
    $('#mod_course_list').selectpicker('refresh');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getInstExamFileList() {
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
    var tbl_html = "<tr class='form-horizontal'>";
    tbl_html += "<td class='span2'>" + semester + "</td>";
    tbl_html += "<td class='span2'>" + course + "</td>";
    tbl_html += "<td class='span1'>" + ticket + "</td>";
    tbl_html += "<td class='span6'><a href=# id='open_inst_exam_file_id_" + inst_exam_file_id +  "'>" + exam_file + "</a></td>";
    tbl_html += "<td class='span1' style='text-align: center;'><a href=# id='delete_inst_exam_file_id_" + inst_exam_file_id +  "'><i class='iconic iconic-sm iconic-trash iconic-color-default'></i></a></td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getPDFAttachmentInfo() {
    var file = $('#mod_exam_file').get(0).files[0];
    var f_name = file.name.replace(/#/g, "");
    
    if (typeof file !== "undefined" && file !== null) {
        var f_extension = getFileExtension(f_name);
        if (f_extension !== "pdf") {
            swal("Error!", "Only PDF file can be upload", "error");
            $('#mod_exam_file').filestyle('clear');
            return false;
        } 
        else {   
            if (file.size >= 3000000) {
                swal("Error!", "Attached file size is too big, max. file size allow is 3Mb or less", "error");
                $('#mod_exam_file').filestyle('clear');
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addInstExamFile(course, ticket, f_name) {
    return db_insertInstExamFile(sessionStorage.getItem('ls_dsps_proctor_loginEmail'), cur_term, cur_semester, ticket, course, f_name, "");
}

function uploadInstructorExamFile(inst_exam_file_id, file) {
    var f_name = "ief_" + inst_exam_file_id + "_" + file.name.replace(/#/g, "").replace(/'/g, "");

    var file_data = new FormData();
    file_data.append("files[]", file, f_name); 
    
    return uploadInstExamFile(file_data);
}

function updateInstExamFile(inst_exam_file_id, file) {
    var f_name = "ief_" + inst_exam_file_id + "_" + file.name.replace(/#/g, "").replace(/'/g, "");
    return db_updateInstExamFileByID(inst_exam_file_id, f_name);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function isExamPDFExist(file_link_name) {
    var result = new Array();
    result = db_getExamPDFByFileLinkName(file_link_name);
    
    if (result.length >= 1) {
        swal("Error", "Selected exam file has been assigned for proctor exam. Please wait until proctor process is completed/canceled", "error");
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