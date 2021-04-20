CREATE OR REPLACE FUNCTION "cf$_entity".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  oResult := concat_ws (',', oResult, cf$_Message.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, core$_Session.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, core$_User.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_Currency.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_Account_Type.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_Category_Prototype.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_Profile.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_Project.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_Import_Source.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_Currency_Rate_Source.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_Invitation.get ('{}'::jsonb));

  oResult := concat_ws (',', oResult, cf$_project.get_dependency ('{}'::jsonb));
end;
$function$
