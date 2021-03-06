const HelperSettings = {
  messageTimeout: null,
  availableSettings: {
    bot: {
      mybotmod: {
        title: 'БОТ модератор (beta)',
        description: 'Эта функция позволяет вам и модераторам использовать бота на своем канале.',
        type: 'title'
      },
      cmdBan: { // b
        title: '/ban/unban {USERNAME}',
        description: 'Забанить/Разбанить пользователя в чате',
        type: 'cmd2'
      },
      cmdMod: { // m
        title: '/mod/unmod {USERNAME}',
        description: 'Повысить пользователя до модератора канала, что даст ему доступ к командам и функциям и наоборот',
        type: 'cmd2'
      },
      cmdRaid: { // r
        title: '/raid {CHANNELNAME}',
        description: 'Эта команда отправит зрителя на другой канал в прямом эфире',
        type: 'cmd'
      },
      cmdTitle: { // t
        title: '/title [TEXT]',
        description: 'Изменить название стрима',
        type: 'cmd'
      },
      cmdGame: { // g
        title: '/game [GAMENAME]',
        description: 'Обновить игру канала (без ошибок)',
        type: 'cmd'
      },
      cmdFollowers: { // f
        title: '/followers/followersoff',
        description: 'Включает/отключает режим чата только для фолловеров',
        type: 'cmd2'
      },
      cmdSubscribers: { // s
        title: '/subscribers/subscribersoff',
        description: 'Включает/отключает режим чата только для платных подписчиков',
        type: 'cmd2'
      },
      cmdTimeout: {  // o
        title: '/timeout {USERNAME} [1/10/60]',
        description: 'Позволяет вам временно заблокировать кого-либо из чата по умолчанию на 10 минут',
        type: 'cmd'
      },

      mybotuser: {
        title: 'БОТ пользователь (beta)',
        description: 'Эта функция позволяет всем использовать бота на вашем канале.',
        type: 'title'
      },
      cmdUptime: { // u
        title: '!uptime',
        description: 'Эта команда позволяет узнать сколько идет стрим',
        type: 'cmd'
      },
      cmdUserTitle: { // w
        title: '!title',
        description: 'Эта команда позволяет узнать название стрима',
        type: 'cmd'
      },
      cmdUserGame: { // q
        title: '!game',
        description: 'Эта команда позволяет узнать категорию стрима',
        type: 'cmd'
      },
      cmdCommands: { // c
        title: '!commands',
        description: 'Позволяет пользователям получать список команд',
        type: 'cmd'
      },
      cmdPoints: { // p
        title: '!points [USERNAME]',
        description: 'Позволяет пользователям получать их количество монет',
        type: 'cmd'
      },

      event: {
        title: 'События (beta)',
        type: 'title'
      },
      eventInit: {
        title: `Бот подключился к каналу (${Helper.tooltip('{cmd_commands}', '!commands')})`,
        type: 'botevent'
      },
      eventFollow: {
        title: 'Пользователь подписался ({user_login})',
        type: 'botevent'
      },
      eventSub: {
        title: `Пользователь платно подписался ({user_login}, ${Helper.tooltip('{product_name}', '1 месяц, 2 месяца')})`,
        type: 'botevent'
      },

      usercmds: {
        type: 'builditems'
      },
      usercmdstimeout: {
        type: 'builditems'
      },
    },
    protectionCaps: {
      general: {
        title: 'Общее настройки защиты от заглавных букв',
        type: 'title'
      },
      autoPermit: {
        title: `Авто разрешение ${Helper.tooltip('', 'Установите группу пользователей, которая не будет наказана')}`,
        type: 'select',
        items: [
          {
            value: 0,
            label: 'Нет'
          },
          {
            value: 1,
            label: 'Подписчики'
          }
        ]
      },
      punishment: {
        title: 'Наказание',
        type: 'select',
        items: [
          {
            value: 0,
            label: 'Удалить'
          },
          {
            value: 1,
            label: 'Тайм-аут 1мин.'
          },
          {
            value: 2,
            label: 'Бан'
          }
        ]
      },
      sendPunishmentMessage: {
        title: 'Отправить сообщение о наказании ({user_login})',
        type: 'botevent'
      },
      advanced: {
        title: 'Настройки',
        type: 'title'
      },

      minCaps: {
        title: `Мин. Количество заглавных букв ${Helper.tooltip('', 'Установите количество заглавных букв до того, как система начнет обнаруживать')}`,
        type: 'number',
        min: 1
      },
      maxCaps: {
        title: `Максимум. Количество заглавных букв ${Helper.tooltip('', 'Установите максимально допустимое количество заглавных букв')}`,
        type: 'number',
        min: 1
      },
      percentCaps: {
        title: `Максимум. Процент ${Helper.tooltip('', 'Установите максимальный процент заглавных букв в сообщении')}`,
        type: 'number',
        min: 0,
        max: 100
      },
    },
    protectionSymbol: {
      general: {
        title: 'Общее настройки защиты от длинных сообщений',
        type: 'title'
      },
      autoPermit: {
        title: `Авто разрешение ${Helper.tooltip('', 'Установите группу пользователей, которая не будет наказана')}`,
        type: 'select',
        items: [
          {
            value: 0,
            label: 'Нет'
          },
          {
            value: 1,
            label: 'Подписчики'
          }
        ]
      },
      punishment: {
        title: 'Наказание',
        type: 'select',
        items: [
          {
            value: 0,
            label: 'Удалить'
          },
          {
            value: 1,
            label: 'Тайм-аут 1мин.'
          },
          {
            value: 2,
            label: 'Бан'
          }
        ]
      },
      sendPunishmentMessage: {
        title: 'Отправить сообщение о наказании ({user_login})',
        type: 'botevent'
      },
      advanced: {
        title: 'Настройки',
        type: 'title'
      },

      maxLength: {
        title: `Максимум. Длина сообщения ${Helper.tooltip('', 'Установите максимальное количество символов, разрешенное в одном сообщении')}`,
        type: 'number',
        min: 1
      },
    },
    protectionLink: {
      general: {
        title: 'Общее настройки защиты от ссылок',
        type: 'title'
      },
      autoPermit: {
        title: `Авто разрешение ${Helper.tooltip('', 'Установите группу пользователей, которая не будет наказана')}`,
        type: 'select',
        items: [
          {
            value: 0,
            label: 'Нет'
          },
          {
            value: 1,
            label: 'Подписчики'
          }
        ]
      },
      punishment: {
        title: 'Наказание',
        type: 'select',
        items: [
          {
            value: 0,
            label: 'Удалить'
          },
          {
            value: 1,
            label: 'Тайм-аут 1мин.'
          },
          {
            value: 2,
            label: 'Бан'
          }
        ]
      },
      blockType: {
        title: `Тип блокировки ${Helper.tooltip('', 'Черный список - блокируются сайты из этого списка. </br>Белый список - блокируются все сайты, которые не входят в этот список.')}`,
        type: 'select',
        items: [
          {
            value: 0,
            label: 'Черный список'
          },
          {
            value: 1,
            label: 'Белый список'
          }
        ]
      },
      sendPunishmentMessage: {
        title: 'Отправить сообщение о наказании ({user_login})',
        type: 'botevent'
      },
      advanced: {
        title: 'Настройки',
        type: 'title'
      },

      // maxLength: {
      //   title: `Максимум. Длина сообщения ${Helper.tooltip('', 'Установите максимальное количество символов, разрешенное в одном сообщении')}`,
      //   type: 'number',
      //   min: 1
      // },
    },
    log: {
      enabled: {
        title: 'Записывать журнал',
        description: 'сообщения, действия и др.',
        type: 'boolean'
      },
    },
    coins: {
      addCoinCount: {
        title: `Добавить монет за 5 минут просмотра`,
        type: 'number',
        min: 1,
        max: 100000
      },
      cmdStore: {
        title: '!store',
        description: 'Получить список товаров',
        type: 'cmd'
      },
      cmdStoreInfo: {
        title: '!storeinfo {ID}',
        description: 'Получить информацию о товаре',
        type: 'cmd'
      },
      cmdRedeem: {
        title: '!redeem {ID}',
        description: 'Используестя для покупки товара',
        type: 'cmd'
      }
    },
    // loyaltyStore: {
    //   addCustomBlock: {
    //     title: `Добавить пользовательский блок в панели канала (sorting_number панели)`,
    //     type: 'numberWithBoolean',
    //     min: 0,
    //     max: 100,
    //     onChange: (value) => {
    //       // console.log('change', value)
    //       if (value[1]) {
    //         chrome.runtime.sendMessage({ from: 'popup_bot', updateCustomizeBlockLoyaltyStore: value })
    //       } else {
    //         chrome.runtime.sendMessage({ from: 'popup_bot', deleteCustomizeBlockLoyaltyStore: true })
    //       }
    //     }
    //   },
    // },
    loyaltyUsers: {
      addCustomBlock: {
        title: `Добавить пользовательский блок в панели канала`,
        description: 'Номер сортировки',
        type: 'numberWithBoolean',
        min: 0,
        max: 100,
        onChange: (value) => {
          // console.log('change', value)
          if (value[1]) {
            chrome.runtime.sendMessage({ from: 'popup_bot', updateCustomizeBlockLoyaltyUsers: value })
          } else {
            chrome.runtime.sendMessage({ from: 'popup_bot', deleteCustomizeBlockLoyaltyUsers: true })
          }
        }
      },
    }
  },
  showMessage(message, type = 'success') {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    let status = document.querySelector('#status')
    let textElement = status.querySelector('p');
    textElement.innerHTML = message;
    textElement.classList.remove(...textElement.classList);
    textElement.classList.add(type);
    status.classList.add('active');
    let hide = () => {
      status.removeEventListener('click', hide);
      status.classList.remove('active');
      this.messageTimeout = null;
    };
    status.addEventListener('click', hide);
    this.messageTimeout = setTimeout(hide, 2000);
  },
  _basic(title, description, formField, line=false, id) {
    return `
    <div class="option ${line ? "title" : ""}" ${id ? "id=" + id : ""}>
      <div class="ovg-option" >
        <div class="option-line" >

          <div class="labelField">
            ${line ? '<div class="line"></div>' : ''}
            <span ${line ? 'class="titleline"' : 'class="title"'}> ${title} </span>
            ${description ? `<span class="description" ${line ? 'style="background-color: var(--wasd-color-prime); padding-right: 5px;"' : ''}> ${description} </span>` : ''}
          </div>
          <div class="formField">${formField}</div>

        </div>
      </div>
    </div>`;
  },
  async save(optionElements) {
    return new Promise((resolve, reject) => {
      let newSettings = JSON.parse(JSON.stringify(settings));
      for (let option of optionElements) {
        if (!option.dataset.name) continue;
        // console.log(option, newSettings)
        let split = option.dataset.name.split('_');
        let value = null;

        if (option.type === 'checkbox' && option.classList.contains('botevent')) {
          value = [newSettings[split[0]][split[1]][0], option.checked]
        } else if (option.type === 'text' && option.classList.contains('botevent')) {
          value = [option.value, newSettings[split[0]][split[1]][1]]
        } else if (option.type === 'checkbox' && option.classList.contains('numberWithBoolean')) {
          value = [newSettings[split[0]][split[1]][0], option.checked]
        } else if (option.dataset.type === 'number' || option.type === 'number' && option.classList.contains('numberWithBoolean')) {
          value = [option.value, newSettings[split[0]][split[1]][1]]
        } else if (option.dataset.type === 'boolean') {
          value = option.checked;
        } else if (option.dataset.type === 'cmd') {
          value = {enabled: option.checked, alias: newSettings[split[0]][split[1]].alias || ''};
        } else if (option.dataset.type === 'cmd2') {
          value = {enabled: option.checked, alias: newSettings[split[0]][split[1]].alias || '', unalias: newSettings[split[0]][split[1]].unalias || ''};
        } else if (option.type === 'radio') {
          value = option.checked && option.value === '1';
        } else if (option.type === 'checkbox') {
          value = option.checked;
        } else if (option.dataset.type === 'number' || option.type === 'number') {
          value = parseFloat(option.value);
        } else {
          value = option.value;
        }

        // console.log(value, split[0], split[1], settings[split[0]][split[1]])

        if (!newSettings[split[0]]) newSettings[split[0]] = {};

        newSettings[split[0]][split[1]] = value;

        let onChange = this.availableSettings[split[0]][split[1]]?.onChange;
        if (typeof onChange === 'function') onChange(value);
      }

      chrome.storage[storageType].set(newSettings, () => {
        this.showMessage('параметры сохранены', 'success');
        resolve()
      });

    })
  },
  saveSettings(newSettings) {
    chrome.storage[storageType].set(newSettings, () => {
      console.log('параметры сохранены');
    });
  },
  loaded() {
    chrome.storage.onChanged.addListener(async function(changes, namespace) {
      settings[Object.entries(changes)[0][0]] = Object.entries(changes)[0][1].newValue
      if (namespace === 'local') {
        // Helper.WASD.update();
      } else if (namespace === 'sync') {
        chrome.runtime.sendMessage({from: 'popup_bot',settings: 'get'})
      }
    });
    chrome.runtime.sendMessage({from: 'popup_bot',getData: 'loaded'})
  },
  build(category) {
    let html = '';
    let categorySettings = this.availableSettings[category];
    for (let name in categorySettings) {
      if (categorySettings.hasOwnProperty(name)) {
        let setting = categorySettings[name];
        let type = setting.type;
        let fieldName = `${category}_${name}`;
        if (type === 'boolean') {
          html += this.boolean(fieldName, setting.title, setting.description, settings[category][name], 'Вкл', 'Откл');
        } else if (type === 'cmd') {
          html += this.cmd(fieldName, setting.title, setting.description, settings[category][name], 'Вкл', 'Откл');
        } else if (type === 'cmd2') {
          html += this.cmd2(fieldName, setting.title, setting.description, settings[category][name], 'Вкл', 'Откл');
        } else if (type === 'text') {
          html += this.text(fieldName, setting.title, setting.description, settings[category][name]);
        } else if (type === 'number') {
          html += this.number(fieldName, setting.title, setting.description, settings[category][name], setting.min, setting.max);
        } else if (type === 'select') {
          html += this.select(fieldName, setting.title, setting.description, setting.items, settings[category][name]);
        } else if (type === 'none') {
          html += this.none(fieldName, setting.title, setting.description, settings[category][name]);
        } else if (type === 'title') {
          html += this.title(fieldName, setting.title, setting.description, settings[category][name], setting.id);
        } else if (type === 'color') {
          html += this.color(fieldName, setting.title, setting.description, settings[category][name]);
        } else if (type === 'botevent') {
          html += this.botevent(fieldName, setting.title, setting.description, settings[category][name]);
        } else if (type === 'numberWithBoolean') {
          html += this.numberWithBoolean(fieldName, setting.title, setting.description, settings[category][name], setting.min, setting.max);
        }
      }
    }

    return html;
  },
  boolean(name, title, description, defaultValue = false, yesButton = 'Вкл', noButton = 'Откл') {
    return this._basic(title, description, `
      <ol class="flexibleButtonGroup optionTypeBoolean">
        <label class="switch-ovg">
          <input option-type="boolean" type="checkbox" id="boolean_${name}" name="boolean_${name}" value="0" class="optionField" data-name="${name}" ${defaultValue ? 'checked' : ''}>
          <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
        </label>
      </ol>`);
  },
  cmd(name, title, description, defaultValue = {enabled: true, alias: ''}, yesButton = 'Вкл', noButton = 'Откл') {
    let def = Helper.getDefaultSettings()[name.split('_')[0]][name.split('_')[1]]
    return this._basic(title, description, `
      <ol class="flexibleButtonGroup optionTypeBoolean">
        <ovg-button class="flat-btn ovg change" style="right: 10px;">
          <button class="basic ovg small editCmd" data-name="${name}" data-alias="${def.alias}">
            <i class="wasd-icons-edit" style="pointer-events: none;"></i>
          </button>
          <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip>
        </ovg-button>
        <label class="switch-ovg">
          <input option-type="cmd" data-type="cmd" type="checkbox" id="cmd_${name}" name="cmd_${name}" value="0" class="optionField" data-name="${name}" ${defaultValue.enabled ? 'checked' : ''}>
          <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
        </label>
      </ol>`);
  },
  cmd2(name, title, description, defaultValue = {enabled: true, alias: '', unalias: ''}, yesButton = 'Вкл', noButton = 'Откл') {
    let def = Helper.getDefaultSettings()[name.split('_')[0]][name.split('_')[1]]
    return this._basic(title, description, `
      <ol class="flexibleButtonGroup optionTypeBoolean">
        <ovg-button class="flat-btn ovg change" style="right: 10px;">
          <button class="basic ovg small editCmd2" data-name="${name}" data-alias="${def.alias}"  data-unalias="${def.unalias}">
            <i class="wasd-icons-edit" style="pointer-events: none;"></i>
          </button>
          <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip>
        </ovg-button>
        <label class="switch-ovg">
          <input option-type="cmd2" data-type="cmd2" type="checkbox" id="cmd_${name}" name="cmd_${name}" value="0" class="optionField" data-name="${name}" ${defaultValue.enabled ? 'checked' : ''}>
          <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
        </label>
      </ol>`);
  },
  text(name, title, description, defaultValue = '') {
    return this._basic(title, description, `
      <ol class="flexibleButtonGroup optionTypeBoolean">
        <input type="text" class="optionField" data-name="${name}" value="${defaultValue}" />
        <!--button class="optionField def" data-name="${name}" option-type="text"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button-->
      </ol>`);
  },
  number(name, title, description, defaultValue = '', min = 0, max = 0) {
    return this._basic(title, description, `
      <ol class="flexibleButtonGroup optionTypeBoolean">
        <div class="def">
          <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
            <div ovg="" class="wasd-input-wrapper" style="padding: 0 0 8px 0;">
              <div ovg="" class="wasd-input">
                <input ovg="" class="ng-pristine optionField ng-untouched ng-valid" type="number" option-type="number" data-name="${name}" style="margin: 0;" value="${defaultValue}" ${min ? 'min="' + min + '" ' : ''}${max ? 'max="' + max + '"' : ''}/>
              </div>
            </div>
          </wasd-input>
          <ovg-tooltip><div class="tooltip tooltip_position-topRight tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Правая кнопка мыши для сброса </div></div></ovg-tooltip>
        </div>
        <!--button class="optionField def" data-name="${name}" option-type="number"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button-->
      </ol>`);
  },
  select(name, title, description, items = [1], defaultValue = '') {
    let selectOptions = '';
    defaultValue = defaultValue.toString();
    for (let item of items) {
      selectOptions += `<option value="${item.value}"${item.value.toString() === defaultValue ? ' selected' : ''}>${item.label}</option>`;
    }
    return this._basic(title, description, `
      <ol class="flexibleButtonGroup optionTypeBoolean">
        <div class="def">
          <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
            <div ovg="" class="wasd-input-wrapper" style="padding: 0 0 8px 0;">
              <div ovg="" class="wasd-input">
                <select class="optionField" data-name="${name}" option-type="select" style="padding-right: 35px;">${selectOptions}</select> <div class="accordion-header-arrow-ovg"><i class="wasd-icons-dropdown-top"></i></div>
              </div>
            </div>
          </wasd-input>
        </div>
        <!--button class="optionField def" data-name="${name}" option-type="select"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button-->
      </ol>`);
  },
  none(name, title, description, defaultValue = '') {
    return this._basic(title, description, ``, false);
  },
  title(name, title, description, defaultValue = '') {
    return this._basic(title, description, ``, true);
  },
  color(name, title, description, defaultValue = '') {
    return this._basic(title, description, `
      <ol class="flexibleButtonGroup optionTypeBoolean">
        <div class="def">
          <div class="clr-field" style="color: ${defaultValue};">
            <button aria-labelledby="clr-open-label"></button>
            <input type="text" option-type="color" class="optionField" data-name="${name}" value="${defaultValue}" data-coloris>
          </div>
          <ovg-tooltip><div class="tooltip tooltip_position-topRight tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Правая кнопка мыши для сброса </div></div></ovg-tooltip>
        </div>
      </ol>`);
  },
  botevent(name, title, description, defaultValue = ['', false], yesButton = 'Вкл', noButton = 'Откл') {
    return this._basic(title, description, `
      <ol class="flexibleButtonGroup optionTypeBoolean">
        <div class="def">
          <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
            <div ovg="" class="wasd-input-wrapper">
              <div ovg="" class="wasd-input" style="margin-right: 15px;">
                <input ovg="" class="ng-pristine optionField botevent ng-untouched ng-valid" type="text" option-type="botevent" data-name="${name}" style="margin: 0;" value="${defaultValue[0]}">
              </div>
            </div>
          </wasd-input>
          <ovg-tooltip><div class="tooltip tooltip_position-topRight tooltip_size-small" style="width: 260px;right: 40px;"><div class="tooltip-content tooltip-content_left"> Правая кнопка мыши для сброса </div></div></ovg-tooltip>
        </div>
        <label class="switch-ovg">
          <input option-type="boolean" type="checkbox" id="boolean_${name}" name="boolean_${name}" value="0" class="optionField botevent" data-name="${name}" ${defaultValue[1] ? 'checked' : ''}>
          <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
        </label>
        <!--button class="optionField def" data-name="${name}" option-type="botevent"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button-->
      </ol>`
    );
  },
  numberWithBoolean(name, title, description, defaultValue = [0, false], yesButton = 'Вкл', noButton = 'Откл', min = 0, max = 0) {
    return this._basic(title, description, `
      <ol class="flexibleButtonGroup optionTypeBoolean">
        <div class="def">
          <wasd-input _ngcontent-gmb-c228="" _ngcontent-gmb-c28="" class="ng-dirty ng-touched ng-valid">
            <div ovg="" class="wasd-input-wrapper">
              <div ovg="" class="wasd-input" style="margin-right: 15px;">
                <input ovg="" class="ng-pristine optionField numberWithBoolean ng-untouched ng-valid" type="number" option-type="numberWithBoolean" data-name="${name}" style="margin: 0;" value="${defaultValue[0]}" ${min ? 'min="' + min + '" ' : ''}${max ? 'max="' + max + '"' : ''}>
              </div>
            </div>
          </wasd-input>
          <ovg-tooltip><div class="tooltip tooltip_position-topRight tooltip_size-small" style="width: 260px;right: 40px;"><div class="tooltip-content tooltip-content_left"> Правая кнопка мыши для сброса </div></div></ovg-tooltip>
        </div>
        <label class="switch-ovg">
          <input option-type="boolean" type="checkbox" id="boolean_${name}" name="boolean_${name}" value="0" class="optionField numberWithBoolean" data-name="${name}" ${defaultValue[1] ? 'checked' : ''}>
          <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
        </label>
        <!--button class="optionField def" data-name="${name}" option-type="numberWithBoolean"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button-->
      </ol>`
    );
  }
}