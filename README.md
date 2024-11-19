# Автоматическая запись данных в Google Таблицу с помощью MacroDroid

Этот гайд поможет вам настроить автоматическую запись данных из SMS и push-уведомлений в Google Таблицу.

### Шаг 1: Создание Google аккаунта
1. В настройках телефона заходим в пункт "Аккаунты"

   <img src="screenshots/account/1accounts.jpg" width="400px">
   
2. Нажимаем "Добавить аккаунт"

   <img src="screenshots/account/2createaccount.jpg" width="400px">
   
3. Выбираем Google

   <img src="screenshots/account/3choosegoogle.jpg" width="400px">
   
4. Нажимаем "Создать аккаунт" -> "Для личного пользования"

   <img src="screenshots/account/4typeofaccount.jpg" width="400px">
   
5. Заполняем данные

### Шаг 2: Предоставление доступа к таблице
1. В таблице нажимаем "Настройки Доступа" (в правом верхнем углу)
2. Вводим почту созданного аккаунта и нажимаем на всплывшую подсказку

   <img src="screenshots/table/2addemail.png" width="400px">
   
3. Проверяем, что справа выставлен режим доступа "Редактор" и нажимаем "Отправить"

   <img src="screenshots/table/3editor.png" width="400px">

### Шаг 3: Создание проекта в Google Apps Script
1. Открываем окно в режиме инкогнито (`CTRL`+`SHIFT`+`N` или `CTRL`+`SHIFT`+`P`)
2. Заходим на https://google.com/, нажимаем "Войти" и заходим в созданный аккаунт
   ![image](screenshots/script/1login.png)
3. Заходим на https://script.google.com/home/
   ![image](screenshots/script/2script.png)
4. Нажимаем слева большую кнопку со знаком `+`
5. Нажимаем "Понятно"
   ![image](screenshots/script/3gotit.png)
6. Выделяем всё, стираем и вставляем [этот код](script.js)
   ![image](screenshots/script/4replace.png)
7. Нажимаем "💾"
   ![image](screenshots/script/5save.png)
8. Нажимаем "Начать развертывание" -> "Новое развертывание"
   ![image](screenshots/script/6deploy.png)
9. Нажимаем "⚙" -> "Веб-приложение"
   ![image](screenshots/script/7type.png)
10. В поле "У кого есть доступ" выбираем "Все"
    ![image](screenshots/script/8access.png)
11. Нажимаем "Начать развертывание"
    ![image](screenshots/script/9deploy.png)
12. Нажимаем "Предоставить доступ"
    ![image](screenshots/script/10access.png)
13. Выбираем созданный аккаунт
    ![image](screenshots/script/11account.png)
14. Нажимаем на серую надпись слева
    ![image](screenshots/script/12advanced.png)
15. Нажимаем на серую надпись снизу
    ![image](screenshots/script/13project.png)
16. Нажимаем на кнопку справа
    ![image](screenshots/script/14allow.png)
17. Копируем ссылку
    ![image](screenshots/script/15copy.png)

### Шаг 4: Настройка MacroDroid

1. Установить [MacroDroid](https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid) из Play Store
2. **Для SMS:**:
   - Качаем [макрос для SMS](sms_spreadsheet_macro.json)

3. **Для Push-уведомлений:**:
   - Качаем [макрос для Push-уведомлений](push_spreadsheet_macro.json)
   - Открываем макрос, нажимаем "Получено уведомление" -> "Настроить"
   - Нажимаем "Получено уведомление" -> "OK"
   - Нажимаем "Выбрать приложение(я)" -> "ОК"
   - Выбираем нужное(ые) приложение(я) -> "ОК" -> "ОК"

4. Открываем макрос, нажимаем "HTTP-запрос (POST)" -> "Настроить"
5. Вставляем ссылку, скопированную ранее

   <img src="screenshots/macrodroid/3url.png" width="400px">

6. Меняем цифры в "acc" на последние 4 цифры номера счёта и цифры в "card" на последние 4 цифры карты

    <img src="screenshots/macrodroid/4body.png" width="400px">