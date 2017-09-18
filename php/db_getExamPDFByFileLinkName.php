<?php
    require("config.php");
    
    $FileLinkName = filter_input(INPUT_POST, 'FileLinkName');
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[ExamPDF] WHERE FileLinkName = '".$FileLinkName."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);