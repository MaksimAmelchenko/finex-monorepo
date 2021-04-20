CREATE OR REPLACE FUNCTION "cf$_money".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult   json;
  vId_Money int;
begin
  begin
    vId_Money := (iParams->>'idMoney')::int;
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  with m as (select mi.Id_Money as "idMoney",
                    mi.Id_User as "idUser",
                    mi.Id_Currency as "idCurrency",
                    mi.Name,
                    mi.Symbol,
                    mi.Is_Enabled as "isEnabled",
                    mi.sorting,
                    COALESCE(mi.precision, 2) as "precision"
               from cf$.v_Money mi
              where mi.Id_Money = coalesce (vId_Money, mi.Id_Money)
              order by mi.Sorting, 
                       upper(mi.Name))
  select json_agg(m)
    into vResult
    from m;

  if vId_Money is null then
    oResult := concat ('"moneys"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"money"', ':', coalesce (vResult->>0, '{}'));
  end if;
end;
$function$
