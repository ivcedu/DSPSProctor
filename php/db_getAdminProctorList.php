<?php
    require("config.php");
    
    $SearchOption = filter_input(INPUT_POST, 'SearchOption');
    $SearchValue = filter_input(INPUT_POST, 'SearchValue');
    $sql_options = "";
    
    if ($SearchOption !== "All") {
        switch ($SearchOption) {
            case "Student ID":
                $sql_options = " AND pct.StuID LIKE '".$SearchValue."%'";
                break;
            case "Instructor Name":
                $sql_options = " AND pnm.InstLName LIKE '".$SearchValue."%'";
                break;
            case "Course Name":
                $sql_options = " AND pct.CourseID LIKE '".$SearchValue."%'";
                break;
            default:
                break;
        }
    }
    
    $query = "SELECT pct.ProctorID, pct.SectionNum, pct.CourseID, "
                . "pnm.StuFName, pnm.StuLName, pnm.InstFName, pnm.InstLName, "
                . "CONVERT(datetime, pct.TestDate + ' ' + pct.TestTime) AS TestDT, stu.[Status], stp.Step "
                . "FROM [IVCDSPS].[dbo].[Proctor] AS pct INNER JOIN [IVCDSPS].[dbo].[Status] AS stu ON pct.StatusID = stu.StatusID "
                . "INNER JOIN [IVCDSPS].[dbo].[Step] AS stp ON pct.StepID = stp.StepID "
                . "INNER JOIN [IVCDSPS].[dbo].[ProctorName] AS pnm ON pct.ProctorID = pnm.ProctorID "
                . "WHERE (pct.StatusID = 1 OR pct.StatusID = 2 OR pct.StatusID = 7)".$sql_options." "
                . "ORDER BY TestDT ASC";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);