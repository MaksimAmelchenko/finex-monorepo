CREATE OR REPLACE FUNCTION "cf$_account".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vAccount  cf$.v_Account%rowtype;
  vReaders  jsonb;
  vWriters  jsonb;
begin
  begin
    vAccount.Id_Account := (iParams->>'idAccount')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" must be a number');
  end;

  if vAccount.Id_Account is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" is required');
  end if;
 
  begin
    select a.*
      into strict vAccount
      from cf$.v_Account a
     where a.Id_Account = vAccount.Id_Account;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

--  if cf$_account.get_Permit (vAccount.Id_Account) != 7 then
--      perform error$.raise ('permission_denied');
--  end if;
  
  if (iParams \? 'name') then
    vAccount.Name := sanitize$.to_String (iParams->>'name');
    if vAccount.Name is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"name" is empty');
    end if;
  end if;

  if (iParams \? 'idAccountType') then
    begin
      vAccount.Id_Account_Type := (iParams->>'idAccountType')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountType" must be number');
    end;
    if vAccount.Id_Account_Type is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountType" is empty');
    end if;
  end if;

  if (iParams \? 'isEnabled') 
  then
    begin
      vAccount.Is_Enabled := (iParams->>'isEnabled')::boolean;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" must be true or false');
    end;

    if vAccount.Is_Enabled is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" is empty');
    end if;
  end if;

  if (iParams \? 'note') then
    vAccount.Note := sanitize$.to_String (iParams->>'note');
  end if;

  begin
    update cf$.Account a
       set Id_Account_Type = vAccount.Id_Account_Type,
           name = vAccount.name,
           Is_Enabled = vAccount.Is_Enabled,
           note = vAccount.Note
     where a.Id_Project = vAccount.Id_Project
       and a.Id_Account = vAccount.Id_Account;
  exception
    when unique_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
    when check_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;

  -- TODO сделать нормальное обновление прав через bitand и merge
  -- а то слишком сложно с кучей запросов
  -- + переделать в create
  if (iParams \? 'writers') then
    declare
      vLength int;
    begin
      vWriters := iParams->'writers';
      vLength := jsonb_array_length(vWriters);
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"writers" must be an array');
    end;

    delete 
      from cf$.Account_Permit ap 
     where ap.Id_Project = vAccount.Id_Project
       and ap.Id_Account = vAccount.Id_Account 
       and ap.Permit = 3
       and ap.Id_User not in (select jsonb_array_elements_text(vWriters)::text::int);

    -- Удаляем из списка "Право на чтение", т.к. право на запись более сильное
    delete 
      from cf$.Account_Permit ap 
     where ap.Id_Project = vAccount.Id_Project
       and ap.Id_Account = vAccount.Id_Account 
       and ap.Permit = 1
       and ap.Id_User in (select jsonb_array_elements_text(vWriters)::text::int);


    insert into cf$.Account_Permit (Id_Account, Id_User, Permit)
        (select vAccount.Id_Account, value::text::int, 3
           from jsonb_array_elements_text(vWriters) 
          where value::text::int != context.get('Id_User')::int
          except all
          select ap.Id_Account, ap.Id_User, ap.Permit
            from cf$.Account_Permit ap 
           where ap.Id_Project = vAccount.Id_Project
             and ap.Id_Account = vAccount.Id_Account 
             and ap.Permit = 3);
  end if;

  if (iParams \? 'readers') then
    declare
      vLength int;
    begin
      vReaders := iParams->'readers';
      vLength := jsonb_array_length(vReaders);
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"readers" must be an array');
    end;

    delete 
      from cf$.Account_Permit ap 
     where ap.Id_Project = vAccount.Id_Project
       and ap.Id_Account = vAccount.Id_Account 
       and ap.Permit = 1
       and ap.Id_User not in (select jsonb_array_elements_text(vReaders)::text::int);

    -- исключаем тех, у кого уже есть право на чтение и на запись
    insert into cf$.Account_Permit (Id_Account, Id_User, Permit)
        (select vAccount.Id_Account, value::text::int, 1
           from jsonb_array_elements_text(vReaders)
          where value::text::int != context.get('Id_User')::int
          except all
          select ap.Id_Account, ap.Id_User, 1
            from cf$.Account_Permit ap 
           where ap.Id_Project = vAccount.Id_Project
             and ap.Id_Account = vAccount.Id_Account 
             and ap.Permit in (1,3));
  end if;

  oResult := cf$_account.get (('{"idAccount": ' || vAccount.Id_Account::text || '}')::jsonb);
end;
$function$
