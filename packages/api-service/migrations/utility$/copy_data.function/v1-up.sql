CREATE OR REPLACE FUNCTION "utility$".copy_data(iid_project integer, idbegin date, idend date)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
	declare
	  r record;
	  vId_CashFlow cf$.CashFlow.Id_CashFlow%type;
	begin
	  perform context.set('isNotCheckPermit', '1');
	  for r in (select cf.*
	              from cf$.CashFlow cf
	             where cf.Id_Project = iId_Project
	               and cf.Id_CashFlow_Type = 1
	               and exists (select null 
	                             from cf$.CashFlow_Detail cfd
	                            where cfd.Id_CashFlow = cf.Id_CashFlow
	                              and cfd.DCashFlow_Detail between iDBegin and iDEnd))
	  loop
	    insert into cf$.CashFlow (Id_Project, Id_User, Id_Contractor, Id_CashFlow_Type, note, tags)
	         values (r.Id_Project, r.Id_User, r.Id_Contractor, r.Id_CashFlow_Type, r.Note, r.Tags)   
	      returning Id_CashFlow
	           into vId_CashFlow;
           
	    insert into cf$.CashFlow_Detail (Id_Project, Id_CashFlow, Id_User, Id_Account, 
	                              Id_Category, Id_Money, Id_Unit, sign, DCashFlow_Detail, 
	                              Quantity, Sum, Note, Tags)
	         select cfd.Id_Project, vId_CashFlow, cfd.Id_User, cfd.Id_Account, 
	                cfd.Id_Category, cfd.Id_Money, cfd.Id_Unit, cfd.sign, 
	--                cfd.DCashFlow_Detail + interval '1 year' + ((-5 + random()*10)::int::text || ' day')::interval,
	                cfd.DCashFlow_Detail + interval '1 year',
	                cfd.Quantity, round((cfd.Sum * (1 + random() * 25 / 100))::numeric, 2), cfd.Note, cfd.Tags
	           from cf$.CashFlow_Detail cfd
	          where cfd.Id_Project = r.Id_Project
	            and cfd.Id_CashFlow = r.Id_CashFlow
	            and cfd.DCashFlow_Detail between iDBegin and iDEnd;
	  end loop;               
	  perform context.set('isNotCheckPermit', null);
	end;
	$function$
