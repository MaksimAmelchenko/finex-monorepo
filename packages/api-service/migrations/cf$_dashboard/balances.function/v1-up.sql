CREATE OR REPLACE FUNCTION "cf$_dashboard".balances(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  oResult := concat_ws (',', oResult, cf$_account.balance (iParams));
  oResult := concat_ws (',', oResult, cf$_debt.balance (iParams));
end;
$function$
