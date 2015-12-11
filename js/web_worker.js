//self.onmessage = function(e) {
//    setTimeout(function () {
//        var data = e.data;
//        var result = data.login_email + " " + data.login_name + " " + data.password;
//        
//        self.postMessage(result);
//        self.close();
//    }, 3000);
//};

self.addEventListener('message', function(e) {   
    var data = e.data;
//    var subject = "DSPS Exams Ticket";
//    var message = "Problems: " + data.problems;
    var url = data.parent_site + "/DSPSProctor/php/sendEmailToTechSupport.php";
    
//    self.postMessage(result);
//    self.close();  
    
//    ajax(url, 
//            {'Email': 'deantest@ivc.edu', 'Name': '', 'FromEmail': data.login_email, 'FromName': data.login_name, 'Password': data.password, 'Subject': subject, 'Message': message, 'StrImages': data.img_base64}, 
//            function(data) {
//                //do something with the data like:
//                self.postMessage(data);
//                self.close(); }, 
//            'POST');
    
    ajax(url, 
        data.obj_json, 
        function(data) {
            //do something with the data like:
            self.postMessage(data);
            self.close(); }, 
        'POST');
}, false);

////////////////////////////////////////////////////////////////////////////////
var ajax = function(url, data, callback, type) {
//    var data_array, data_string, idx, value;
//    if (data === null) {
//        data = {};
//    }
//    if (callback === null) {
//        callback = function() {};
//    }
//    if (type === null) {
//        type = 'GET';
//    }
    
//    data_array = [];
//    for (idx in data) {
//        value = data[idx];
//        data_array.push("" + idx + "=" + value);
//    }
//    
//    data_string = data_array.join("&");
    
    var xhr = new XMLHttpRequest(); 
    xhr.open(type, url, true);
//    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Content-Length', data.length);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            return callback(xhr.responseText);
        }
    };
    
    xhr.send(data);
//    xhr.send(data_string);
    return xhr;
};