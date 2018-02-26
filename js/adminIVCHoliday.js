var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {  
        getIVCHolidayList();
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_ivc_holiday_list").tablesorter({ });
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
  
    // add button click ////////////////////////////////////////////////////////
    $('#btn_add').click(function() { 
        if (!ivcHolidayValidation()) {
            return false;
        }

        db_insertIVCHoliday($('#ivc_holiday').val());
        getIVCHolidayList();
    });
    
    // delete all button click /////////////////////////////////////////////////
    $('#btn_delete_all').click(function() { 
        db_deleteIVCHolidayAll();
        getIVCHolidayList();
    });
    
    // table row delete button click ///////////////////////////////////////////
    $('table').on('click', 'a[id^="ivc_holiday_id_"]', function() {
        var ivc_holiday_id = $(this).attr('id').replace("ivc_holiday_id_", "");
        db_deleteIVCHolidayByID(ivc_holiday_id);
        getIVCHolidayList();
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ivc tech support click //////////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() {
        if ($.trim($('#mod_tech_problems').val()) === "") {
            swal("Error!", "Please describe your technical issue", "error");
            return false;
        }
        
        if (!appSystemTechSupport("Application Web Site: DSPS Exams - Admin IVC Holiday<br/><br/>", $('#mod_tech_problems').val(), str_img)) {
            $('#mod_tech_support').modal('hide');
            var str_subject = "DSPS Exam: IVC Tech Support Request Error";
            var str_msg = "Admin IVC Holiday: IVC tech support request error";
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

    // datepicker
    $('#ivc_holiday').datepicker();
    
    // autosize
    $('#mod_tech_problems').autosize();
    
    // tooltip popover
    $('#nav_capture').popover({content:"Report a Bug", placement:"bottom"});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ivcHolidayValidation() {
    if ($('#ivc_holiday').val() === "") {
        swal("Error", "Please select date", "error");
        return false;
    }
    
    var result = new Array();
    result = db_getIVCHolidayByDate($('#ivc_holiday').val());
    if (result.length === 1) {
        swal("Error", "Date " + $('#ivc_holiday').val() + " already exist", "error");
        return false;
    }
    else {
        return true;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getIVCHolidayList() {
    var result = new Array(); 
    result = db_getIVCHoliday();
    
    $('#body_tr').empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setIVCHolidayListHTML(result[i]['IVCHolidayID'], result[i]['IVCHoliday']);
    }
    $("#body_tr").append(body_html);
}

function setIVCHolidayListHTML(ivc_holiday_id, ivc_holiday) {
    var tbl_html = "<tr class='form-horizontal'>";
    tbl_html += "<td class='span2'>" + ivc_holiday + "</td>";
    tbl_html += "<td class='span1' style='text-align: center;'><a href=# id='ivc_holiday_id_" + ivc_holiday_id +  "'><i class='iconic iconic-sm iconic-trash iconic-color-default'></i></a></td>";
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