<?php
    require("PHPMailerAutoload.php");

    $Email = filter_input(INPUT_POST, 'Email');
    $Name = filter_input(INPUT_POST, 'Name');
    $Subject = filter_input(INPUT_POST, 'Subject');
    $Message = filter_input(INPUT_POST, 'Message');

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->Host = "smtp1.socccd.edu";
    $mail->From = "ivcdspsexams@ivc.edu";
    $mail->FromName = "DSPS Proctor";
    $mail->AddAddress($Email, $Name);
    //$mail->AddCC($address, $name);
    $mail->IsHTML(true); // send as HTML
    $mail->Subject = $Subject;
    $mail->Body = $Message;

    if($mail->Send()) {
        echo json_encode(true);
    }
    else {
        echo json_encode(false);
    }