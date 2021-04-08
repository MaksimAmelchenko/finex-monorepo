CREATE OR REPLACE FUNCTION "cf$_project".merge(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r                   record;
  vProjects           int[];
  vId_Target_Project  cf$.Project.Id_Project%type;
  
  vUnits_Count            int := 0;
  vTags_Count             int := 0;
  vMoneys_Count           int := 0;
  vAccounts_Count         int := 0;
  vCategories_Count       int := 0;
  vContractors_Count      int := 0;
  vCashFlows_Count        int := 0;
  vCashFlow_Details_Count int := 0;
  vPlans_Count            int := 0;

  vId_User  core$.User.Id_User%type := context.get('Id_User');
begin
  begin
    vId_Target_Project := iParams->>'idProject';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idProject" must be a number');
  end;

  if vId_Target_Project is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idProject" is required');
  end if;

  if (iParams \? 'projects') 
  then
    begin
      vProjects := array_remove (array (select jsonb_array_elements_text(iParams->'projects')::int), vId_Target_Project);
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"projects" must be an array');
    end;
  else
    perform error$.raise ('invalid_parameters', iDev_Message := '"projects" is required');
  end if;
 
  begin
    select p.Id_Project
      into strict vId_Target_Project
      from cf$.v_Project p
     where p.Id_Project = vId_Target_Project;
  exception
    when no_data_found 
    then
      perform error$.raise ('no_data_found');
  end;
  
  --  just check
  for r in (select unnest(vProjects) as Id_Project) 
  loop
    if cf$_project.get_Permit (r.Id_Project) != 7 
    then
      perform error$.raise ('permission_denied');
    end if;
    
    if r.Id_Project = context.get('Id_Project')::int 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := 'You can not use active project for merging');
    end if;
  end loop;
  
  for r in (select unnest(vProjects) as Id_Project) 
  loop
    select Units_Count + vUnits_Count,
           Tags_Count + vTags_Count,
           Accounts_Count + vAccounts_Count,
           Categories_Count + vCategories_Count,
           Contractors_Count + vContractors_Count,
           CashFlows_Count + vCashFlows_Count,
           CashFlow_Details_Count + vCashFlow_Details_Count,
           Moneys_Count + vMoneys_Count,
           Plans_Count + vPlans_Count
      into vUnits_Count,
           vTags_Count,
           vAccounts_Count,
           vCategories_Count,
           vContractors_Count,
           vCashFlows_Count,
           vCashFlow_Details_Count,
           vMoneys_Count,
           vPlans_Count
      from cf$_project.merge (r.Id_Project, vId_Target_Project);

    -- через констрейн не получилось это сделать, т.к. его нужно делать отложенным
    -- а отложенные констрейны не работают при каскадном удалении
    -- AfterTriggerSaveEvent() called outside of query
    
    perform cf$_project.destroy(('{"idProject":' || r.Id_Project::text || '}')::jsonb);
  end loop;

  oResult := concat ( '"accountsCount":', json.to_json (vAccounts_Count),
                     ',"contractorsCount":', json.to_json (vContractors_Count),
                     ',"categoriesCount":', json.to_json (vCategories_Count),
                     ',"unitsCount":', json.to_json (vUnits_Count),
                     ',"tagsCount":', json.to_json (vTags_Count),
                     ',"moneysCount":', json.to_json (vMoneys_Count),
                     ',"plansCount":', json.to_json (vPlans_Count),
                     ',"cashFlowsCount":', json.to_json (vCashFlows_Count),
                     ',"cashFlowDetailsCount":', json.to_json (vCashFlow_Details_Count)
                     );

  if vId_Target_Project = context.get('Id_Project')::int 
  then
    oResult := oResult || ',' || cf$_project.get_dependency ('{}'::jsonb);
  end if;

end;
$function$
