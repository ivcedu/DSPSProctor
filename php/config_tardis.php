<?php
    $dbHost = "TOPSPIN.SOCCCD.EDU";
    $dbDatabase = "TARDIS";
    $dbUser = "TardisUser";
    $dbPass = '!$Tardis&User';

    // MSSQL database connection
    try {
        $dbConn = new PDO("sqlsrv:server=$dbHost;Database=$dbDatabase", $dbUser, $dbPass);
    } 
    catch (PDOException $e) {
        die ($e->getMessage());
    }
