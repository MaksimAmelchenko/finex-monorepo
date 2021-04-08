CREATE OR REPLACE FUNCTION "sanitize$".to_int_array(ivalue jsonb)
 RETURNS bigint[]
 LANGUAGE plpgsql
 IMMUTABLE STRICT
AS $function$
declare
  vResult bigint[];
begin
  if jsonb_typeof(iValue) = 'null' 
  then
    return null;
  end if;
  
  if jsonb_typeof(iValue) <> 'array' 
  then
    raise exception '%', 'a value must be an array';
  end if;
  
  begin
    vResult := array (select jsonb_array_elements_text(iValue)::bigint);
  exception
    when others 
    then
      raise exception '%', 'a value must be an array of integer';
  end;
  
  return vResult;
end;
$function$
