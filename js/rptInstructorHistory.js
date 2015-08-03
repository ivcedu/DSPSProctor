////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (localStorage.key(0) !== null) {        
        getAdminProctorCompleteList();
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
function getAdminProctorCompleteList() {
    var result = new Array(); 
    result = db_getInstProctorCompleteList('echambers@ivc.edu');
//    result = db_getInstProctorCompleteList(localStorage.getItem('ls_dsps_proctor_loginEmail'));
    
    $('#body_tr').empty();
    var body_html = "";
    if (result.length !== 0) {
        for(var i = 0; i < result.length; i++) { 
            body_html += setAdminProctorCompleteListHTML(result[i]['ProctorID'], result[i]['SectionNum'], result[i]['CourseID'], result[i]['StuName'], 
                                                         result[i]['Status'], result[i]['Step'], convertDBDateTimeToString(result[i]['DateSubmitted']));
        }
        $("#body_tr").append(body_html);
    }
}

function setAdminProctorCompleteListHTML(proctor_id, section_num, course_id, stu_name, status, step, date_submitted) {
    var tbl_html = "<tr>";    
    tbl_html += "<td class='span1'><a href=# id='proctor_id_" + proctor_id +  "'>" + section_num + "</a></td>";
    tbl_html += "<td class='span2'>" + course_id + "</td>";
    tbl_html += "<td class='span3'>" + stu_name + "</td>";
    tbl_html += "<td class='span2' id='status_" + proctor_id + "'>" + status + "</td>";
    tbl_html += "<td class='span2' id='step_" + proctor_id + "'>" + step + "</td>";
    tbl_html += "<td class='span2'>" + date_submitted + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}