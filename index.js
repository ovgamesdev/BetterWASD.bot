let storageType = 'sync';

let settings = Helper.getDefaultSettings();


const BetterStreamChat = {
  settingsDiv: null,
  async init() {
    //<editor-fold desc="changelog">
    let changelogLabels = {
      added: '<span class="label" style="color: var(--wasd-color-text-prime);background: none;font-weight: 600;">Добавлено</span>',
      optimized: '<span class="label" style="color: var(--wasd-color-text-prime);background: none;font-weight: 600;">Оптимизировано</span>',
      changed: '<span class="label" style="color: var(--wasd-color-text-prime);background: none;font-weight: 600;">Изменено</span>',
      fixed: '<span class="label" style="color: var(--wasd-color-text-prime);background: none;font-weight: 600;">Исправлено</span>',
      removed: '<span class="label" style="color: var(--wasd-color-text-prime);background: none;font-weight: 600;">Удалено</span>'
    };
    let changelogList = [{
            version: '1.0.7',
            date: '2021-11-30',
            items: [{
                text: [
                    `Переменная timer(time)`,
                    `Переменная uptime()`,
                    `Защита чата - Защита от заглавных букв`,
                    `Защита чата - Защита от длинных сообщений`,
                ],
                label: 'added'
            }, {
                text: [
                    `Таймеры бота`
                ],
                label: 'changed'
            }]
        },{
            version: '1.0.6',
            date: '2021-11-20',
            items: [{
                text: [
                    `События - Бот подключился к каналу`
                ],
                label: 'added'
            },{
                text: [
                    `Переменная randomVar()`
                ],
                label: 'changed'
            }]
        },{
            version: '1.0.5',
            date: '2021-07-19',
            items: [{
                text: [
                    `Изменить для "Пользовательские команды" и "Таймеры бота"`
                ],
                label: 'added'
            }]
        },{
            version: '1.0.4',
            date: '2021-07-19',
            items: [{
                text: [
                    `Команды чата - timeout`
                ],
                label: 'added'
            }]
        },{
            version: '1.0.3.1',
            date: '2021-07-17',
            items: [{
                text: [
                    `Переменная user()`
                ],
                label: 'added'
            }]
        },{
            version: '1.0.3',
            date: '2021-07-17',
            items: [{
                text: [
                    `Переменные`
                ],
                label: 'added'
            },{
                text: [
                    `Пользовательские команды`,
                    `Таймер бота`
                ],
                label: 'changed'
            }]
        },{
            version: '1.0.2',
            date: '2021-07-16',
            items: [{
                text: [
                    `Пользовательские команды`,
                    `Таймер бота`
                ],
                label: 'added'
            }]
        },{
            version: '1.0.1',
            date: '2021-07-13',
            items: [{
                text: [
                    `Основные ошибки`
                ],
                label: 'fixed'
            }]
        },{
            version: '1.0.0',
            date: '2021-07-12',
            items: [{
                text: [
                    'Первый выпуск'
                ],
                label: 'added'
            }]
        }
    ];
    //</editor-fold>
    let changelogHtml = '';
    for (let changelog of changelogList) {
      changelogHtml += `<h2 style="color: var(--wasd-color-text-prime);">Version ${changelog.version} (${changelog.date})</h2><ul style="display: grid;padding-inline-start: 4px;margin: 5px 0;">`;

      for (let item of changelog.items) {
        if (item.label) {
          let labelHtml = '';
          let labels = item.label.split(' ');

          for (let label of labels) {
            changelogHtml += changelogLabels[label];
          }

          for (let text of item.text) {
            changelogHtml += `<span class="textlabel">• ${text}</span>`;
          }                    
        }

        if (item.issueID) {
          item.text += ` (<a target="_blank" href="https://github.com/ovgamesdev/WASD_TV/issues/${item.issueID}">#${item.issueID}</a>)`;
        }
      }
      changelogHtml += '</ul>';
    }

    //<editor-fold desc="settings div">
    let settingsDiv = document.createElement('div');
    this.settingsDiv = settingsDiv;
    settingsDiv.id = 'bscSettingsPanel';
    settingsDiv.innerHTML = `<div id="status">
      <p>
      </p>
      </div>
      <header>
        <div class="logo">
          <img src="${chrome.runtime.getURL("img/icon128.png")}" style="width: 32px; height: 32px;">
          <div style="padding-left: 10px; font-size: 18px; width: 140px;">BetterWASD.bot</div>
        </div>

        <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-valid ng-dirty ng-touched" id="settingsSearchDiv">
          <div ovg="" class="wasd-input-wrapper">
            <div ovg="" class="wasd-input">
              <input ovg="" id="settingsSearch" class="has-button ng-pristine ng-untouched ng-valid ui-autocomplete-input" placeholder="Поиск настроек" type="text" autocomplete="off" style="margin: 0;">
              <button ovg="" type="button" class="button-icon" style="top: 4px;">
                <i ovg="" class="wasd-icons-close"></i>
              </button>
            </div>
          </div>
        </wasd-input>

        <div style="width: 100%"></div>
      </header>

      <section class="ovg-tabs-wrapper vertical left">
        <div class="tabs">
          <div class="items" style="padding: 10px 0">
            <a role="tab" class="item" data-tab="about">О нас</a>
            <div>
              <a role="pod-tab" class="item disabled">Защита чата от</a>
              <a role="tab" class="sub-item" data-tab="protectionCaps">заглавных букв</a>
              <a role="tab" class="sub-item" data-tab="protectionSymbol">длинных сообщений</a>
            </div>
            <a role="tab" class="item active" data-tab="bot">Команды чата</a>
            <a role="tab" class="item" data-tab="cmdbot">Пользовательские команды</a>
            <a role="tab" class="item" data-tab="timeoutbot">Таймеры бота</a>
            <a role="tab" class="item" data-tab="variables">Переменные</a>
            <a role="tab" class="item" data-tab="changelog">Журнал изменений</a>
            <a role="window" class="item" data-tab="backup">Бэкап</a>
          </div>
        </div>
      </section>

      <main class="text" data-tab="about" style="background-color: var(--wasd-color-bg-prime);">
        <div class="aboutHalf">
          <img class="aboutIcon" src="${chrome.runtime.getURL("img/icon128.png")}">
          <h1>BetterWASD.bot v${changelogList[0].version}</h1>
          <h2>от ваших друзей в <a href="https://ovgamesdev.github.io/ru/" target="_blank">OvGames</a></h2>
          <br>
        </div>
        <div class="aboutHalf">
          <h1 style="margin-top: 100px;">Думаете, этот аддон классный?</h1>
          <br><br><h2>
          Напишите отзыв на <a target="_blank" href="https://chrome.google.com/webstore/detail/fdgepfaignbakmmbiafocfjcnaejgldb">Chrome Webstore</a>
          </h2><br>
        </div>
      </main>
      
      <main class="" id="protectionCaps" data-tab="protectionCaps">
      
        <!--p> Настройки защиты от заглавных букв </p-->
        ${HelperSettings.build('protectionCaps')}

      </main>
      <main class="" id="protectionSymbol" data-tab="protectionSymbol">

        <!--p> Настройки защиты от длинных сообщений </p-->
        ${HelperSettings.build('protectionSymbol')}

      </main>

      <main class="active" id="bot" data-tab="bot">
        <div class="help">
          <p style="margin: 10px 0px 5px 10px;">Обратите внимание что...</p>
          <ul type="square" style="padding: 0 20px 15px 20px;">
            <li style="list-style: inside;"> Бот отвечает от вашего имени </li>
            <li style="list-style: inside; padding-top: 10px;"> Слова, заключенные в фигурные скобки, символы "{" и "}" указывают на обязательное значение, например: USERNAME потребует имя пользователя (например, "Justin"). </li>
            <li style="list-style: inside; padding-top: 10px;"> Слово, заключенное в квадратные скобки "[" и "]", указывает на необязательное значение, например: SECONDS можно не указывать или заменить числом секунд (например, 10). </li>
            <li style="list-style: inside; padding-top: 10px;"> Сами символы ([,], {и}) не должны включаться в текстовое поле при вводе вашей команды. </li>
          </ul>
        </div>

        ${HelperSettings.build('bot')}
      </main>

      <main class="text" data-tab="cmdbot">
        <div style="display: flex;justify-content: space-between;">
          <h1 style="padding-left: 10px;"> Пользовательские команды </h1>
          <ovg-button class="flat-btn ovg">
            <button id="showFormCmdbotBtn" class="primary medium ovg"> Добавить команду </button>
          </ovg-button>
        </div>


        <div class="cmdbot form-bg" style="display: none;">
          <div class="form">

            <div class="container">
              <h3 style="margin: 0 0 10px 0;"> Добавить команду </h3>
              <div class="row">
                <div class="col-25">
                  <label for="fname"> Префикс </label>
                </div>
                <div class="col-75">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input id="userCmdPrefix" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Префикс" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row">
                <div class="col-25">
                  <label for="subject"> Команда </label>
                </div>
                <div class="col-75">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input id="userCmdCmd" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Команда" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row">
                <div class="col-25">
                  <label  for="fname"> Ответ </label>
                </div>
                <div class="col-75">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <textarea id="userCmdResult" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Ответ на команду. (Поддерживает переменные)" type="text" autocomplete="off" style="height:100px;resize:none;"></textarea>
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row">
                <div class="col-25">
                  <label for="fname"> Привилегия </label>
                </div>
                <div class="col-75">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <select id="userCmdPrivilege">
                          <option value="0" > Модератор </option>
                          <option value="1" > Подписчик </option>
                          <option value="2" selected > Каждый </option>
                        </select>
                      </div>
                    </div>
                   </wasd-input>

                  <!--select id="userCmdPrivilege">
                    <option value="0" > Модератор </option>
                    <option value="1" > Подписчик </option>
                    <option value="2" selected > Каждый </option>
                  </select-->

                </div>
              </div>
              <br>
              <div class="row footer">
                <ovg-button class="flat-btn ovg" style="display: flex;">
                  <button id="hideFormCmdBtn" class="medium ovg warning"> отмена </button>
                  <button id="addCmdBtn" class="primary medium ovg updateUser"> сохранить </button>
                </ovg-button>
              </div>
              </form>
            </div>

          </div>
        </div>

        <table class="table-ovg">

          <thead class="thead-ovg">
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Префикс</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Команда</div>
            </th>
            <!--th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Атрибут</div>
            </th-->
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Ответ</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Привилегия</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Действия</div>
            </th>
          </thead>

          <tbody class="usercmds ovg-items">
          </tbody>
        </table>
      </main>

      <main class="text" data-tab="timeoutbot">
        <div style="display: flex;justify-content: space-between;">
          <h1 style="padding-left: 10px;"> Таймеры бота </h1>
          <ovg-button class="flat-btn ovg">
            <button id="showFormTimeoutBtn" class="primary medium ovg"> Добавить таймер </button>
          </ovg-button>
        </div>

        <div class="timer form-bg" style="display: none;">
          <div class="form">

            <div class="container">
              <h3 style="margin: 0 0 10px 0;"> Добавить таймер </h3>
              <div class="row">
                <div class="col-25">
                  <label for="fname"> Имя </label>
                </div>
                <div class="col-75">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input id="timeoutName" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Имя" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row">
                <div class="col-25">
                  <label for="subject"> Сообщение </label>
                </div>
                <div class="col-75">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <textarea id="timeoutMessage" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Сообщение (Поддерживает переменные)" type="text" autocomplete="off" style="height:100px;resize:none;"></textarea>
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row">
                <div class="col-25">
                  <label for="fname"> Интервал ${Helper.tooltip('', 'Значение в секундах')} </label>
                </div>
                <div class="col-75">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input id="timeoutInterval" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="interval" type="number" value="300" min="5" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row">
                <div class="col-25">
                  <label for="fname"> Минимум линии ${Helper.tooltip('', 'Минимальное количество строк чата за последние 5 минут, необходимое для активации таймера')} </label>
                </div>
                <div class="col-75">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input id="timeoutMinMessages" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="minMessages" type="number" value="5" min="1" max="1000" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <br>
              <div class="row footer">
                <ovg-button class="flat-btn ovg" style="display: flex;">
                  <button id="hideFormTimeoutBtn" class="medium ovg warning"> отмена </button>
                  <button id="addTimeoutBtn" class="primary medium ovg updateUser"> сохранить </button>
                </ovg-button>
              </div>
              </form>
            </div>

          </div>
        </div>
        
        <table class="table-ovg">

          <thead class="thead-ovg">
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Имя</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Сообщение</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Интервал ${Helper.tooltip('', 'Значение в секундах')}</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Минимум линии</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Действия</div>
            </th>
          </thead>

          <tbody class="usercmdstimeout ovg-items">
          </tbody>
        </table>
      </main>

      <main class="text" data-tab="variables">
        <h1 style="padding-left: 10px; padding-right: 10px;"> Переменные команд </h1>
        <table class="table-ovg">

          <thead class="thead-ovg">
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Переменная</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Описание</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Пример</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Результат</div>
            </th>
          </thead>
            <tr class="table-menu__block" style="justify-content: space-between;">
              <td><div><p> randomInt(0,100) </p></div></td>
              <td><div><p> Отображает случайное число от 1 до 100 </p></div></td>
              <td><div><p> randomInt(50,80) </p></div></td>
              <td><div><p> 62 </p></div></td>
            </tr>
            <tr class="table-menu__block" style="justify-content: space-between;">
              <td><div><p> randomUser() </p></div></td>
              <td><div><p> Отображает имя случайного пользователя, просматривающего канал в данный момент </p></div></td>
              <td><div><p> randomUser() </p></div></td>
              <td><div><p> @OvGames </p></div></td>
            </tr>
            <tr class="table-menu__block" style="justify-content: space-between;">
              <td><div><p> randomVar(...arg) </p></div></td>
              <td><div><p> Отображает случайный аргумент, отправленный в скобках через знак " &" </p></div></td>
              <td><div><p> randomVar(1&ку&3 банан&56 - 1&кто) </p></div></td>
              <td><div><p> 56 - 1 </p></div></td>
            </tr>
            <tr class="table-menu__block" style="justify-content: space-between;">
              <td><div><p> user() </p></div></td>
              <td><div><p> Отображает имя пользователя, который вызвал команду </p></div></td>
              <td><div><p> user() </p></div></td>
              <td><div><p> @OvGames </p></div></td>
            </tr>
            <tr class="table-menu__block" style="justify-content: space-between;">
              <td><div><p> timer(${Helper.tooltip('time', 'время в формате "YYYY-MM-DDThh:mm:ss" <br> (символ T используется для разделения даты и времени)')}) </p></div></td>
              <td><div><p> Отображает (сколько прошло)/(сколько осталось) времени </p></div></td>
              <td><div><p> timer(2021-11-23T03:00:00) </p></div></td>
              <td><div><p> ${Helper.tooltip('через 30 минут', 'если сейчас <br> 2021-11-23T03:30:00')} </p></div></td>
            </tr>
            <tr class="table-menu__block" style="justify-content: space-between;">
              <td><div><p> uptime() </p></div></td>
              <td><div><p> Отображает сколько идет стрим </p></div></td>
              <td><div><p> uptime() </p></div></td>
              <td><div><p> 01:19:33 </p></div></td>
            </tr>
          <tbody class="ovg-items">
          </tbody>
        </table>
      </main>

      <!--main class="text" data-tab="backup">

        <input id="importInput" type="file" accept=".backup" style="display: none;">
        <span> Эта функция позволяет вам сохранить и восстановить ваши настройки BetterWASD.bot </span>
        <div style="padding-top: 10px;">
          <div class="ovg-button-div">
            <button class="primary medium ovg backup-download">
              <span class="primary medium ovg-button-span">
                <img style="width: 20px; height: 20px;" src="${chrome.runtime.getURL("img/download.png")}">
              </span>
              <span> Сохранить </span>
            </button>
          </div>

          <div class="ovg-button-div">
            <button class="primary medium ovg backup-upload">
              <span class="primary medium ovg-button-span">
                <img style="width: 20px; height: 20px;" src="${chrome.runtime.getURL("img/upload.png")}">
              </span>
              <span> Восстановить </span>
            </button>
          </div>
        </div>
      </main-->

      <main class="text" data-tab="changelog">
        <h1>Журнал изменений</h1>
        <h4 style="margin-top:10px;padding-left: 10px;padding-right: 0px;margin-bottom: 0px;"> Информацию о будущих версиях можно найти <a href="https://wasd.tv/ovgames/posts" target="_blank">тут</a></h4>
        ${changelogHtml}
      </main>

      <footer>
        <span>BetterWASD.bot ${changelogList[0].version} (${changelogList[0].date})</span>
        <span> Offered by <a href="https://ovgamesdev.github.io/ru/" target="_blank">OvGames</a> | <a href="https://wasd.tv/ovgames" target="_blank">WASD</a> 
      </span>`;
    document.body.append(settingsDiv);

    settingsDiv.querySelector('[data-tab="backup"').addEventListener('click', () => window.open(chrome.runtime.getURL("backup.html")))

    // to def
    for (let option of settingsDiv.querySelectorAll('.optionField.def')) {
      option.addEventListener('click', (event) => {
        let split = event.target.dataset.name.split('_');
        switch (event.target.getAttribute('option-type')) {
          // case 'boolean':
          //     event.target.parentElement.querySelector(`input[id=boolean_${event.target.getAttribute('data-name')}]`).checked = Helper.getDefaultSettings()[split[0]][split[1]]
          //     HelperSettings.save([event.target.parentElement.querySelector('input[type="checkbox"]')])
          //     break;
          // case 'text':
          //     event.target.parentElement.querySelector('input[type="text"]').value = Helper.getDefaultSettings()[split[0]][split[1]]
          //     HelperSettings.save([event.target.parentElement.querySelector('input[type="text"]')])
          //     break;
          case 'number':
            event.target.parentElement.querySelector('input[type="number"]').value = Helper.getDefaultSettings()[split[0]][split[1]]
            event.target.parentElement.querySelector('input[type="number"]').dispatchEvent(new Event('change'));
            break;
          case 'select':
            event.target.parentElement.querySelector('select').value = Helper.getDefaultSettings()[split[0]][split[1]]
            event.target.parentElement.querySelector('select').dispatchEvent(new Event('change'));
            break;
          case 'color':
            let defVal = Helper.varColorToColor(Helper.getDefaultSettings()[split[0]][split[1]])
            event.target.parentElement.querySelector('input[data-coloris]').value = defVal
            event.target.parentElement.style.color = defVal
            event.target.parentElement.querySelector('input[data-coloris]').dispatchEvent(new Event('change'));
            break;
          case 'botevent':
            console.log(event.target)
            event.target.parentElement.querySelector('input[type="text"]').value = Helper.getDefaultSettings()[split[0]][split[1]][0]
            event.target.parentElement.querySelector('input[type="text"]').dispatchEvent(new Event('change'));
            break;
          default:
            console.log('def')
            break;
        }
      });
    }

    for (let option of settingsDiv.querySelectorAll('.optionField')) {
      option.addEventListener('contextmenu', (event) => {
        let split = event.target.dataset.name.split('_');
        switch (event.target.getAttribute('option-type')) {
          // case 'boolean':
          //     event.target.parentElement.querySelector(`input[id=boolean_${event.target.getAttribute('data-name')}]`).checked = Helper.getDefaultSettings()[split[0]][split[1]]
          //     HelperSettings.save([event.target.parentElement.querySelector('input[type="checkbox"]')])
          //     break;
          // case 'text':
          //     event.target.parentElement.querySelector('input[type="text"]').value = Helper.getDefaultSettings()[split[0]][split[1]]
          //     HelperSettings.save([event.target.parentElement.querySelector('input[type="text"]')])
          //     break;
          case 'number':
            event.target.parentElement.querySelector('input[type="number"]').value = Helper.getDefaultSettings()[split[0]][split[1]]
            event.target.parentElement.querySelector('input[type="number"]').dispatchEvent(new Event('change'));
            break;
          case 'select':
            event.target.parentElement.querySelector('select').value = Helper.getDefaultSettings()[split[0]][split[1]]
            event.target.parentElement.querySelector('select').dispatchEvent(new Event('change'));
            break;
          case 'color':
            let defVal = Helper.varColorToColor(Helper.getDefaultSettings()[split[0]][split[1]])
            event.target.parentElement.querySelector('input[data-coloris]').value = defVal
            event.target.parentElement.style.color = defVal
            event.target.parentElement.querySelector('input[data-coloris]').dispatchEvent(new Event('change'));
            break;
          case 'botevent':
            console.log(event.target)
            event.target.parentElement.querySelector('input[type="text"]').value = Helper.getDefaultSettings()[split[0]][split[1]][0]
            event.target.parentElement.querySelector('input[type="text"]').dispatchEvent(new Event('change'));
            break;
          default:
            console.log('def', event.target.getAttribute('option-type'), event.target)
            break;
        }
        event.preventDefault();
      });
    }

    // bind search emoji
    var filter1, ul1, options1, title1, titleline1, i1;
    settingsSearch.addEventListener('input', () => {
      filter1 = settingsSearch.value.toUpperCase();
      ul1 = document.querySelector("main[data-tab='bot']");
      options1 = ul1.querySelectorAll("div.option");
      for (i1 = 0; i1 < options1.length; i1++) {
        title1 = options1[i1].querySelector("span.title");
        if (title1) {
          if (title1.innerHTML.toUpperCase().indexOf(filter1) > -1) {
            options1[i1].style.display = "";
          } else {
            options1[i1].style.display = "none";
          }
        }

        titleline1 = options1[i1].querySelector("span.titleline");
        if (titleline1) {
          if (filter1 == '') {
            options1[i1].style.display = "";
            settingsDiv.querySelector('[id="bot"] .help').style.display = "";
          } else {
            options1[i1].style.display = "none";
            settingsDiv.querySelector('[id="bot"] .help').style.display = "none";
          }
        }
      }
    });

    // navigation
    for (let navItem of settingsDiv.querySelectorAll('section .items a[role="tab"]')) {
      navItem.addEventListener('click', ({ target }) => {
        let links = settingsDiv.querySelectorAll('section .items a');
        let tabs = settingsDiv.querySelectorAll('main');
        for (let element of [...tabs, ...links]) {
          element.classList.remove('active');
        }

        if (target.getAttribute('data-tab') == 'bot') {
          settingsSearchDiv.classList.remove('hidden')
        } else {
          settingsSearchDiv.classList.add('hidden')
        }

        target.classList.add('active');
        settingsDiv.querySelector(`main[data-tab="${target.dataset.tab}"]`).classList.add('active');
      });
    }

    // change event
    for (let option of settingsDiv.querySelectorAll('.optionField')) {
      option.addEventListener('change', (event) => {
        HelperSettings.save([event.target]);
      });
    }

    for (let cmd in settings.bot.usercmds) {
      Helper.addUserCmd(settings.bot.usercmds[cmd])
    }

    for (let cmd in settings.bot.usercmdstimeout) {
      Helper.addUserTimeout(settings.bot.usercmdstimeout[cmd])
    }

    addCmdBtn.addEventListener('click', () => {
      let prefix = userCmdPrefix.value.trim()
      let cmd = userCmdCmd.value.trim()
      // let attributes = userCmdAtributes.value.trim()
      let result = userCmdResult.value.trim()
      let privilege = userCmdPrivilege.selectedIndex

      let value = {prefix: prefix, cmd: cmd, attributes: '', result: result, privilege: privilege, enabled: true}

      if (Helper.tryAddUserCmd(value) == 'err') return

      document.querySelector('.cmdbot.form-bg').style.display = 'none'
    })

    addTimeoutBtn.addEventListener('click', () => {
      let name = timeoutName.value.trim()
      let message = timeoutMessage.value.trim()
      let interval = Number(timeoutInterval.value)
      let minMessages = Number(timeoutMinMessages.value)

      let value = {name: name, message: message, interval: interval, minMessages: minMessages, enabled: true}

      if (Helper.tryAddUserTimeout(value) == 'err') return

      document.querySelector('.timer.form-bg').style.display = 'none'
    })

    hideFormTimeoutBtn.addEventListener('click', () => {
      document.querySelector('.timer.form-bg').style.display = 'none'
    })
    hideFormCmdBtn.addEventListener('click', () => {
      document.querySelector('.cmdbot.form-bg').style.display = 'none'
    })

    showFormTimeoutBtn.addEventListener('click', () => {
      timeoutName.value = ''
      timeoutMessage.value = ''
      timeoutInterval.value = 300
      timeoutMinMessages.value = 5

      document.querySelector('.timer.form-bg').style.display = 'block'

      document.querySelector('.timer.form-bg .container h3').textContent = ' Добавить таймер '
    })
    document.querySelector('.timer.form-bg').addEventListener('click', (e) => {
      if (e.target.className == 'timer form-bg') document.querySelector('.timer.form-bg').style.display = 'none'
    })

    showFormCmdbotBtn.addEventListener('click', () => {
      userCmdPrefix.value = ''
      userCmdCmd.value = ''
      userCmdResult.value = ''
      userCmdPrivilege.selectedIndex = 2

      document.querySelector('.cmdbot.form-bg').style.display = 'block'

      document.querySelector('.cmdbot.form-bg .container h3').textContent = ' Добавить команду '
    })
    document.querySelector('.cmdbot.form-bg').addEventListener('click', (e) => {
      if (e.target.className == 'cmdbot form-bg') document.querySelector('.cmdbot.form-bg').style.display = 'none'
    })
    

    var tooltips = settingsDiv.querySelectorAll(".tooltip-wrapper");
    for (let tooltip of tooltips) {
      $( tooltip ).tooltip({
        classes: { "ui-tooltip": "ui-ovg-tooltip" },
        content: tooltip.title,
        show: false,
        hide: false,
        position: {
          my: "center bottom",
          at: "center top-5",
          within: $('#bscSettingsPanel')
        }
      });
    }

  },
};

let initialize = async () => {
  try {
    settings = await Helper.getSettings();
    if (typeof settings === 'undefined') {
      settings = Helper.getDefaultSettings();
    }
    console.log('settings =', settings)
  } catch (e) {
    console.log('catch', e);
  }
  BetterStreamChat.init()
  HelperSettings.loaded()
}

initialize();





/* to new settings */

let toNewSettings = async () => {
  try {
    settings = await Helper.getSettings();
    if (typeof settings === 'undefined') {
      settings = Helper.getDefaultSettings();
    } else if (settings.bot.cmdBan[1] != undefined) {
      chrome.storage[storageType].set(getUpdateSettings(), () => {
        location.reload()
      })
    }
  } catch (e) {
    console.log('catch toNewSettings', e);
  }
};

toNewSettings()

const getUpdateSettings = () => {
  return {
    bot: {
      cmdPrefixBotMod: settings.bot.cmdPrefixBotMod[1],
      cmdBan: settings.bot.cmdBan[1],
      cmdMod: settings.bot.cmdMod[1],
      cmdRaid: settings.bot.cmdRaid[1],
      cmdTitle: settings.bot.cmdTitle[1],
      cmdGame: settings.bot.cmdGame[1],
      cmdFollowers: settings.bot.cmdFollowers[1],
      cmdSubscribers: settings.bot.cmdSubscribers[1],
      cmdTimeout: settings.bot.cmdTimeout[1],

      cmdPrefixBotUser: settings.bot.cmdPrefixBotUser[1],
      cmdUptime: settings.bot.cmdUptime[1],
      cmdUserTitle: settings.bot.cmdUserTitle[1],
      cmdUserGame: settings.bot.cmdUserGame[1],

      eventFollow: settings.bot.eventFollow[1],
      eventSub: settings.bot.eventSub[1],
      eventInit: ['Bot inited', true],
      
      usercmds: settings.bot.usercmds.replace(/(randomVar\(([^)]+[^ ]))/ig, (match) => { return match.replace(/,/ig, '&') }),
      usercmdstimeout: settings.bot.usercmdstimeout.replace(/(randomVar\(([^)]+[^ ]))/ig, (match) => { return match.replace(/,/ig, '&') }),

      protectionCaps: {
        autoPermit: '0',
        punishment: '0',
        sendPunishmentMessage: ['{user_login} Пожалуйста, воздержитесь от заглавных букв.', true],
        minCaps: 5,
        maxCaps: 50,
        percentCaps: 50
      },
      protectionSymbol: {
        autoPermit: '0',
        punishment: '0',
        sendPunishmentMessage: ['{user_login} -> Пожалуйста, воздержитесь от отправки длинных сообщений.', true],
        maxLength: 140
      },
      
    }
  };
}