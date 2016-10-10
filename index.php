<!DOCTYPE HTML>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
        <meta http-equiv="Cache-Control" content="no-cache"/>
        <title>DSPS Exams Login</title>
        <!-- include css -->
        <link rel="stylesheet" href="../include/sweetalert/css/sweetalert.css"/>
        <!-- application css -->
        <link rel="stylesheet" href="css/style-2.css"/>
    </head>
    <body>
        <div class="loginFrame">
            <div class="header">
                <div>DSPS <span>Exams</span></div>
            </div>
            <div class="login">
                <input type="text" placeholder="college email address" name="user" id="username"><br>
                <input type="password" placeholder="password" name="password" id="password"><br>
                <input type="button" value="Login" id="btn_login">
            </div>
            <div class="footer">
                <div id="login_error"></div>
            </div>
        </div>

        <!-- include javascript -->
        <script src="../include/jquery/jquery-2.0.3.min.js"></script>
        <script src="../include/bowser/bowser.min.js"></script>
        <script src="../include/utilities/js/jquery.backstretch.min.js"></script>
        <script src="../include/sweetalert/js/sweetalert.min.js"></script>
        <!-- application javascript -->
        <script src="js/Login.js"></script>
        <script src="js/session_data.js"></script>
        <script src="js/db_access.js"></script>
    </body>
</html>
