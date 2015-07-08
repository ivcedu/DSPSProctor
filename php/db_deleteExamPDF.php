<?php
    require("config.php");
     
    $ExamPDFID = filter_input(INPUT_POST, 'ExamPDFID');

    $query = "DELETE FROM [IVCDSPS].[dbo].[ExamPDF] WHERE ExamPDFID = '".$ExamPDFID."'";
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute();

    echo json_encode($result);