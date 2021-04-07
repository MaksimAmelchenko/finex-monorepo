CREATE OR REPLACE FUNCTION "cf$_plan"."create"(iparams jsonb, OUT id_plan integer, OUT new_tags text)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vPlan    cf$.Plan%rowtype;
  vTags    text[];
begin
  begin
    vPlan.dBegin := sanitize$.to_date (iParams->>'dBegin');
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be a date');
  end;

  if vPlan.dBegin is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" is required');
  end if;

  begin
    vPlan.Report_Period := sanitize$.to_date (iParams->>'reportPeriod');
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" must be a date');
  end;

  if vPlan.Report_Period is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" is required');
  end if;

  vPlan.Operation_Note := sanitize$.to_String (iParams->>'operationNote');

  if (iParams \? 'operationTags') 
  then
    begin
      vTags := array (select jsonb_array_elements_text(iParams->'operationTags'));
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a json array');
    end;

    select oTags, 
           oNew_Tags
      into vPlan.Operation_Tags, 
           New_Tags
      from cf$_tag.decode (vTags);
  end if;

  begin
    vPlan.Repeat_Type := iParams->>'repeatType';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"repeatType" must be a numeric');
  end;

  if vPlan.Repeat_Type is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"repeatType" is required');
  end if;

  begin
    vPlan.Repeat_Days := sanitize$.to_int_array (iParams->'repeatDays');
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"repeatDays" must be a array of numbers');
  end;

  begin
    vPlan.End_Type := iParams->>'endType';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"endType" must be a number');
  end;

  begin
    vPlan.Repeat_Count := iParams->>'repeatCount';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"repeatCount" must be a number');
  end;

  begin
    vPlan.DEnd := sanitize$.to_date (iParams->>'dEnd');
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" must be a date');
  end;

  vPlan.Color_Mark := sanitize$.to_String (iParams->>'colorMark');

  vPlan.Note := sanitize$.to_String (iParams->>'note');

  begin
    insert into cf$.Plan (DBegin, 
                          Report_Period,
                          Operation_Note,
                          Operation_Tags,
                          Repeat_Type,
                          Repeat_Days,
                          End_Type,
                          Repeat_Count,
                          DEnd,
                          Color_Mark,
                          Note)
         values (vPlan.DBegin, 
                 vPlan.Report_Period,
                 vPlan.Operation_Note,
                 vPlan.Operation_Tags,
                 vPlan.Repeat_Type,
                 vPlan.Repeat_Days,
                 vPlan.End_Type,
                 vPlan.Repeat_Count,
                 vPlan.DEnd,
                 vPlan.Color_Mark,
                 vPlan.Note)
      returning plan.Id_Plan
           into Id_Plan;
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
