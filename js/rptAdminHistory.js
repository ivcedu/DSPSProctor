var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        sessionStorage.setItem('ls_dsps_report_referrer', "rptAdminHistory.html");
        getDefaultStartEndDate();
        getAdminProctorCompleteList("All", "", $('#start_date').val(), $('#end_date').val());
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#proctor_list").tablesorter({ });
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
    
    //filter button click //////////////////////////////////////////////////////
    $('#btn_filter').click(function() {
        $('#search_option').val("All");
        $('#search_option').selectpicker('refresh');
        $('#search_field').val("");
        $('#search_field').prop('readonly', true);
        getAdminProctorCompleteList("All", "", $('#start_date').val(), $('#end_date').val());
    });
    
    //refresh button click /////////////////////////////////////////////////////
    $('#btn_refresh').click(function() { 
        var search_field = $('#search_option').val();
        var value = $('#search_field').val();
        getAdminProctorCompleteList(search_field, value, $('#start_date').val(), $('#end_date').val());
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
        if (!appSystemTechSupport("Application Web Site: DSPS Exams - Admin History<br/><br/>", $('#mod_tech_problems').val(), str_img)) {
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
    
    // selectpicker
    $('.selectpicker').selectpicker();
    
    // datepicker
    $('#start_date').datepicker();
    $('#end_date').datepicker();
    
    // auto size
    $('#mod_tech_problems').autosize();
    
    // tooltip popover
    $('#nav_capture').popover({content:"Report a Bug", placement:"bottom"});
});

////////////////////////////////////////////////////////////////////////////////
function getDefaultStartEndDate() {
    $('#start_date').datepicker( "setDate", getCurrentFirstDayOfMonth() );
    $('#end_date').datepicker( "setDate", getCurrentLastDayOfMonth() );
}

////////////////////////////////////////////////////////////////////////////////
function getAdminProctorCompleteList(search_field, value, start_date, end_date) {
    var result = new Array(); 
    result = db_getAdminProctorCompleteList(search_field, value, start_date, end_date);
    
    $('#body_tr').empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setAdminProctorCompleteListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['InstName'], result[i]['StuID'], result[i]['StuName'], 
                                                     result[i]['Step'], result[i]['Status'], result[i]['StatusID']);
    }
    $("#body_tr").append(body_html);
}

function setAdminProctorCompleteListHTML(proctor_id, section_num, course_id, int_name, stu_ID, stu_name, step, status, status_id) {
    var tbl_html = "<tr class='form-horizontal'>";
    tbl_html += "<td class='span1'><a href=# id='proctor_id_" + proctor_id +  "'>" + section_num + "</a></td>";
    tbl_html += "<td class='span2'>" + course_id + "</td>";
    tbl_html += "<td class='span2'>" + int_name + "</td>";
    tbl_html += "<td class='span2'>" + stu_ID + "</td>";
    tbl_html += "<td class='span3'>" + stu_name + "</td>";
    tbl_html += "<td class='span2' id='step_" + proctor_id + "'>" + step + "</td>";
    tbl_html += "<td class='span2'>" + status + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function capture() {    
    html2canvas($('body')).then(function(canvas) { str_img = canvas.toDataURL(); });
}