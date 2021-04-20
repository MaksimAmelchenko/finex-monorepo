CREATE OR REPLACE FUNCTION "cf$".project_bud_check_permit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  vId_Project cf$.Project.Id_Project%type;
begin
  if context.get ('isNotCheckPermit') is null then
    if TG_OP = 'UPDATE' then
      vId_Project := new.Id_Project;
    else
      vId_Project := old.Id_Project;
    end if;
    
    if cf$_project.get_Permit (vId_Project) & 7 != 7 then
      perform error$.raise ('permission_denied', iMessage := 'У Вас нет прав на изменение/удаления данного проекта');
    end if;
  end if;    

  if TG_OP = 'UPDATE' then
    return new;
  else
    return old;
  end if; 
end;
$function$
