CREATE OR REPLACE FUNCTION "core$_operation".call(iid_operation integer, iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vOperation         core$.Operation%rowtype;
  vOperation_Log     core$.Operation_Log%rowtype;
  vStart_Timestamp   timestamptz  := clock_timestamp();
begin
--  savepoint before_operation;
  begin

    select o.*
      into strict vOperation
      from core$.Operation o
     where o.Id_Operation = iId_Operation;

    if (not vOperation.Is_Enabled )
    then
      perform error$.raise ('disabled_operation');
    end if;

    execute 'select ' || vOperation.Method || '($1)' into oResult using iParams;
    oResult = concat ('{', oResult, '}');
    
--    vOperation_Log.Result := oResult;
    --/*
  exception
    when others then
      vOperation_Log.Is_Error := 1;

      declare
        vCode text;
        vMessage text;
        vDev_Message text;
        vDB_Message text;
        vMore_Info text;
        vStack text;
        vError jsonb;
        vMessage_Text text;
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
          vCode := 'error_during_operation';
          get stacked diagnostics vDev_Message = message_text,  
                                  vStack = pg_exception_context,
                                  vMore_Info = pg_exception_detail;

        end if; 

        oResult := error$.format_fault (vCode, vMessage, vDev_Message, vDB_Message, vMore_Info, vStack);
      end;

      vOperation_Log.Result := oResult;
--      rollback to before_operation;
    --*/
  end;

  vOperation_Log.Params := iParams::text;
  vOperation_Log.Params := regexp_replace(vOperation_Log.Params, '"password":\s*"[^"]+"', '"password": "***"');
  vOperation_Log.Params := regexp_replace(vOperation_Log.Params, '"newPassword":\s*"[^"]+"', '"newPassword": "***"');

  vOperation_Log.Id_Operation := iId_Operation;
  vOperation_Log.time_spent_ms := round(1000 * extract (epoch from (clock_timestamp() - vStart_Timestamp)));

  insert into Core$.Operation_Log (id_Operation, Id_User, Is_Error, Time_Spent_ms, Params, Result)
       values (vOperation_Log.Id_OPeration, vOperation_Log.Id_User, vOperation_Log.Is_Error, vOperation_Log.time_Spent_ms, vOperation_Log.Params, vOperation_Log.Result);
end;
$function$
