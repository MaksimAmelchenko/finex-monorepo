CREATE OR REPLACE FUNCTION context.get(iname text)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  vResult text;
begin
  begin
    vResult := nullif (current_setting('core_ctx.' || iName), '');
  exception
    when others then
      vResult := null; 
  end;

  return vResult;
end;

-- если убрать Вызывать с правами вызывающего и "вернуть нул если нул", то выполняется быстрее 
-- обычной get в 5 раз
-- НО если неправильный параметр, то вызывает исключение
--select nullif (current_setting('core_ctx.' || iName), '');
$function$
