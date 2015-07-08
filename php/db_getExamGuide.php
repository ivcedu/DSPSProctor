<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[ExamGuide] AS exgu LEFT JOIN [IVCDSPS].[dbo].[CalType] AS cltp ON exgu.CalTypeID = cltp.CalTypeID "
            ."LEFT JOIN [IVCDSPS].[dbo].[Internet] AS inte ON exgu.InternetID = inte.InternetID "
            ."WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);