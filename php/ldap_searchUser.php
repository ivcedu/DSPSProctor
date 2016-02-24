<?php
    $server = "idc1.ivc.edu idc2.ivc.edu idc3.vic.edu";
    $baseDN = "dc=ivc,dc=edu";
    
    $userID = filter_input(INPUT_POST, 'userID');
    $result = array();
    
    $ldapconn = ldap_connect($server);
    if($ldapconn) {
        ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);
        
        $ldapbind = ldap_bind($ldapconn, "IVCSTAFF\\stafftest", "staff");
        if($ldapbind) {
            $filter = "(&(objectClass=user)(objectCategory=person)(cn=".$userID."))";
            $ladp_result = ldap_search($ldapconn, $baseDN, $filter);
            $data = ldap_get_entries($ldapconn, $ladp_result);
            
            if ($data != null && $data["count"] === 1) {
                if (array_key_exists('displayname', $data[0])) {
                    $display_name = $data[0]["displayname"][0];
                }
                if (array_key_exists('mail', $data[0])) {
                    $email = $data[0]["mail"][0];
                }
                if (array_key_exists('telephonenumber', $data[0])) {
                    $phone = $data[0]["telephonenumber"][0];
                }
                if (array_key_exists('employeetype', $data[0])) {
                    $etype = $data[0]["employeetype"][0];
                }
                
                $result = array($name, $email, $phone, $etype);
            }  
        }
        
        ldap_close($ldapconn);
    }
    echo json_encode($result);