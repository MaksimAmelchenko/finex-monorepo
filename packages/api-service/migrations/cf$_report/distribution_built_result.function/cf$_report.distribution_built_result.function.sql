CREATE OR REPLACE FUNCTION "cf$_report".distribution_built_result(iparent integer)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER COST 1000
AS $function$
declare
  vResult text;
begin
  select  string_agg ('{"idCategory":' || json.to_json(d.Id_Category) 
                       || ',"sum":[' || json.to_json(d.Sum_In) || ',' || json.to_json(d.Sum_Out) || ']'
                       || ',"items": [' ||  case when Id_Category is not null then cf$_report.distribution_built_result (d.Id_Category)  else '' end || ']'
                       ||'}',
                      ',')
    into vResult
    from cf$_report_distribution d
   where d.Parent = iParent 
      or (iParent is null and d.Parent is null);

  return coalesce (vResult, '');
end;
$function$
