CREATE OR REPLACE FUNCTION "cf$_account".get_name(iid_project integer, iid_account integer)
 RETURNS text
 LANGUAGE sql
 STABLE STRICT SECURITY DEFINER
AS $function$
  select a.Name
    from cf$.Account a
   where a.Id_Project = iId_Project
     and a.Id_Account = iId_Account;
$function$
