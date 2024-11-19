# Записывалка в таблицу

## Вам понадобится
1. Телефон
2. Новая симка
3. Компьютер


## Гайд

1. Создать Google аккаунт
2. Предоставляем доступ к таблице
3. Настроить проект в Google Apps Script
4. Настроить MacroDroid

### Создание Google аккаунта
1. В настройках телефона заходим в пункт "Аккаунты"
   ![image](screenshots/account/1accounts.jpg)
2. Нажимаем "Добавить аккаунт"
   ![image](screenshots/account/2createaccount.jpg)
3. Выбираем Google
   ![image](screenshots/account/3choosegoogle.jpg)
4. Нажимаем "Создать аккаунт" -> "Для личного пользования"
   ![image](screenshots/account/4typeofaccount.jpg)
5. Заполняем данные

### Предоставление доступа к таблице
1. В таблице нажимаем "Настройки Доступа"
   ![image](screenshots/table/1table.png)
2. Вводим почту созданного аккаунта и нажимаем на всплывшую подсказку
   ![image](screenshots/table/2addemail.png)
3. Проверяем, что справа выставлен режим доступа "Редактор" и нажимаем "Отправить"
   ![image](screenshots/table/3editor.png)

### Создание проекта в Google Apps Script
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

### Настройка MacroDroid

1. Установить MacroDroid из Play Store
    ![image](screenshots/macrodroid/1macrodroid.jpg)
2. Качаем [макрос для SMS](sms_spreadsheet_macro.json)
3. Открываем макрос, нажимаем "HTTP-запрос (POST)" -> "Настроить"
4. Вставляем ссылку, скопированную ранее
   ![image](screenshots/macrodroid/3url.png)
5. Меняем цифры в "acc" на последние 4 цифры номера счёта и цифры в "card" на последние 4 цифры карты
   ![image](screenshots/macrodroid/4body.png)
6. Качаем [макрос для PUSH-уведомлений](push_spreadsheet_macro.json)
7. Открываем макрос, нажимаем "Получено уведомление" -> "Настроить"
8. Нажимаем "Получено уведомление" -> "OK"
9. Нажимаем "Выбрать приложение(я)" -> "ОК"
10. Выбираем нужное(ые) приложение(я) -> "ОК" -> "ОК"
11. Нажимаем "HTTP-запрос (POST)" -> "Настроить"
12. Вставляем ссылку, скопированную ранее
    ![image](screenshots/macrodroid/3url.png)
13. Меняем цифры в "acc" на последние 4 цифры номера счёта и цифры в "card" на последние 4 цифры карты
    ![image](screenshots/macrodroid/4body.png)
