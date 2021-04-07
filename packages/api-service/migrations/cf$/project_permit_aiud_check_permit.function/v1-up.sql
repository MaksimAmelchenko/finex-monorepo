CREATE OR REPLACE FUNCTION "cf$".project_permit_aiud_check_permit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  vId_Project cf$.Project.Id_Project%type;
begin
  if context.get ('isNotCheckPermit') is null then
    if TG_OP in ('INSERT', 'UPDATE') then
      vId_Project := new.Id_Project;
    else
      vId_Project := old.Id_Project;
    end if;
    
    if cf$_Project.get_Permit (vId_Project) & 7 != 7 then
      perform error$.raise ('permission_denied', iMessage := 'У Вас нет прав на изменение данного проекта');
    end if;
  end if;

  return null;
end;
$function$
