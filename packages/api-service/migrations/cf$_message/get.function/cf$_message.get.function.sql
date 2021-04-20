CREATE OR REPLACE FUNCTION "cf$_message".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r record;
  vWelcome_Text    text;
  vChange_Log_Text text;
  vResult          text;
begin
  if core$_user.Is_New()
  then
    vWelcome_Text := '
    <div>
      <p>
          Спасибо, что выбрали наш сервис.
      </p>

      Чтобы начать, Вам нужно выполнить 2 действия:
      <ol>
          <li>
              <strong>Завести счета</strong> в справочнике «Счета». 
              <br/>
              Например, «Кошелек» или «Зарплатная карточка»
          </li>
          <li>
              <strong>Создать доход</strong>, чтобы задать начальные остатки по новым счетам.
          </li>
      </ol>

      Также мы рекомендуем:
      <ol>
          <li>
              Ознакомиться с <a href="https://finex.io/about" target="_blank">описанием программы</a>.
              <br/>
              Это поможет понять, как работает программа и использовать ее более эффективно.
          </li>
          <li>
              Посмотреть справочник «Категории». Он уже заполнен стандартным набором категорий, но Вы
              всегда можете сформировать его как Вам удобно.
          </li>
          <li>
              Настроить справочник «Валюты»: отсортировать, добавить новые валюты. 
          </li>
      </ol>

      <p>
          <i class="fa fa-lg fa-comments-o"></i>
          Если у Вас есть вопросы или предложения, то их можно оставить на сайте сообщества:
          <a href="http://community.finex.io" target="_blank">community.finex.io</a> 
          или нажав кнопку 
          <span class="label label-primary">
            <i class="fa fa-comments"></i> 
            Обратная связь
          </span> 
          в меню слева.
      </p>

      <p>
          <i class="fa fa-lg fa-skype text-info"></i> 
          Также для быстрой связи можно написать в наш <strong>скайп</strong>: <em>finex.io</em>
      </p>
      <hr/>
      <p>
          С наилучшими пожеланиями,
          <br/>
          команда FINEX.io
      </p>
    </div>
';
    vResult := concat_ws (',', vResult, '"welcome":' || json.to_json(vWelcome_Text));
  else
    for r in (select cl.Title,
                     cl.Description
                from cf$.change_log cl
               where cl.DSet > core$_user.get_DLast_SignIn()
               order by cl.DSet desc) 
    loop
      vChange_Log_Text := concat (vChange_Log_Text, '<h5>', r.Title, '</h5>', r.Description);
    end loop;

    if vChange_Log_Text is not null  
    then
      vChange_Log_Text := concat (vChange_Log_Text, 
                                  '<hr/>
                                   <p>
                                     <a href="http://community.finex.io/topic/711879-istoriya-obnovleniya/" target="_blank">
                                       Полная история изменений
                                     </a>
                                   </p>');
      vResult := concat_ws (',', vResult, '"changeLog":' || json.to_json(vChange_Log_Text));
    end if;
  end if;

  oResult := concat('"messages"', ':', '{', vResult, '}');  
end;
$function$
