CREATE OR REPLACE FUNCTION "cf$_import"."#clear"()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  delete from cf$.cashflow_detail;
  delete from cf$.cashflow;
  delete from cf$.account;
  delete from cf$.contractor;
  delete from cf$.cashflow_item where Id_User is not null;
  delete from cf$.unit where Id_User is not null;
end;
$function$
