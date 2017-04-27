////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    var curBrowser = bowser.name;
    var curVersion = Number(bowser.version);
    
    switch (curBrowser) {
        case "Safari":
            if (curVersion < 5)
                window.open('browser_not_support.html', '_self');
            break;
        case "Chrome":
            if (curVersion < 7)
                window.open('browser_not_support.html', '_self');
            break;
        case "Firefox":
            if (curVersion < 22)
                window.open('browser_not_support.html', '_self');
            break;
        case "Internet Explorer":
            if (curVersion < 11)
                window.open('browser_not_support.html', '_self');
            break;
        default:     
            break;
    }
};

////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {  
    // enter key to login
    $('#password').keypress(function (e) {
        if(e.keyCode === 13){
            $('#btn_login').click();
        }
    });
    
    $('#btn_login').click(function() {
        // ireport.ivc.edu validation //////////////////////////////////////////
        if(location.href.indexOf("ireport.ivc.edu") >= 0 && !ireportValidation()) {
            swal({  title: "Access Denied",
                    text: "This is a Development site. It will redirect to IVC Application site",
                    type: "error",
                    confirmButtonText: "OK" },
                    function() {
                        sessionStorage.clear();
                        window.open('https://services.ivc.edu/', '_self');
                        return false;
                    }
            );
        }
        ////////////////////////////////////////////////////////////////////////
        else {
            var url_param = sessionStorage.getItem('ls_dsps_url_param');
            var login_error = loginInfo();

            if(login_error === "") {
                var login_type = sessionStorage.getItem('ls_dsps_proctor_loginType');
                if (login_type === "Staff") {
                    var result = new Array();
                    result = db_getAdmin(sessionStorage.getItem('ls_dsps_proctor_loginEmail'));
                    if (result.length === 1 || sessionStorage.getItem('ls_dsps_proctor_loginEmail') === "ykim160@ivc.edu") {
                        if (url_param === null) {
                            window.open('adminHome.html', '_self');
                            return false;
                        }
                        else {
                            window.open(url_param, '_self');
                            return false;
                        }
                    }
                    else {                    
                        if (url_param === null) {
                            window.open('instructorHome.html', '_self');
                            return false;
                        }
                        else {
                            window.open(url_param, '_self');
                            return false;
                        }
                    }
                }
                else {                
                    window.open('newProctor.html', '_self');
                    return false;
                }
            }
            else {
                $('#login_error').html(login_error);
                this.blur();
            }
        }
    });
    
    $.backstretch(["images/dsps_back_web_2.jpg"], {duration: 3000, fade: 750});
});

////////////////////////////////////////////////////////////////////////////////
function loginInfo() {
    var username = $('#username').val().toLowerCase();
    var password = $('#password').val();
    var error = loginEmailValidation(username);
    if(error !== "") {
        return error;
    }
    
    var result = new Array();
    if (username.indexOf("@ivc.edu") >= 1) {
        username = username.replace("@ivc.edu", "");
        result = getLoginUserInfo("php/login.php", username, password);
        if (result.length === 0) {
            result = getLoginUserInfo("php/login_student.php", username, password);
        }
    }
    else {
        username = username.replace("@saddleback.edu", "");
        result = getLoginUserInfo("php/login_saddleback.php", username, password);
        if (result.length === 0) {
            result = getLoginUserInfo("php/login_student_saddleback.php", username, password);
        }
    }   
    
    if (result.length === 0) {
        return "Invalid Email or Password";
    }
    else {
        var display_name = result[0];
        var fname = result[1];
        var lname = result[2];
        var email = result[3];
        var loginID = result[4];
        var login_type = result[5];
        
        // demo setup
//        if (display_name === "deantest staffgen") {
//            email = "tcheng@ivc.edu";
//            loginID = "9999995";
//            login_type = "Staff";
//        }
//        else if (display_name === "Staff1") {
//            email = "swyma2@ivc.edu";
//            loginID = "858805";
//            login_type = "Student";
//        }
        
        if (email === null || typeof email === 'undefined') {
            return "AD Login System Error";
        }
        else {
            localData_login(display_name, fname, lname, email, loginID, login_type, username, password);
            if (location.href.indexOf("ireport.ivc.edu") >= 0) {
                sessionStorage.setItem('m_parentSite', 'https://ireport.ivc.edu');
            }
            else {
                sessionStorage.setItem('m_parentSite', 'https://services.ivc.edu');
            }
            return "";
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
function loginEmailValidation(login_email) {    
    if (login_email.indexOf("@ivc.edu") !== -1 || login_email.indexOf("@saddleback.edu") !== -1) {
        return "";
    }
    else {
        return "Invalid Email";
    }
}

////////////////////////////////////////////////////////////////////////////////
function ireportValidation() {
    var username = $('#username').val().toLowerCase().replace("@ivc.edu", "").replace("@saddleback.edu", "");
    if (ireportDBgetUserAccess(username) !== null) {
        return true;
    }
    else {
        return false;
    }
}