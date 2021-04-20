CREATE OR REPLACE FUNCTION "cf$_currency".upload_cbr(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
/*  vResult      json;*/
  r            record;
  vDRate       cf$.Currency_Rate.DRate%type;
  vId_Currency cf$.Currency.Id_Currency%type;

  vCount       integer;
  
  vUpdCount  int := 0;
  vInsCount  int := 0;
  vMissCount int := 0;
  vMissed    text;
  vId_Currency_Rate_Source smallint := 2;
begin
  if (iParams \? 'Date') then
    begin
      vDRate := to_date(nullif(trim(iParams->>'Date'), ''), 'dd.mm.yyyy');
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"Date" must be a date');
    end;
  end if;
  if vDRate is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"Date" is required');
  end if;

  for r in (select value->>'CharCode' as Code,
                   lib.to_numeric(value->>'Nominal') / lib.to_numeric(value->>'Value') as Rate
              from jsonb_array_elements(iParams->'Valute')) 
  loop
    
    select Id_Currency
      into vId_Currency
      from cf$.Currency c
     where c.code = r.code;
 
    if vId_Currency is null then
      vMissed := concat_ws(',', vMissed, r.Code);   
      vMissCount = vMissCount + 1;
      continue;
    end if;

    with upd as (update cf$.currency_rate cr
                    set Rate = r.Rate
                  where cr.Id_Currency_Rate_Source = vId_Currency_Rate_Source
                    and cr.DRate = vDRate
                    and cr.Id_Currency = vId_Currency
              returning *
                )
    select count(*) 
      into vCount
      from upd;
     
    if vCount = 0 then
      insert into cf$.currency_rate (Id_Currency_Rate_Source, DRate, Id_Currency, Rate)
           values (vId_Currency_Rate_Source, vDRate, vId_Currency, r.Rate);
      vInsCount = vInsCount + 1;
    else
      vUpdCount = vUpdCount + 1;
    end if; 
  end loop;

  oResult := json.list(array['dRate', json.to_json(vDRate),
                             'updCount', json.to_json(vUpdCount),
                             'insCount', json.to_json(vInsCount),
                             'missCount', json.to_json(vMissCount),
                             'missed', concat ('[', vMissed ,']')
                            ]
                        );
end;
$function$
