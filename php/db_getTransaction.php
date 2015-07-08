<?php
    require("config.php");

    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[Transaction] WHERE ProctorID = '" . $ProctorID . "' ORDER BY TransactionID DESC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);