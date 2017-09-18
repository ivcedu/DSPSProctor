<?php
    require("config.php");
     
    $InstExamFileID = filter_input(INPUT_POST, 'InstExamFileID');

    $query = "DELETE FROM [IVCDSPS].[dbo].[InstExamFile] WHERE InstExamFileID = '".$InstExamFileID."'";
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute();

    echo json_encode($result);