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
    $('#nav_home').click(function() { 
        window.open('adminHome.html', '_self');
        return false;
    });
    
    $('#nav_logout').click(function() { 
        sessionStorage.clear();
        window.open("Login.html", '_self');
        return false;
    });
  
    // add button click ////////////////////////////////////////////////////////
    $('#btn_add').click(function() { 
        if (!ivcHolidayValidation()) {
            return false;
        }
        else {
            db_insertIVCHoliday($('#ivc_holiday').val());
            getIVCHolidayList();
            return false;
        }
    });
    
    // delete all button click /////////////////////////////////////////////////
    $('#btn_delete_all').click(function() { 
        db_deleteIVCHolidayAll();
        getIVCHolidayList();
        return false;
    });
    
    // table row delete button click ///////////////////////////////////////////
    $('table').on('click', 'a[id^="ivc_holiday_id_"]', function() {
        var ivc_holiday_id = $(this).attr('id').replace("ivc_holiday_id_", "");
        db_deleteIVCHolidayByID(ivc_holiday_id);
        getIVCHolidayList();
        return false;
    });

    // datepicker
    $('#ivc_holiday').datepicker();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ivcHolidayValidation() {
    var result = new Array();
    result = db_getIVCHolidayByDate($('#ivc_holiday').val());
    if (result.length === 1) {
        swal({title: "Error", text: "Date " + $('#ivc_holiday').val() + " already exist", type: "error"});
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
    tbl_html += "<td class='span1'><a href=# id='ivc_holiday_id_" + ivc_holiday_id +  "'><i class='icon-trash icon-black'></i></a></td>";
    tbl_html += "</tr>";
    return tbl_html;
}