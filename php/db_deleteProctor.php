<?php
    require("config.php");
     
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');

    $query1 = "DELETE FROM [IVCDSPS].[dbo].[ExamGuide] WHERE ProctorID = '".$ProctorID."'";
    $query2 = "DELETE FROM [IVCDSPS].[dbo].[ExamPDF] WHERE ProctorID = '".$ProctorID."'";
    $query3 = "DELETE FROM [IVCDSPS].[dbo].[InstForm] WHERE ProctorID = '".$ProctorID."'";
    $query4 = "DELETE FROM [IVCDSPS].[dbo].[Accom] WHERE ProctorID = '".$ProctorID."'";
    $query5 = "DELETE FROM [IVCDSPS].[dbo].[ProctorLog] WHERE ProctorID = '".$ProctorID."'";
    $query6 = "DELETE FROM [IVCDSPS].[dbo].[ProctorName] WHERE ProctorID = '".$ProctorID."'";
    $query7 = "DELETE FROM [IVCDSPS].[dbo].[Transaction] WHERE ProctorID = '".$ProctorID."'";
    $query8 = "DELETE FROM [IVCDSPS].[dbo].[Proctor] WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query1);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query2);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query3);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query4);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query5);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query6);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query7);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query8);
    $result = $cmd->execute();

    echo json_encode($result);