CREATE OR REPLACE FUNCTION "cf$_import".decode_currency_code(icode text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCode   cf$.Currency.Code%type;
begin
  vCode := upper (trim (iCode));
  if vCode in ('РУБ', 'Р', 'РУБ.', 'Р.') 
  then
    vCode := 'RUB';
  elsif vCode = 'ГРН' 
  then
    vCode := 'UAH';
  elsif vCode = '$' 
  then
    vCode := 'USD';
  elsif vCode in ('Є', '€') 
  then
    vCode := 'EUR';
  end if;
  
  return vCode;  
end;
$function$
