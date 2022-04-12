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
        cmdPoints: { enabled: true, alias: '!points' },

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
      protectionLink: {
      	status: false,
        autoPermit: '0',
        punishment: '0',
        blockType: '0',
        sendPunishmentMessage: ['{user_login} -> Пожалуйста, воздержитесь от публикации ссылок.', true],
        blacklist: {}
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
      	cmdStore: { enabled: true, alias: '!store' },
      	cmdStoreInfo: { enabled: true, alias: '!storeinfo' },
      	cmdRedeem: { enabled: true, alias: '!redeem' },
      	users: {},
      	store: {},
      	// store_custom_block_id: null,
      	users_custom_block_id: null,
      },
      // loyaltyStore: {
      // 	addCustomBlock: [0, false],
      // },
      loyaltyUsers: {
      	addCustomBlock: [0, false],
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
	  
		<ovg-dropdown class="">
		  <div class="dropdown-ovg is-action medium" style="right: 10px;">
		    <div class="dropdown-title">
		      <i class="wasd-icons-dots-vert"></i>
		    </div>
		    <div class="dropdown-list">
		      <div class="dropdown-list__item change">
		        <span>Редактировать</span>
		      </div>
		      <div class="dropdown-list__item remove">
		        <span>Удалить</span>
		      </div>
		    </div>
		  </div>
		</ovg-dropdown>

	  <!--ovg-button class="flat-btn ovg remove" style="right: 20px;"> <button class="medium ovg removeUser warning" data=""><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button>
	  <ovg-button class="flat-btn ovg change" style="right: 10px;"> <button class="basic medium ovg updateUser" data=""><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button-->
    
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
	  	this.showDelete(`Удалить команду?`, `Вы точно хотите удалить команду «${data.cmd}»?`).then((value) => {
	  		if (value) {
			    console.log('1', settings.bot.usercmds)

			    let deleted = settings.bot.usercmds[data.cmd]
			    delete settings.bot.usercmds[data.cmd]

			    item.remove()
					this.setNotFoundUserCmd()
			    HelperSettings.showMessage(`Команда ${deleted?.cmd} удалена`, 'success')

			    console.log('2', settings.bot.usercmds)
			    HelperSettings.save([document.querySelector('.optionField')]);
	  		}
	  	})
	  })

		item.querySelector('.dropdown-ovg').addEventListener('click', () => {
			item.querySelector('.dropdown-ovg').classList.add('is-open')
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
	  
		<ovg-dropdown class="">
		  <div class="dropdown-ovg is-action medium" style="right: 10px;">
		    <div class="dropdown-title">
		      <i class="wasd-icons-dots-vert"></i>
		    </div>
		    <div class="dropdown-list">
		      <div class="dropdown-list__item change">
		        <span>Редактировать</span>
		      </div>
		      <div class="dropdown-list__item remove">
		        <span>Удалить</span>
		      </div>
		    </div>
		  </div>
		</ovg-dropdown>

	  <!--ovg-button class="flat-btn ovg remove" style="right: 20px;"> <button class="medium ovg removeUser warning" data=""><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button>
	  <ovg-button class="flat-btn ovg change" style="right: 10px;"> <button class="basic medium ovg updateUser" data=""><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button-->
	  
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
	  	this.showDelete(`Удалить таймер?`, `Вы точно хотите удалить таймер «${data.name}»?`).then((value) => {
	  		if (value) {
			    console.log('1', settings.bot.usercmdstimeout)

			    let deleted = settings.bot.usercmdstimeout[data.name]
			    delete settings.bot.usercmdstimeout[data.name]

			    item.remove()
			    this.setNotFoundUserTimeout()
			    HelperSettings.showMessage(`Команда ${deleted.name} удалена`, 'success')

			    console.log('2', settings.bot.usercmdstimeout)
			    HelperSettings.save([document.querySelector('.optionField')]);
	  		}
	  	})
	  })

		item.querySelector('.dropdown-ovg').addEventListener('click', () => {
			item.querySelector('.dropdown-ovg').classList.add('is-open')
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
		let maxLength = data.result

	  if (data.cmd.trim() == '') {
	    HelperSettings.showMessage('Не Хватает команды', 'error')
	    return 'err'
	  }
	  if (data.cmd.trim().split(' ').length != 1) {
	    HelperSettings.showMessage('Команда должна состоять из 1го слова', 'error')
	    return 'err'
	  }
	  if (data.result.trim() == '') {
	    HelperSettings.showMessage('Не Хватает ответа', 'error')
	    return 'err'
	  }

    maxLength  = maxLength.replace(/(randomInt\(([^)]+[^ ]))/ig, (match) => {
      match = match.replace('randomInt', '').replace(/([()])/ig, '').split(',')
      if (match[0] && match[1]) {
        return match[1]
      } else {
        return '0'
      }
    })
    maxLength = maxLength.replace('randomUser\(\)', () => {
      return '@max_username=21______' // username
    })
    maxLength = maxLength.replace(/(randomVar\(([^)]+[^ ]))/ig, (match) => {
      match = match.replace('randomVar', '').replace(/([()])/ig, '').split('&')
      match.forEach((value, index) => { match[index] = value.replace('U+0029', ')').replace('U+0026', '&') })
      match = match.sort(function (a, b) { return b.length - a.length })[0];
      // console.log(match)
      return match
    })
    maxLength = maxLength.replace(/user\(\)/ig, () => {
      return '@max_username=21______' // username
    })
    maxLength = maxLength.replace(/(timer\(([^)]+[^ ]))/ig, (match) => {
      return '@max_username=22_______' // несколько секунд назад
    })
    maxLength = maxLength.replace(/uptime\(\)/ig, () => {
      return `000:00:00`
    })

    // console.log(maxLength, maxLength.length)

	  if (maxLength.length > 240) {
	    HelperSettings.showMessage(`Ответ превышает 240 символов (${maxLength.length})`, 'error')
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
		let maxLength = data.message

	  if (data.name.trim() == '') {
	    HelperSettings.showMessage('Не Хватает имени', 'error')
	    return 'err'
	  }
	  if (data.message.trim() == '') {
	    HelperSettings.showMessage('Не Хватает сообщения', 'error')
	    return 'err'
	  }
	  if (data.interval < 5) {
	    HelperSettings.showMessage('Интервал меньше 5ти секунд', 'error')
	    return 'err'
	  }
	  if (data.minMessages < 1) {
	    HelperSettings.showMessage('Минимум линии меньше 1го', 'error')
	    return 'err'
	  }

    maxLength  = maxLength.replace(/(randomInt\(([^)]+[^ ]))/ig, (match) => {
      match = match.replace('randomInt', '').replace(/([()])/ig, '').split(',')
      if (match[0] && match[1]) {
        return match[1]
      } else {
        return '0'
      }
    })
    maxLength = maxLength.replace('randomUser\(\)', () => {
      return '@max_username=21______' // username
    })
    maxLength = maxLength.replace(/(randomVar\(([^)]+[^ ]))/ig, (match) => {
      match = match.replace('randomVar', '').replace(/([()])/ig, '').split('&')
      match.forEach((value, index) => { match[index] = value.replace('U+0029', ')').replace('U+0026', '&') })
      match = match.sort(function (a, b) { return b.length - a.length })[0];
      // console.log(match)
      return match
    })
    maxLength = maxLength.replace(/user\(\)/ig, () => {
      return '@max_username=21______' // username
    })
    maxLength = maxLength.replace(/(timer\(([^)]+[^ ]))/ig, (match) => {
      return '@max_username=22_______' // несколько секунд назад
    })
    maxLength = maxLength.replace(/uptime\(\)/ig, () => {
      return `000:00:00`
    })

    // console.log(maxLength, maxLength.length)

	  if (maxLength.length > 240) {
	    HelperSettings.showMessage(`Ответ превышает 240 символов (${maxLength.length})`, 'error')
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
  hideModal(text='') {
    document.querySelector(`ovg-modal-window.show${text}`)?.classList.remove('show')
    if (document.querySelector(`ovg-modal-window.show`)) return
    document.querySelector(`ovg-modal-backdrop.show`)?.classList.remove('show')
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
	  <!--ovg-button class="flat-btn ovg remove" style="right: 20px;"> <button class="medium ovg removeUser warning" data=""><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button-->
	  <ovg-button class="flat-btn ovg change" style="right: 10px;"> <button class="basic medium ovg updateUser" data=""><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button>
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

	    htmlPagination += `<button index="${page-1}" class="item" ${page >= 1 ? '' : 'disabled'}>&#60;</button>`
	    if (page >= 2) htmlPagination += `<button index="${page-2}" class="item">${page - 1}</button>`
	    if (page >= 1) htmlPagination += `<button index="${page-1}" class="item">${page}</button>`
	    htmlPagination += `<button index="${page}" class="item active">${page + 1}</button>`
	    if (page <= pages - 2) htmlPagination += `<button index="${page+1}" class="item">${page + 2}</button>`
	    if (page <= pages - 3) htmlPagination += `<button index="${page+2}" class="item">${page + 3}</button>`
	    htmlPagination += `<button index="${page+1}" class="item" ${page <= pages - 2 ? '' : 'disabled'}>&#62;</button>`

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

    let data_keys = Helper.logs.filter ( (d) => {
    	if (filter == '') return true

    	if (d[0] == 'message')   return d[1].user_login         .toUpperCase().match(filter)
    	if (d[0] == 'subscribe') return d[1].user_login         .toUpperCase().match(filter)
    	if (d[0] == 'user_ban')  return d[1].payload.user_login .toUpperCase().match(filter)

    	return false
    });

		let startFrom = page * limit
		data = data_keys.slice(startFrom , startFrom + limit)

		data.map((item) => { Helper.addLog(item) })

    let pages = Math.ceil(data_keys.length / limit)

    if (!(pages <= 1)) {
	    let htmlPagination = ''

	    htmlPagination += `<button index="${page-1}" class="item" ${page >= 1 ? '' : 'disabled'}>&#60;</button>`
	    if (page >= 2) htmlPagination += `<button index="${page-2}" class="item">${page - 1}</button>`
	    if (page >= 1) htmlPagination += `<button index="${page-1}" class="item">${page}</button>`
	    htmlPagination += `<button index="${page}" class="item active">${page + 1}</button>`
	    if (page <= pages - 2) htmlPagination += `<button index="${page+1}" class="item">${page + 2}</button>`
	    if (page <= pages - 3) htmlPagination += `<button index="${page+2}" class="item">${page + 3}</button>`
	    htmlPagination += `<button index="${page+1}" class="item" ${page <= pages - 2 ? '' : 'disabled'}>&#62;</button>`

			document.querySelector('[data-tab="log"] .pagination').innerHTML = htmlPagination

			for(let item of document.querySelectorAll('[data-tab="log"] .pagination .item')) {
				item.addEventListener('click', () => { Helper.paginationLog( Number(item.getAttribute("index")) ) })
			}
    } else {
    	document.querySelector('[data-tab="log"] .pagination').innerHTML = ''
    }
	},
	addLink(data) {
	  let html = document.querySelector('.blacklist.ovg-items')
	  let item = document.createElement('tr')
	  item.classList.add(`table-menu__block`)
	  item.style = 'justify-content: space-between;'
	  item.innerHTML = `<td><div><p url="${data.url}">${data.url}</p></div></td> <td><div><p count="${data.type}">${data.type}</p></div></td><td class="td-btns" style="text-align: end;"><div> 
	  <ovg-button class="flat-btn ovg remove" style="right: 20px;"> <button class="medium ovg removeUser warning" data=""><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button>
	  <!--ovg-button class="flat-btn ovg change" style="right: 10px;"> <button class="basic medium ovg updateUser" data=""><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button-->
		</div></td>`;
	  item.setAttribute("itemurlkey", data.url)
	  html.append(item)

	  // item.querySelector('.change').addEventListener('click', () => {
	  //   coinsCount.value = data.count
	  //   coinsCount.setAttribute('user_id', data.user_id)

	  //   Helper.showModal('coinschange')
	  // })

	  item.querySelector('.remove').addEventListener('click', () => {

	  	this.showDelete(`Удалить ссылку?`, `Вы точно хотите удалить ссылку «${data.url}»?`).then((value) => {
	  		if (value) {
			    let deleted = settings.protectionLink.blacklist[data.url]
			    delete settings.protectionLink.blacklist[data.url]

			    item.remove()
					this.setNotFoundUserCount()
			    HelperSettings.showMessage(`Ссылка ${deleted?.url} удалена`, 'success')

			    HelperSettings.save([document.querySelector('.optionField')]);
	  		}
	  	})

	  })

		document.querySelector('.blacklist.ovg-items .not-found')?.remove()
	},
	tryAddLink(data) {
	  if (!settings.protectionLink.blacklist[data.url]) {
	    settings.protectionLink.blacklist[data.url] = data
	    Helper.addLink(data)
	    HelperSettings.save([document.querySelector('.optionField')]);
	  } else {
	    settings.protectionLink.blacklist[data.url] = data

	    let item = document.querySelector(`[itemurlkey="${data.url}"]`)

	    item.querySelector('[url]').textContent = data.url
	    item.querySelector('[type]').textContent = data.type

	    HelperSettings.save([document.querySelector('.optionField')]);
	  }
	},
	tryAddLoyaltyStore(data) {

	  if (data.name.trim() == '') {
	    HelperSettings.showMessage('Не Хватает имени', 'error')
	    return 'err'
	  }
	  if (data.id.trim() == '') {
	    HelperSettings.showMessage('Не Хватает id', 'error')
	    return 'err'
	  }
	  if (data.description.trim() == '') {
	    HelperSettings.showMessage('Не Хватает описания', 'error')
	    return 'err'
	  }
	  if ((data.quantity != 0 && data.quantity < -1) || data.quantity == 0) {
	    HelperSettings.showMessage('Количество не может быть меньше одного 3', 'error')
	    return 'err'
	  }
	  if ((data.buyOnUser != 0 && data.buyOnUser < -1) || data.buyOnUser == 0) {
	    HelperSettings.showMessage('Количество на пользователя не может быть меньше одного', 'error')
	    return 'err'
	  }
	  if (data.price < 1) {
	    HelperSettings.showMessage('Цена не может быть меньше одного', 'error')
	    return 'err'
	  }

		console.log(settings.coins.store, data.id)
	  if (!settings.coins.store[data.id]) {
	    settings.coins.store[data.id] = data
	    Helper.addLoyaltyStore(data)
	    HelperSettings.save([document.querySelector('.optionField')]).then(() => {
	    	// setTimeout(() => {
				  // chrome.runtime.sendMessage({ from: 'popup_bot', updateCustomizeBlockLoyaltyStore: settings.loyaltyStore.addCustomBlock })
	    	// }, 250)
	    })
	  } else {
	    settings.coins.store[data.id] = data

	    let item = document.querySelector(`[itemLoyaltyStore="${data.id}"]`)

	    item.querySelector('[name]').textContent = data.name
	    item.querySelector('[name]').title = 'id:' + data.id
	    item.querySelector('[description]').textContent = data.description
	    item.querySelector('[price]').textContent = data.price
	    item.querySelector('[quantity]').textContent = data.quantity == -1 ? '∞' : data.quantity
	    item.querySelector('[sold]').textContent = data.sold

	    HelperSettings.save([document.querySelector('.optionField')]).then(() => {
	    	// setTimeout(() => {
				  // chrome.runtime.sendMessage({ from: 'popup_bot', updateCustomizeBlockLoyaltyStore: settings.loyaltyStore.addCustomBlock })
	    	// }, 250)
	    })
	  }

	},
	addLoyaltyStore(data, index) {
	  console.log(data)
	  let html = document.querySelector('.loyaltyStore.ovg-items')
	  let item = document.createElement('tr')
	  item.classList.add(`table-menu__block`)
	  item.style = 'justify-content: space-between;'
	  item.innerHTML = `<td><div><p name="${data.name}" title="id: ${data.id}">${data.name}</p></div></td> 
	  <td><div><p description="${data.description}">${data.description}</p></div></td> 
	  <td><div><p price="${data.price}">${data.price}</p></div></td> 
	  <td><div><p quantity="${data.quantity}">${data.quantity == -1 ? '∞' : data.quantity}</p></div></td> 
	  <td><div><p sold="${data.sold}">${data.sold}</p></div></td> 

	  <td class="td-btns"><div> 
	  <!--ovg-button class="flat-btn ovg remove" style="right: 20px;"> <button class="medium ovg removeUser warning" data=""><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button>
	  <ovg-button class="flat-btn ovg change" style="right: 10px;"> <button class="basic medium ovg updateUser" data=""><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button-->
	  
	  <ovg-dropdown class="">
		  <div class="dropdown-ovg is-action medium" style="right: 10px;">
		    <div class="dropdown-title">
		      <i class="wasd-icons-dots-vert"></i>
		    </div>
		    <div class="dropdown-list">
		      <div class="dropdown-list__item change">
		        <span>Редактировать</span>
		      </div>
		      <div class="dropdown-list__item redeems">
		        <span>Покупки</span>
		      </div>
		      <div class="dropdown-list__item remove">
		        <span>Удалить</span>
		      </div>
		    </div>
		  </div>
		</ovg-dropdown>

    <label class="switch-ovg" style="align-self: center;">
      <input type="checkbox" class="optionField" ${data.enabled ? 'checked' : ''}>
      <span class="slider-ovg"> <div class="switcher_thumb-ovg"></div> </span>
    </label>

	  </div></td>`;
	  item.setAttribute("itemLoyaltyStore", data.id)
	  html.append(item)

	  item.querySelector('.change').addEventListener('click', () => {
	    let changed = settings.coins.store[data.id]
	    console.log(changed)
	    loyaltyStoreName.value = changed.name
	    loyaltyStoreId.value = changed.id
	    loyaltyStoreDescription.value = changed.description
	    loyaltyStorePrice.value = changed.price
	    loyaltyStoreQuantity.value = changed.quantity
	    loyaltyStoreBuyOnUser.value = changed.buyOnUser

	    Helper.showModal('loyaltyStore')
	    document.querySelector('ovg-modal-window.loyaltyStore .modal-block__title span').textContent = ' Изменить товар '
	  })

	  item.querySelector('.remove').addEventListener('click', () => {

	  	this.showDelete(`Удалить товар?`, `Вы точно хотите удалить товар «${data.name}»?`).then((value) => {
	  		if (value) {

			    console.log('1', settings.coins.store)

			    let deleted = settings.coins.store[data.id]
			    delete settings.coins.store[data.id]

			    item.remove()
			    this.setNotFoundLoyaltyStore()
			    HelperSettings.showMessage(`Товар ${deleted.name} удален`, 'success')

			    console.log('2', settings.coins.store)
			    HelperSettings.save([document.querySelector('.optionField')]).then(() => {
			    	// setTimeout(() => {
						  // chrome.runtime.sendMessage({ from: 'popup_bot', updateCustomizeBlockLoyaltyStore: settings.loyaltyStore.addCustomBlock })
			    	// }, 250)
			    }).catch((err) => {
			    	console.log(err)
			    })

	  		}
	  	})

	  })

	  item.querySelector('.redeems').addEventListener('click', () => {
	  	document.querySelector('.loyaltyStoreUsers.ovg-items').innerHTML = ''
	  	settings.coins.store[data.id].buyers.forEach((value, index) => {
	  		Helper.addLoyaltyStoreUsers(value, index)
	  	})
	  	if (settings.coins.store[data.id].sold == 0) Helper.setNotFoundLoyaltyStoreUsers()
	  	Helper.showModal('loyaltyStoreUsers')
	  })

		item.querySelector('.dropdown-ovg').addEventListener('click', () => {
			item.querySelector('.dropdown-ovg').classList.add('is-open')
		})

	  let input = item.querySelector('input')
	  input.addEventListener('change', ({e}) => {
	    settings.coins.store[data.id].enabled = input.checked

	    HelperSettings.save([document.querySelector('.optionField')]);
	  })

		document.querySelector('.loyaltyStore.ovg-items .not-found')?.remove()
	},
	setNotFoundLoyaltyStore() {
    if (document.querySelector('.loyaltyStore.ovg-items').childElementCount == 0) {
      let div = document.createElement('div')
      document.querySelector('.loyaltyStore.ovg-items').append(div)
      div.outerHTML = '<div class="not-found" style="position: absolute;width: 748px;height: 321px;"><div style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);">У вас нет товаров в магазине</div></div>'
    }
	},
	async showDelete(title, description, buttonOk = 'Удалить') {
		return new Promise((resolve, reject) => {
			let data = document.createElement('ovg-modal-window')
			data.classList.add('delete')
			data.style.zIndex = '6000'

			let modalBlock = `
				<div class="modal-block modal-block_small">

          <div class="modal-block__title">
            <span> ${title} </span>
          </div>

          <div class="modal-block__content"> ${description} </div>

          <div class="modal-block__footer">
            <ovg-button class="ghost-btn ovg" style="display: flex;">
              <button class="medium ovg primary hide" style="margin-right: 5px;">
                <span> Отмена </span>
              </button>
            </ovg-button>
            <ovg-button class="flat-btn ovg" style="display: flex;">
              <button class="warning medium ovg remove">
                <span> ${buttonOk} </span>
              </button>
            </ovg-button>
          </div>

        </div>`

      data.innerHTML = modalBlock

      bscSettingsPanel.append(data)

      this.showModal('delete')
      document.querySelector('ovg-modal-backdrop').style.zIndex = '5990'


      document.querySelector('ovg-modal-window.delete button.hide').addEventListener('click', () => {
      	Helper.hideModal('.delete')
      	document.querySelector('ovg-modal-window.delete')?.remove()
      	document.querySelector('ovg-modal-backdrop').style.zIndex = ''
      	resolve(false)
	    })

	    document.querySelector('ovg-modal-window.delete button.remove').addEventListener('click', () => {
	    	Helper.hideModal('.delete')
	    	document.querySelector('ovg-modal-window.delete')?.remove()
	    	document.querySelector('ovg-modal-backdrop').style.zIndex = ''
	    	resolve(true)
	    })

      document.querySelector('ovg-modal-window.delete').addEventListener('click', (e) => {
	      if (e.target.className == 'delete show') {
	      	Helper.hideModal('.delete')
	      	document.querySelector('ovg-modal-window.delete')?.remove()
	      	document.querySelector('ovg-modal-backdrop').style.zIndex = ''
	      	resolve(false)
	      }
	    })

		})
	},
	addLoyaltyStoreUsers(data, index) {
	  console.log(data)
	  let html = document.querySelector('.loyaltyStoreUsers.ovg-items')
	  let item = document.createElement('tr')
	  item.classList.add(`table-menu__block`)
	  item.style = 'justify-content: space-between;'

	  item.innerHTML = `<td><div><p status="${data.status}" title="${data.status == 1 ? 'Выполнено' : data.status == 2 ? 'Возвращено' : 'В ожидании'}">${data.status == 1 ? '<i class="wasd-icons-done" style="font-size: 18px;position: relative;left: -2px;"></i>' : data.status == 2 ? '<i class="wasd-icons-ban"></i>' : '<i class="wasd-icons-freez"></i>'}</p></div></td> <td><div><p user_login="${data.user_login}">${data.user_login}</p></div></td> <td><div><p created_at="${data.created_at}" title="${moment(data.created_at).format('lll')}">${moment(data.created_at).format('H:mm:ss')}</p></div></td> <td class="td-btns" style="text-align: end;"><div> 
	  
	  ${data.status != 2 ?  `<ovg-dropdown class="">
		  <div class="dropdown-ovg is-action medium" style="right: 10px;">
		    <div class="dropdown-title">
		      <i class="wasd-icons-dots-vert"></i>
				</div>
		    ${
		    	data.status == 0 ? 
		    	`<div class="dropdown-list">
			      <div class="dropdown-list__item completed">
			        <span>Выполнить</span>
			      </div>
			    </div>`
		    	:
		    	`<div class="dropdown-list">
			      <div class="dropdown-list__item return">
			        <span>Вернуть монеты</span>
			      </div>
			    </div>`
		    }

		  </div>
		</ovg-dropdown>` : '' }
		

	  <!--ovg-button class="flat-btn ovg remove" style="right: 20px;"> <button class="medium ovg removeUser warning" data=""><i class="wasd-icons-delete" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Удалить </div></div></ovg-tooltip> </ovg-button>
	  <ovg-button class="flat-btn ovg change" style="right: 10px;"> <button class="basic medium ovg updateUser" data=""><i class="wasd-icons-edit" style="pointer-events: none;"></i></button> <ovg-tooltip><div class="tooltip tooltip_position-top tooltip_size-small" style="width: 260px;"><div class="tooltip-content tooltip-content_left"> Изменить </div></div></ovg-tooltip> </ovg-button-->

	  </div></td>`;
	  // item.setAttribute("index", index)
	  html.append(item)

	  item.querySelector('.return')?.addEventListener('click', () => {

	  	this.showDelete(`Вернуть монеты?`, `Вы точно хотите вернуть ${data.price} монет пользователю «${data.user_login}»?`, 'Вернуть').then((value) => {
	  		if (!value) return
		  	settings.coins.users[data.user_id].count += data.price
		    settings.coins.store[data.id].buyers[index].status = 2
		    settings.coins.store[data.id].sold --

		    HelperSettings.save([document.querySelector('.optionField')]);

	      setTimeout(() => {
	        chrome.runtime.sendMessage({ from: 'popup_bot', updateCustomizeBlockLoyaltyUsers: settings.loyaltyUsers.addCustomBlock })
	      }, 250)

		    chrome.runtime.sendMessage({ from: 'background_bot', coinUsers: settings.coins.users })
		    chrome.runtime.sendMessage({ from: 'popup_bot', sendMessage: `"@${data.user_login} Вам возвращено ${data.price} монет` })

		  	document.querySelector('.loyaltyStoreUsers.ovg-items').innerHTML = ''
		  	settings.coins.store[data.id].buyers.forEach((value, index) => {
		  		Helper.addLoyaltyStoreUsers(value, index)
		  	})

		  	document.querySelector('.loyaltyStore.ovg-items').innerHTML = ''
		    for (let cmd in settings.coins.store) {
		      Helper.addLoyaltyStore(settings.coins.store[cmd])
		    }
		    Helper.setNotFoundLoyaltyStore()

		    Helper.buildUsersCount()

	  	})
	  })

	  item.querySelector('.completed')?.addEventListener('click', () => {

	  	this.showDelete(`Выполнить?`, `Вы точно хотите завершить задание пользователя «${data.user_login}»?`, 'Выполнить').then((value) => {
	  		if (!value) return
		    settings.coins.store[data.id].buyers[index].status = 1

		    HelperSettings.save([document.querySelector('.optionField')]);

		  	document.querySelector('.loyaltyStoreUsers.ovg-items').innerHTML = ''
		  	settings.coins.store[data.id].buyers.forEach((value, index) => {
		  		Helper.addLoyaltyStoreUsers(value, index)
		  	})

	  	})
	  })

		item.querySelector('.dropdown-ovg')?.addEventListener('click', () => {
			item.querySelector('.dropdown-ovg').classList.add('is-open')
		})

		document.querySelector('.loyaltyStoreUsers .not-found')?.remove()
	},
	setNotFoundLoyaltyStoreUsers() {
    if (document.querySelector('.loyaltyStoreUsers.ovg-items').childElementCount == 0) {
    	if (document.querySelector('.loyaltyStoreUsers .not-found')) return
      let div = document.createElement('div')
      document.querySelector('.loyaltyStoreUsers .modal-block__content').append(div)
      div.outerHTML = '<div class="not-found" style="position: relative;width: 412px;height: 121px;"><div style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);">Нет покупателей</div></div>'
    }
	},
};