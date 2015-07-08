<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[ProctorLog] AS pcl LEFT JOIN [IVCDSPS].[dbo].[Step] AS stp ON pcl.StepID = stp.StepID "
            ."LEFT JOIN [IVCDSPS].[dbo].[Status] AS stu ON pcl.StatusID = stu.StatusID "
            ."WHERE ProctorID = '".$ProctorID."' ORDER BY DTStamp ASC";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);