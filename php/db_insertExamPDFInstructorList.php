<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $FileName = filter_input(INPUT_POST, 'FileName');
    $FileLinkName = filter_input(INPUT_POST, 'FileLinkName');
    
    $FileName = str_replace("'", "", $FileName);
    $FileLinkName = str_replace("'", "", $FileLinkName);
    
    $query = "INSERT INTO [IVCDSPS].[dbo].[ExamPDF] (ProctorID, FileName, FileLinkName) "
                ."VALUES ('$ProctorID', '$FileName', '$FileLinkName')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);