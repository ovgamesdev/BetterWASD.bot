const Helper = {
	tooltip(text, data) {
	  return `<a style="position: relative;" class="tooltip-wrapper" title='${data}'>${text == '' ? '<i _ngcontent-boj-c248="" class="wasd-icons-notice" style="font-size: 14px;"></i>' : text}</a>`
	},
  getDefaultSettings() {
    return {
      bot: {
        cmdBan: { enabled: true, alias: '/ban', unalias: '/unban' },
        cmdMod: { enabled: true, alias: '/mod', unalias: '/unmod' },
        cmdRaid: { enabled: true, alias: '/raid' },
        cmdTitle: { enabled: true, alias: '/title' },
        cmdGame: { enabled: true, alias: '/game' },
        cmdFollowers: { enabled: true, alias: '/followers', unalias: '/followersoff' },
        cmdSubscribers: { enabled: true, alias: '/subscribers', unalias: '/subscribersoff' },
        cmdTimeout: { enabled: true, alias: '/timeout' },

        cmdUptime: { enabled: true, alias: '!uptime' },
        cmdUserTitle: { enabled: true, alias: '!title' },
        cmdUserGame: { enabled: true, alias: '!game' },
        cmdCommands: { enabled: true, alias: '!commands' },

        eventFollow: ['{user_login} Спасибо за подписку!', false],
        eventSub: ['{user_login} Спасибо за платную подписку на {product_name}!', false],
        eventInit: ['Бот запущен. Что я умею: {cmd_commands}', true],
        
        usercmds: {},
        usercmdstimeout: {}
      },
      protectionCaps: {
      	status: false,
        autoPermit: '0',
        punishment: '0',
        sendPunishmentMessage: ['{user_login} -> Пожалуйста, воздержитесь от заглавных букв.', true],
        minCaps: 5,
        maxCaps: 50,
        percentCaps: 50
      },
      protectionSymbol: {
      	status: false,
        autoPermit: '0',
        punishment: '0',
        sendPunishmentMessage: ['{user_login} -> Пожалуйста, воздержитесь от отправки длинных сообщений.', true],
        maxLength: 140,
      },
      log: {
      	enabled: true,
      	type: {
      		// system_message: true,
      		message: true,
      		// sticker: true,
					// event: true,
					// giftsV1: true,
					// yadonat: true,
					// messageDeleted: true,
					subscribe: true,
					// _system: true,
					// leave: true,
					user_ban: true,
					// settings_update: true,
      		// joined: true,
      	}
      },
      coins: {
      	addCoinCount: 1,
      	users: {}
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
	addUserCmd(data) {
	  console.log(data)
	  let html = document.querySelector('.usercmds.ovg-items')
	  let item = document.createElement('tr')
	  item.classList.add(`table-menu__block`)
	  item.style = 'justify-content: space-between;'
	  item.innerHTML = `<td><div><p cmd="${data.cmd}">${data.cmd}</p></div></td> <!--td><div><p attributes="${data.attributes}">${data.attributes}</p></div></td--> <td><div><p result="${data.result}">${data.result}</p></div></td> <td><div><p privilege="${data.privilege}">${data.privilege == 0 ? 'Модератор' : ''}${data.privilege == 1 ? 'Подписчик' : ''}${data.privilege == 2 ? 'Каждый' : ''}</p></div></td> <td class="td-btns" style="text-align: end;"><div> 
	  <ovg-button class="flat-btn ovg remove" style="right: 20px;"> <button class="medium ovg removeUser warning" data="22814674"><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button>
	  <ovg-button class="flat-btn ovg change" style="right: 10px;"> <button class="basic medium ovg updateUser" data="22814674"><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button>
    
    <label class="switch-ovg" style="align-self: center;">
      <input type="checkbox" class="optionField" ${data.enabled ? 'checked' : ''}>
      <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
    </label>

	  </div></td>`;
	  item.setAttribute("itemcmd", data.cmd)
	  html.append(item)

	  item.querySelector('.change').addEventListener('click', () => {
	    let changed = settings.bot.usercmds[data.cmd]
	    userCmdCmd.value = changed.cmd
	    userCmdResult.value = changed.result
	    userCmdPrivilege.selectedIndex = changed.privilege

	    Helper.showModal('cmdbot')
	    document.querySelector('ovg-modal-window.cmdbot .modal-block__title span').textContent = ' Изменить команду '
	  })

	  item.querySelector('.remove').addEventListener('click', () => {
	    console.log('1', settings.bot.usercmds)

	    let deleted = settings.bot.usercmds[data.cmd]
	    delete settings.bot.usercmds[data.cmd]

	    item.remove()
			this.setNotFoundUserCmd()
	    HelperSettings.showMessage(`Команда ${deleted?.cmd} удалена`, 'success')

	    console.log('2', settings.bot.usercmds)
	    HelperSettings.save([document.querySelector('.optionField')]);
	  })

	  let input = item.querySelector('input')
	  input.addEventListener('change', ({e}) => {
	    console.log(input.checked)
	    settings.bot.usercmds[data.cmd].enabled = input.checked


	    HelperSettings.save([document.querySelector('.optionField')]);
	  })

		document.querySelector('.usercmds.ovg-items .not-found')?.remove()
	},
	setNotFoundUserCmd() {
		if (document.querySelector('.usercmds.ovg-items').childElementCount == 0) {
      let div = document.createElement('div')
      document.querySelector('.usercmds.ovg-items').append(div)
      div.outerHTML = '<div class="not-found" style="position: absolute;width: 748px;height: 321px;"><div style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);">Команд пока нет.. Нажмите кнопку «Добавить команду», чтобы создать его.</div></div>'
    }
	},
	addUserTimeout(data, index) {
	  console.log(data)
	  let html = document.querySelector('.usercmdstimeout.ovg-items')
	  let item = document.createElement('tr')
	  item.classList.add(`table-menu__block`)
	  item.style = 'justify-content: space-between;'
	  item.innerHTML = `<td><div><p name="${data.name}">${data.name}</p></div></td> <td><div><p message="${data.message}">${data.message}</p></div></td> <td><div><p interval="${data.interval}">${data.interval}</p></div></td> <td><div><p minMessages="${data.minMessages ? data.minMessages : "5"}">${data.minMessages ? data.minMessages : "5"}</p></div></td> <td class="td-btns"><div> 
	  <ovg-button class="flat-btn ovg remove" style="right: 20px;"> <button class="medium ovg removeUser warning" data="22814674"><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button>
	  <ovg-button class="flat-btn ovg change" style="right: 10px;"> <button class="basic medium ovg updateUser" data="22814674"><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button>
	  
    <label class="switch-ovg" style="align-self: center;">
      <input type="checkbox" class="optionField" ${data.enabled ? 'checked' : ''}>
      <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
    </label>

	  </div></td>`;
	  item.setAttribute("itemtime", data.cmd)
	  html.append(item)

	  item.querySelector('.change').addEventListener('click', () => {
	    let changed = settings.bot.usercmdstimeout[data.name]
	    console.log(changed)
	    timeoutName.value = changed.name
	    timeoutMessage.value = changed.message
	    timeoutInterval.value = changed.interval
	    timeoutMinMessages.value = changed.minMessages

	    Helper.showModal('timer')
	    document.querySelector('ovg-modal-window.timer .modal-block__title span').textContent = ' Изменить таймер '
	  })

	  item.querySelector('.remove').addEventListener('click', () => {
	    console.log('1', settings.bot.usercmdstimeout)

	    let deleted = settings.bot.usercmdstimeout[data.name]
	    delete settings.bot.usercmdstimeout[data.name]

	    item.remove()
	    this.setNotFoundUserTimeout()
	    HelperSettings.showMessage(`Команда ${deleted.name} удалена`, 'success')

	    console.log('2', settings.bot.usercmdstimeout)
	    HelperSettings.save([document.querySelector('.optionField')]);
	  })

	  let input = item.querySelector('input')
	  input.addEventListener('change', ({e}) => {
	    console.log(input.checked)
	    settings.bot.usercmdstimeout[data.name].enabled = input.checked
	    if (!input.checked) chrome.runtime.sendMessage({ from: 'popup_bot', stopTimeout: data.name })

	    HelperSettings.save([document.querySelector('.optionField')]);
	  })

		document.querySelector('.usercmdstimeout.ovg-items .not-found')?.remove()
	},
	setNotFoundUserTimeout() {
    if (document.querySelector('.usercmdstimeout.ovg-items').childElementCount == 0) {
      let div = document.createElement('div')
      document.querySelector('.usercmdstimeout.ovg-items').append(div)
      div.outerHTML = '<div class="not-found" style="position: absolute;width: 748px;height: 321px;"><div style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);">Таймеров пока нет.. Нажмите кнопку «Добавить таймер», чтобы создать его.</div></div>'
    }
	},
	addLog(JSData) {
	  // console.log(JSData)

	  // JSData[0] == 'message' || JSData[0] == 'subscribe' || JSData[0] == 'user_ban'
	  let html = document.querySelector('.logs.ovg-items')
	  let item = document.createElement('tr')
	  item.classList.add(`table-menu__block`)
	  item.style = 'justify-content: space-between;'

	  let user_login = JSData[1].user_login || JSData[1].payload.user_login
	  
	  let isMsg = typeof JSData[1].message != 'undefined'
	  let isSub = typeof JSData[1].product_name != 'undefined'
	  let isBan = JSData[0] == 'user_ban'
	  if (isSub) isSub = `${JSData[1].product_name == 60 ? 'Оформляет подписку на 2 месяца' : 'Оформляет подписку на 1 месяц' }`

	  let message = JSData[1].message || isSub || JSData[0]

	  item.innerHTML = `<td><div><p type="${isMsg ? 'msg' : ''}${isSub ? 'sub' : ''}${isBan ? 'ban' : ''}"><i _ngcontent-boj-c248="" class="${isMsg ? 'wasd-icons-message' : ''}${isSub ? 'wasd-icons-subscribe' : ''}${isBan ? 'wasd-icons-ban' : ''}"></i></p></div></td>
	  <td><div><p date="${JSData[1].date_time}">${moment(JSData[1].date_time).format('H:mm:ss')}</p></div></td>
	  <td><div><p user_login="${user_login}">${user_login}</p></div></td>
	  <td><div><p message="${message}">${message}</p></div></td>`;
	  html.append(item)
	},
	tryAddUserCmd(data) {
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
	},
  hideModal() {
    document.querySelector('ovg-modal-window.show')?.classList.remove('show')
    document.querySelector('ovg-modal-backdrop.show')?.classList.remove('show')
  },
  showModal(modal, alias, unalias) {
  	if (modal == 'cmdmod') {
  		aliasName.placeholder = alias
  	} else if (modal == 'cmdmod2') {
  		aliasName2_1.placeholder = alias
  		aliasName2_2.placeholder = unalias
  	}

    document.querySelector('ovg-modal-window.' + modal)?.classList.add('show')
    document.querySelector('ovg-modal-backdrop')?.classList.add('show')
  },
	addUserCount(data) {
	  data = settings.coins.users[data]
	  let html = document.querySelector('.coins.ovg-items')
	  let item = document.createElement('tr')
	  item.classList.add(`table-menu__block`)
	  item.style = 'justify-content: space-between;'
	  item.innerHTML = `<td><div><p user_login="${data.user_login}">${data.user_login}</p></div></td> <td><div><p count="${data.count}">${data.count}</p></div></td><td class="td-btns" style="text-align: end;"><div> 
	  <!--ovg-button class="flat-btn ovg remove" style="right: 20px;"> <button class="medium ovg removeUser warning" data="22814674"><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button-->
	  <ovg-button class="flat-btn ovg change" style="right: 10px;"> <button class="basic medium ovg updateUser" data="22814674"><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button>
		</div></td>`;
	  item.setAttribute("user_id", data.user_id)
	  html.append(item)

	  item.querySelector('.change').addEventListener('click', () => {
	    coinsCount.value = data.count
	    coinsCount.setAttribute('user_id', data.user_id)

	    Helper.showModal('coinschange')
	  })

	  // item.querySelector('.remove').addEventListener('click', () => {

	  //   let deleted = settings.coins.users[data.user_id]
	  //   delete settings.coins.users[data.user_id]

	  //   item.remove()
			// this.setNotFoundUserCount()
	  //   HelperSettings.showMessage(`Монеты пользователя ${deleted?.user_login} удалена`, 'success')

	  //   HelperSettings.save([document.querySelector('.optionField')]);
	  // })

		document.querySelector('.coins.ovg-items .not-found')?.remove()
	},
	buildUsersCount() {
    Helper.paginationCoin()

    Helper.setNotFoundUserCount()
	},
	setNotFoundUserCount() {
    if (document.querySelector('.coins.ovg-items').childElementCount == 0) {
      let div = document.createElement('div')
      document.querySelector('.coins.ovg-items').append(div)
      div.outerHTML = '<div class="not-found" style="position: absolute;width: 748px;height: 321px;"><div style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);">Монет пока нет..</div></div>'
    }
	},
	paginationCoin(page = 0, limit = 20) {
		$('.coins.ovg-items').empty();

	  let filter = coinUsersSearch.value.toUpperCase().trim();

    let data = Object.values(settings.coins.users).filter ( (d) => {
    	if (filter == '') return true
    	return !!d.user_login.toUpperCase().match(filter)
    });

    let data_keys = data.map((item) => { return item.user_id })

		let startFrom = page * limit
		data = data_keys.slice(startFrom , startFrom + limit)

		data.map((item) => { Helper.addUserCount(item) })

    let pages = Math.ceil(data_keys.length / limit)

    if (!(pages <= 1)) {
	    let htmlPagination = ''

	    if (page >= 1) htmlPagination += `<div index="${page-1}" class="item">&#60;</div>`
	    if (page >= 2) htmlPagination += `<div index="${page-2}" class="item">${page - 1}</div>`
	    if (page >= 1) htmlPagination += `<div index="${page-1}" class="item">${page}</div>`
	    htmlPagination += `<div index="${page}" class="item active">${page + 1}</div>`
	    if (page <= pages - 2) htmlPagination += `<div index="${page+1}" class="item">${page + 2}</div>`
	    if (page <= pages - 3) htmlPagination += `<div index="${page+2}" class="item">${page + 3}</div>`
	    if (page <= pages - 2) htmlPagination += `<div index="${page+1}" class="item">&#62;</div>`

			document.querySelector('[data-tab="coins"] .pagination').innerHTML = htmlPagination

			for(let item of document.querySelectorAll('[data-tab="coins"] .pagination .item')) {
				item.addEventListener('click', () => { Helper.paginationCoin( Number(item.getAttribute("index")) ) })
			}
    } else {
    	document.querySelector('[data-tab="coins"] .pagination').innerHTML = ''
    }
	},
	logs: [],
	paginationLog(page = 0, limit = 20) {
		$('.logs.ovg-items').empty();

	  let filter = logUsersSearch.value.toUpperCase().trim();

    let data = Helper.logs.filter ( (d) => {
    	if (filter == '') return true

    	if (d[0] == 'message')   return d[1].user_login         .toUpperCase().match(filter)
    	if (d[0] == 'subscribe') return d[1].user_login         .toUpperCase().match(filter)
    	if (d[0] == 'user_ban')  return d[1].payload.user_login .toUpperCase().match(filter)

    	return false
    });

		let startFrom = page * limit
		data = data.slice(startFrom , startFrom + limit)

		data.map((item) => { Helper.addLog(item) })

    let pages = Math.ceil(data.length / limit)

    if (!(pages <= 1)) {
	    let htmlPagination = ''

	    if (page >= 1) htmlPagination += `<div index="${page-1}" class="item">&#60;</div>`
	    if (page >= 2) htmlPagination += `<div index="${page-2}" class="item">${page - 1}</div>`
	    if (page >= 1) htmlPagination += `<div index="${page-1}" class="item">${page}</div>`
	    htmlPagination += `<div index="${page}" class="item active">${page + 1}</div>`
	    if (page <= pages - 2) htmlPagination += `<div index="${page+1}" class="item">${page + 2}</div>`
	    if (page <= pages - 3) htmlPagination += `<div index="${page+2}" class="item">${page + 3}</div>`
	    if (page <= pages - 2) htmlPagination += `<div index="${page+1}" class="item">&#62;</div>`

			document.querySelector('[data-tab="log"] .pagination').innerHTML = htmlPagination

			for(let item of document.querySelectorAll('[data-tab="log"] .pagination .item')) {
				item.addEventListener('click', () => { Helper.paginationLog( Number(item.getAttribute("index")) ) })
			}
    } else {
    	document.querySelector('[data-tab="log"] .pagination').innerHTML = ''
    }
	}
};