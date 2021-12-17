const HelperSettings = {
  messageTimeout: null,
  availableSettings: {
    bot: {
      mybotmod: {
        title: 'БОТ модератор (beta)',
        description: 'Эта функция позволяет вам и модераторам использовать бота на своем канале.',
        type: 'title'
      },
      cmdPrefixBotMod: {
        title: 'Префикс команд.',
        type: 'botevent'
      },
      cmdBan: {
        title: '/ban/unban {USERNAME}',
        description: 'Забанить/Разбанить пользователя в чате',
        type: 'boolean'
      },
      cmdMod: {
        title: '/mod/unmod {USERNAME}',
        description: 'Повысить пользователя до модератора канала, что даст ему доступ к командам и функциям и наоборот',
        type: 'boolean'
      },
      cmdRaid: {
        title: '/raid {CHANNELNAME}',
        description: 'Эта команда отправит зрителя на другой канал в прямом эфире',
        type: 'boolean'
      },
      cmdTitle: {
        title: '/title [TEXT]',
        description: 'Изменить название стрима',
        type: 'boolean'
      },
      cmdGame: {
        title: '/game [GAMENAME]',
        description: 'Обновить игру канала (без ошибок)',
        type: 'boolean'
      },
      cmdFollowers: {
        title: '/followers/followersoff',
        description: 'Эта команда включает/отключает режим чата только для фолловеров',
        type: 'boolean'
      },
      cmdSubscribers: {
        title: '/subscribers/subscribersoff',
        description: 'Эта команда включает/отключает режим чата только для платных подписчиков',
        type: 'boolean'
      },
      cmdTimeout: {
        title: '/timeout {USERNAME} [1/10/60]',
        description: 'Эта команда позволяет вам временно заблокировать кого-либо из чата по умолчанию на 10 минут',
        type: 'boolean'
      },

      mybotuser: {
        title: 'БОТ пользователь (beta)',
        description: 'Эта функция позволяет всем использовать бота на вашем канале.',
        type: 'title'
      },
      cmdPrefixBotUser: {
        title: 'Префикс команд.',
        type: 'botevent'
      },
      cmdUptime: {
        title: '!uptime',
        description: 'Эта команда позволяет узнать сколько идет стрим',
        type: 'boolean'
      },
      cmdUserTitle: {
        title: '!title',
        description: 'Эта команда позволяет узнать название стрима',
        type: 'boolean'
      },
      cmdUserGame: {
        title: '!game',
        description: 'Эта команда позволяет узнать категорию стрима',
        type: 'boolean'
      },
      /*cmdFollowage: {
        title: '!followage - Эта команда позволяет узнать сколько пользователь отслеживает на ваш канал.',
        type: 'boolean'
      },*/

      event: {
        title: 'События (beta)',
        type: 'title'
      },
      eventInit: {
        title: 'Бот подключился к каналу',
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
        items: [{
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
        items: [{
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
        items: [{
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
        items: [{
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
    log: {
      enabled: {
        title: 'Записывать журнал',
        description: 'сообщения, действия и др.',
        type: 'boolean'
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
            ${description ? `<span class="description"> ${description} </span>` : ''}
          </div>
          <div class="formField">${formField}</div>

        </div>
      </div>
    </div>`;
  },
  save(optionElements) {
    let newSettings = JSON.parse(JSON.stringify(settings));
    for (let option of optionElements) {
      if (!option.dataset.name) continue;
      console.log(option)
      let split = option.dataset.name.split('_');
      let value = null;

      if (option.type === 'checkbox' && option.classList.contains('botevent')) {
        value = [settings[split[0]][split[1]][0], option.checked]
      } else if (option.type === 'text' && option.classList.contains('botevent')) {
        value = [option.value, settings[split[0]][split[1]][1]]
      } else if (option.type === 'radio') {
        value = option.checked && option.value === '1';
      } else if (option.type === 'checkbox') {
        value = option.checked;
      } else if (option.dataset.type === 'number' || option.type === 'number') {
        value = parseFloat(option.value);
      } else {
        value = option.value;
      }

      console.log(value, split[0], split[1], settings[split[0]][split[1]])

      if (!newSettings[split[0]]) newSettings[split[0]] = {};

      newSettings[split[0]][split[1]] = value;

      let onChange = this.availableSettings[split[0]][split[1]]?.onChange;
      if (typeof onChange === 'function') onChange(value);
    }
    chrome.storage[storageType].set(newSettings, () => {
      this.showMessage('параметры сохранены', 'success');
    });
  },
  loaded() {
    chrome.storage.onChanged.addListener(async function(changes, namespace) {
      if (namespace === 'local') {
        // Helper.WASD.update();
      } else if (namespace === 'sync') {
        settings = await Helper.getSettings();
      }
    });
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
        }
      }
    }

    return html;
  },
  boolean(name, title, description, defaultValue = false, yesButton = 'Вкл', noButton = 'Откл') {
    if (typeof defaultValue === 'undefined') {
      updateSettingsToNew()
      return ''
    } else {
      return this._basic(title, description, `
        <ol class="flexibleButtonGroup optionTypeBoolean">
          <label class="switch-ovg">
            <input option-type="boolean" type="checkbox" id="boolean_${name}" name="boolean_${name}" value="0" class="optionField" data-name="${name}" ${defaultValue ? 'checked' : ''}>
            <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
          </label>
        </ol>`);
    }
  },
  text(name, title, description, defaultValue = '') {
    if (typeof defaultValue === 'undefined') {
      updateSettingsToNew()
      return ''
    } else {
      return this._basic(title, description, `
        <ol class="flexibleButtonGroup optionTypeBoolean">
          <input type="text" class="optionField" data-name="${name}" value="${defaultValue}" />
          <!--button class="optionField def" data-name="${name}" option-type="text"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button-->
        </ol>`);
    }
  },
  number(name, title, description, defaultValue = '', min = 0, max = 0) {
    if (typeof defaultValue === 'undefined') {
      updateSettingsToNew()
      return ''
    } else {
      return this._basic(title, description, `
        <ol class="flexibleButtonGroup optionTypeBoolean">
          <div class="def">
            <input type="number" class="optionField" data-name="${name}" value="${defaultValue}" ${min ? 'min="' + min + '" ' : ''}${max ? 'max="' + max + '"' : ''}/>
            <ovg-tooltip><div class="tooltip tooltip_position-topRight tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Правая кнопка мыши для сброса </div></div></ovg-tooltip>
          </div>
          <!--button class="optionField def" data-name="${name}" option-type="number"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button-->
        </ol>`);
    }
  },
  select(name, title, description, items = [1], defaultValue = '') {
    if (typeof defaultValue === 'undefined') {
      updateSettingsToNew()
      return ''
    } else {
      let selectOptions = '';
      defaultValue = defaultValue.toString();
      for (let item of items) {
        selectOptions += `
        <option value="${item.value}"${item.value.toString() === defaultValue ? ' selected' : ''}>${item.label}</option>`;
      }
      return this._basic(title, description, `
        <ol class="flexibleButtonGroup optionTypeBoolean">
          <div class="def">
            <select class="optionField" data-name="${name}">${selectOptions}</select>
          </div>
          <!--button class="optionField def" data-name="${name}" option-type="select"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button-->
        </ol>`);
    }
  },
  none(name, title, description, defaultValue = '') {
    return this._basic(title, description, ``, false);
  },
  title(name, title, description, defaultValue = '') {
    return this._basic(title, description, ``, true);
  },
  color(name, title, description, defaultValue = '') {
    if (typeof defaultValue === 'undefined') {
      updateSettingsToNew()
      return ''
    } else {
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
    }
  },
  botevent(name, title, description, defaultValue = ['', false], yesButton = 'Вкл', noButton = 'Откл') {
    if (typeof defaultValue === 'undefined') {
      updateSettingsToNew()
      return ''
    } else {
      return this._basic(title, description, `
        <ol class="flexibleButtonGroup optionTypeBoolean">
          <div class="def">
            <input option-type="botevent" type="text" class="optionField botevent" data-name="${name}" value="${defaultValue[0]}"/>
            <ovg-tooltip><div class="tooltip tooltip_position-topRight tooltip_size-small" style="width: 260px;right: 40px;"><div class="tooltip-content tooltip-content_left"> Правая кнопка мыши для сброса </div></div></ovg-tooltip>
          </div>
          <label class="switch-ovg">
            <input option-type="boolean" type="checkbox" id="boolean_${name}" name="boolean_${name}" value="0" class="optionField botevent" data-name="${name}" ${defaultValue[1] ? 'checked' : ''}>
            <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
          </label>
          <!--button class="optionField def" data-name="${name}" option-type="botevent"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button-->
        </ol>`
      );
    }
  },
}