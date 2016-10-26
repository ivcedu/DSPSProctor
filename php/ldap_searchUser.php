<?php
    $server = "ivc.edu";
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
                if (array_key_exists('givenname', $data[0])) {
                    $first_name = $data[0]["givenname"][0];
                }
                if (array_key_exists('sn', $data[0])) {
                    $last_name = $data[0]["sn"][0];
                }
                
                $result = array($display_name, $email, $first_name, $last_name);
            }  
        }
        
        ldap_close($ldapconn);
    }
    echo json_encode($result);