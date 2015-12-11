////////////////////////////////////////////////////////////////////////////////
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

function proc_sendEmailToTechSupport(Email, Name, FromEmail, FromName, Password, Subject, Message, StrImages) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/sendEmailToTechSupport.php",
        data:{Email:Email, Name:Name, FromEmail:FromEmail, FromName:FromName, Password:Password, Subject:Subject, Message:Message, StrImages:StrImages},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}