<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $StepID = filter_input(INPUT_POST, 'StepID');
    $Column = filter_input(INPUT_POST, 'Column');

    $query = "UPDATE [IVCDSPS].[dbo].[Proctor] "
                ."SET StepID = '".$StepID."', ".$Column." = getdate() "
                ."WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);