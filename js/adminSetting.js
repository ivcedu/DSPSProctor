var admin_id = "";
var str_img = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {  
        getAdminList();
        initializeTable();
    }
    else {
        window.open('Login.html', '_self');
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_admin_list").tablesorter({ });
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
  
    // new admin button click //////////////////////////////////////////////////
    $('#btn_new_admin').click(function() { 
        admin_id = "";
        $('#mod_btn_delete').hide();
        clearModalSection();
        $('#mod_dialog_box_header').html("New Administrator");
        $('#mod_dialog_box').modal('show');
    });
    
    // table row open resource form click //////////////////////////////////////
    $('table').on('click', 'a[id^="edit_admin_id_"]', function() {
        admin_id = $(this).attr('id').replace("edit_admin_id_", "");
        var result = new Array();
        result = db_getAdminByID(admin_id);
        $('#mod_btn_delete').show();
        clearModalSection();
        $('#mod_dialog_box_header').html("Edit Administrator");
        $('#mod_admin_name').val(result[0]['AdminName']);
        $('#mod_admin_email').val(result[0]['AdminEmail']);
        $('#mod_dialog_box').modal('show');
    });

    // modal save button click /////////////////////////////////////////////////
    $('#mod_btn_save').click(function() { 
        var admin_name = $.trim($('#mod_admin_name').val());
        var admin_email = $.trim($('#mod_admin_email').val());
        if (admin_id === "") {
            db_insertAdmin(admin_name, admin_email);
        }
        else {
            db_updateAdmin(admin_id, admin_name, admin_email);
        }
        
        getAdminList();
        $('#mod_dialog_box').modal('hide');
    });
    
    // modal delete button click ///////////////////////////////////////////////
    $('#mod_btn_delete').click(function() { 
        db_deleteAdmin(admin_id);
        
        getAdminList();
        $('#mod_dialog_box').modal('hide');
    });
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ivc tech support click //////////////////////////////////////////////////
    $('#mod_tech_btn_submit').click(function() {
        if ($.trim($('#mod_tech_problems').val()) === "") {
            swal("Error!", "Please describe your technical issue", "error");
            return false;
        }
        
        if (!appSystemTechSupport("Application Web Site: DSPS Exams - Admin Setting<br/><br/>", $('#mod_tech_problems').val(), str_img)) {
            $('#mod_tech_support').modal('hide');
            var str_subject = "DSPS Exam: IVC Tech Support Request Error";
            var str_msg = "Admin Setting: IVC tech support request error";
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
function getAdminList() {
    var result = new Array(); 
    result = db_getAdminList();
    
    $('#body_tr').empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setAdminListHTML(result[i]['AdminID'], result[i]['AdminName'], result[i]['AdminEmail']);
    }
    $("#body_tr").append(body_html);
}

function setAdminListHTML(admin_id, admin_name, admin_email) {
    var tbl_html = "<tr class='form-horizontal'>";
    tbl_html += "<td class='span2'>" + admin_name + "</td>";
    tbl_html += "<td class='span2'>" + admin_email + "</td>";
    tbl_html += "<td class='span1' style='text-align: center;'><a href=# id='edit_admin_id_" + admin_id +  "'><i class='iconic iconic-sm iconic-lock-unlocked iconic-color-default'></i></a></td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function clearModalSection() {
    $('#mod_dialog_box_header').html("");
    $('#mod_admin_name').val("");
    $('#mod_admin_email').val("");
}

////////////////////////////////////////////////////////////////////////////////
function capture() {    
    html2canvas($('body')).then(function(canvas) { 
        str_img = canvas.toDataURL();
        $('#mod_tech_img_screen').prop('src', str_img);
    });
}