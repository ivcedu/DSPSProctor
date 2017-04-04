var str_img = "";
var master = false;
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {   
        $('#mod_dialog_box').modal('hide');
        $('#mod_tech_support').modal('hide');
        $('#mod_tech_processing').hide();
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
        window.open("Login.html", '_self');
        return false;
    });
    
    $('#nav_capture').click(function() { 
        capture();
        $('#mod_tech_problems').val("");
        $('#mod_tech_img_screen').prop('src', str_img);
        $('#mod_tech_support').modal('show');
    });
    
    // report - all history click //////////////////////////////////////////////
    $('#nav_rpt_all').click(function() { 
        window.open('rptAdminHistory.html', '_self');
        return false;
    });
    
    // admin click /////////////////////////////////////////////////////////////
    $('#nav_admin').click(function() { 
        window.open('adminSetting.html', '_self');
        return false;
    });
    
    // ivc holiday click ///////////////////////////////////////////////////////
    $('#nav_ivc_holiday').click(function() { 
        window.open('adminIVCHoliday.html', '_self');
        return false;
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
                break;
            case "Instructor Review":
                var str_url = location.href;
                sessionStorage.setItem('ss_dsps_proctor_referrer', str_url);
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
                               } 
                               else {     
                                   window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
                               } 
                            }
                        );
                }
                else {
                    window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
                }
                break;
            case "Review 2":
                window.open('dspsReview_2.html?proctor_id=' + proctor_id, '_self');
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
                               } 
                               else {     
                                   window.open('dspsComplete.html?proctor_id=' + proctor_id, '_self');
                               } 
                            }
                        );
                }
                else {
                    window.open('dspsComplete.html?proctor_id=' + proctor_id, '_self');
                }
                break;
            default:
                var str_url = location.href;
                sessionStorage.setItem('ss_dsps_proctor_referrer', str_url);
                window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
                break;
        }
        return false;
    });
    
    // modal submit button click ///////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() {        
        $(this).hide();
        $('#mod_tech_btn_close').prop('disabled', true);
        $('#mod_tech_processing').show();
        $('#mod_tech_msg_end').hide();
        
        var data = {'Email': 'ivctech@ivc.edu',
                    'Name': '',
                    'FromEmail': sessionStorage.getItem('ls_dsps_proctor_loginEmail'),
                    'FromName': sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'),
                    'Password': sessionStorage.getItem('ls_dsps_proctor_password'),
                    'Subject': 'DSPS Exams Ticket',
                    'Message': 'Problems: ' + $('#mod_tech_problems').val().replace(/\n/g, "<br>"),
                    'StrImages': str_img.replace("data:image/png;base64,", "")};
        var obj_JSON = JSON.stringify(data);
        
        var web_worker = new Worker('js/web_worker.js');
        web_worker.addEventListener('message', function(e) {
            if (e.data === "true") {
                $('#mod_tech_msg_end').html("Email has been sent to IVC Tech successfully");
            }
            else {
                $('#mod_tech_msg_end').html("Sending email failed, please call 949.451.5504");
            }

            $('#mod_tech_progress_bar').hide();
            $('#mod_tech_msg_end').show();
            $('#mod_tech_btn_close').prop('disabled', false); 
        }, false);
        
        web_worker.postMessage({'parent_site': sessionStorage.getItem('m_parentSite'), 'obj_json': obj_JSON});

//        web_worker.postMessage({'parent_site': sessionStorage.getItem('m_parentSite'),
//                                'login_email': sessionStorage.getItem('ls_dsps_proctor_loginEmail'),
//                                'login_name': sessionStorage.getItem('ls_dsps_proctor_loginDisplayName'),
//                                'password': sessionStorage.getItem('ls_dsps_proctor_password'),
//                                'problems': $('#mod_tech_problems').val().replace(/\n/g, "<br>"),
//                                'img_base64': str_img.replace("data:image/png;base64,", "")});

//        setTimeout(function() {
//            sendEmailToTechSupport();
//            $('#mod_tech_msg_start').hide();
//            $('#mod_tech_msg_end').show();
//            $('#mod_tech_btn_close').prop('disabled', false);            
//        }, 1000);
    });
    
    // get screen shot image ///////////////////////////////////////////////////
    html2canvas($('body'), {
        onrendered: function(canvas) { str_img = canvas.toDataURL("image/png"); }
    });
    
    // popover
    $('#nav_capture').popover({content:"Report an issue", placement:"bottom"});
    
    // selectpicker
    $('.selectpicker').selectpicker();
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
    html2canvas($('body')).then(function(canvas) { str_img = canvas.toDataURL(); });
}

////////////////////////////////////////////////////////////////////////////////
function sendEmailToTechSupport() {
    var login_email = sessionStorage.getItem('ls_dsps_proctor_loginEmail');
    var login_name = sessionStorage.getItem('ls_dsps_proctor_loginDisplayName');
    var password = sessionStorage.getItem('ls_dsps_proctor_password');
    
    var subject = "DSPS Exams Ticket";
    var message = "Problems: " + $('#mod_tech_problems').val().replace(/\n/g, "<br>");
//    message += "<img src='cid:screen_shot'/>";    
    var img_base64 = str_img.replace("data:image/png;base64,", "");
    return proc_sendEmailToTechSupport("ivctech@ivc.edu", "", login_email, login_name, password, subject, message, img_base64);
}