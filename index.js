let storageType = 'sync';

let settings = Helper.getDefaultSettings();
let userColors = ["#7fba40", "#1c3fc8", "#a5276d", "#913ca7", "#4332b6", "#266bc5", "#5bc3c1", "#d87539", "#a9ad47", "#3ca13b", "#4db89a", "#6a4691", "#f5a623", "#e7719e", "#9fcbef", "#7b4b4b"]

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
    let changelogList = [
      {
        version: '1.0.8.1',
        date: '2022-01-04',
        items: [{
          text: [
            `Инициализация бота`
          ],
          label: 'fixed'
        }, {
          text: [
            `Голосование`
          ],
          label: 'optimized'
        }]
      },{
        version: '1.0.8',
        date: '2022-01-04',
        items: [{
          text: [
            `Подарки`,
            `Голосование`
          ],
          label: 'added'
        }, {
          text: [
            `Добавить команду`,
            `Добавить таймер`
          ],
          label: 'changed'
        }]
      },{
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
            <a role="tab" class="item" data-tab="giveaway">Подарки</a>
            <a role="tab" class="item" data-tab="poll">Голосование</a>
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
            <li ovg="">
              <a ovg="" class="nav-sidebar__link" data-tab="giveaway">
                <i ovg="" class="ovg-icon-giveaway"></i>
                <span ovg="">Подарки</span>
              </a>
            </li>
            <li ovg="">
              <a ovg="" class="nav-sidebar__link" data-tab="poll">
                <i ovg="" class="ovg-icon-poll"></i>
                <span ovg="">Голосование</span>
              </a>
            </li>
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

      <main class="text" data-tab="giveaway" style="background-color: var(--wasd-color-bg-prime);">

        <div style="display: flex;justify-content: space-between;">
          <h1> Подарки </h1>
        </div>

        <div style="display: flex;width: 100%;height: 90%;padding-top: 5px;">
          <div class="grid" style="padding-top: 10px;">
            <h2> Пользователи: <span class="userList_Count">0</span> </h2>

            <div style="display: flex;justify-content: space-between;">
              <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                <div ovg="" class="wasd-input-wrapper" style="margin-bottom: 6px;">
                  <div ovg="" class="wasd-input">
                    <input id="searchUser" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Поиск.." type="text" autocomplete="off">
                  </div>
                </div>
              </wasd-input>

              <ovg-button class="flat-btn ovg" style="margin: 4px 0px 0 5px;height: 32px;">
                <button id="giveaway_reset" class="medium-cube ovg basic"> <i _ngcontent-boj-c248="" class="wasd-icons-record"></i> </button>
                <ovg-tooltip><div class="ovg tooltip tooltip_position-left tooltip_size-small" style="width: 167px;"><div class="tooltip-content tooltip-content_left ovg"> Сбросить право на участие </div></div></ovg-tooltip>
              </ovg-button>

            </div>

            <div class="block-users">
              <div class="block__users users">
              </div>
            </div>
          </div>
          <div class="grid" style="padding-top: 10px;">
            <h2>Настройка</h2>
            <!--p>Право на участие</p>
            <select multiple>
              <option selected> Модератор </option>
              <option selected> Платные подписчики </option>
              <option selected> Подписчики </option>
              <option selected> Пользовательи </option>
            </select-->

            <!--p>Тип раздачи</p>
            <select id="giveaway_type">
              <option> activeusers </option>
              <option selected> keyword </option>
              <option> randomnumber </option>
            </select-->

            <div class="activeusers" style="display: none">
              
            </div>

            <div class="keyword" style="display: block">
              <div class="row">
                <div class="col-36">
                  <label for="subject" style="float: left;text-align: right;padding-right: 10px;margin-top: -8px;"> Ключевое слово </label>
                </div>
                <div class="col-64">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input id="giveaway_keyword" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Ключевое слово" type="text" autocomplete="off" value="!giveaway">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="description" style="padding-top: 5px;">Это ключевое слово, которое люди вводят в чат, чтобы получить право на победу (без учета регистра).</div>
            </div>

            <div class="randomnumber" style="display: none">
              <input type="number" id="giveaway_min_number" value="0">
              <input type="number" id="giveaway_max_number" value="100">
            </div>

            <div class="bottom" style="bottom: 32px;">
              <ovg-button class="flat-btn ovg" style="display: flex;">
                <button id="giveaway_roll" class="medium ovg primary" style="width: 208px;"> Начать раздачу </button>
                <button id="giveaway_draw" class="medium ovg primary"> Раздать </button>
                <button id="giveaway_end"  class="medium ovg warning" style="left: 10px;"> Завершить </button>
              </ovg-button>
            </div>
          </div>
          <div class="grid">
          </div>
        </div>
      </main>

      <main class="text" data-tab="poll" style="background-color: var(--wasd-color-bg-prime);">

        <div style="display: flex;justify-content: space-between;">
          <h1> Голосование </h1>
          <ovg-button class="flat-btn ovg">
            <button id="showFormPoll" class="primary medium ovg"> Создать голосование </button>
          </ovg-button>
        </div>
        
        <div class="not-found" style="position: absolute; width: 728px; height: 364px;"><div style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);">Активных голосований пока нет.. Нажмите кнопку «Создать голосование», чтобы создать его.</div></div>
      </main>

      <main class="text" data-tab="log">

        <div style="display: flex;justify-content: space-between;">
          <h1> Журнал </h1>
        </div>

        <!--select>
          <option selected> all </option>
          <option> message </option>
          <option> ban </option>
        </select-->

        <table class="table-ovg">

          <thead class="thead-ovg">
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Тип</div>
            </th>
            <th class="table-heading-ovg">
              <div class="table-heading-text-ovg">&nbsp;&nbsp;Дата&nbsp;&nbsp;</div>
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
                  </ol>
                </div>
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
                  </ol>
                </div>
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
            <!--th class="table-heading-ovg">
              <div class="table-heading-text-ovg">Префикс</div>
            </th-->
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
              <div class="table-heading-text-ovg" style="text-align: right;">Действия</div>
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
              <div class="table-heading-text-ovg">&nbsp;&nbsp;Переменная&nbsp;&nbsp;</div>
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

      <ovg-modal-backdrop class=""> </ovg-modal-backdrop>

      <ovg-modal-window class="cmdbot">
        <div class="modal-block modal-block_medium" style="width: 440px;">

          <div class="modal-block__title">
            <span> Добавить команду </span>
          </div>

          <div class="modal-block__content" style="padding: 0 24px;">
            <!--div class="row">
              <div class="col-36">
                <label for="fname"> Префикс </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper">
                    <div ovg="" class="wasd-input">
                      <input id="userCmdPrefix" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Префикс" type="text" autocomplete="off">
                    </div>
                  </div>
                 </wasd-input>
              </div>
            </div-->
            <div class="row">
              <div class="col-36">
                <label for="subject"> Команда </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper">
                    <div ovg="" class="wasd-input">
                      <input id="userCmdCmd" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="!команда" type="text" autocomplete="off">
                    </div>
                  </div>
                 </wasd-input>
              </div>
            </div>
            <div class="row">
              <div class="col-36">
                <label  for="fname"> Ответ </label>
              </div>
              <div class="col-64">
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
              <div class="col-36">
                <label for="fname"> Привилегия </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper" style="padding: 0 0 8px 0;">
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
          </div>

          <div class="modal-block__footer">
              <ovg-button class="flat-btn ovg" style="display: flex;">
                <button class="medium ovg warning hide" style="margin-right: 5px;"> отмена </button>
                <button id="addCmdBtn" class="primary medium ovg updateUser"> сохранить </button>
              </ovg-button>
          </div>

        </div>
      </ovg-modal-window>

      <ovg-modal-window class="timer">
        <div class="modal-block modal-block_medium" style="width: 440px;">

          <div class="modal-block__title">
            <span> Добавить таймер </span>
          </div>

          <div class="modal-block__content" style="padding: 0 24px;">
            <div class="row">
              <div class="col-36">
                <label for="fname"> Имя </label>
              </div>
              <div class="col-64">
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
              <div class="col-36">
                <label for="subject"> Сообщение </label>
              </div>
              <div class="col-64">
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
              <div class="col-36">
                <label for="fname"> Интервал ${Helper.tooltip('', 'Значение в секундах')} </label>
              </div>
              <div class="col-64">
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
              <div class="col-36">
                <label for="fname"> Минимум линии ${Helper.tooltip('', 'Минимальное количество строк чата за последние 5 минут, необходимое для активации таймера')} </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper" style="padding: 0 0 8px 0;">
                    <div ovg="" class="wasd-input">
                      <input id="timeoutMinMessages" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="minMessages" type="number" value="5" min="1" max="1000" autocomplete="off">
                    </div>
                  </div>
                 </wasd-input>
              </div>
            </div>
          </div>

          <div class="modal-block__footer">
              <ovg-button class="flat-btn ovg" style="display: flex;">
                <button class="medium ovg warning hide" style="margin-right: 5px;"> отмена </button>
                <button id="addTimeoutBtn" class="primary medium ovg updateUser"> сохранить </button>
              </ovg-button>
          </div>

        </div>
      </ovg-modal-window>

      <ovg-modal-window class="infobot">
        <div class="modal-block modal-block_medium" style="width: 440px;">

          <div class="modal-block__title">
            <span> Обратите внимание что... </span>
          </div>

          <div class="modal-block__content" style="padding: 0 24px;">
            <ul type="square" style="padding: 0;">
              <li style="list-style: inside;"> Бот отвечает от вашего имени </li>
              <li style="list-style: inside; padding-top: 10px;"> Слова, заключенные в фигурные скобки, символы "{" и "}" указывают на обязательное значение, например: USERNAME потребует имя пользователя (например, "Justin"). </li>
              <li style="list-style: inside; padding-top: 10px;"> Слово, заключенное в квадратные скобки "[" и "]", указывает на необязательное значение, например: SECONDS можно не указывать или заменить числом секунд (например, 10). </li>
              <li style="list-style: inside; padding-top: 10px;"> Сами символы ([,], {и}) не должны включаться в текстовое поле при вводе вашей команды. </li>
            </ul>
          </div>

          <div class="modal-block__footer">
              <ovg-button class="flat-btn ovg" style="display: flex;">
                <button class="primary medium ovg hide"> Понятно </button>
              </ovg-button>
          </div>

        </div>
      </ovg-modal-window>

      <ovg-modal-window class="cmdmod">
        <div class="modal-block modal-block_medium" style="width: 440px;">

          <div class="modal-block__title">
            <span> Изменить команду </span>
          </div>

          <div class="modal-block__content" style="padding: 0 24px;">
            <div class="row">
              <div class="col-36">
                <label for="fname"> Команда </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper" style="padding: 0 0 8px 0;">
                    <div ovg="" class="wasd-input">
                      <input id="aliasName" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Команда" type="text" autocomplete="off">
                    </div>
                  </div>
                 </wasd-input>
              </div>
            </div>
          </div>

          <div class="modal-block__footer">
              <ovg-button class="flat-btn ovg" style="display: flex;">
                <button class="medium ovg warning hide" style="margin-right: 5px;"> отмена </button>
                <button id="addCmdModBtn" class="primary medium ovg"> сохранить </button>
              </ovg-button>
          </div>

        </div>
      </ovg-modal-window>

      <ovg-modal-window class="cmdmod2">
        <div class="modal-block modal-block_medium" style="width: 440px;">

          <div class="modal-block__title">
            <span> Изменить команду </span>
          </div>

          <div class="modal-block__content" style="padding: 0 24px;">
            <div class="row">
              <div class="col-36">
                <label for="fname"> Команда вкл. </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper" style="padding: 0 0 8px 0;">
                    <div ovg="" class="wasd-input">
                      <input id="aliasName2_1" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Команда вкл." type="text" autocomplete="off">
                    </div>
                  </div>
                 </wasd-input>
              </div>
            </div>
            <div class="row">
              <div class="col-36">
                <label for="fname"> Команда откл. </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper" style="padding: 0 0 8px 0;">
                    <div ovg="" class="wasd-input">
                      <input id="aliasName2_2" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Команда откл." type="text" autocomplete="off">
                    </div>
                  </div>
                 </wasd-input>
              </div>
            </div>
          </div>

          <div class="modal-block__footer">
              <ovg-button class="flat-btn ovg" style="display: flex;">
                <button class="medium ovg warning hide" style="margin-right: 5px;"> отмена </button>
                <button id="addCmdModBtn2" class="primary medium ovg"> сохранить </button>
              </ovg-button>
          </div>

        </div>
      </ovg-modal-window>

      <ovg-modal-window class="poll">
        <div class="modal-block modal-block_medium" style="width: 440px;">

          <div class="modal-block__title">
            <span> Добавить голосование </span>
          </div>

          <div class="modal-block__content scroller-element" style="padding: 0 24px;">
            <div class="row">
              <div class="col-36">
                <label for="fname"> Вопрос </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper">
                    <div ovg="" class="wasd-input">
                      <input id="questionInput" ovg="" class="has-button ng-pristine ng-untouched ng-valid" placeholder="Вопрос" type="text" autocomplete="off">
                    </div>
                  </div>
                 </wasd-input>
              </div>
            </div>
            <div class="row">
              <div class="col-36">
                <label for="fname"> Вариант 1 </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper">
                    <div ovg="" class="wasd-input">
                      <input ovg="" class="respnose has-button ng-pristine ng-untouched ng-valid" placeholder="" type="text" autocomplete="off">
                    </div>
                  </div>
                 </wasd-input>
              </div>
            </div>
            <div class="row">
              <div class="col-36">
                <label for="fname"> Вариант 2 </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper">
                    <div ovg="" class="wasd-input">
                      <input ovg="" class="respnose has-button ng-pristine ng-untouched ng-valid" placeholder="" type="text" autocomplete="off">
                    </div>
                  </div>
                 </wasd-input>
              </div>
            </div>

            <div>
              <div class="row row-respnose hide">
                <div class="col-36">
                  <label for="fname"> Вариант 3 </label>
                </div>
                <div class="col-64">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input ovg="" class="respnose-hide has-button ng-pristine ng-untouched ng-valid" placeholder="" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row row-respnose hide">
                <div class="col-36">
                  <label for="fname"> Вариант 4 </label>
                </div>
                <div class="col-64">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input ovg="" class="respnose-hide has-button ng-pristine ng-untouched ng-valid" placeholder="" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row row-respnose hide">
                <div class="col-36">
                  <label for="fname"> Вариант 5 </label>
                </div>
                <div class="col-64">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input ovg="" class="respnose-hide has-button ng-pristine ng-untouched ng-valid" placeholder="" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row row-respnose hide">
                <div class="col-36">
                  <label for="fname"> Вариант 6 </label>
                </div>
                <div class="col-64">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input ovg="" class="respnose-hide has-button ng-pristine ng-untouched ng-valid" placeholder="" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row row-respnose hide">
                <div class="col-36">
                  <label for="fname"> Вариант 7 </label>
                </div>
                <div class="col-64">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input ovg="" class="respnose-hide has-button ng-pristine ng-untouched ng-valid" placeholder="" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row row-respnose hide">
                <div class="col-36">
                  <label for="fname"> Вариант 8 </label>
                </div>
                <div class="col-64">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input ovg="" class="respnose-hide has-button ng-pristine ng-untouched ng-valid" placeholder="" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row row-respnose hide">
                <div class="col-36">
                  <label for="fname"> Вариант 9 </label>
                </div>
                <div class="col-64">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input ovg="" class="respnose-hide has-button ng-pristine ng-untouched ng-valid" placeholder="" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>
              <div class="row row-respnose hide">
                <div class="col-36">
                  <label for="fname"> Вариант 10 </label>
                </div>
                <div class="col-64">
                  <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                    <div ovg="" class="wasd-input-wrapper">
                      <div ovg="" class="wasd-input">
                        <input ovg="" class="respnose-hide has-button ng-pristine ng-untouched ng-valid" placeholder="" type="text" autocomplete="off">
                      </div>
                    </div>
                   </wasd-input>
                </div>
              </div>

              <div style="justify-content: flex-end;display: flex;">
                <ovg-button class="flat-btn ovg" style="display: flex;">
                  <button class="end ovg primary small" style="margin-right: 5px;" id="btnAddInput">+</button>
                  <button class="remove ovg primary small" id="btnRemoveInput" disabled>-</button>
                </ovg-button>
              </div>
            </div>

            <div class="row">
              <div class="col-36">
                <label for="fname"> Продолжительность </label>
              </div>
              <div class="col-64">
                <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
                  <div ovg="" class="wasd-input-wrapper" style="padding: 0 0 8px 0;">
                    <div ovg="" class="wasd-input">
                      <select id="durationSelect">
                        <option value="1" > 1 мин. </option>
                        <option value="2" selected> 2 мин. </option>
                        <option value="3" > 3 мин. </option>
                        <option value="5" > 5 мин. </option>
                        <option value="10" > 10 мин. </option>
                      </select>
                    </div>
                  </div>
                 </wasd-input>
              </div>
            </div>
          </div>

          <div class="modal-block__footer">
            <ovg-button class="flat-btn ovg" style="display: flex;">
              <button class="medium ovg warning hide" style="margin-right: 5px;"> отмена </button>
              <button id="addPollBtn" class="primary medium ovg updateUser"> создать </button>
            </ovg-button>
          </div>

        </div>
      </ovg-modal-window>

      <main class="text" data-tab="changelog">
        <h1>Журнал изменений</h1>
        <!--h4 style="margin-top:10px;padding-left: 10px;padding-right: 0px;margin-bottom: 0px;"> Информацию о будущих версиях можно найти <a href="https://wasd.tv/ovgames/posts" target="_blank">тут</a></h4-->
        ${changelogHtml}
      </main>`;
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

    showFormPoll.addEventListener('click', () => {
      questionInput.value = ''
      durationSelect.selectedIndex = 1

      for (let input of document.querySelectorAll('.poll input.respnose')) {
        input.value = ''
      }
      for (let input of document.querySelectorAll('.poll input.respnose-hide')) {
        input.value = ''
      }

      for (let el of document.querySelectorAll('.row-respnose.show')) {
        poll_ui.removeInput()
      }

      Helper.showModal('poll')
    })

    btnAddInput.addEventListener('click', () => poll_ui.addInput() )
    btnRemoveInput.addEventListener('click', () => poll_ui.removeInput() )

    document.querySelector('ovg-modal-window.poll').addEventListener('click', (e) => {
      if (e.target.className == 'poll show') Helper.hideModal()
    })

    addPollBtn.addEventListener('click', () => {

      if (questionInput.value.trim() == '') {
        HelperSettings.showMessage('Null question', 'error')
        return
      }

      let arr = []
      for (let i of document.querySelectorAll('.poll input.respnose')) {
        if (i.value.trim() == '') {
          HelperSettings.showMessage('Null respnose', 'error')
          return
        }
        arr.push(i.value)
      }

      chrome.runtime.sendMessage({
        from: 'popup_bot',
        createPoll: {
          arr: arr,
          question: questionInput.value,
          duration: Number(durationSelect.value)
        }
      })

      Helper.hideModal()
    })

    for (let cmd of document.querySelectorAll('.editCmd')) {
      cmd.addEventListener('click', () => {
        let split = cmd.dataset.name.split('_');

        aliasName.dataset.name = cmd.dataset.name
        aliasName.value = settings[split[0]][split[1]].alias

        Helper.showModal('cmdmod')
      })
    }
    for (let cmd of document.querySelectorAll('.editCmd2')) {
      cmd.addEventListener('click', () => {
        let split = cmd.dataset.name.split('_');

        aliasName2_1.dataset.name = cmd.dataset.name
        aliasName2_1.value = settings[split[0]][split[1]].alias
        aliasName2_2.value = settings[split[0]][split[1]].unalias

        Helper.showModal('cmdmod2')
      })
    }

    document.querySelector('ovg-modal-window.cmdmod').addEventListener('click', (e) => {
      if (e.target.className == 'cmdmod show') Helper.hideModal()
    })

    document.querySelector('ovg-modal-window.cmdmod2').addEventListener('click', (e) => {
      if (e.target.className == 'cmdmod2 show') Helper.hideModal()
    })

    document.querySelector("button.infobot.show").addEventListener('click', () => {
      Helper.showModal('infobot')
    })
    for (let el of document.querySelectorAll("ovg-modal-window button.hide")) {
      el.addEventListener('click', () => Helper.hideModal())
    }
    document.querySelector('ovg-modal-window.infobot').addEventListener('click', (e) => {
      if (e.target.className == 'infobot show') Helper.hideModal()
    })

    let fontStyle = document.createElement('style');
    fontStyle.type = 'text/css';
    fontStyle.innerHTML = '';
    fontStyle.appendChild(document.createTextNode(`@font-face {
      font-family: 'icomoon';
      src:  url(${chrome.runtime.getURL("css/fonts/icomoon.ttf")}?hfnfya) format('truetype'),
        url(${chrome.runtime.getURL("css/fonts/icomoon.woff")}?hfnfya) format('woff'),
        url(${chrome.runtime.getURL("css/fonts/icomoon.svg")}?hfnfya#icomoon) format('svg');
      font-weight: normal;
      font-style: normal;
      font-display: block;
    }`));
    document.body.append(fontStyle);

    // giveaway_type.addEventListener('change', (option) => {
    //   document.querySelector('[data-tab="giveaway"] .keyword').style.display = 'none'
    //   document.querySelector('[data-tab="giveaway"] .randomnumber').style.display = 'none'
    //   document.querySelector('[data-tab="giveaway"] .activeusers').style.display = 'none'

    //   if (option.target.value == 'keyword') {
    //     document.querySelector('[data-tab="giveaway"] .keyword').style.display = 'block'
    //   } else if (option.target.value == 'randomnumber') {
    //     document.querySelector('[data-tab="giveaway"] .randomnumber').style.display = 'block'
    //   } else if (option.target.value == 'activeusers') {
    //     document.querySelector('[data-tab="giveaway"] .activeusers').style.display = 'block'
    //   }
    // })

    // to def
    for (let option of settingsDiv.querySelectorAll('.optionField.def')) {
      option.addEventListener('click', (event) => {
        let split = event.target.dataset.name.split('_');
        switch (event.target.getAttribute('option-type')) {
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
          chrome.runtime.sendMessage({ from: 'popup_bot', log: true })
        }

        if (target.getAttribute('data-tab') == 'giveaway') {
          chrome.runtime.sendMessage({ from: 'popup_bot', getGiveaweySettings: 'click' })
        } else {
          var iframe = document.querySelector('.chat_iframe')
          iframe?.parentNode.removeChild(iframe);
        }

        if (target.getAttribute('data-tab') == 'poll') {
          chrome.runtime.sendMessage({ from: 'popup_bot', getPollSettings: 'click' })
        } else {
          var div = document.querySelector('main[data-tab="poll"] .poll')
          div?.parentNode.removeChild(div);
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
          chrome.runtime.sendMessage({ from: 'popup_bot', log: true })
        }

        if (target.getAttribute('data-tab') == 'giveaway') {
          chrome.runtime.sendMessage({ from: 'popup_bot', getGiveaweySettings: 'click' })
        } else {
          var iframe = document.querySelector('.chat_iframe')
          iframe?.parentNode.removeChild(iframe);
        }

        if (target.getAttribute('data-tab') == 'poll') {
          chrome.runtime.sendMessage({ from: 'popup_bot', getPollSettings: 'click' })
        } else {
          var div = document.querySelector('main[data-tab="poll"] .poll')
          div?.parentNode.removeChild(div);
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

    var filter_user, ul_user, options_user, title_user, i_user;
    searchUser.addEventListener('input', () => {
      filter_user = searchUser.value.toUpperCase();
      ul_user = document.querySelector(".block__users.users");
      options_user = ul_user.querySelectorAll(".users__item");
      for (i_user = 0; i_user < options_user.length; i_user++) {
        title_user = options_user[i_user].querySelector(".users__item-name .item");
        if (title_user) {
          if (title_user.textContent.toUpperCase().indexOf(filter_user) > -1) {
            options_user[i_user].style.display = "";
          } else {
            options_user[i_user].style.display = "none";
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

    addCmdModBtn.addEventListener('click', (e) => {
      let alias = aliasName.value.trim()
      let split = aliasName.dataset.name.split('_');

      settings[split[0]][split[1]].alias = alias
      HelperSettings.save([document.querySelector(`[data-name="${aliasName.dataset.name}"]`).parentNode.parentNode.parentNode]);

      Helper.hideModal()
    })

    addCmdModBtn2.addEventListener('click', (e) => {
      let alias = aliasName2_1.value.trim()
      let unalias = aliasName2_2.value.trim()
      let split = aliasName2_1.dataset.name.split('_');

      settings[split[0]][split[1]].alias = alias
      settings[split[0]][split[1]].unalias = unalias
      HelperSettings.save([document.querySelector(`[data-name="${aliasName2_1.dataset.name}"]`).parentNode.parentNode.parentNode]);

      Helper.hideModal()
    })

    addCmdBtn.addEventListener('click', () => {
      let cmd = userCmdCmd.value.trim()
      let result = userCmdResult.value.trim()
      let privilege = userCmdPrivilege.selectedIndex

      let value = {cmd: cmd, attributes: '', result: result, privilege: privilege, enabled: true}

      if (Helper.tryAddUserCmd(value) == 'err') return

      Helper.hideModal()
    })

    addTimeoutBtn.addEventListener('click', () => {
      let name = timeoutName.value.trim()
      let message = timeoutMessage.value.trim()
      let interval = Number(timeoutInterval.value)
      let minMessages = Number(timeoutMinMessages.value)

      let value = {name: name, message: message, interval: interval, minMessages: minMessages, enabled: true}

      if (Helper.tryAddUserTimeout(value) == 'err') return

      Helper.hideModal()
    })

    showFormTimeoutBtn.addEventListener('click', () => {
      timeoutName.value = ''
      timeoutMessage.value = ''
      timeoutInterval.value = 300
      timeoutMinMessages.value = 5

      Helper.showModal('timer')

      document.querySelector('ovg-modal-window.timer .modal-block__title span').textContent = ' Добавить таймер '
    })
    document.querySelector('ovg-modal-window.timer').addEventListener('click', (e) => {
      if (e.target.className == 'timer show') Helper.hideModal()
    })

    showFormCmdbotBtn.addEventListener('click', () => {
      userCmdCmd.value = ''
      userCmdResult.value = ''
      userCmdPrivilege.selectedIndex = 2

      Helper.showModal('cmdbot')

      document.querySelector('ovg-modal-window.cmdbot .modal-block__title span').textContent = ' Добавить команду '
    })
    document.querySelector('ovg-modal-window.cmdbot').addEventListener('click', (e) => {
      if (e.target.className == 'cmdbot show') Helper.hideModal()
    })

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.from == 'background_bot' && typeof msg.logs == 'object') {
        $('.table-ovg .logs').empty();
        for (let log of msg.logs) {
          if (log[0] == 'message' || log[0] == 'subscribe' || log[0] == 'user_ban') Helper.addLog(log.slice(0, 100))
        }
        if (document.querySelector('.table-ovg .logs').childElementCount == 0) {
          let div = document.createElement('div')
          document.querySelector('.table-ovg .logs').append(div)
          div.outerHTML = '<div style="position: absolute;width: 748px;height: 321px;"><div style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);">Журнал пока пуст.</div></div>'
        }
      }
      if (msg.from == 'background_bot' && msg.winner) {
        giveaway_ui.showWinner(msg.winner)
      }
      if (msg.from == 'background_bot' && msg.register_data) {
        giveaway_ui.addUsers_userList([msg.register_data[1]])
      }
      if (msg.from == 'background_bot' && msg.getData) {
        giveaway_ui.visibility_giveaway(msg.getData.registerStart)
        
        giveaway_ui.addUsers_userList(msg.getData.registrationArr)

        giveaway_keyword.value = msg.getData.keyWord
      }
      if (msg.from == 'background_bot' && msg.giveawayWinnerMgs) {
        giveaway_ui.addWinnerMsg(msg.giveawayWinnerMgs)
      }
      if (msg.from == 'background_bot' && msg.getGiveaweySettings) {
        if (document.querySelector('main[data-tab="giveaway"] .chat_iframe')) return

        if (!msg.getGiveaweySettings.stream_id) {
          var div = document.createElement('div')
          div.classList.add('chat_iframe')
          div.innerHTML = 'Не удалось получить доступ к чату'
          document.querySelector(`[data-tab="giveaway"] > div:nth-child(2) > div:nth-child(3)`).append(div)
          return
        }
        var iframe = document.createElement('iframe')
        iframe.src = `https://wasd.tv/chat?channel_name=${msg.getGiveaweySettings.channel_name}&stream_id=${msg.getGiveaweySettings.stream_id}${msg.getGiveaweySettings.private_link ? '&private_link=' + msg.getGiveaweySettings.private_link : ''}`
        iframe.classList.add('chat_iframe')
        document.querySelector(`[data-tab="giveaway"] > div:nth-child(2) > div:nth-child(3)`).append(iframe)
      }
      if (msg.from == 'background_bot' && msg.createdPoll) {
        poll_ui.create(msg.createdPoll)
      }
      if (msg.from == 'background_bot' && msg.pollPercent) {
        poll_ui.update(msg.pollPercent)
      }
      if (msg.from == 'background_bot' && msg.getPollSettings) {
        poll_ui.create(msg.getPollSettings)
      }
      if (msg.from == 'background_bot' && msg.winPoll) {
        poll_ui.win(msg.winPoll, msg.data)
      }
      if (msg.from == 'background_bot' && msg.removePoll) {
        poll_ui.removeAll()
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

    giveaway_keyword.addEventListener('change', (e) => {
      chrome.runtime.sendMessage({ from: 'popup_bot', keyWord: e.target.value })
    });

    giveaway_roll.addEventListener('click', () => {
      chrome.runtime.sendMessage({ from: 'popup_bot', start: 'click' })

      giveaway_ui.visibility_giveaway(true)
    });

    giveaway_end.addEventListener('click', () => {
      chrome.runtime.sendMessage({ from: 'popup_bot', end: 'click' })

      giveaway_ui.clear_userList()
      giveaway_ui.visibility_giveaway(false)
    });

    giveaway_reset.addEventListener('click', () => {
      chrome.runtime.sendMessage({ from: 'popup_bot', reset: 'click' })

      giveaway_ui.clear_userList()
    });

    giveaway_draw.addEventListener('click', () => {
      chrome.runtime.sendMessage({ from: 'popup_bot', draw: 'click' })
    });

  },
};

const giveaway_ui = {
  clear_userList() {
    $('.block__users.users').empty();
    document.querySelector('.userList_Count').textContent = '0'
  },
  addUsers_userList(users = []) {
    for (let user of users) {
      let role = giveaway_ui.getRole(user)

      let isOwner = role.indexOf('owner')             != -1
      let isModer = role.indexOf('moderator')         != -1
      let isSub = role.indexOf('sub')                 != -1
      let isAdmin = role.indexOf('admin')             != -1
      let isPromoCodeWin = role.indexOf('promowin')   != -1

      var div = document.createElement('div')
      div.classList.add('users__item')
      div.classList.add('item--hover')
      div.innerHTML = `<div class="users__item-name" style="color: ${userColors[user.user_id % (userColors.length - 1)]};">
        <div class="item ${isModer ? 'is-moderator' : ''}${isOwner ? 'is-owner' : ''}${isAdmin ? 'is-admin' : ''}">${isModer ? '<i _ngcontent-eti-c54="" class="icon wasd-icons-moderator"></i>' : ''}${isOwner ? '<i _ngcontent-lef-c54="" class="icon wasd-icons-owner"></i>' : ''}${isAdmin ? '<i _ngcontent-lef-c54="" class="icon wasd-icons-dev"></i>' : ''} ${user.user_login} </div></div>`

      document.querySelector('.block__users.users').append(div)
    }
    document.querySelector('.userList_Count').textContent = document.querySelector('.block__users.users').childElementCount
  },
  visibility_giveaway(is) {
    if (is) {
      giveaway_roll.style.display = 'none'
      giveaway_draw.style.display = 'block'
      giveaway_end.style.display = 'block'
    } else {
      giveaway_roll.style.display = 'block'
      giveaway_draw.style.display = 'none'
      giveaway_end.style.display = 'none'
    }
  },
  showWinner(data) {
    var modal =  document.createElement('ovg-modal-window')
    modal.classList.add('winner')
    modal.innerHTML = `<div class="modal-block modal-block_medium" style="width: 440px;height: 380px;">
      <div class="modal-block__title">
        <span> Победитель </span>
      </div>
      <div class="modal-block__content scroller-element">
        <div style="display: flex;justify-content: space-between;">
          <div style="display: flex;">
            <div class="avatar" style="background-image: url(${data.user_avatar.large});"></div>
            <a class="username" rel="noopener noreferrer" target="_blank" href="https://wasd.tv/user/${data.user_id}" title="${data.user_login}"> ${data.user_login} </a>
          </div>
          <div class="timer">00:00</div>
        </div>
        <div class="block-ovg" style="height: 156px;max-height: 100%;margin-top: 10px;"><div class="block__messages-ovg"></div></div>
      </div>
      <div class="modal-block__footer">
        <ovg-button class="flat-btn ovg" style="display: flex;">
          <button class="medium ovg primary ok" style="margin-right: 5px;"> хорошо </button>
        </ovg-button>
      </div>
    </div>`
    document.querySelector('#bscSettingsPanel').append(modal)
    Helper.showModal('winner')

    let timerdiv = document.querySelector('ovg-modal-window.winner .timer')
    let winTime = new Date()
    let intervalTimer = setInterval(() => {
      var dater = new Date(new Date() - winTime)
      if (!timerdiv) {
        return clearInterval(intervalTimer)
      }
      timerdiv.textContent = `${(dater.getUTCMinutes() < 10) ? '0' + dater.getUTCMinutes() : dater.getUTCMinutes()}:${(dater.getUTCSeconds() < 10) ? '0' + dater.getUTCSeconds() : dater.getUTCSeconds()}`
    }, 1000)

    document.querySelector('ovg-modal-window.winner button.ok').addEventListener('click', () => {
      Helper.hideModal()
      document.querySelector('ovg-modal-window.winner')?.remove()
    })

    document.querySelector('ovg-modal-window.winner').addEventListener('click', (e) => {
      if (e.target.className == 'winner show') {
        Helper.hideModal()
        document.querySelector('ovg-modal-window.winner')?.remove()
      }
    })
  },
  addWinnerMsg(JSData) {
    let messagesDiv = document.querySelector('.block__messages-ovg');
    let divMessageDiv = document.querySelector('.block-ovg');
    
    if (messagesDiv && divMessageDiv) {
      let role = giveaway_ui.getRole(JSData[1])
      messagesDiv?.appendChild(giveaway_ui.createMessage(role, JSData[1].user_login, userColors[JSData[1].user_id % (userColors.length - 1)], JSData[1]?.message, JSData[1]?.sticker?.sticker_image?.medium, new Date(JSData[1].date_time)))
      divMessageDiv.scrollTop = divMessageDiv.scrollHeight;
    }
  },
  createMessage(role, username, color, message, sticker, date_time = new Date()) {

    let isOwner = role.indexOf('owner')           != -1
    let isModer = role.indexOf('moderator')       != -1
    let isSub = role.indexOf('sub')               != -1
    let isAdmin = role.indexOf('admin')           != -1
    let isPromoCodeWin = role.indexOf('promowin') != -1
    let blockmessage = message;

    if (message == undefined) blockmessage = ''

    let node = document.createElement('div')
    node.classList.add('block__messages__item-ovg')
    node.setAttribute('role', role)
    if (sticker) node.setAttribute('sticker', sticker)
    node.setAttribute('username', username)
    node.setAttribute('message', message)
    // <div class="message-ovg is-time${!!message?.match(HelperWASD.self_channel_name) ? ' has-mention' : ''}">
    node.innerHTML = `<wasd-chat-message>
      <div class="message-ovg is-time${false ? ' has-mention' : ''}">
        <div class="message__time-ovg" style="width: 30px;"> ${moment(date_time).format('HH:mm')} </div>
          <div class="message__info-ovg">
            <div class="message__info__text-ovg">
              <div class="info__text__status-ovg">
                ${isSub ? `<div _ngcontent-iox-c54="" class="info__text__status-paid" style="background-color: ${color}"><i _ngcontent-iox-c54="" class="icon wasd-icons-star" role-card=""></i></div>` : ``}
                <div username="${username}" usernamelc="${username.toLowerCase()}" class="info__text__status__name-ovg ${isModer ? 'is-moderator' : ''}${isOwner ? 'is-owner' : ''}${isAdmin ? 'is-admin' : ''}" style="${(false) ? `margin: 0px;` : ''}color: ${color}">${isModer ? '<i _ngcontent-eti-c54="" class="icon wasd-icons-moderator"></i>' : ''}${isOwner ? '<i _ngcontent-lef-c54="" class="icon wasd-icons-owner"></i>' : ''}${isAdmin ? '<i _ngcontent-lef-c54="" class="icon wasd-icons-dev"></i>' : ''} ${username} </div>
              </div>
              ${(false) ? `<span aria-hidden="true" id="colon-after-author-name-ovg" style=" margin-right: 4px; color: var(--yt-live-chat-primary-text-color, rgba(var(--wasd-color-switch--rgb),.88))">: </span>` : '' }
              <div class="message-text-ovg"><span>${(blockmessage == 'Стикер') ? '<span class="chat-message-text stickertext">Стикер</span>' : blockmessage }</span></div>
              ${(sticker != undefined) ? '<img alt="sticker" class="sticker small" src="'+sticker+'"> <span class="chat-message-text stickertext sticker_text">Стикер</span>' : ''}
            </div>
          </div>
        </div>
      </div>
    </wasd-chat-message>`;

    return node
  },
  getRole(data) {
    let role = 'user'

    let isSub = false
    if (Array.isArray(data.other_roles)) {
      for (let role of data.other_roles) {
        if (!isSub) isSub = (role == 'CHANNEL_SUBSCRIBER')
      }
    } else {
      if (!isSub) isSub = (data.other_roles == 'CHANNEL_SUBSCRIBER')
    }
    if (isSub) role += ' sub'

    let isOwner = false
    if (Array.isArray(data.user_channel_role)) {
      for (let role of data.user_channel_role) {
        if (!isOwner) isOwner = (role == 'CHANNEL_OWNER')
      }
    } else {
      if (!isOwner) isOwner = (data.user_channel_role == 'CHANNEL_OWNER')
    }
    if (isOwner) role += ' owner'

    let isModer = false
    if (Array.isArray(data.user_channel_role)) {
      for (let role of data.user_channel_role) {
        if (!isModer) isModer = (role == 'CHANNEL_MODERATOR')
      }
    } else {
      if (!isModer) isModer = (data.user_channel_role == 'CHANNEL_MODERATOR')
    }
    if (isModer) role += ' moderator'

    let isAdmin = false
    if (Array.isArray(data.user_channel_role)) {
      for (let role of data.user_channel_role) {
        if (!isAdmin) isAdmin = (role == 'WASD_ADMIN')
      }
    } else {
      if (!isAdmin) isAdmin = (data.user_channel_role == 'WASD_ADMIN')
    }
    if (isAdmin) role += ' admin'

    let isPromoCodeWin = false
    if (Array.isArray(data.other_roles)) {
      for (let role of data.other_roles) {
        if (!isPromoCodeWin) isPromoCodeWin = (role == 'PROMO_CODE_WINNER')
      }
    } else {
      if (!isPromoCodeWin) isPromoCodeWin = (data.other_roles == 'PROMO_CODE_WINNER')
    }
    if (isPromoCodeWin) role += ' promowin'

    return role
  }
}

const poll_ui = {
  interval: null,
  create(createdPoll) {
    if (createdPoll.question == '') return
    if (document.querySelector('main[data-tab="poll"] .poll')) return
    document.querySelector('[data-tab="poll"] .not-found')?.remove()
    showFormPoll.setAttribute('disabled', '')

    let percent = {}
    let sum = 0
    let options = ''

    for (let vote in createdPoll.args) {
      sum += createdPoll.args[vote].length
    }

    for (let atr in createdPoll.args) {
      options += `<div class="poll_option" index="${atr}"><div class="progress" style="width: ${(createdPoll.args[atr].length / sum ) * 100}%"></div><div class="con"><i ovg="" class="ovg-icon-win"></i><div class="title"> ${createdPoll.args[atr]} </div></div><div class="percent"> ${Math.round((createdPoll.args[atr].length / sum ) * 100)}% (0) </div></div>`
    }

    let div = document.createElement('div')
    div.classList.add('poll')
    div.innerHTML = `<div class="poll_title"><h2 class="title">${createdPoll.question}</h2><ovg-button class="ovg stroked-btn"><button class="basic ovg small end"> Завершить голосование </button><button style="display: none" class="basic ovg small remove"> Закрыть голосование </button></ovg-button></div> <div class="poll_container scroller-element">${options}</div><div class="poll_timer" style="width: calc(100% - 16px);"><div class="progress"></div></div>`

    document.querySelector('main[data-tab="poll"]').appendChild(div)
    let buttonend = document.querySelector('.poll button.end')
    let buttonremove = document.querySelector('.poll button.remove')

    if (div) {
      buttonend.addEventListener('click', () => {
        buttonend.style.display = 'none'
        buttonremove.style.display = 'block'

        chrome.runtime.sendMessage({ from: 'popup_bot', endPoll: true })
      })

      buttonremove.addEventListener('click', () => {
        buttonend.style.display = 'none'
        buttonremove.style.display = 'none'

        chrome.runtime.sendMessage({ from: 'popup_bot', removePoll: true })
      })
    }

    if (createdPoll.wins?.length >= 1) {
      this.win(createdPoll.wins, createdPoll.data)
      buttonend.style.display = 'none'
      buttonremove.style.display = 'block'
      console.log('wins', createdPoll)
    } else {
      console.log('create', createdPoll)
      this.timerProgress(createdPoll.startTime, createdPoll.duration)
    }
  },
  update(pollPercent) {
    if (!document.querySelector(`main[data-tab="poll"] .poll`)) return
    for(let atr in pollPercent) {
      atr = pollPercent[atr]
      let option = document.querySelector(`main[data-tab="poll"] .poll .poll_option[index="${atr.id}"]`)
      option.querySelector('.progress').style.width = atr.percent+'%'
      option.querySelector('.percent').textContent = ` ${Math.round(atr.percent)}% (${atr.votes.length}) `
    }
  },
  win(atrs, data) {
    for (atr of atrs) {
      let option = document.querySelector(`main[data-tab="poll"] .poll .poll_option[index="${atr.id}"]`)
      option.classList.add('win')
    }

    clearInterval(this.interval)

    document.querySelector('.poll button.end').style.display = 'none'
    document.querySelector('.poll button.remove').style.display = 'block'

    this.timerProgress(data.timeoutWin, data.duration / 60000)
  },
  removeAll() {
    for (let div of document.querySelectorAll('main[data-tab="poll"] .poll')) {
      div?.parentNode.removeChild(div);
    }

    if (!document.querySelector('main[data-tab="poll"] .poll')) {
      let div = document.createElement('div')
      div.classList.add('not-found')
      div.style.position = 'absolute'
      div.style.width = '728px'
      div.style.height = '364px'
      div.innerHTML = '<div style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);">Активных голосований пока нет.. Нажмите кнопку «Создать голосование», чтобы создать его.</div>'
      document.querySelector('main[data-tab="poll"]').append(div)
      
      showFormPoll.removeAttribute('disabled', '')
    }
  },
  timerProgress(_startTime, _duration) {
    clearInterval(this.interval)
    document.querySelector('.poll_timer .progress').style.transition = ''

    const normalizeBetweenTwoRanges = (val, minVal, maxVal, newMin, newMax) => { return newMin + (val - minVal) * (newMax - newMin) / (maxVal - minVal) };

    var countDownDate = new Date(_startTime).getTime() + (60*1000) * _duration;
    var duration = countDownDate - new Date(_startTime).getTime()
    this.interval = setInterval(() => {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var value = normalizeBetweenTwoRanges(distance, 0, duration, 0, 100)
      if (document.querySelector('.poll_timer .progress')) {
        document.querySelector('.poll_timer .progress').style.width = `${value}%`
      } else {
        clearInterval(this.interval)
      }
      
      if (value <= 0) {
        value = 0
        clearInterval(this.interval)
      }
    }, 10);
  },

  addInput() {
    let row = document.querySelector('.row-respnose.hide')
    if (!row) return
    row.classList.remove('hide')
    row.classList.add('show')
    let res = row.querySelector('.respnose-hide')
    if (!res) return
    res.classList.remove('respnose-hide')
    res.classList.add('respnose')

    this.updateBtnDisabled()
  },
  removeInput() {
    let rows = document.querySelectorAll('.row-respnose.show')
    if (!rows) return
    let row = rows[rows.length-1]
    if (!row) return
    row.classList.remove('show')
    row.classList.add('hide')
    let res = row.querySelector('.respnose')
    if (!res) return
    res.classList.remove('respnose')
    res.classList.add('respnose-hide')

    this.updateBtnDisabled()
  },
  updateBtnDisabled() {
    if (document.querySelectorAll('.row-respnose.hide').length == 8) {
      btnAddInput.removeAttribute('disabled')
      btnRemoveInput.setAttribute('disabled', '')
    } else if (document.querySelectorAll('.row-respnose.show').length == 8) {
      btnAddInput.setAttribute('disabled', '')
      btnRemoveInput.removeAttribute('disabled')
    } else {
      btnAddInput.removeAttribute('disabled')
      btnRemoveInput.removeAttribute('disabled')
    }
  }

}

let initialize = async () => {
  try {
    settings = await Helper.getSettings();
    if (typeof settings === 'undefined') {
      settings = Helper.getDefaultSettings();
    } else if (typeof settings.bot.cmdBan == 'boolean') {
      chrome.storage[storageType].set(getUpdateSettings(), () => { location.reload() })
    }
    console.log('settings =', settings)
  } catch (e) {
    console.log('catch', e);
  }
  BetterStreamChat.init()
  HelperSettings.loaded()
  chrome.runtime.sendMessage({ from: 'popup_bot', init: settings })
}

const getUpdateSettings = () => {
  return {
    bot: {
      cmdBan: { enabled: settings.bot.cmdBan, alias: '/ban', unalias: '/unban' },
      cmdMod: { enabled: settings.bot.cmdMod, alias: '/mod', unalias: '/unmod' },
      cmdRaid: { enabled: settings.bot.cmdRaid, alias: '/raid' },
      cmdTitle: { enabled: settings.bot.cmdTitle, alias: '/title' },
      cmdGame: { enabled: settings.bot.cmdGame, alias: '/game' },
      cmdFollowers: { enabled: settings.bot.cmdFollowers, alias: '/followers', unalias: '/followersoff' },
      cmdSubscribers: { enabled: settings.bot.cmdSubscribers, alias: '/subscribers', unalias: '/subscribersoff' },
      cmdTimeout: { enabled: settings.bot.cmdTimeout, alias: '/timeout' },

      cmdUptime: { enabled: settings.bot.cmdUptime, alias: '!uptime' },
      cmdUserTitle: { enabled: settings.bot.cmdUserTitle, alias: '!title' },
      cmdUserGame: { enabled: settings.bot.cmdUserGame, alias: '!game' },
      cmdCommands: { enabled: true, alias: '!commands' },

      eventFollow: settings.bot.eventFollow,
      eventSub: settings.bot.eventSub,
      eventInit: settings.bot.eventInit,
      
      usercmds: normalizeCmd(settings.bot.usercmds),
      usercmdstimeout: settings.bot.usercmdstimeout,      
    },
    protectionCaps: settings.protectionCaps,
    protectionSymbol: settings.protectionSymbol,
    log: settings.log
  };
}

const normalizeCmd = (usercmds) => {
  let res = {}
  for (let item in usercmds) {
    let i = usercmds[item]
    i.cmd = i.prefix + i.cmd
    delete i.prefix
    res[i.cmd] = usercmds[item]
  }
  return res
}


document.addEventListener("DOMContentLoaded", () => {
  initialize();

  // to init settings
  if (new URL(document.URL).searchParams.get('type') == 'installed') {
    let div = document.createElement('div')
    div.classList.add('ex_updated')
    div.innerHTML = `<div class="title">Расширение BetterWASD - bot установлено!</div></br><div><ovg-button class="flat-btn ovg"><button class="primary medium ovg"> хорошо </button></ovg-button></div>`
    document.body.appendChild(div)
    document.querySelector('button').addEventListener('click', () => window.close())
  }

  // to update settings
  if (new URL(document.URL).searchParams.get('type') == 'updated') {
    let div = document.createElement('div')
    div.classList.add('ex_updated')
    div.innerHTML = `<div class="title">Расширение BetterWASD - bot было обновлено!</div><div class="description">Могут возникнуть некоторые ошибки, в слкчае их происхождения переустановите расширение! :(</div></br><div><ovg-button class="flat-btn ovg"><button class="primary medium ovg"> хорошо </button></ovg-button></div>`
    document.body.appendChild(div)
    document.querySelector('button').addEventListener('click', () => window.close())
  }
});
