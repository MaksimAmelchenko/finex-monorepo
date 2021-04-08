CREATE OR REPLACE FUNCTION "cf$_currency".upload_openexchangerates(iparams jsonb, OUT oresult text)
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
  vId_Currency_Rate_Source int := 1;
begin

--select drate from  generate_series ('1999-01-01'::timestamp, now()::timestamp, '1 days') as drate
--where EXTRACT(DOW FROM drate) in (1,3,5);

  if (iParams \? 'timestamp') then
    begin
      vDRate := (to_timestamp((iParams->>'timestamp')::int) at time zone 'utc')::date;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"timestamp" must be a timestamp');
    end;
  end if;

  if vDRate is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"timestamp" is required');
  end if;

  for r in (select key as code, 
                   value::numeric as rate
              from jsonb_each_text(iParams->'rates')
             where key not in ('GGP', 'IMP', 'JEP')) 
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
                    and cr.Id_Currency = vId_Currency
                    and cr.DRate = vDRate
              returning *
                )
    select count(*) 
      into vCount
      from upd;
     
    if vCount = 0 then
      insert into cf$.currency_rate (Id_Currency_Rate_Source, Id_Currency, DRate, Rate)
           values (vId_Currency_Rate_Source,  vId_Currency, vDRate, r.Rate);
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
