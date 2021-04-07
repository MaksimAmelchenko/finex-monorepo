CREATE OR REPLACE FUNCTION "cf$_import"."#get_id_counteragent"(iname text, OUT oid_counteragent integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  begin
    select c.Id_Counteragent
      into strict oId_Counteragent
      from cf$.v_Counteragent c
     where upper(c.Name) = upper(iName);
  exception
    when no_data_found then
      oId_Counteragent := null;
  end;       
               
  if oId_Counteragent is null then
    insert into cf$.Counteragent (Name)
         values (iName)
      returning Id_Counteragent
           into oId_Counteragent;
  end if;
end;
$function$
