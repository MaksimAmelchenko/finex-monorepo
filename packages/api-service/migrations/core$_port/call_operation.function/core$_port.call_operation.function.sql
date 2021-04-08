CREATE OR REPLACE FUNCTION "core$_port".call_operation(isession_id uuid, ioperation_name text, iparams text, OUT oresponse text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
 vParams        jsonb;
 vOperation     core$.Operation%rowtype;
 vResult        text;

begin
  begin
    begin
      vParams := coalesce(iParams::jsonb, '{}'::jsonb);
    exception
      when others then
        perform error$.raise('bad_request', iDev_Message := 'Invalid input JSON');
    end;
    
    perform core$_port.set_request_Info('ip', (vParams->>'ip')::text);
   
    begin
      select o.*
        into strict vOperation
        from core$.operation o
       where o.name = iOperation_Name;
    exception
      when no_data_found then
        perform error$.raise ('operation_is_not_found', iDev_Message := 'Operation "' || iOperation_Name || '" isn''t found') ;
    end;

    if vOperation.Is_Need_Authorize  then
      perform context.set (iSession_Id);
    end if;
    
    select core$_operation.call (vOperation.Id_Operation, vParams)
      into vResult;

  exception
    when others then
      declare
        vCode         text;
        vMessage      text;
        vDev_Message  text;
        vDB_Message   text;
        vMore_Info    text;
        vStack        text;

        vMessage_Text text;
        vError        jsonb;
      begin
        if sqlstate = 'CR999' then
          get stacked diagnostics vMessage_Text = message_text,  
                                  vStack = pg_exception_context;

          vError := vMessage_Text::jsonb;
          vCode := vError->>'code';
          
          if vError \? 'message' then
            vMessage := vError->>'message';
          end if;
          
          if vError \? 'devMessage' then
            vDev_Message := vError->>'devMessage';
          end if;

          if vError \? 'dbMessage' then
            vDB_Message := vError->>'dbMessage';
          end if;

          if vError \? 'moreInfo' then
            vMore_Info := vError->>'moreInfo';
          end if;
        else
          vCode := 'internal_server_error';
          get stacked diagnostics vDev_Message = message_text,  
                                  vStack = pg_exception_context,
                                  vMore_Info = pg_exception_detail;

        end if; 

        vResult := error$.format_fault (vCode, vMessage, vDev_Message, vDB_Message, vMore_Info, vStack);
      end;

  end;

  oResponse := vResult;
end;
$function$
