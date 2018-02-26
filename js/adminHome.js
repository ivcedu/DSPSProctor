var str_img = "";
var master = false;
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {   
        $('#login_name').html(sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'));
        setAdminOption();
        getAdminProctorList("All", "");
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#dsps_1_list").tablesorter({ });
    $("#dsps_2_list").tablesorter({ });
    $("#inst_review_list").tablesorter({ });
    $("#dsps_complete_list").tablesorter({ });
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
    
    // filter option change event //////////////////////////////////////////////
    $('#filter_option').change(function() {
        switch ($(this).val()) {
            case "All":
                $('#review_1_section').show();
                $('#instructor_section').show();
                $('#review_2_section').show();
                $('#complete_section').show();
                break;
            case "Review 1":
                $('#review_1_section').show();
                $('#instructor_section').hide();
                $('#review_2_section').hide();
                $('#complete_section').hide();
                break;
            case "Instructor":
                $('#review_1_section').hide();
                $('#instructor_section').show();
                $('#review_2_section').hide();
                $('#complete_section').hide();
                break;
            case "Review 2":
                $('#review_1_section').hide();
                $('#instructor_section').hide();
                $('#review_2_section').show();
                $('#complete_section').hide();
                break;
            case "Complete":
                $('#review_1_section').hide();
                $('#instructor_section').hide();
                $('#review_2_section').hide();
                $('#complete_section').show();
                break;
            default:
                break;
        }
    });
    
    // search option change event //////////////////////////////////////////////
    $('#search_option').change(function() {
        if ($(this).val() === "All") {
            $('#search_field').val("");
            $('#search_field').prop('readonly', true);
        }
        else {
            $('#search_field').prop('readonly', false);
        }
    });
    
    // search button click /////////////////////////////////////////////////////
    $('#btn_search').click(function() { 
        var search_option = $('#search_option').val();
        var search_value = $('#search_field').val().trim();
        getAdminProctorList(search_option, search_value);
    });
    
    // table row open resource form click //////////////////////////////////////
    $('table').on('click', 'a[id^="proctor_id_"]', function(e) {
        e.preventDefault();
        var proctor_id = $(this).attr('id').replace("proctor_id_", "");
        var step = $('#step_' + proctor_id).html();
        
        switch (step) {
            case "Review 1":
                window.open('dspsReview_1.html?proctor_id=' + proctor_id, '_self');
                return false;
                break;
            case "Instructor Review":
                if (master) {
                    swal({ title: "Instructor Review", 
                           type: "info",
                           showCancelButton: true,
                           confirmButtonText: "Instructor View",
                           cancelButtonText: "Admin View",
                           closeOnConfirm: false,
                           closeOnCancel: false }, 
                           function(isConfirm) {   
                               if (isConfirm) { 
                                    window.open('instructorReview.html?proctor_id=' + proctor_id, '_self');
                                    return false;
                               } 
                               else {     
                                    window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
                                    return false;
                               } 
                            }
                        );
                }
                else {
                    window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
                    return false;
                }
                break;
            case "Review 2":
                window.open('dspsReview_2.html?proctor_id=' + proctor_id, '_self');
                return false;
                break;
            case "Complete":
                if (master) {
                    swal({ title: "DSPS Complete", 
                           type: "info",
                           showCancelButton: true,
                           confirmButtonText: "Instructor View",
                           cancelButtonText: "Admin View",
                           closeOnConfirm: false,
                           closeOnCancel: false }, 
                           function(isConfirm) {   
                               if (isConfirm) { 
                                    window.open('instructorExamUpdate.html?proctor_id=' + proctor_id, '_self');
                                    return false;
                               } 
                               else {     
                                    window.open('dspsComplete.html?proctor_id=' + proctor_id, '_self');
                                    return false;
                               } 
                            }
                        );
                }
                else {
                    window.open('dspsComplete.html?proctor_id=' + proctor_id, '_self');
                    return false;
                }
                break;
            default:
                window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
                break;
        }
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ivc tech support click //////////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() {
        if ($.trim($('#mod_tech_problems').val()) === "") {
            swal("Error!", "Please describe your technical issue", "error");
            return false;
        }
        
        if (!appSystemTechSupport("Application Web Site: DSPS Exams - Admin Home<br/><br/>", $('#mod_tech_problems').val(), str_img)) {
            $('#mod_tech_support').modal('hide');
            var str_subject = "DSPS Exam: IVC Tech Support Request Error";
            var str_msg = "Admin Home: IVC tech support request error";
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

    // selectpicker
    $('.selectpicker').selectpicker();
    
    // autosize
    $('#mod_tech_problems').autosize();
    
    // tooltip popover
    $('#nav_capture').popover({content:"Report a Bug", placement:"bottom"});
});

////////////////////////////////////////////////////////////////////////////////
function setAdminOption() {   
    if (sessionStorage.getItem('ls_dsps_proctor_loginEmail') === "ykim160@ivc.edu") {
        master = true;
    }
}

////////////////////////////////////////////////////////////////////////////////
function getAdminProctorList(search_option, search_value) {
    var result = new Array(); 
    result = db_getAdminProctorList(search_option, search_value);
    
    $('#dsps_1_body_tr').empty();
    $('#dsps_2_body_tr').empty();
    $('#inst_review_body_tr').empty();
    $('#dsps_complete_body_tr').empty();
    
    var dsps_1_body_html = "";
    var dsps_2_body_html = "";
    var inst_review_body_html = "";
    var dsps_complete_body_html = "";
    for(var i = 0; i < result.length; i++) { 
        switch(result[i]['Step']) {
            case "Review 1":
                dsps_1_body_html += setAdminProctorListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuLName'], result[i]['StuFName'],
                                        result[i]['InstLName'], result[i]['InstFName'], result[i]['Status'], convertDBDateTimeToString(result[i]['TestDT']), result[i]['Step']);
                break;
            case "Review 2":
                dsps_2_body_html += setAdminProctorListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuLName'], result[i]['StuFName'], 
                                        result[i]['InstLName'], result[i]['InstFName'], result[i]['Status'], convertDBDateTimeToString(result[i]['TestDT']), result[i]['Step']);
                break;
            case "Instructor Review":
                inst_review_body_html += setAdminProctorListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuLName'], result[i]['StuFName'], 
                                            result[i]['InstLName'], result[i]['InstFName'], result[i]['Status'], convertDBDateTimeToString(result[i]['TestDT']), result[i]['Step']);
                break;
            case "Complete":
                dsps_complete_body_html += setAdminProctorListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuLName'], result[i]['StuFName'],
                                            result[i]['InstLName'], result[i]['InstFName'], result[i]['Status'], convertDBDateTimeToString(result[i]['TestDT']), result[i]['Step']);
                break;
            default:
                break;
        }
        
    }
    $("#dsps_1_body_tr").append(dsps_1_body_html);
    $("#dsps_2_body_tr").append(dsps_2_body_html);
    $("#inst_review_body_tr").append(inst_review_body_html);
    $("#dsps_complete_body_tr").append(dsps_complete_body_html);
}

function setAdminProctorListHTML(proctor_id, section_num, course_id, stu_lname, stu_fname, inst_lname, inst_fname, status, test_dt, step) {
    var tbl_html = "<tr>";
    tbl_html += "<td class='span1'><a href=# id='proctor_id_" + proctor_id +  "'>" + section_num + "</a></td>";
    tbl_html += "<td class='span2'>" + course_id + "</td>";
    tbl_html += "<td class='span2'>" + stu_lname + "</td>";
    tbl_html += "<td class='span1'>" + stu_fname + "</td>";
    tbl_html += "<td class='span2'>" + inst_lname + "</td>";
    tbl_html += "<td class='span1'>" + inst_fname + "</td>";
    tbl_html += "<td class='span2' id='status_" + proctor_id + "'>" + status + "</td>";
    tbl_html += "<td class='span2'>" + test_dt + "</td>";
    tbl_html += "<td class='span1' style='display: none;' id='step_" + proctor_id + "'>" + step + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function capture() {    
    html2canvas($('body')).then(function(canvas) { 
        str_img = canvas.toDataURL();
        $('#mod_tech_img_screen').prop('src', str_img);
    });
}