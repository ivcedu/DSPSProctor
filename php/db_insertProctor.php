<?php
    require("config.php");
    
    $StuName = filter_input(INPUT_POST, 'StuName');
    $StuEmail = filter_input(INPUT_POST, 'StuEmail');
    $StuID = filter_input(INPUT_POST, 'StuID');
    $InstName = filter_input(INPUT_POST, 'InstName');
    $InstEmail = filter_input(INPUT_POST, 'InstEmail');
    $CourseID = filter_input(INPUT_POST, 'CourseID');
    $SectionNum = filter_input(INPUT_POST, 'SectionNum');
    $TestDate = filter_input(INPUT_POST, 'TestDate');
    $TestTime = filter_input(INPUT_POST, 'TestTime');
    $Comments = filter_input(INPUT_POST, 'Comments');

    $query = "INSERT INTO [IVCDSPS].[dbo].[Proctor] (StatusID, StepID, StuName, StuEmail, StuID, InstName, InstEmail, CourseID, SectionNum, TestDate, TestTime, Comments) "
                ."VALUES ('1', '1', '$StuName', '$StuEmail', '$StuID', '$InstName', '$InstEmail', '$CourseID', '$SectionNum', '$TestDate', '$TestTime', '$Comments')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);