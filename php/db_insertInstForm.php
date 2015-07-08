<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $TAllotMin = filter_input(INPUT_POST, 'TAllotMin');
    $Mailbox = filter_input(INPUT_POST, 'Mailbox');
    $Bldg = filter_input(INPUT_POST, 'Bldg');
    $ProfessorPU = filter_input(INPUT_POST, 'ProfessorPU');
    $Faculty = filter_input(INPUT_POST, 'Faculty');
    $Office = filter_input(INPUT_POST, 'Office');
    $StuDelivery = filter_input(INPUT_POST, 'StuDelivery');
    $ScanEmail = filter_input(INPUT_POST, 'ScanEmail');
    $SEOptionID = filter_input(INPUT_POST, 'SEOptionID');
    $ExamAttach = filter_input(INPUT_POST, 'ExamAttach');

    $query = "INSERT INTO [IVCDSPS].[dbo].[InstForm] (ProctorID, TAllotMin, Mailbox, Bldg, ProfessorPU, Faculty, Office, StuDelivery, ScanEmail, SEOptionID, ExamAttach) "
                ."VALUES ('$ProctorID', '$TAllotMin', '$Mailbox', '$Bldg', '$ProfessorPU', '$Faculty', '$Office', '$StuDelivery', '$ScanEmail', '$SEOptionID', '$ExamAttach')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);