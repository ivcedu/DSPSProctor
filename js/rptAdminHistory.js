////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {        
        getAdminProctorCompleteList("All", "");
    }
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {  
    $('#nav_home').click(function() { 
        window.open('home.html', '_self');
    });
    
    $('#nav_logout').click(function() { 
        localStorage.clear();
        window.open('Login.html', '_self');
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
    
    //refresh button click /////////////////////////////////////////////////////
    $('#btn_refresh').click(function() { 
        var search_field = $('#search_option').val();
        var value = $('#search_field').val();
        getAdminProctorCompleteList(search_field, value);
    });
    
    // table row open resource form click //////////////////////////////////////
    $('table').on('click', 'a[id^="proctor_id_"]', function(e) {
        e.preventDefault();
        var proctor_id = $(this).attr('id').replace("proctor_id_", "");
        window.open('printProctor.html?proctor_id=' + proctor_id, '_self');
    });
    
    // selectpicker
    $('.selectpicker').selectpicker();
});

////////////////////////////////////////////////////////////////////////////////
function getAdminProctorCompleteList(search_field, value) {
    var result = new Array(); 
    result = db_getAdminProctorCompleteList(search_field, value);
    
    $('#body_tr').empty();
    if (result.length !== 0) {
        for(var i = 0; i < result.length; i++) { 
            setAdminProctorCompleteListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['InstName'], result[i]['StuID'], result[i]['StuName'], 
                                            result[i]['Step'], convertDBDateTimeToString(result[i]['DateSubmitted']));
        }
    }
}

function setAdminProctorCompleteListHTML(proctor_id, section_num, course_id, int_name, stu_ID, stu_name, step, date_submitted) {
    var tbl_html = "<tr>";
    tbl_html += "<td class='span1'><a href=# id='proctor_id_" + proctor_id +  "'>" + section_num + "</a></td>";
    tbl_html += "<td class='span2'>" + course_id + "</td>";
    tbl_html += "<td class='span2'>" + int_name + "</td>";
    tbl_html += "<td class='span2'>" + stu_ID + "</td>";
    tbl_html += "<td class='span3'>" + stu_name + "</td>";
    tbl_html += "<td class='span2' id='step_" + proctor_id + "'>" + step + "</td>";
    tbl_html += "<td class='span2'>" + date_submitted + "</td>";
    tbl_html += "</tr>";
    $("#body_tr").append(tbl_html);
}