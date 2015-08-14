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

function proc_sendEmailToTechSupport(Email, Name, CCEmail, CCName, Subject, Message, StrImages) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/sendEmailToTechSupport.php",
        data:{Email:Email, Name:Name, CCEmail:CCEmail, CCName:CCName, Subject:Subject, Message:Message, StrImages:StrImages},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}