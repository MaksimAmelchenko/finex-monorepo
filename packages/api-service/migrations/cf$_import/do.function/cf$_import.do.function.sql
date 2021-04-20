CREATE OR REPLACE FUNCTION "cf$_import"."do"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Import_Source        cf$.Import_Source.Id_Import_Source%type;
  vImport_Source_Type_Code cf$.Import_Source_Type.code%type;
  vDelimiter               text;
  vIs_Group                boolean;
  vId_File                 core$.File.Id_File%type;

  vTag                     cf$.Tag.name%type;
  vId_Tag                  cf$.Tag.Id_Tag%type;
  
  -- 
  vIs_Convert_Debts         boolean;
  vIs_Convert_Invalid_Debts boolean;
begin
  begin
    vId_File := iParams->>'idFile';
    vId_Import_Source := iParams->>'importSource';
    vImport_Source_Type_Code := iParams->>'importSourceType';
    vDelimiter := iParams->>'delimiter';
    vIs_Group := iParams->>'isGroup';
    vTag := sanitize$.to_String (iParams->>'tag');

    vIs_Convert_Debts := coalesce (trim (iParams->>'isConvertDebts'), 'false');
    vIs_Convert_Invalid_Debts := coalesce (trim (iParams->>'isConvertInvalidDebts'), 'false');
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;
  
  if vTag is not null 
  then
    -- Проверяем, есть ли уже такой тег
    select t.Id_Tag
      into vId_Tag
      from cf$.v_Tag t
     where upper(t.name) = upper(vTag);

    if vId_Tag is null 
    then
      insert into cf$.Tag (name)
           values (vTag)
        returning Id_Tag
             into vId_Tag;
    end if;
  end if;


  if vId_Import_Source = 1 
  then
    oResult := cf$_import.homebuh5 (vId_File, vImport_Source_Type_Code, vDelimiter, vIs_Group, vId_Tag);
  elsif vId_Import_Source = 2 
  then
    oResult := cf$_import.drebedengi (vId_File, vImport_Source_Type_Code, vDelimiter, vIs_Group, vId_Tag, vIs_Convert_Debts, vIs_Convert_Invalid_Debts);
  elsif vId_Import_Source = 3 
  then
    oResult := cf$_import.zenmoney (vId_File, vImport_Source_Type_Code, vDelimiter, vIs_Group, vId_Tag);
  elsif vId_Import_Source = 4
  then
    oResult := cf$_import.homemoney (vId_File, vImport_Source_Type_Code, vDelimiter, vIs_Group, vId_Tag);
  else
    perform error$.raise ('invalid_parameters', iDev_Message := 'Invalid import source''s id');
  end if;
end;
$function$
