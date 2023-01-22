create or replace function billing$.access_period_aiud() returns trigger as
$$
declare
  userId integer;
begin
  if (TG_OP = 'DELETE') then
    userId := old.user_id;
  else
    userId := new.user_id;
  end if;

  update core$.user as u
     set access_until = (select max(ap.end_at)
                           from billing$.access_period ap
                          where ap.user_id = u.id_user)
   where u.id_user = userId;

  return null;
end
$$ language 'plpgsql';

create trigger access_period_aiud
  after insert or update or delete
  on billing$.access_period
  for each row
execute procedure billing$.access_period_aiud();
