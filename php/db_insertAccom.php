<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $TimeOneHalf = filter_input(INPUT_POST, 'TimeOneHalf');
    $DoubleTime = filter_input(INPUT_POST, 'DoubleTime');
    $AltMedia = filter_input(INPUT_POST, 'AltMedia');
    $Reader = filter_input(INPUT_POST, 'Reader');
    $EnlargeExam = filter_input(INPUT_POST, 'EnlargeExam');
    $UseOfComp = filter_input(INPUT_POST, 'UseOfComp');
    $Other = filter_input(INPUT_POST, 'Other');
    $txtOther = filter_input(INPUT_POST, 'txtOther');
    $Scribe = filter_input(INPUT_POST, 'Scribe');
    $Scantron = filter_input(INPUT_POST, 'Scantron');
    $WrittenExam = filter_input(INPUT_POST, 'WrittenExam');
    $Distraction = filter_input(INPUT_POST, 'Distraction');

    $query = "INSERT INTO [IVCDSPS].[dbo].[Accom] (ProctorID, TimeOneHalf, DoubleTime, AltMedia, Reader, EnlargeExam, UseOfComp, Other, txtOther, Scribe, Scantron, WrittenExam, Distraction) "
                ."VALUES ('$ProctorID', '$TimeOneHalf', '$DoubleTime', '$AltMedia', '$Reader', '$EnlargeExam', '$UseOfComp', '$Other', '$txtOther', '$Scribe', '$Scantron', '$WrittenExam', '$Distraction')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);