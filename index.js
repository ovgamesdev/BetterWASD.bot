let storageType = 'sync';

tooltip = (text, data) =>  {
  return `<a style="position: relative;" class="tooltip-wrapper" title='${data}'>${text}</a>`
}

const Helper = {
  getDefaultSettings() {
    return {
      bot: {
        cmdPrefixBotMod: ['/', true],
        cmdBan: true,
        cmdMod: true,
        cmdRaid: true,
        cmdTitle: true,
        cmdGame: true,
        cmdFollowers: true,
        cmdSubscribers: true,
        cmdTimeout: true,

        cmdPrefixBotUser: ['!', true],
        cmdUptime: true,
        cmdUserTitle: true,
        cmdUserGame: true,

        eventFollow: ['{user_login} Спасибо за подписку!', false],
        eventSub: ['{user_login} Спасибо за платную подписку на {product_name}!', false],
        eventInit: ['Bot inited', true],
        
        usercmds: {},
        usercmdstimeout: {}
      }
    };
  },
  getSettings() {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined') {
        chrome.storage[storageType].get((items) => {
          let defaultSettings = this.getDefaultSettings();
          if (typeof items.bot !== 'undefined') {
            items = items || {};

            for (let key in defaultSettings) {
              if (defaultSettings.hasOwnProperty(key)) {
                items[key] = Object.assign(defaultSettings[key], items[key] || {});
              }
            }
            resolve(items);
          } else {
            chrome.storage[storageType].set(defaultSettings, () => {console.log('settings inited')});
            resolve(defaultSettings);
          }

        });
      } else {
        reject('browser not supported?');
      }
    });
  },

  Settings: {
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
          title: `Пользователь платно подписался ({user_login}, ${tooltip('{product_name}', '1 месяц, 2 месяца')})`,
          type: 'botevent'
        },
      }
    },
    showMessage(message, type = 'success') {
      if (this.messageTimeout) {
        clearTimeout(this.messageTimeout);
      }

      let statusElement = BetterStreamChat.settingsDiv.querySelector('#status');
      let textElement = statusElement.querySelector('p');
      textElement.innerHTML = message;
      textElement.classList.remove(...textElement.classList);
      textElement.classList.add(type);
      statusElement.classList.add('active');
      let hide = () => {
        statusElement.removeEventListener('click', hide);
        statusElement.classList.remove('active');
        this.messageTimeout = null;
      };
      statusElement.addEventListener('click', hide);
      this.messageTimeout = setTimeout(hide, 2000);
    },
    _basic(title, description, formField, line=false, id) {
      return `
      <div class="option" id="${id}">
        <div class="ovg-option" >
          <div class="option-line" >

            <div class="labelField">
              ${line ? '<div class="line"></div>' : ''}
              <span ${line ? 'class="titleline"' : 'class="title"'}> ${title} </span>
              <span class="description" style="display: block;"> ${description || ''}</span>
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

        let onChange = this.availableSettings[split[0]][split[1]].onChange;
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
  },

  addUserCmd(data) {
    console.log(data)
    let html = document.querySelector('.usercmds.ovg-items')
    let item = document.createElement('tr')
    item.classList.add(`table-menu__block`)
    item.style = 'justify-content: space-between;'
    item.innerHTML = `<td><div><p prefix="${data.prefix}">${data.prefix}</p></div></td> <td><div><p cmd="${data.cmd}">${data.cmd}</p></div></td> <!--td><div><p attributes="${data.attributes}">${data.attributes}</p></div></td--> <td><div><p result="${data.result}">${data.result}</p></div></td> <td><div><p privilege="${data.privilege}">${data.privilege == 0 ? 'Модератор' : ''}${data.privilege == 1 ? 'Подписчик' : ''}${data.privilege == 2 ? 'Каждый' : ''}</p></div></td> <td class="td-btns"><div> 
    <ovg-button class="flat-btn ovg remove"> <button class="medium ovg removeUser warning" data="22814674"><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button>
    <ovg-button class="flat-btn ovg change" style="left: 10px;"> <button class="basic medium ovg updateUser" data="22814674"><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button>
    </div></td>`;
    item.setAttribute("itemcmd", data.cmd)
    html.append(item)

    item.querySelector('.change').addEventListener('click', ({ target }) => {
      let changed = settings.bot.usercmds[data.cmd]
      document.querySelector('[id="userCmdPrefix"]').value = changed.prefix
      document.querySelector('[id="userCmdCmd"]').value = changed.cmd
      document.querySelector('[id="userCmdResult"]').value = changed.result
      document.querySelector('[id="userCmdPrivilege"]').selectedIndex = changed.privilege
    })

    item.querySelector('.remove').addEventListener('click', ({ target }) => {
      console.log('1', settings.bot.usercmds)

      let deleted = settings.bot.usercmds[data.cmd]
      delete settings.bot.usercmds[data.cmd]

      item.remove()
      Helper.Settings.showMessage(`Команда ${deleted.cmd} удалена`, 'success')

      console.log('2', settings.bot.usercmds)
      Helper.Settings.save([document.querySelector('.optionField')]);
    })
  },
  addUserTimeout(data, index) {
    console.log(data)
    let html = document.querySelector('.usercmdstimeout.ovg-items')
    let item = document.createElement('tr')
    item.classList.add(`table-menu__block`)
    item.style = 'justify-content: space-between;'
    item.innerHTML = `<td><div><p name="${data.name}">${data.name}</p></div></td> <td><div><p message="${data.message}">${data.message}</p></div></td> <td><div><p interval="${data.interval}">${data.interval}</p></div></td> <td class="td-btns"><div> 
    <ovg-button class="flat-btn ovg remove"> <button class="medium ovg removeUser warning" data="22814674"><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button>
    <ovg-button class="flat-btn ovg change" style="left: 10px;"> <button class="basic medium ovg updateUser" data="22814674"><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button>
    </div></td>`;
    item.setAttribute("itemtime", data.cmd)
    html.append(item)

    item.querySelector('.change').addEventListener('click', ({ target }) => {
      let changed = settings.bot.usercmdstimeout[data.name]
      console.log(changed)
      document.querySelector('[id="timeoutName"]').value = changed.name
      document.querySelector('[id="timeoutMessage"]').value = changed.message
      document.querySelector('[id="timeoutInterval"]').value = changed.interval
    })

    item.querySelector('.remove').addEventListener('click', ({ target }) => {
      console.log('1', settings.bot.usercmdstimeout)

      let deleted = settings.bot.usercmdstimeout[data.name]
      delete settings.bot.usercmdstimeout[data.name]

      item.remove()
      Helper.Settings.showMessage(`Команда ${deleted.name} удалена`, 'success')

      console.log('2', settings.bot.usercmdstimeout)
      Helper.Settings.save([document.querySelector('.optionField')]);
    })
  },
  tryAddUserCmd(data) {
    if (data.prefix.trim() == '') {
      Helper.Settings.showMessage('Null prefix', 'error')
      return 'err'
    }
    if (data.cmd.trim() == '') {
      Helper.Settings.showMessage('Null cmd', 'error')
      return 'err'
    }
    if (data.result.trim() == '') {
      Helper.Settings.showMessage('Null result', 'error')
      return 'err'
    }

    if (!settings.bot.usercmds[data.cmd]) {
      settings.bot.usercmds[data.cmd] = data
      Helper.addUserCmd(data)
      Helper.Settings.save([document.querySelector('.optionField')]);
    } else {
      settings.bot.usercmds[data.cmd] = data

      let item = document.querySelector(`[itemcmd="${data.cmd}"]`)

      item.querySelector('[prefix]').textContent = data.prefix
      item.querySelector('[cmd]').textContent = data.cmd
      item.querySelector('[result]').textContent = data.result
      item.querySelector('[privilege]').textContent = `${data.privilege == 0 ? 'Модератор' : ''}${data.privilege == 1 ? 'Подписчик' : ''}${data.privilege == 2 ? 'Каждый' : ''}`

      Helper.Settings.save([document.querySelector('.optionField')]);
    }
  },
  tryAddUserTimeout(data) {
    if (data.name.trim() == '') {
      Helper.Settings.showMessage('Null name', 'error')
      return 'err'
    }
    if (data.message.trim() == '') {
      Helper.Settings.showMessage('Null message', 'error')
      return 'err'
    }
    if (data.interval < 5) {
      Helper.Settings.showMessage('Interval < 5', 'error')
      return 'err'
    }

    if (!settings.bot.usercmdstimeout[data.name]) {
      settings.bot.usercmdstimeout[data.name] = data
      Helper.addUserTimeout(data)
      Helper.Settings.save([document.querySelector('.optionField')]);
    } else {
      settings.bot.usercmdstimeout[data.name] = data

      let item = document.querySelector(`[itemtime="${data.cmd}"]`)

      item.querySelector('[name]').textContent = data.name
      item.querySelector('[message]').textContent = data.message
      item.querySelector('[interval]').textContent = data.interval

      Helper.Settings.save([document.querySelector('.optionField')]);
    }
  }
};

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
          <img src="chrome-extension://leildpnijdjakgapjimklcbkdgfpheck/img/icon128.png" style="width: 32px; height: 32px;">
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
            <a role="tab" class="item active" data-tab="bot">Команды чата</a>
            <a role="tab" class="item" data-tab="cmdbot">Пользовательские команды</a>
            <a role="tab" class="item" data-tab="timeoutbot">Таймеры бота</a>
            <a role="tab" class="item" data-tab="variables">Переменные</a>
            <a role="tab" class="item" data-tab="changelog">Журнал изменений</a>
            <!--a role="tab" class="item" data-tab="backup">Бэкап</a-->
          </div>
        </div>
      </section>

      <main class="text" data-tab="about" style="background-color: var(--wasd-color-bg-prime);">
        <div class="aboutHalf">
          <img class="aboutIcon" src="${chrome.extension.getURL("img/icon128.png")}">
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

        ${Helper.Settings.build('bot')}
      </main>

      <main class="text" data-tab="cmdbot">
        <h1 style="padding-left: 10px; padding-right: 10px;"> Пользовательские команды </h1>
        <h4 style="margin-top:10px;padding-left: 10px;padding-right: 0px;"> Добавить/Изменить команду </h4>
        <div style="padding-left: 10px;">
          <input placeholder="Префикс" id="userCmdPrefix" style="width: 65px;margin-right: 2px;"/>
          <input placeholder="Команда" id="userCmdCmd" style="width: 80px;margin-right: 2px;"/>
          <!--input placeholder="Атрибут" id="userCmdAtributes" style="width: 80px;"/-->
          <input placeholder="Ответ на команду. (Поддерживает переменные)" id="userCmdResult" style="width: 312px;margin-right: 2px;"/>
          <select id="userCmdPrivilege" style="margin-right: 2px;width: 70px;">
            <option value="0" > Модератор </option>
            <option value="1" > Подписчик </option>
            <option value="2" selected > Каждый </option>
          </select>
          <button id="addCmdBtn" class="ovg-button">+</button>
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
        <h1 style="padding-left: 10px; padding-right: 10px;"> Таймеры бота </h1>
        <h4 style="margin-top:10px;padding-left: 10px;padding-right: 0px;"> Добавить таймер </h4>
        <div style="padding-left: 10px;">
          <input placeholder="Имя" id="timeoutName" style="width: 80px;margin-right: 2px;"/>
          <input placeholder="Сообщение (Поддерживает переменные)" id="timeoutMessage" style="width: 275px;margin-right: 2px;"/>
          <input type="number" value="300" min="5" placeholder="interval" id="timeoutInterval" style="width: 80px;margin-right: 2px;"/>
          <button id="addTimeoutBtn" class="ovg-button">+</button>
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
              <div class="table-heading-text-ovg">Интервал (сек)</div>
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
          <tbody class="ovg-items">
          </tbody>
        </table>
      </main>

      <main class="text" data-tab="backup">

        <input id="importInput" type="file" accept=".backup" style="display: none;">
        <span> Эта функция позволяет вам сохранить и восстановить ваши настройки BetterWASD.bot </span>
        <div style="padding-top: 10px;">
          <div class="ovg-button-div">
            <button class="primary medium ovg backup-download">
              <span class="primary medium ovg-button-span">
                <img style="width: 20px; height: 20px;" src="${chrome.extension.getURL("img/download.png")}">
              </span>
              <span> Сохранить </span>
            </button>
          </div>

          <div class="ovg-button-div">
            <button class="primary medium ovg backup-upload">
              <span class="primary medium ovg-button-span">
                <img style="width: 20px; height: 20px;" src="${chrome.extension.getURL("img/upload.png")}">
              </span>
              <span> Восстановить </span>
            </button>
          </div>
        </div>
      </main>

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
    for (let navItem of settingsDiv.querySelectorAll('section .items > a')) {
      navItem.addEventListener('click', ({
        target
      }) => {
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

        target.classList.add('active');
        settingsDiv.querySelector(`main[data-tab="${target.dataset.tab}"]`).classList.add('active');
      });
    }

    // change event
    for (let option of settingsDiv.querySelectorAll('.optionField')) {
      option.addEventListener('change', (event) => {
        Helper.Settings.save([event.target]);
      });
    }

    for (let cmd in settings.bot.usercmds) {
      Helper.addUserCmd(settings.bot.usercmds[cmd])
    }

    for (let cmd in settings.bot.usercmdstimeout) {
      Helper.addUserTimeout(settings.bot.usercmdstimeout[cmd])
    }

    settingsDiv.querySelector('#addCmdBtn').addEventListener('click', () => {
      let prefix = settingsDiv.querySelector('#userCmdPrefix').value.trim()
      let cmd = settingsDiv.querySelector('#userCmdCmd').value.trim()
      // let attributes = settingsDiv.querySelector('#userCmdAtributes').value.trim()
      let result = settingsDiv.querySelector('#userCmdResult').value.trim()
      let privilege = settingsDiv.querySelector('#userCmdPrivilege').selectedIndex

      let value = {prefix: prefix, cmd: cmd, attributes: '', result: result, privilege: privilege, enabled: true}

      if (Helper.tryAddUserCmd(value) == 'err') return

      document.querySelector('[id="userCmdPrefix"]').value = ''
      document.querySelector('[id="userCmdCmd"]').value = ''
      document.querySelector('[id="userCmdResult"]').value = ''
      document.querySelector('[id="userCmdPrivilege"]').selectedIndex = 2
    })

    settingsDiv.querySelector('#addTimeoutBtn').addEventListener('click', () => {
      let name = settingsDiv.querySelector('#timeoutName').value.trim()
      let message = settingsDiv.querySelector('#timeoutMessage').value.trim()
      let interval = Number(settingsDiv.querySelector('#timeoutInterval').value)

      let value = {name: name, message: message, interval: interval, enabled: true}

      if (Helper.tryAddUserTimeout(value) == 'err') return

      document.querySelector('[id="timeoutName"]').value = ''
      document.querySelector('[id="timeoutMessage"]').value = ''
      document.querySelector('[id="timeoutInterval"]').value = 300
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
  Helper.Settings.loaded()
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
    }
  };
}