CREATE OR REPLACE FUNCTION "cf$".cashflow_detail_aiud()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if context.get ('isNotCalculateBalance') is null 
  then
    if TG_OP in ('UPDATE', 'DELETE') then

      -- "Откатываем" предыдущие изменение этой детализации ДП
      update cf$.Account_Balance ab
         set Sum_In = Sum_In - case when old.Sign = 1 then old.Sum else 0 end,
             Sum_Out = Sum_Out - case when old.Sign = -1 then old.Sum else 0 end
       where ab.Id_Project = old.Id_Project
         and ab.Id_Account = old.Id_Account
         and ab.DBalance = old.DCashFlow_Detail
         and ab.Id_Money = old.Id_Money;

      -- TODO Может не удалять и оставлять нули \?\?\?
      delete 
        from cf$.Account_Balance ab
       where ab.Id_Project = old.Id_Project
         and ab.Id_Account = old.Id_Account
         and ab.DBalance = old.DCashFlow_Detail
         and ab.Id_Money = old.Id_Money
         and ab.Sum_In = 0
         and ab.Sum_Out = 0;
    end if;       

    --
    if TG_OP in ('INSERT', 'UPDATE') then
      with
        s as (select new.Id_Project as Id_Project,
                     new.Id_Account as Id_Account,
                     new.DCashFlow_Detail as DBalance,
                     new.Id_Money as Id_Money,
                     case when new.Sign = 1 then new.Sum else 0 end as Sum_In,
                     case when new.Sign = -1 then new.Sum else 0 end as Sum_Out),
        upsert as (update cf$.Account_Balance ab
                      set Sum_In = ab.Sum_In + s.Sum_In,
                          Sum_Out = ab.Sum_Out + s.Sum_Out
                     from s
                    where ab.Id_Project = s.Id_Project
                      and ab.Id_Account = s.Id_Account
                      and ab.DBalance = s.DBalance
                      and ab.Id_Money = s.Id_Money
                returning * )
      insert
        into cf$.Account_Balance (Id_Project, Id_Account, DBalance, Id_Money, Sum_In, Sum_Out)
      select s.Id_Project,
             s.Id_Account,
             s.DBalance,
             s.Id_Money,
             s.Sum_In,
             s.Sum_Out
        from s
       where not exists (select 1
                           from upsert up);
    end if;            
  end if;

  return null;             
end;
$function$
