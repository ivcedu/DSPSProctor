<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $StatusID = filter_input(INPUT_POST, 'StatusID');
    $Column = filter_input(INPUT_POST, 'Column');

    $query = "UPDATE [IVCDSPS].[dbo].[Proctor] "
                ."SET StatusID = '".$StatusID."', ".$Column." = getdate() "
                ."WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);