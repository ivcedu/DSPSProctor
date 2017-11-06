var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        sessionStorage.setItem('ls_dsps_report_referrer', "rptNoExamList.html");
        getAdminProctorNoExamList();
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_no_exam_list").tablesorter({ });
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
    
    // table row open resource form click //////////////////////////////////////
    $('table').on('click', 'a[id^="proctor_id_"]', function(e) {
        e.preventDefault();
        var proctor_id = $(this).attr('id').replace("proctor_id_", "");
        window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
        return false;
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ivc tech support click //////////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() { 
        if (!appSystemTechSupport("Application Web Site: DSPS Exams - No Exam History<br/><br/>", $('#mod_tech_problems').val(), str_img)) {
            $('#mod_tech_support').modal('hide');
            var str_subject = "DSPS Exam: IVC Tech Support Request Error";
            var str_msg = "Admin History: IVC tech support request error";
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
    
    // tooltip popover
    $('#nav_capture').popover({content:"Report a Bug", placement:"bottom"});
});

////////////////////////////////////////////////////////////////////////////////
function getAdminProctorNoExamList() {
    var result = new Array(); 
    result = db_getAdminProctorNoExamList();
    
    $('#body_tr').empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setAdminProctorNoExamListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuID'], 
                                                    result[i]['StuName'], result[i]['InstName'], convertDBDateTimeToString(result[i]['TestDT']));
    }
    $("#body_tr").append(body_html);
}

function setAdminProctorNoExamListHTML(proctor_id, section_num, course_id, stu_id, stu_name, inst_name, test_dt) {
    var tbl_html = "<tr class='form-horizontal'>";
    tbl_html += "<td class='span1'><a href=# id='proctor_id_" + proctor_id +  "'>" + section_num + "</a></td>";
    tbl_html += "<td class='span2'>" + course_id + "</td>";
    tbl_html += "<td class='span3'>" + inst_name + "</td>";
    tbl_html += "<td class='span1'>" + stu_id + "</td>";
    tbl_html += "<td class='span3'>" + stu_name + "</td>";
    tbl_html += "<td class='span2'>" + test_dt + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function capture() {    
    html2canvas($('body')).then(function(canvas) { str_img = canvas.toDataURL(); });
}