<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $FileName = filter_input(INPUT_POST, 'FileName');
    $ExamPDF = filter_input(INPUT_POST, 'ExamPDF');
    
    $FileName = str_replace("'", "", $FileName);
    
    $query = "INSERT INTO [IVCDSPS].[dbo].[ExamPDF] (ProctorID, FileName, ExamPDF) "
                ."VALUES ('$ProctorID', '$FileName', '$ExamPDF')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);