CREATE OR REPLACE FUNCTION "cf$_tag".encode(itags integer[])
 RETURNS text[]
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
select array (select t.name 
                from      unnest(iTags) Id_Tag 
                     join cf$.v_Tag t using (Id_Tag));
$function$
