////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    $('#login_error').hide();
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
        var url_param = sessionStorage.getItem('ls_dsps_url_param');
        
        if(loginInfo()) {
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
            $('#login_error').show();
            this.blur();
        }
    });
});

////////////////////////////////////////////////////////////////////////////////
function loginInfo() {    
    var username = $('#username').val().toLowerCase().replace("@ivc.edu", "").replace("@saddleback.edu", "");
    var password = $('#password').val();
    
    var result = new Array();
    result = getLoginUserInfo("php/login.php", username, password);
    if (result.length === 0) {
        result = getLoginUserInfo("php/login_student.php", username, password);
    }
    if (result.length === 0) {
        result = getLoginUserInfo("php/login_student_saddleback.php", username, password);
    }
    
    if (result.length === 0) {
        return false;
    }
    else {
        var display_name = result[0];
        var email = result[1];
        var loginID = result[2];
        var login_type = result[3];
        
        // demo setup
//        if (display_name === "deantest staffgen") {
//            email = "gbrogan@ivc.edu";
//            loginID = "9999995";
//            login_type = "Staff";
//        }
//        else if (display_name === "Staff1") {
//            email = "yadimor0@ivc.edu";
//            loginID = "783042";
//            login_type = "Student";
//        }
        
        if (email === null || typeof email === 'undefined') {
            alert("Login error: There was an error getting login user information from Active Direcy please try again");
            return false;
        }

        localData_login(display_name, email, loginID, login_type, username, password);
        if (location.href.indexOf("ireport.ivc.edu") >= 0) {
            sessionStorage.setItem('m_parentSite', 'https://ireport.ivc.edu');
        }
        else {
            sessionStorage.setItem('m_parentSite', 'https://services.ivc.edu');
        }
        return true;
    }
}