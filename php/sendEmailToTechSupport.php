<?php
    require("PHPMailerAutoload.php");

//    $Email = filter_input(INPUT_POST, 'Email');
//    $Name = filter_input(INPUT_POST, 'Name');
//    $FromEmail = filter_input(INPUT_POST, 'FromEmail');
//    $FromName = filter_input(INPUT_POST, 'FromName');
//    $Password = filter_input(INPUT_POST, 'Password');
//    $Subject = filter_input(INPUT_POST, 'Subject');
//    $Message = filter_input(INPUT_POST, 'Message');
//    $StrImages = filter_input(INPUT_POST, 'StrImages');
    
//    $headers = getallheaders();
//    if ($headers["Content-Type"] === "application/json; charset=UTF-8") {
//        $obj_data = json_decode(file_get_contents("php://input"), true) ?: [];
//    }
    
    $obj_data = json_decode(file_get_contents("php://input"));
    $Email = $obj_data->Email;
    $Name = $obj_data->Name;
    $FromEmail = $obj_data->FromEmail;
    $Password = $obj_data->Password;
    $FromName = $obj_data->FromName;
    $Subject = $obj_data->Subject;
    $Message = $obj_data->Message;
    $StrImages = $obj_data->StrImages;

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'tls';
    $mail->Host = 'smtp1.socccd.edu';
    $mail->Port = 587;
    $mail->Username = $FromEmail;
    $mail->Password = $Password;
    $mail->setFrom($FromEmail, $FromName);
//    $mail->addReplyTo($FromEmail, $FromName);
    $mail->AddAddress($Email, $Name);
//    $mail->AddCC($CCEmail, $CCName);
    $mail->IsHTML(true); // send as HTML
    $mail->addStringAttachment(base64_decode($StrImages), 'screen_shot.png', 'base64', 'image/png');
//    $mail->addStringEmbeddedImage(base64_decode($StrImages), 'screen_shot', 'screen_shot.png', 'base64', 'image/png');
    $mail->Subject = $Subject;
    $mail->Body = $Message;

    if($mail->Send()) {
        echo "true";
    }
    else {
        echo "false";
    }