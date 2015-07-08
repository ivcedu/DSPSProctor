<?php
    require("config.php");
     
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');

    $query = "DELETE FROM [IVCDSPS].[dbo].[ExamPDF] WHERE ProctorID = '".$ProctorID."'";
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute();

    echo json_encode($result);