CREATE OR REPLACE FUNCTION "cf$_report".dynamics_built_result(iparent integer)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER COST 1000
AS $function$
declare
  vResult text;
begin
  with a as (select d.Id_Category, 
                    string_agg('"' || d.month::text || '":[' || json.to_json(d.Sum_In) || ',' || json.to_json(d.Sum_Out) || ']', ',' /*order by Month*/) as s
               from cf$_report_dynamics d
               where d.Parent = iParent 
                  or (iParent is null and d.Parent is null)
               group by d.Id_Category, d.Parent)
  select  string_agg ('{"idCategory":' || json.to_json(a.Id_Category) 
                       || ',' || s  
                       || ',"items": [' ||  case when Id_Category is not null then cf$_report.dynamics_built_result (Id_Category)  else '' end || ']'
                       ||'}',
                      ',')
    into vResult
    from a;

  return coalesce (vResult, '');
end;
$function$
