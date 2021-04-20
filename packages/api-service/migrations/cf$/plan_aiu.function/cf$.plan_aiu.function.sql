CREATE OR REPLACE FUNCTION "cf$".plan_aiu()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  vIs_Valid boolean;
begin
  vIs_Valid :=   
              (     new.Repeat_Type = 0 
                and new.Repeat_Days is null
                and new.End_Type is null
                and new.Repeat_Count is null
                and new.DEnd is null 
              )
           or (   (   (    new.Repeat_Type = 1 
                       and cardinality(new.Repeat_Days) > 0
                       and (select count(*) 
                              from unnest(new.Repeat_Days) d
                             where d not between 1 and 7) = 0
                      )
                   or (    new.Repeat_Type = 2
                       and cardinality(new.Repeat_Days) > 0
                       and (select count(*) 
                              from unnest(new.Repeat_Days) d
                             where d not between 1 and 31) = 0
                      )
                   or (    new.Repeat_Type in (3, 4)
                       and new.Repeat_Days is null
                      )
                  )
              and (   (    new.End_Type = 0
                       and new.Repeat_Count is null
                       and new.DEnd is null
                      )
                   or (    new.End_Type = 1
                       and new.Repeat_Count > 1
                       and new.DEnd is null
                      )  
                   or (    new.End_Type = 2
                       and new.Repeat_Count is null
                       and new.DEnd > new.DBegin
                      )  
                  )
              );

  if not vIs_Valid  
  then
    perform error$.raise('invalid_parameters', iDev_Message := 'invalid the scheduler''s conditions');
  end if;              

  return null;
end;
$function$
