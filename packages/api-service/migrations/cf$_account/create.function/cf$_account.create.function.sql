CREATE OR REPLACE FUNCTION "cf$_account"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vAccount  cf$.v_Account%rowtype;
  vReaders  jsonb;
  vWriters  jsonb;
begin
  if (iParams \? 'name') then
    vAccount.Name = nullif( trim(iParams->>'name'), '');
  end if;

  if vAccount.Name is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"name" is required');
  end if;

  if (iParams \? 'idAccountType') then
    begin
	    vAccount.Id_Account_Type = (iParams->>'idAccountType')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountType" must be a number');
    end;
  end if;

  if vAccount.Id_Account_Type is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountType" is required');
  end if;

  if (iParams \? 'isEnabled') then
    begin
	    vAccount.Is_Enabled = (iParams->>'isEnabled')::boolean;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" must be 1 or 0');
    end;
  end if;

  if vAccount.Is_Enabled is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" is required');
  end if;

  if (iParams \? 'note') then
    vAccount.Note = nullif (trim (iParams->>'note'), '');
  end if;

  begin
    insert into cf$.Account  
                (Id_Account_Type, name, Is_Enabled, note)
         values (vAccount.Id_Account_Type, vAccount.name, vAccount.Is_Enabled, vAccount.Note)
      returning Id_Account, 
                Id_Project
           into vAccount.Id_Account, 
                vAccount.Id_Project;
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

    insert into cf$.Account_Permit (Id_Account, Id_User, Permit)
        (select vAccount.Id_Account, value::text::int, 3
           from jsonb_array_elements(vWriters) 
          where value::text::int != context.get('Id_User')::int);
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

    -- исключаем тех, у кого уже есть право на запись
    insert into cf$.Account_Permit (Id_Account, Id_User, Permit)
        (select vAccount.Id_Account, value::text::int, 1
           from jsonb_array_elements(vReaders)
          where value::text::int != context.get('Id_User')::int
          except all
          select ap.Id_Account, ap.Id_User, 1
            from cf$.Account_Permit ap 
           where ap.Id_Project = vAccount.Id_Project 
             and ap.Id_Account = vAccount.Id_Account 
             and ap.Permit = 3);
  end if;

  oResult := cf$_account.get (('{"idAccount": ' || vAccount.Id_Account::text || '}')::jsonb);
end;
$function$
