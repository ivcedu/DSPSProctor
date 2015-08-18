<?php
    if(isset($_FILES["files"])) {
        $page_info = "C:\\xpdfbin-win-3.04\\bin64\\pdfinfo.exe";
        $input_file = $_FILES["files"]["tmp_name"][0];
        
        // Parse entire output
        // Surround with double quotes if file name has spaces
        exec("$page_info \"$input_file\"", $output);
        
        // Iterate through lines
        $pagecount = 0;
        foreach($output as $op) {
            // Extract the number
            if(preg_match("/Pages:\s*(\d+)/i", $op, $matches) === 1) {
                $pagecount = intval($matches[1]);
                break;
            }
        }
        
        echo json_encode($pagecount);
    }