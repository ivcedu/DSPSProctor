<?php
    require("config.php");
    
    $query = "SELECT prct.ProctorID, "
                . "prct.SectionNum, "
                . "prct.CourseID, "
                . "prct.StuID, "
                . "prct.StuName, "
                . "prct.InstName, "
                . "CONVERT(datetime, prct.TestDate + ' ' + prct.TestTime) AS TestDT "
                . "FROM [IVCDSPS].[dbo].[Proctor] AS prct INNER JOIN [IVCDSPS].[dbo].[InstForm] AS infm ON prct.ProctorID = infm.ProctorID "
                . "WHERE prct.StatusID = 2 AND prct.StepID = 4 AND infm.ExamReceived = 0";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);