<?php
    require("PHPMailerAutoload.php");

    $Email = filter_input(INPUT_POST, 'Email');
    $Name = filter_input(INPUT_POST, 'Name');
    $Subject = filter_input(INPUT_POST, 'Subject');
    $Message = filter_input(INPUT_POST, 'Message');
    $DateStart = filter_input(INPUT_POST, 'DateStart');
    $DateEnd = filter_input(INPUT_POST, 'DateEnd');
    $Title = filter_input(INPUT_POST, 'Title');
    $Location = filter_input(INPUT_POST, 'Location');
    $Description = filter_input(INPUT_POST, 'Description');
    
    // Build the ics file
    $ical = "BEGIN:VCALENDAR\n"
            ."VERSION:2.0\n"
            ."PRODID:-//DSPS Exams Application\n"
            ."CALSCALE:GREGORIAN\n"
            ."BEGIN:VTIMEZONE\n"
            ."TZID:America/Los_Angeles\n"
            ."TZURL:http://tzurl.org/zoneinfo-outlook/America/Los_Angeles\n"
            ."X-LIC-LOCATION:America/Los_Angeles\n"
            ."BEGIN:DAYLIGHT\n"
            ."TZOFFSETFROM:-0800\n"
            ."TZOFFSETTO:-0700\n"
            ."TZNAME:PDT\n"
            ."DTSTART:19700308T020000\n"
            ."RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\n"
            ."END:DAYLIGHT\n"
            ."BEGIN:STANDARD\n"
            ."TZOFFSETFROM:-0700\n"
            ."TZOFFSETTO:-0800\n"
            ."TZNAME:PST\n"
            ."DTSTART:19701101T020000\n"
            ."RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\n"
            ."END:STANDARD\n"
            ."END:VTIMEZONE\n"
            ."BEGIN:VEVENT\n"
            ."UID:" . md5($Title) ."\n"
            ."DTSTAMP:" . time() ."\n"
            ."DTSTART;TZID=\"America/Los_Angeles\":" . $DateStart ."\n"
            ."DTEND;TZID=\"America/Los_Angeles\":" . $DateEnd ."\n"
            ."LOCATION:" . $Location ."\n"
            ."DESCRIPTION:" . $Description ."\n"
            ."SUMMARY:" . $Title ."\n"
            ."END:VEVENT\n"
            ."END:VCALENDAR";
    
//    header('Content-type: text/calendar; charset=utf-8');
//    header('Content-Disposition: inline; filename=dsps proctor schedule.ics; method=REQUEST');

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->Host = "smtp1.socccd.edu";
    $mail->From = "ivcdspsexams@ivc.edu";
    $mail->FromName = "DSPS Exam";
    $mail->AddAddress($Email, $Name);
    $mail->IsHTML(true); // send as HTML
    $mail->addStringAttachment($ical, 'dsps exams schedule.ics');
//    $mail->AddStringAttachment($ical, "dsps proctor schedule.ics", "7bit", "text/calendar; charset=utf-8; method=REQUEST");
    $mail->Subject = $Subject;
    $mail->Body = $Message;

    if($mail->Send()) {
        echo json_encode(true);
    }
    else {
        echo json_encode(false);
    }