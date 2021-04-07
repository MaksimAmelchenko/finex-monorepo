CREATE OR REPLACE FUNCTION "core$_operation"."#get_result"(iparams json, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Operation_Queue core$.Operation_Queue.Id_Operation_Queue%type;
  vResult             core$.Operation_Queue.Result%type;
begin
  begin
    vId_Operation_Queue := iParams->>'idOperationQueue';
  exception
    when others
    then
      perform error.raise ('Invalid parameters');
  end;

  begin
    select oq.result
      into vResult
      from core$.Operation_Queue oq
     where coalesce (oq.Id_Session, -1) = coalesce ( context.get('Id_Session'), -1)
       and oq.Id_Operation_Queue = vId_Operation_Queue;
  exception
    when no_data_found
    then
      perform error.raise ('Invalid request');
  end;

  if vResult is null
  then
    oResult := json.object(array['_noDataYet', 1]);
  else
    oResult := vResult;
  end if;
end;
$function$
