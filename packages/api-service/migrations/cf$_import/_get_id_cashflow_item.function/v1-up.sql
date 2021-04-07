CREATE OR REPLACE FUNCTION "cf$_import"."#get_id_cashflow_item"(iname text, iparent integer, OUT oid_cashflow_item integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if nullif (trim(iName), '') is null then
    oId_CashFlow_Item := iParent;
    return;
  end if;

  begin
    select cfi.Id_CashFlow_Item
      into strict oId_CashFlow_Item
      from cf$.v_CashFlow_Item cfi
     where coalesce(cfi.Parent, -1) =  coalesce(iParent, -1) 
       and upper(cfi.Name) = upper(iName);
  exception
    when no_data_found then
      oId_CashFlow_Item := null;
  end;       
               
  if oId_CashFlow_Item is null then
    insert into cf$.CashFlow_Item (Parent, Name)
         values (iParent, iName)
      returning Id_CashFlow_Item
           into oId_CashFlow_Item;
  end if;
end;
$function$
