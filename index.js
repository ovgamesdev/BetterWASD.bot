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
            date: '2021-12-17',
            items: [{
                text: [
                    `Переменная timer(time)`,
                    `Переменная uptime()`,
                    `Защита чата - Защита от заглавных букв`,
                    `Защита чата - Защита от длинных сообщений`,
                    `Журнал`,
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
    for (let changelog of changelogList.slice(0, 5)) {
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
    settingsDiv.innerHTML = `
      <div id="status">
        <p>
        </p>
      </div>
      <header>

        <div class="header__left-side">
          <div ovg="" class="burger-menu__wrap mobile" style="width: 1.6rem;padding-left: 6px;"><div ovg="" class="burger-toggle show-section-mobile"><div ovg="" class="burger-toggle__icon icon-default"><i ovg="" class="wasd-icons-menu-burger"></i></div><div ovg="" class="burger-toggle__icon icon-active"><i ovg="" class="wasd-icons-close"></i></div></div></div>

          <div ovg="" class="header-new__nav-sidebar-toggle nav-sidebar-toggle open-nav-sidebar">
            <i ovg="" class="wasd-icons-sidebar-burgermenu-closed nav-sidebar-toggle__icon-default"></i>
            <i ovg="" class="wasd-icons-sidebar-burgermenu-opened nav-sidebar-toggle__icon-active"></i>
          </div>

          <a class="logo">
            <img alt="BetterWASD.BOT" src="${chrome.runtime.getURL("img/Wasd_Better_color_logo_dark.png")}">
            <div class="logo__mob" tabindex="0"></div>
          </a>

          <wasd-input class="ng-valid ng-dirty ng-touched notfocused" id="settingsSearchDiv">
            <div ovg="" class="wasd-input-wrapper">
              <div ovg="" class="wasd-input">
                <input ovg="" id="settingsSearch" class="has-button ng-pristine ng-untouched ng-valid ui-autocomplete-input" placeholder="Поиск настроек" type="text" autocomplete="off" style="margin: 0;">
                <button ovg="" type="button" class="button-icon">
                  <i ovg="" class="wasd-icons-search"></i>
                </button>
              </div>
            </div>
          </wasd-input>

          <div class="header__search-btn" tabindex="0" style="display: none">
            <i class="wasd-icons-search"></i>
          </div>


        </div>

        <div class="header__right-side">
        </div>

      </header>

      <section class="ovg-tabs-wrapper vertical left" style="display: none;">
        <div class="tabs">
          <div class="items" style="padding: 10px 0">
            <a role="tab" class="item" data-tab="about">О нас</a>
            <a role="tab" class="item active" data-tab="protection">Защита от спама</a>
            <a role="tab" class="item active" data-tab="bot">Команды чата</a>
            <a role="tab" class="item" data-tab="cmdbot">Пользовательские команды</a>
            <!--a role="tab" class="item" data-tab="giveaway">Подарки</a-->
            <a role="tab" class="item" data-tab="log">Журнал</a>
            <a role="tab" class="item" data-tab="timeoutbot">Таймеры бота</a>
            <a role="tab" class="item" data-tab="variables">Переменные</a>
            <a role="tab" class="item" data-tab="changelog">Журнал изменений</a>
            <a role="window" class="item" data-tab="backup">Бэкап</a>
          </div>
        </div>
      </section>

      <wasd-nav-sidebar ovg="" style="z-index:5">
        <div ovg="" id="nav-sidebar" class="nav-sidebar" style="height: calc(100% - 48px);z-index: 1;float: left;z-index: 5557;overflow: hidden;">
          <ul ovg="" class="nav-sidebar__list top">
            <li ovg="">
              <a ovg="" class="nav-sidebar__link nav-sidebar__link--active" data-tab="bot">
                <i ovg="" class="ovg-icon-magic"></i>
                <span ovg="">Команды чата</span>
              </a>
            </li>
            <!--li ovg="">
              <a ovg="" class="nav-sidebar__link" data-tab="giveaway">
                <i ovg="" class="ovg-icon-giveaway"></i>
                <span ovg="">Подарки</span>
              </a>
            </li-->
            <li ovg="">
              <a ovg="" class="nav-sidebar__link" data-tab="log">
                <i ovg="" class="ovg-icon-log" style="font-size: 18px;"></i>
                <span ovg="">Журнал</span>
              </a>
            </li>
            <li ovg="">
              <a ovg="" class="nav-sidebar__link" data-tab="protection">
                <i ovg="" class="ovg-icon-filter"></i>
                <span ovg="">Защита от спама</span>
              </a>
            </li>
            <li ovg="">
              <a ovg="" class="nav-sidebar__link" data-tab="timeoutbot">
                <i ovg="" class="ovg-icon-timer"></i>
                <span ovg="">Таймеры бота</span>
              </a>
            </li>
            <li ovg="">
              <a ovg="" class="nav-sidebar__link" data-tab="variables">
                <i ovg="" class="ovg-icon-variables"></i>
                <span ovg="">Переменные</span>
              </a>
            </li>
            <li ovg="">
              <a ovg="" class="nav-sidebar__link" data-tab="changelog">
                <i ovg="" class="ovg-icon-history"></i>
                <span ovg="">Журнал изменений</span>
              </a>
            </li>
          </ul>
          <ul ovg="" class="nav-sidebar__list bottom">
            <li ovg="">
              <a ovg="" class="nav-sidebar__link" data-tab="about">
                <i ovg="" class="wasd-icons-sidebar-faq"></i>
                <span ovg="">О нас</span>
              </a>
            </li>
          </ul>
        </div>
      </wasd-nav-sidebar>

      <main class="text pod-position" data-tab="about">

        <div style="padding: 10px;">
          <span style="font-size: 21px;">Напишите отзыв на <a target="_blank" href="https://chrome.google.com/webstore/detail/fdgepfaignbakmmbiafocfjcnaejgldb">Chrome Webstore</a></span>
        </div>

        <div style="padding: 10px;">
          <span>Автор: <a href="https://ovgamesdev.github.io/ru/" target="_blank">OvGames</a> | <a href="https://wasd.tv/ovgames" target="_blank">WASD</a></span>
        </div>

        <div style="padding: 10px;">
          <h2 style="padding-bottom: 10px;">Настройки</h2>
          <div class="flat-btn ovg ovg-button-div" style="margin: 0!important;display: inline-grid;">
            <button style="margin-bottom: 6px;" class="primary medium ovg backup">
              <span class="ovg-button-span">
                <i class="wasd-icons-extract"></i>
              </span>
              <span> Резервная копия </span>
            </button>
          </div>
        </div>

        <div class="bottom" style="margin-bottom: 5px;">
          <span>Version ${changelogList[0].version} (${changelogList[0].date})</span>
        </div>

      </main>

      <main class="text" data-tab="giveaway">

        <div style="display: flex;justify-content: space-between;">
          <h1 style="padding-left: 10px;"> Подарки </h1>
        </div>

        <div style=" display: flex; width: 100%; height: 90%; ">
          <div style=" width: 33%; margin: 5px;">
            <p>0 подходящих пользователей</p>
            <div>
              <h2>Пользовательи</h2>
              <button>reset</button>
            </div>
            <div style="flex: 1; overflow-x: hidden; overflow-y: auto; padding: 12px 0; position: relative;" class="userList">

            </div>
          </div>
          <div style=" width: 33%; margin: 5px;">
            <h2>Настройка</h2>
            <p>Право на участие</p>
            <select multiple>
              <option selected> Модератор </option>
              <option selected> Платные подписчики </option>
              <option selected> Подписчики </option>
              <option selected> Пользовательи </option>
            </select>

            <p>Тип раздачи</p>
            <select id="giveaway_type">
              <option selected> activeusers </option>
              <option> keyword </option>
              <option> randomnumber </option>
            </select>

            <div class="activeusers" style="display: block">
              
            </div>

            <div class="keyword" style="display: none">
              <input id="giveaway_keyword" placeholder="keyword">
            </div>

            <div class="randomnumber" style="display: none">
              <input type="number" id="giveaway_min_number" value="0">
              <input type="number" id="giveaway_max_number" value="100">
            </div>

            <button id="giveaway_roll">Раздать</button>
          </div>
          <div style=" width: 34%; margin: 5px 0;">
            <h2>Чат</h2>
            <iframe src="https://wasd.tv/chat?channel_name=OvGames&stream_id=865795&private_link=iDbryQjrg83czW5gXG3LgcGDxLqHXeJfBPaY0fTiDws.DSnJ8AsRA-qs0SnNgeZRuFBTqi4oeC72JQRTeDyi3bc" style=" width: 257px; border: 0; height: 358px; "></iframe>
          </div>
        </div>
      </main>

      <main class="text" data-tab="log">

        <div style="display: flex;justify-content: space-between;">
          <h1> Журнал </h1>
        </div>

        <table class="table-ovg">

          <thead class="thead-ovg">
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Тип</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Дата</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Отображаемое имя</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Сообщение</div>
            </th>
          </thead>

          <tbody class="logs ovg-items">
          </tbody>
        </table>
      </main>

      <main class="" data-tab="protection">
        <div class="links_to">

          <div class="option link_to" data-tab="protectionCaps">
            <div class="ovg-option">
              <div class="option-line">
                <div class="labelField">
                  <span class="title"> Защита от заглавных букв </span>
                </div>
                <div class="formField">
              <ol class="flexibleButtonGroup optionTypeBoolean">
                <label class="switch-ovg">
                  <input option-type="boolean" type="checkbox" id="boolean_protectionCaps_status" name="boolean_protectionCaps_status" value="0" class="optionField" data-name="protectionCaps_status" ${settings.protectionCaps.status ? 'checked' : ''}>
                  <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
                </label>
              </ol></div>
              </div>
            </div>
          </div>

          <div class="option link_to" data-tab="protectionSymbol" >
            <div class="ovg-option">
              <div class="option-line">
                <div class="labelField">
                  <span class="title"> Защита от длинных сообщений </span>
                </div>
                <div class="formField">
              <ol class="flexibleButtonGroup optionTypeBoolean">
                <label class="switch-ovg">
                  <input option-type="boolean" type="checkbox" id="boolean_protectionSymbol_status" name="boolean_protectionSymbol_status" value="0" class="optionField" data-name="protectionSymbol_status" ${settings.protectionSymbol.status ? 'checked' : ''}>
                  <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
                </label>
              </ol></div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <main class="" id="protectionCaps" data-tab="protectionCaps">
        <ovg-button class="flat-btn links_to ovg">
          <button style="margin: 10px 0 5px 10px;" data-tab="protection" class="link_to ovg basic show small"> назад </button>
        </ovg-button>

        <!--p> Настройки защиты от заглавных букв </p-->
        ${HelperSettings.build('protectionCaps')}

      </main>
      <main class="" id="protectionSymbol" data-tab="protectionSymbol">
        <ovg-button class="flat-btn links_to ovg">
          <button style="margin: 10px 0 5px 10px;" data-tab="protection" class="link_to ovg basic show small"> назад </button>
        </ovg-button>

        <!--p> Настройки защиты от длинных сообщений </p-->
        ${HelperSettings.build('protectionSymbol')}

      </main>

      <main class="active" id="bot" data-tab="bot">

        <ovg-button class="flat-btn links_to ovg" style="padding: 10px 0 5px 10px; display: flex;">
          <button data-tab="bot" class="link_to ovg primary show small"> Команды </button>
          <button data-tab="cmdbot" class="link_to ovg basic show small" style="margin-left: 5px;"> Пользовательские команды </button>
        </ovg-button>
        
        <div style="display: flex;justify-content: space-between;">
          <h1 style="padding-left: 10px;"> Команды </h1>
          <ovg-button class="flat-btn ovg" style=" padding-right: 10px; ">
            <button class="infobot medium-cube ovg basic show"> <i _ngcontent-boj-c248="" class="wasd-icons-notice"></i> </button>
          </ovg-button>
        </div>

        ${HelperSettings.build('bot')}
      </main>

      <main class="text" data-tab="cmdbot">
      
        <ovg-button class="flat-btn links_to ovg" style="padding-bottom: 5px; display: flex;">
          <button data-tab="bot" class="link_to ovg basic show small"> Команды </button>
          <button data-tab="cmdbot" class="link_to ovg primary show small" style="margin-left: 5px;"> Пользовательские команды </button>
        </ovg-button>

        <div style="display: flex;justify-content: space-between;">
          <h1> Пользовательские команды </h1>
          <ovg-button class="flat-btn ovg">
            <button id="showFormCmdbotBtn" class="primary medium ovg"> Добавить команду </button>
          </ovg-button>
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
          <h1> Таймеры бота </h1>
          <ovg-button class="flat-btn ovg">
            <button id="showFormTimeoutBtn" class="primary medium ovg"> Добавить таймер </button>
          </ovg-button>
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
        <h1> Переменные команд </h1>
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

      <div class="cmdbot form-bg">
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

      <div class="timer form-bg">
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

      <div class="infobot form-bg">
        <div class="form">

          <div class="container">
            <h3 style="margin: 0 0 10px 0;"> Обратите внимание что... </h3>
            <ul type="square" style="padding: 0;">
              <li style="list-style: inside;"> Бот отвечает от вашего имени </li>
              <li style="list-style: inside; padding-top: 10px;"> Слова, заключенные в фигурные скобки, символы "{" и "}" указывают на обязательное значение, например: USERNAME потребует имя пользователя (например, "Justin"). </li>
              <li style="list-style: inside; padding-top: 10px;"> Слово, заключенное в квадратные скобки "[" и "]", указывает на необязательное значение, например: SECONDS можно не указывать или заменить числом секунд (например, 10). </li>
              <li style="list-style: inside; padding-top: 10px;"> Сами символы ([,], {и}) не должны включаться в текстовое поле при вводе вашей команды. </li>
            </ul>
            <br>
            <div class="row footer">
              <ovg-button class="flat-btn ovg" style="display: flex;">
                <button class="primary medium ovg hide"> ok </button>
              </ovg-button>
            </div>
          </div>

        </div>
      </div>

      <main class="text" data-tab="changelog">
        <h1>Журнал изменений</h1>
        <!--h4 style="margin-top:10px;padding-left: 10px;padding-right: 0px;margin-bottom: 0px;"> Информацию о будущих версиях можно найти <a href="https://wasd.tv/ovgames/posts" target="_blank">тут</a></h4-->
        ${changelogHtml}
      </main>
      `;
    document.body.append(settingsDiv);
    BetterStreamChat.changelog = changelogList[0]

    settingsDiv.querySelector('[data-tab="about"] button.backup').addEventListener('click', () => window.open(chrome.runtime.getURL("backup.html")))

    settingsDiv.querySelector('#settingsSearchDiv button').addEventListener('click', () => {
      settingsSearchDiv.classList.remove('notfocused')
      settingsSearch.dispatchEvent(new Event('input'))
      settingsSearch.focus()
    });

    settingsSearch.addEventListener('blur', () => {
      settingsSearch.value = ''
      settingsSearchDiv.classList.add('notfocused')
    });

    document.querySelector("button.infobot.show").addEventListener('click', () => {
      document.querySelector(".infobot.form-bg").classList.add('show')
    })
    document.querySelector(".infobot.form-bg .hide").addEventListener('click', () => {
      document.querySelector(".infobot.form-bg").classList.remove('show')
    })
    document.querySelector('.infobot.form-bg').addEventListener('click', (e) => {
      if (e.target.className == 'infobot form-bg show') document.querySelector(".infobot.form-bg").classList.remove('show')
    })

    let fontStyle = document.createElement('style');
    fontStyle.type = 'text/css';
    fontStyle.innerHTML = '';
    fontStyle.appendChild(document.createTextNode(`@font-face {
      font-family: 'icomoon';
      src:  url(${chrome.runtime.getURL("css/fonts/icomoon.ttf")}?ek8nz4) format('truetype'),
        url(${chrome.runtime.getURL("css/fonts/icomoon.woff")}?ek8nz4) format('woff'),
        url(${chrome.runtime.getURL("css/fonts/icomoon.svg")}?ek8nz4#icomoon) format('svg');
      font-weight: normal;
      font-style: normal;
      font-display: block;
    }`));
    document.body.append(fontStyle);

    document.querySelector('#giveaway_type').addEventListener('change', (option) => {
      document.querySelector('[data-tab="giveaway"] .keyword').style.display = 'none'
      document.querySelector('[data-tab="giveaway"] .randomnumber').style.display = 'none'
      document.querySelector('[data-tab="giveaway"] .activeusers').style.display = 'none'

      if (option.target.value == 'keyword') {
        document.querySelector('[data-tab="giveaway"] .keyword').style.display = 'block'
      } else if (option.target.value == 'randomnumber') {
        document.querySelector('[data-tab="giveaway"] .randomnumber').style.display = 'block'
      } else if (option.target.value == 'activeusers') {
        document.querySelector('[data-tab="giveaway"] .activeusers').style.display = 'block'
      }
    })

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

    // link to navigation 
    for (let link of settingsDiv.querySelectorAll('.links_to .link_to')) {
      link.addEventListener('click', ({ target }) => {

        console.log(target.classList.value)
        if (target.classList.value == 'slider-ovg' || target.classList.value == 'optionField') return

        let tabs = settingsDiv.querySelectorAll('main');
        for (let element of [...tabs]) {
          element.classList.remove('active');
        }

        if (target.getAttribute('data-tab') == 'bot') {
          settingsSearchDiv.classList.remove('hidden')
        } else {
          settingsSearchDiv.classList.add('hidden')
        }

        settingsDiv.querySelector(`main[data-tab="${target.dataset.tab}"]`).classList.add('active');

      });
    }

    // navigation old
    for (let navItem of settingsDiv.querySelectorAll('section .items > a')) {
      navItem.addEventListener('click', ({ target }) => {
        let links = settingsDiv.querySelectorAll('section .items > a');
        let tabs = settingsDiv.querySelectorAll('main');
        for (let element of [...tabs, ...links]) {
          element.classList.remove('active');
        }

        if (target.getAttribute('data-tab') == 'bot') {
          settingsSearchDiv.classList.remove('hidden')
        } else {
          settingsSearchDiv.classList.add('hidden')
        }

        if (target.getAttribute('data-tab') == 'log') {
          chrome.runtime.sendMessage({
            from: 'popup_bot',
            log: true
          })
        }

        target.classList.add('active');
        settingsDiv.querySelector(`main[data-tab="${target.dataset.tab}"]`).classList.add('active');
      });
    }

    // navigation new
    for (let navItem of settingsDiv.querySelectorAll('#nav-sidebar .nav-sidebar__link')) {
      navItem.addEventListener('click', ({ target }) => {
        let links = settingsDiv.querySelectorAll('#nav-sidebar .nav-sidebar__link');
        let tabs = settingsDiv.querySelectorAll('main');
        for (let element of [...tabs]) {
          element.classList.remove('active');
        }
        for (let element of [...links]) {
          element.classList.remove('nav-sidebar__link--active');
        }

        if (target.getAttribute('data-tab') == 'bot') {
          settingsSearchDiv.classList.remove('hidden')
        } else {
          settingsSearchDiv.classList.add('hidden')
        }

        if (target.getAttribute('data-tab') == 'log') {
          chrome.runtime.sendMessage({
            from: 'popup_bot',
            log: true
          })
        }

        target.classList.add('nav-sidebar__link--active');
        settingsDiv.querySelector(`main[data-tab="${target.dataset.tab}"]`).classList.add('active');
      });
    }

    // open nav sidebar
    settingsDiv.querySelector('wasd-nav-sidebar').addEventListener('click', () => {
      if (settingsDiv.querySelector('wasd-nav-sidebar[ovg]').classList.contains('nav-sidebar--expanded')) {
        settingsDiv.querySelector('wasd-nav-sidebar[ovg]').classList.remove('nav-sidebar--expanded')
        settingsDiv.querySelector('.open-nav-sidebar').classList.remove('nav-sidebar-toggle--active')
      }
    })
    settingsDiv.querySelector('.open-nav-sidebar').addEventListener('click', () => {
      settingsDiv.querySelector('wasd-nav-sidebar[ovg]').classList.toggle('nav-sidebar--expanded')
      settingsDiv.querySelector('.open-nav-sidebar').classList.toggle('nav-sidebar-toggle--active')
    })

    // bind search settings
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
          } else {
            options1[i1].style.display = "none";
          }
        }
      }
    });

    // change event
    for (let option of settingsDiv.querySelectorAll('.optionField')) {
      option.addEventListener('change', (event) => {
        HelperSettings.save([event.target]);
      });
    }

    for (let cmd in settings.bot.usercmds) {
      Helper.addUserCmd(settings.bot.usercmds[cmd])
    }
    Helper.setNotFoundUserCmd()

    for (let cmd in settings.bot.usercmdstimeout) {
      Helper.addUserTimeout(settings.bot.usercmdstimeout[cmd])
    }
    Helper.setNotFoundUserTimeout()

    addCmdBtn.addEventListener('click', () => {
      let prefix = userCmdPrefix.value.trim()
      let cmd = userCmdCmd.value.trim()
      // let attributes = userCmdAtributes.value.trim()
      let result = userCmdResult.value.trim()
      let privilege = userCmdPrivilege.selectedIndex

      let value = {prefix: prefix, cmd: cmd, attributes: '', result: result, privilege: privilege, enabled: true}

      if (Helper.tryAddUserCmd(value) == 'err') return

      document.querySelector(".cmdbot.form-bg").classList.remove('show')
    })

    addTimeoutBtn.addEventListener('click', () => {
      let name = timeoutName.value.trim()
      let message = timeoutMessage.value.trim()
      let interval = Number(timeoutInterval.value)
      let minMessages = Number(timeoutMinMessages.value)

      let value = {name: name, message: message, interval: interval, minMessages: minMessages, enabled: true}

      if (Helper.tryAddUserTimeout(value) == 'err') return
      document.querySelector(".timer.form-bg").classList.remove('show')
    })

    hideFormTimeoutBtn.addEventListener('click', () => {
      document.querySelector(".timer.form-bg").classList.remove('show')
    })
    hideFormCmdBtn.addEventListener('click', () => {
      document.querySelector(".cmdbot.form-bg").classList.remove('show')
    })

    showFormTimeoutBtn.addEventListener('click', () => {
      timeoutName.value = ''
      timeoutMessage.value = ''
      timeoutInterval.value = 300
      timeoutMinMessages.value = 5

      document.querySelector(".timer.form-bg").classList.add('show')

      document.querySelector('.timer.form-bg .container h3').textContent = ' Добавить таймер '
    })
    document.querySelector('.timer.form-bg').addEventListener('click', (e) => {
      if (e.target.className == 'timer form-bg show') document.querySelector(".timer.form-bg").classList.remove('show')
    })

    showFormCmdbotBtn.addEventListener('click', () => {
      userCmdPrefix.value = ''
      userCmdCmd.value = ''
      userCmdResult.value = ''
      userCmdPrivilege.selectedIndex = 2

      document.querySelector(".cmdbot.form-bg").classList.add('show')

      document.querySelector('.cmdbot.form-bg .container h3').textContent = ' Добавить команду '
    })
    document.querySelector('.cmdbot.form-bg').addEventListener('click', (e) => {
      if (e.target.className == 'cmdbot form-bg show') document.querySelector(".cmdbot.form-bg").classList.remove('show')
    })

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.from == 'background_bot' && typeof msg.logs == 'object') {
        $('.table-ovg .logs').empty();
        for (let log of msg.logs) {
          if (log[0] == 'message' || log[0] == 'subscribe' || log[0] == 'user_ban')  Helper.addLog(log.slice(0, 100))
        }
        if (document.querySelector('.table-ovg .logs').childElementCount == 0) {
          let div = document.createElement('div')
          document.querySelector('.table-ovg .logs').append(div)
          div.outerHTML = '<div style="position: absolute;width: 748px;height: 321px;"><div style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);">Журнал пока пуст.</div></div>'
        }
      }
    });
    
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


updateSetingsToNew = () => {
  alert("Ваша версия настроек устарела!")
}
