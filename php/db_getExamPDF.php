<?php
    require("config.php");
    
    $ExamPDFID = filter_input(INPUT_POST, 'ExamPDFID');
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[ExamPDF] WHERE ExamPDFID = '".$ExamPDFID."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);