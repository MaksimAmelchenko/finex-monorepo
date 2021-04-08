CREATE OR REPLACE FUNCTION "cf$_project".get_permit(iid_project integer, OUT opermit smallint)
 RETURNS smallint
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
begin
  begin
    select p.Permit
      into strict oPermit
      from cf$_project.permit() p (id_project, permit)
     where p.Id_Project = iId_Project;
  exception
    when no_data_found then
      oPermit := 0;
  end;

end;
$function$
