var admin_id = "";
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {  
        $('#mod_dialog_box').modal('hide');
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
    $('#nav_home').click(function() { 
        window.open('adminHome.html', '_self');
        return false;
    });
    
    $('#nav_logout').click(function() { 
        sessionStorage.clear();
        window.open("Login.html", '_self');
        return false;
    });
  
    // new admin button click //////////////////////////////////////////////////
    $('#btn_new_admin').click(function() { 
        admin_id = "";
        $('#mod_btn_delete').hide();
        clearModalSection();
        $('#mod_dialog_box_header').html("New Administrator");
        $('#mod_dialog_box').modal('show');
        return false;
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
        return false;
    });

    // modal save button click /////////////////////////////////////////////////
    $('#mod_btn_save').click(function() { 
        var admin_name = textReplaceApostrophe($.trim($('#mod_admin_name').val()));
        var admin_email = textReplaceApostrophe($.trim($('#mod_admin_email').val()));
        if (admin_id === "") {
            db_insertAdmin(admin_name, admin_email);
        }
        else {
            db_updateAdmin(admin_id, admin_name, admin_email);
        }
        
        getAdminList();
        $('#mod_dialog_box').modal('hide');
        return false;
    });
    
    // modal delete button click ///////////////////////////////////////////////
    $('#mod_btn_delete').click(function() { 
        db_deleteAdmin(admin_id);
        
        getAdminList();
        $('#mod_dialog_box').modal('hide');
        return false;
    });
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
    tbl_html += "<td class='span1'><a href=# id='edit_admin_id_" + admin_id +  "'><i class='icon-edit icon-black'></i></a></td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function clearModalSection() {
    $('#mod_dialog_box_header').html("");
    $('#mod_admin_name').val("");
    $('#mod_admin_email').val("");
}