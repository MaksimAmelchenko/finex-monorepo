create or replace view cf$.v_plan_v2 as
select p.id_project as project_id,
       p.id_plan as id,
       p.id_user as user_id,
       p.dbegin as start_date,
       p.report_period,
       p.repeat_type as repetition_type,
       p.repeat_days as repetition_days,
       p.end_type as termination_type,
       p.repeat_count as repetition_count,
       p.dend as end_date,
       p.note,
       p.operation_note,
       p.operation_tags,
       p.color_mark as marker_color
  from cf$.plan p
