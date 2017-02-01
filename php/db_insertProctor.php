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
    
    $StuName = str_replace("'", "''", $StuName);
    $StuEmail = str_replace("'", "", $StuEmail);
    $StuID = str_replace("'", "", $StuID);
    $InstName = str_replace("'", "''", $InstName);
    $InstEmail = str_replace("'", "", $InstEmail);
    $CourseID = str_replace("'", "", $CourseID);
    $SectionNum = str_replace("'", "", $SectionNum);
    $TestDate = str_replace("'", "", $TestDate);
    $TestTime = str_replace("'", "", $TestTime);
    $Comments = str_replace("'", "''", $Comments);

    $query = "INSERT INTO [IVCDSPS].[dbo].[Proctor] (StatusID, StepID, StuName, StuEmail, StuID, InstName, InstEmail, CourseID, SectionNum, TestDate, TestTime, Comments) "
                ."VALUES ('1', '1', '$StuName', '$StuEmail', '$StuID', '$InstName', '$InstEmail', '$CourseID', '$SectionNum', '$TestDate', '$TestTime', '$Comments')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);