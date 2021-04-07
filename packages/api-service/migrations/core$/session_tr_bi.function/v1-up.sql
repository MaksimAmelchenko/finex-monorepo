CREATE OR REPLACE FUNCTION "core$".session_tr_bi()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
	begin
	  if new.token is null then
	    new.token := md5 (core$.random_string (30)) || new.Id_Session::text;
	  end if;

	  if new.DSet is null 
	  then
	    new.DSet := clock_timestamp();
	  end if;

	  return new;
	end;
	$function$
