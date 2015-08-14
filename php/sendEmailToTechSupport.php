<?php
    require("PHPMailerAutoload.php");

    $Email = filter_input(INPUT_POST, 'Email');
    $Name = filter_input(INPUT_POST, 'Name');
    $CCEmail = filter_input(INPUT_POST, 'CCEmail');
    $CCName = filter_input(INPUT_POST, 'CCName');
    $Subject = filter_input(INPUT_POST, 'Subject');
    $Message = filter_input(INPUT_POST, 'Message');
    $StrImages = filter_input(INPUT_POST, 'StrImages');

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->Host = "smtp1.socccd.edu";
    $mail->From = "donotreply@ivc.edu";
    $mail->FromName = "IVC Automatic System Generated";
    $mail->AddAddress($Email, $Name);
    $mail->AddCC($CCEmail, $CCName);
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