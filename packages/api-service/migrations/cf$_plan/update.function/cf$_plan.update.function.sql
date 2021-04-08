CREATE OR REPLACE FUNCTION "cf$_plan".update(iid_plan integer, iparams jsonb, OUT new_tags text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Project cf$.Project.Id_Project%type := context.get('Id_Project');
  vPlan       cf$.Plan%rowtype;
  vTags       text[];
  vNew_Tags   text;
begin
  begin
    select p.*
      into strict vPlan
      from cf$.Plan p
     where p.Id_Project = vId_Project
       and p.Id_Plan = iId_Plan;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found');
  end;

  if (iParams \? 'dBegin') 
  then
    begin
      vPlan.dBegin := sanitize$.to_date (iParams->>'dBegin');
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be a date');
    end;

    if vPlan.dBegin is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" is empty');
    end if;
  end if;

  if (iParams \? 'reportPeriod') 
  then
    begin
      vPlan.Report_Period := sanitize$.to_date(iParams->>'reportPeriod');
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" must be a date');
    end;

    if vPlan.Report_Period is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" is empty');
    end if;
  end if;

  if (iParams \? 'operationNote') 
  then
    vPlan.Operation_Note := sanitize$.to_String (iParams->>'operationNote');
  end if;

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
           vNew_Tags
      from cf$_tag.decode (vTags);
  end if;

  if (iParams \? 'repeatType') 
  then
    begin
      vPlan.Repeat_Type := iParams->>'repeatType';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"repeatType" must be a number');
    end;

    if vPlan.Repeat_Type is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"repeatType" is empty');
    end if;
  end if;

  if (iParams \? 'repeatDays') 
  then
    begin
      vPlan.Repeat_Days := sanitize$.to_int_array (iParams->'repeatDays');
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"repeatDays" must be a array of numbers');
    end;
  end if;

  if (iParams \? 'endType') 
  then
    begin
      vPlan.End_Type := iParams->>'endType';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"endType" must be a number');
    end;
  end if;

  if (iParams \? 'dEnd') 
  then
    begin
      vPlan.DEnd := sanitize$.to_date(iParams->>'dEnd');
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" must be a date');
    end;
  end if;

  if (iParams \? 'repeatCount') 
  then
    begin
      vPlan.Repeat_Count:= iParams->>'repeatCount';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"repeatCount" must be a number');
    end;
  end if;

  if (iParams \? 'colorMark') 
  then
    vPlan.Color_Mark := sanitize$.to_String (iParams->>'colorMark');
  end if;

  if (iParams \? 'note') 
  then
    vPlan.Note := sanitize$.to_String (iParams->>'note');
  end if;

  begin
    update cf$.Plan p
       set DBegin = vPlan.DBegin,
           Report_Period = vPlan.Report_Period,
           Operation_Note = vPlan.Operation_Note,
           Operation_Tags = vPlan.Operation_Tags,
           Repeat_Type = vPlan.Repeat_Type,
           Repeat_Days = vPlan.Repeat_Days,
           End_Type = vPlan.End_Type,
           DEnd = vPlan.DEnd,
           Repeat_Count = vPlan.Repeat_Count,
           Color_Mark = vPlan.Color_Mark,
           Note = vPlan.Note
     where p.Id_Project = vPlan.Id_Project
       and p.Id_Plan = vPlan.Id_Plan;
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
