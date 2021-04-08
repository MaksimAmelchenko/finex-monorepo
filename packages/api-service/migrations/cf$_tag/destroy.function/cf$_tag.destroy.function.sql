CREATE OR REPLACE FUNCTION "cf$_tag".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vTag cf$.v_Tag%rowtype;
begin

  begin
    vTag.Id_Tag := (iParams->>'idTag')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idTag" must be a number');
  end;

  if vTag.Id_Tag is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idTag" is required');
  end if;
  
  begin
    select t.*
      into strict vTag
      from cf$.v_Tag t
     where t.Id_Tag = vTag.Id_Tag;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  update cf$.CashFlow_Detail cfd
     set Tags = array_remove (Tags, vTag.Id_Tag)
   where cfd.Id_Project = vTag.Id_Project
     and cfd.tags && array[vTag.Id_Tag];

  update cf$.CashFlow cf
     set Tags = array_remove (Tags, vTag.Id_Tag)
   where cf.Id_Project = vTag.Id_Project
     and cf.Tags && array[vTag.Id_Tag];
  
  delete 
    from cf$.Tag t
   where t.Id_Project = vTag.Id_Project
     and t.Id_Tag = vTag.Id_Tag;
end;
$function$
