function dbSystemErrorHandling(str_subject, str_msg) {
    sendEmailToDeveloper(str_subject, str_msg);
    swal({  title: "System Error",
            text: str_msg + ", please contact IVC Tech Support at 949.451.5696",
            type: "error",
            confirmButtonText: "OK" },
            function() {
                sessionStorage.clear();
                window.open('Login.html', '_self');
                return false;
            });
}

function sendEmailToDeveloper(str_subject, str_msg) {
    return proc_sendEmail("ykim160@ivc.edu", "Rich Kim", str_subject, str_msg);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function appSystemTechSupport(str_message, str_problems, img_base64) {
    var subject = "From IVC Web Application: Tech Request";
    str_message += "Request From: " + sessionStorage.getItem('ls_dsps_proctor_loginType') + "<br/>";
    if (sessionStorage.getItem('ls_dsps_proctor_loginType') === "Student") {
        str_message += "Student ID: " + sessionStorage.getItem('ls_dsps_proctor_loginID') + "<br/>";
    }
    str_message += "Name: " + sessionStorage.getItem('ls_dsps_proctor_loginDisplayName') + "<br/>";
    str_message += "Email: " + sessionStorage.getItem('ls_dsps_proctor_loginEmail') + "<br/><br/>";
    str_message += "Describe Your Technical Support Issue:<br/>" + str_problems.replace(/\n/g, "<br/>");  
    img_base64 = img_base64.replace("data:image/png;base64,", "");
    return proc_sendEmailToTechSupport(subject, str_message, img_base64);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function proc_sendEmail(email, name, subject, message) {    
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/sendEmail.php",
        data:{Email:email, Name:name, Subject:subject, Message:message},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function proc_sendEmailWithCalendar(email, name, subject, message, DateStart, DateEnd, Title, Location, Description) {    
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/sendEmailWithCalendar.php",
        data:{Email:email, Name:name, Subject:subject, Message:message, DateStart:DateStart, DateEnd:DateEnd, Title:Title, Location:Location, Description:Description},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function proc_sendEmailToTechSupport(Subject, Message, StrImages) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/sendEmailToTechSupport.php",
        data:{Subject:Subject, Message:Message, StrImages:StrImages},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}