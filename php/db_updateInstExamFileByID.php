<?php
    require("config.php");
    
    $InstExamFileID = filter_input(INPUT_POST, 'InstExamFileID');
    $FileLinkName = filter_input(INPUT_POST, 'FileLinkName');
    
    $FileLinkName = str_replace("'", "", $FileLinkName);

    $query = "UPDATE [IVCDSPS].[dbo].[InstExamFile] "
                . "SET FileLinkName = '".$FileLinkName."' "
                . "WHERE InstExamFileID = '".$InstExamFileID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);