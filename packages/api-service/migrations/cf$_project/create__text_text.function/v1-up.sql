CREATE OR REPLACE FUNCTION "cf$_project"."create"(iname text, inote text DEFAULT NULL::text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Project cf$.Project.Id_Project%type;
begin
  begin
    insert into cf$.Project  
                (name, note)
         values (iName, iNote)
      returning Id_Project
           into vId_Project;
  exception
    when unique_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
    when check_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;

  -- Копируем категории
  declare
    r              record;
    vCategory_Map  hstore;
    vId_Category   cf$.Category.Id_Category%type;
  begin
    vCategory_Map := ''::hstore;
    -- Строим дерево CPT, что бы правильно отсортировать: сначало родитель, а уже потом потомок
    -- т.е. получится, что родитель всегда будет добавлен раньше потомка
    for r in (with recursive 
                cpt as (select cp.Id_Category_Prototype, 
                               cp.Name, 
                               cp.Parent, 
                               cp.Is_System, 
                               1 as lvl 
                          from cf$.Category_Prototype cp
                         where cp.Parent is null
                           and cp.Is_Enabled 
                         union all
                        select cp.Id_Category_Prototype, 
                               cp.Name, 
                               cp.Parent, 
                               cp.Is_System,
                               cpt.lvl + 1
                          from      cpt 
                               join cf$.Category_Prototype cp
                                 on (cp.Parent = cpt.Id_Category_Prototype)
                         where cp.Is_Enabled 
                         )
              select Id_Category_Prototype,
                     name,
                     Parent,
                     Is_System
                from cpt
               order by lvl, name) 
    loop
      insert into cf$.Category (Id_Project, name, Parent, Id_Category_Prototype, Is_System)
           values (vId_Project, 
                   r.Name, 
                   (vCategory_Map->r.parent::text)::int,
                   r.Id_Category_Prototype,
                   r.Is_System)
         returning Id_Category
              into vId_Category;
             
      vCategory_Map := vCategory_Map || hstore(r.Id_Category_Prototype::text, vId_Category::text);
    end loop;
  end;
  
  -- Создаем деньги по умолчанию
  insert into cf$.Money (Id_Project, Id_Currency, Name, Symbol, Sorting)
    with
      s (id_Currency, sorting) as (select 643, 1
                                    union all
                                   select 978, 2
                                    union all
                                   select 840, 3
                                 ) 
    select vId_Project,
           c.Id_Currency, 
           c.Name, 
           c.Symbol, 
           s.Sorting
      from s join cf$.Currency c using  (Id_Currency);

  

  return vId_Project;
end;
$function$
