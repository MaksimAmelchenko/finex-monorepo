CREATE OR REPLACE FUNCTION "cf$_export"."do"(OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vAccounts      json;
  vContractors   json;
  vTags          json;
  vUnits         json;
  vCashFlowItems json;
begin

  with a as (select a.Id_Account as "idAccount", 
                    a.Id_Account_Type as "idAccountType",
                    a.name as "name",
                    a.Is_Enabled as "isEnabled",
                    a.Note as "note"
               from cf$.v_Account a)
  select json_agg(a)
    into vAccounts
    from a;

  with c as (select c.Id_Contractor as "idContractor",
                    c.Name as "name",
                    c.Note as "note"
               from cf$.v_Contractor c)
    select json_agg(c)
      into vContractors
      from c;  

  with t as (select t.Id_Tag as "idTag",
                    t.Name
               from cf$.v_Tag t)
  select json_agg(t)
    into vTags
    from t;

  with u as (select u.Id_Unit as "idUnit",
                    u.Name
               from cf$.v_Unit u)
  select json_agg(u)
    into vUnits
    from u;
    
  with cfi as (select cfi.Id_CashFlow_Item as "idCashFlowItem",
                      cfi.Parent,
                      cfi.Is_Enabled as "isEnabled",
                      cfi.Is_System as "isSystem",
                      cfi.Name,
                      cfi.Note
              from cf$.v_CashFlow_Item cfi)
  select json_agg(cfi)
    into vCashFlowItems
    from cfi;             

  oResult := concat_ws (',', oResult, '"accounts"', ':', coalesce(vAccounts::text,'[]'));
  oResult := concat_ws (',', oResult, '"contractors"', ':', coalesce(vContractors::text,'[]'));
  oResult := concat_ws (',', oResult, '"tags"', ':', coalesce(vTags::text,'[]'));
  oResult := concat_ws (',', oResult, '"units"', ':', coalesce(vUnits::text,'[]'));
  oResult := concat_ws (',', oResult, '"cashFlowItems"', ':', coalesce(vCashFlowItems::text,'[]'));

end;
$function$
