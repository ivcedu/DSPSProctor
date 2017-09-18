<?php
    require("config.php");
    
    $InstEmail = filter_input(INPUT_POST, 'InstEmail');
    $TermCode = filter_input(INPUT_POST, 'TermCode');
    $Semester = filter_input(INPUT_POST, 'Semester');
    $SectionNum = filter_input(INPUT_POST, 'SectionNum');
    $CourseID = filter_input(INPUT_POST, 'CourseID');
    $FileName = filter_input(INPUT_POST, 'FileName');
    $FileLinkName = filter_input(INPUT_POST, 'FileLinkName');
    
    $FileName = str_replace("'", "", $FileName);
    $FileLinkName = str_replace("'", "", $FileLinkName);
    
    $query = "INSERT INTO [IVCDSPS].[dbo].[InstExamFile] (InstEmail, TermCode, Semester, SectionNum, CourseID, FileName, FileLinkName) "
                ."VALUES ('$InstEmail', '$TermCode', '$Semester', '$SectionNum', '$CourseID', '$FileName', '$FileLinkName')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);