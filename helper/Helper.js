const Helper = {
	tooltip(text, data) {
	  return `<a style="position: relative;" class="tooltip-wrapper" title='${data}'>${text == '' ? '<i _ngcontent-boj-c248="" class="wasd-icons-notice" style="font-size: 14px;"></i>' : text}</a>`
	},
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
      },
      protectionCaps: {
        autoPermit: '0',
        punishment: '0',
        sendPunishmentMessage: ['{user_login} -> Пожалуйста, воздержитесь от заглавных букв.', true],
        minCaps: 5,
        maxCaps: 50,
        percentCaps: 50
      },
      protectionSymbol: {
        autoPermit: '0',
        punishment: '0',
        sendPunishmentMessage: ['{user_login} -> Пожалуйста, воздержитесь от отправки длинных сообщений.', true],
        maxLength: 140,
      },
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
	    userCmdPrefix.value = changed.prefix
	    userCmdCmd.value = changed.cmd
	    userCmdResult.value = changed.result
	    userCmdPrivilege.selectedIndex = changed.privilege

	    document.querySelector('.cmdbot.form-bg').style.display = 'block'
	    document.querySelector('.cmdbot.form-bg .container h3').textContent = ' Изменить команду '
	  })

	  item.querySelector('.remove').addEventListener('click', ({ target }) => {
	    console.log('1', settings.bot.usercmds)

	    let deleted = settings.bot.usercmds[data.cmd]
	    delete settings.bot.usercmds[data.cmd]

	    item.remove()
	    HelperSettings.showMessage(`Команда ${deleted.cmd} удалена`, 'success')

	    console.log('2', settings.bot.usercmds)
	    HelperSettings.save([document.querySelector('.optionField')]);
	  })
	},
	addUserTimeout(data, index) {
	  console.log(data)
	  let html = document.querySelector('.usercmdstimeout.ovg-items')
	  let item = document.createElement('tr')
	  item.classList.add(`table-menu__block`)
	  item.style = 'justify-content: space-between;'
	  item.innerHTML = `<td><div><p name="${data.name}">${data.name}</p></div></td> <td><div><p message="${data.message}">${data.message}</p></div></td> <td><div><p interval="${data.interval}">${data.interval}</p></div></td> <td><div><p minMessages="${data.minMessages ? data.minMessages : "5"}">${data.minMessages ? data.minMessages : "5"}</p></div></td> <td class="td-btns"><div> 
	  <ovg-button class="flat-btn ovg remove"> <button class="medium ovg removeUser warning" data="22814674"><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button>
	  <ovg-button class="flat-btn ovg change" style="left: 10px;"> <button class="basic medium ovg updateUser" data="22814674"><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button>
	  </div></td>`;
	  item.setAttribute("itemtime", data.cmd)
	  html.append(item)

	  item.querySelector('.change').addEventListener('click', ({ target }) => {
	    let changed = settings.bot.usercmdstimeout[data.name]
	    console.log(changed)
	    timeoutName.value = changed.name
	    timeoutMessage.value = changed.message
	    timeoutInterval.value = changed.interval
	    timeoutMinMessages.value = changed.minMessages

	    document.querySelector('.timer.form-bg').style.display = 'block'
	    document.querySelector('.timer.form-bg .container h3').textContent = ' Изменить таймер '
	  })

	  item.querySelector('.remove').addEventListener('click', ({ target }) => {
	    console.log('1', settings.bot.usercmdstimeout)

	    let deleted = settings.bot.usercmdstimeout[data.name]
	    delete settings.bot.usercmdstimeout[data.name]

	    item.remove()
	    HelperSettings.showMessage(`Команда ${deleted.name} удалена`, 'success')

	    console.log('2', settings.bot.usercmdstimeout)
	    HelperSettings.save([document.querySelector('.optionField')]);
	  })
	},
	tryAddUserCmd(data) {
	  if (data.prefix.trim() == '') {
	    HelperSettings.showMessage('Null prefix', 'error')
	    return 'err'
	  }
	  if (data.cmd.trim() == '') {
	    HelperSettings.showMessage('Null cmd', 'error')
	    return 'err'
	  }
	  if (data.result.trim() == '') {
	    HelperSettings.showMessage('Null result', 'error')
	    return 'err'
	  }

	  if (!settings.bot.usercmds[data.cmd]) {
	    settings.bot.usercmds[data.cmd] = data
	    Helper.addUserCmd(data)
	    HelperSettings.save([document.querySelector('.optionField')]);
	  } else {
	    settings.bot.usercmds[data.cmd] = data

	    let item = document.querySelector(`[itemcmd="${data.cmd}"]`)

	    item.querySelector('[prefix]').textContent = data.prefix
	    item.querySelector('[cmd]').textContent = data.cmd
	    item.querySelector('[result]').textContent = data.result
	    item.querySelector('[privilege]').textContent = `${data.privilege == 0 ? 'Модератор' : ''}${data.privilege == 1 ? 'Подписчик' : ''}${data.privilege == 2 ? 'Каждый' : ''}`

	    HelperSettings.save([document.querySelector('.optionField')]);
	  }
	},
	tryAddUserTimeout(data) {
	  if (data.name.trim() == '') {
	    HelperSettings.showMessage('Null name', 'error')
	    return 'err'
	  }
	  if (data.message.trim() == '') {
	    HelperSettings.showMessage('Null message', 'error')
	    return 'err'
	  }
	  if (data.interval < 5) {
	    HelperSettings.showMessage('Interval < 5', 'error')
	    return 'err'
	  }
	  if (data.minMessages < 1) {
	    HelperSettings.showMessage('MinMessages < 1', 'error')
	    return 'err'
	  }

	  if (!settings.bot.usercmdstimeout[data.name]) {
	    settings.bot.usercmdstimeout[data.name] = data
	    Helper.addUserTimeout(data)
	    HelperSettings.save([document.querySelector('.optionField')]);
	  } else {
	    settings.bot.usercmdstimeout[data.name] = data

	    let item = document.querySelector(`[itemtime="${data.cmd}"]`)

	    item.querySelector('[name]').textContent = data.name
	    item.querySelector('[message]').textContent = data.message
	    item.querySelector('[interval]').textContent = data.interval
	    item.querySelector('[minMessages]').textContent = data.minMessages

	    HelperSettings.save([document.querySelector('.optionField')]);
	  }
	}
};