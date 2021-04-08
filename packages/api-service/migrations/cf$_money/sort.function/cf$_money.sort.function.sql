CREATE OR REPLACE FUNCTION "cf$_money".sort(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r           record;
  vSorting    cf$.Money.Sorting%type;
  vId_Project cf$.Project.Id_Project%type := context.get('Id_Project')::int;
  
begin
  update cf$.Money m
     set Sorting = null
   where m.Id_Project = vId_Project;
  vSorting := 0; 
  begin
    for r in (select jsonb_array_elements_text(iParams->'moneys')::int as Id_Money) 
    loop
      update cf$.Money m
         set Sorting = vSorting
       where m.Id_Project = vId_Project
         and m.Id_Money = r.Id_Money;

      vSorting := vSorting + 1;
    end loop;
--  exception
--    when others then
--      perform error$.raise ('invalid_parameters', iDev_Message := 'parameter must be an array of integer');
  end;
  
  oResult := cf$_Money.get ('{}'::jsonb);
end;
$function$
