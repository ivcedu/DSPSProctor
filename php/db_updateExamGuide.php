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
    
    $CalTypeOther = str_replace("'", "''", $CalTypeOther);

    $query = "UPDATE [IVCDSPS].[dbo].[ExamGuide] "
            . "SET Notes = '".$Notes."', Book = '".$Book."', Calculator = '".$Calculator."', CalTypeID = '".$CalTypeID."', CalTypeOther = '".$CalTypeOther."', "
            . "Dictionary = '".$Dictionary."', ScratchPaper = '".$ScratchPaper."', Scantron = '".$Scantron."', Computer = '".$Computer."', InternetID = '".$InternetID."' "
            . "WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);