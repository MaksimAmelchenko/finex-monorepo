CREATE OR REPLACE FUNCTION "cf$_plan".cancel(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vPlan      cf$.v_Plan%rowtype;
  vDExclude  date;
begin
  begin
    vPlan.Id_Plan := iParams->>'idPlan';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idPlan" must be a number');
  end;

  if vPlan.Id_Plan is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idPlan" is required');
  end if;
  
  begin
    vDExclude := sanitize$.to_Date(iParams->>'dExclude');
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dExclude" must be a date');
  end;

  if vDExclude is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dExclude" is required');
  end if;
 
  begin
    select p.Id_Plan
      into strict vPlan.Id_Plan
      from cf$.v_Plan p
     where p.Id_Plan = vPlan.Id_Plan;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found');
  end;

  begin
    insert into cf$.Plan_Exclude
                (Id_Plan, DExclude, Action_Type)
         values (vPlan.Id_Plan, vDExclude, 2);
  exception
    when unique_violation
    then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
    when check_violation
    then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;
end;
$function$
