<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $Notes = filter_input(INPUT_POST, 'Notes');
    $Book = filter_input(INPUT_POST, 'Book');
    $Calculator = filter_input(INPUT_POST, 'Calculator');
    $CalTypeID = filter_input(INPUT_POST, 'CalTypeID');
    $CalTypeOther = filter_input(INPUT_POST, 'CalTypeOther');
    $Dictionary = filter_input(INPUT_POST, 'Dictionary');
    $ScratchPaper = filter_input(INPUT_POST, 'ScratchPaper');
    $Scantron = filter_input(INPUT_POST, 'Scantron');
    $Computer = filter_input(INPUT_POST, 'Computer');
    $InternetID = filter_input(INPUT_POST, 'InternetID');

    $query = "INSERT INTO [IVCDSPS].[dbo].[ExamGuide] (ProctorID, Notes, Book, Calculator, CalTypeID, CalTypeOther, Dictionary, ScratchPaper, Scantron, Computer, InternetID) "
                ."VALUES ('$ProctorID', '$Notes', '$Book', '$Calculator', '$CalTypeID', '$CalTypeOther', '$Dictionary', '$ScratchPaper', '$Scantron', '$Computer', '$InternetID')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);