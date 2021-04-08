CREATE OR REPLACE FUNCTION bitwise.is_masked(bitarray integer, mask integer)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE SECURITY DEFINER
AS $function$
begin
  return (select bitarray & mask = mask);
end;
$function$
