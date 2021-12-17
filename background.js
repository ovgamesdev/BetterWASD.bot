let settings = {}
moment.locale('ru')

chrome.storage.sync.get((items) => {
  if (typeof items.bot !== 'undefined') {
    settings = items
    socket.getCurrent()
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  settings[Object.entries(changes)[0][0]] = Object.entries(changes)[0][1].newValue
  if (socket.socketd == null) socket.getCurrent()
  console.log('onChanged', settings)
});

const socket = {
  socketd: null,
  streamId: 0,
  channelId: 0,
  intervalcheck: null,
  intervalSave: null,
  intervalfivemessages: null,
  current: null,
  stream_url: null,
  isBotInited: false,
  intervals: [],
  startedTimeouts: {},
  currentChannel: null,
  intervalLastMessages: {},
  logs: [],
  getCurrent() {
    new Promise((resolve, reject) => {
    fetch(`https://wasd.tv/api/profiles/current`)
    .then(res => res?.json())
    .then((out) => {
      if (out?.result?.user_profile?.channel_id) {
        
        fetch(`https://radiant-basin-27885.herokuapp.com/api/v1/init/bot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_login: out.result.user_profile.user_login,
            user_id: out.result.user_profile.user_id,
            channel_image: out.result.user_profile.profile_image.large
          })
        })
        .then(res => res?.json())
        .then((out) => {
          console.log(out)
        })

        resolve(out.result)
      } else {
        reject(out?.result?.user_role)
      }
    })
    .catch((err)=>{
      reject(err)
    })
    }) .then((out) => {
      this.current = out
      // console.log(out)
      this.initBot()
    }) .catch((err) => {
      console.log(err)
      setTimeout(() => {
        this.getCurrent()
      }, 30000)
    })
  },
  initBot() {
    fetch(`https://wasd.tv/api/channels/${this.current?.user_profile?.channel_id}`)
    .then(res => res?.json())
    .then((out) => {
      if (!this.isBotInited && out.result.channel_is_live) {
        this.isBotInited = true
        this.start(out.result.channel_name)
        console.log('bot inited to channel')
        chrome.browserAction.setIcon({path: "img/icon48.png"});
      } else if (this.isBotInited && !out.result.channel_is_live) {
        this.isBotInited = false
        this.stop(12345, 'LIVE_CLOSED')
        console.log('bot not inited to channel')
      } else if (this.isBotInited && out.result.channel_is_live) {
        // console.log('bot worked')
      } else {
        console.log('bot not worked')
        chrome.browserAction.setIcon({path: "img/noactive48.png"});
      }
      setTimeout(() => {
        this.initBot()
      }, 30000)
    }) .catch((err) => {
      setTimeout(() => {
        this.initBot()
      }, 30000)
    })  
  },
  start(channel_name) {
    this.socketd = new WebSocket("wss://chat.wasd.tv/socket.io/?EIO=3&transport=websocket");

    this.socketd.onopen = function(e) {
      fetch(`https://wasd.tv/api/auth/chat-token`)
      .then(res => res?.json())
      .then((out) => {
          socket.jwt = out.result
          new Promise((resolve, reject) => {
            socket.stream_url = `https://wasd.tv/api/v2/broadcasts/public?channel_name=${channel_name}`
            fetch(`https://wasd.tv/api/v2/broadcasts/public?channel_name=${channel_name}`)
            .then(res => res?.json())
            .then((out) => {
              if (out.result?.media_container && out.result?.media_container?.media_container_streams) {
                resolve(out)
              } else {
                fetch(`https://wasd.tv/api/v2/profiles/current/broadcasts/closed-view-url`)
                .then(res => res?.json())
                .then((out) => {
                  socket.stream_url = out.result.view_url.replace('https://wasd.tv/private-stream/', 'https://wasd.tv/api/v2/broadcasts/closed/')
                  fetch(out.result.view_url.replace('https://wasd.tv/private-stream/', 'https://wasd.tv/api/v2/broadcasts/closed/') )
                  .then(res => res?.json())
                  .then((out) => {
                    resolve(out)
                  })
                })
              }
            })
          }).then((out) => {
            socket.currentChannel = out.result
            socket.streamId = out.result.media_container.media_container_streams[0].stream_id
            socket.channelId = out.result.channel.channel_id

            var data = `42["join",{"streamId":${socket.streamId},"channelId":${socket.channelId},"jwt":"${socket.jwt}","excludeStickers":true}]`;
            socket.socketd.send(data);

            socket.onOpen()

            socket.intervalcheck = setInterval(() => {
              if (socket.socketd) {
                try {
                  socket.socketd.send('2')
                } catch {
                  clearInterval(socket.intervalcheck)
                  clearInterval(socket.intervalSave)
                  clearInterval(socket.intervalfivemessages)
                  socket.socketd = null
                  console.log('[catch]', socket.socketd)
                  socket.start()
                }
              }
            }, 5000)

          })
      })
    };

    this.socketd.onclose = function(e) {
      clearInterval(socket.intervalcheck)
      clearInterval(socket.intervalSave)
      clearInterval(socket.intervalfivemessages)
      socket.socketd = null
      socket.logs = []
      if (e.code == 404) {
        console.log(`[close] Соединение закрыто чисто, код= ${e.code} причина= ${e.reason}`);
      } else if (e.wasClean) {
        console.log(`[close] Соединение закрыто чисто, код= ${e.code} причина= ${e.reason}`);
      } else {
        console.log('[close] Соединение прервано');
        socket.start()
      }
    };

    this.socketd.onmessage = function(e) {
        
      if (e.data != 3) {
        var JSData;
        if (e.data.indexOf('[') != -1 && e.data.indexOf('[') < e.data.indexOf('{')) {
          code = e.data.slice(0, e.data.indexOf('['));
          data = e.data.slice(e.data.indexOf('['), e.data.length);
          JSData = JSON.parse(data);
        } else if (e.data.indexOf('{') != -1) {
          code = e.data.slice(0, e.data.indexOf('{'));
          data = e.data.slice(e.data.indexOf('{'), e.data.length);
          JSData = JSON.parse(data);
        } else {
          JSData = null;
          code = e.data;
        }
        if (JSData) {

          if (settings.log?.enabled && settings.log.type[JSData[0]]) {
            let log = JSData
            log[1].date_time = new Date().toISOString()
            socket.logs.push(log)
          }

          switch (JSData[0]) {
            case "joined":
              console.log(`[${JSData[0]}] ${JSData[1].user_channel_role}`, JSData);
              if (settings.bot.eventInit[1]) socket.send(settings.bot.eventInit[0])
              break;
            case "system_message":
              console.log(`[${JSData[0]}] ${JSData[1].message}`, JSData);
              break;
            case "message":
              console.log(`[${JSData[0]}] ${JSData[1].user_login}: ${JSData[1].message}`, JSData)
              socket.onMessage(JSData)
              wasd.messages.push(JSData[1])
              socket.setTimeouts(JSData)
              protection.protect(JSData[1])
              break;
            case "sticker":
              console.log(`[${JSData[0]}] ${JSData[1].user_login}: ${JSData[1].sticker.sticker_alias}`, JSData);
              break;
            case "viewers":
              console.log(`[${JSData[0]}] anon: ${JSData[1].anon} auth: ${JSData[1].auth} total: ${JSData[1].total}`, JSData);
              break;
            case "event":
              console.log(`[${JSData[0]}] ${JSData[1].event_type} - ${JSData[1].payload.user_login} ${JSData[1].message}`, JSData);
              if (settings.bot.eventFollow[1] && JSData[1].event_type == 'NEW_FOLLOWER') {
                let text = settings.bot.eventFollow[0].replace('{user_login}', '@'+JSData[1].payload.user_login);
                socket.send(text)
              }
              break;
            case "giftsV1":
              console.log(`[${JSData[0]}] ${JSData[1].gift_name}`, JSData);
              break;
            case "yadonat":
              console.log(`[${JSData[0]}] ${JSData[1].donator} - ${JSData[1].donation} - ${JSData[1].msg}`, JSData);
              break;
            case "messageDeleted":
              console.log(`[${JSData[0]}] ${JSData[1].ids}`, JSData);
              break;
            case "subscribe":
              console.log(`[${JSData[0]}] ${JSData[1].user_login} - ${JSData[1].product_name}`, JSData);
              if (settings.bot.eventSub[1]) {
                let text = settings.bot.eventSub[0].replace('{user_login}', '@'+JSData[1].user_login);
                prname = `${(JSData[1].product_name == '30') ? '1 месяц' : ''}${(JSData[1].product_name == '60') ? '2 месяца' : ''}`
                text.replace('{product_name}', prname);
                socket.send(text)
              }
              break;
            case "_system":
              console.log(`[${JSData[0]}] ${JSData[1]}`, JSData);
              break;
            case "leave":
              console.log(`[${JSData[0]}] ${JSData[1].streamId}`, JSData);
              break;
            case "user_ban":
              console.log(`[${JSData[0]}] ${JSData[1].payload.user_login}`, JSData);
              break;
            case "settings_update":
              console.log(`[${JSData[0]}] ${JSData[1]}`, JSData);
              break
            default:
              console.log('def', code, JSData);
              break;
          }
        }
      }
    };

    this.socketd.onerror = function(error) {
      clearInterval(socket.intervalcheck)
      clearInterval(socket.intervalSave)
      clearInterval(socket.intervalfivemessages)
      socket.socketd = null
      console.log(`[error] ${error}`);
      //socket.start()
    };
  },
  stop(code, reason) {
    clearInterval(socket.intervalcheck) // ?
    clearInterval(socket.intervalSave) // ?
    clearInterval(socket.intervalfivemessages) // ?
    this.socketd.close(code, reason)
    this.socketd = null // ?
    socket.logs = []
  },
  send(message) {

    if (this.socketd) this.socketd.send(`42["message",{"hash":"${this.hash(25)}","streamId":${this.streamId},"channelId":${this.channelId},"jwt":"${this.jwt}","message":"${message}"}]`)
  },
  hash(length) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) { result += characters.charAt(Math.floor(Math.random() * charactersLength)); }
    return result;
  },
  parseCmd(message, isDataArray=false, prefix='!') {
    try {
      prefix = prefix.trim()
      message = message.trim()
      let cmd = message.slice(prefix.length, message.indexOf(" "))
      if (!(message.indexOf(" ") != -1)) cmd = message.slice(prefix.length, message.length)
      if (message.slice(0, prefix.length) != prefix) cmd = null
      let data = message.slice(message.indexOf(" "), message.length).trim()
      if (data == data.slice(data.length-1)) {data = null}
      if (data != null && isDataArray) data = data.split(' ')
      return {cmd: cmd, data: data, prefix: prefix}
    } catch (err) {
      console.log(err)
      return {}
    }
  },
  isMod(JSData) {
    if (JSData) {
      let role = JSData[1]?.user_channel_role == 'CHANNEL_OWNER'
      if (!role) role = JSData[1]?.user_channel_role == 'CHANNEL_MODERATOR'
      return role
    } else {
      return false
    }
  },
  isSub(JSData) {
    if (JSData) {
      let role = false
      for (let rol of JSData[1]?.other_roles) { if (rol == 'CHANNEL_SUBSCRIBER') role = true } //?
      if (!role) role = JSData[1]?.user_channel_role == 'CHANNEL_SUBSCRIBER'
      return role
    } else {
      return false
    }
  },
  onMessage(JSData) {
    let data1 = this.parseCmd(JSData[1].message, true, settings.bot.cmdPrefixBotMod[0])
    let user_login = JSData[1].user_login
    if (data1.cmd != null) console.log('bot mod', data1)
    if (data1.prefix == settings.bot.cmdPrefixBotMod[0]) switch (data1.cmd) {
      case 'ban':
        if (settings.bot.cmdBan) {
          if (this.isMod(JSData)) if (data1.data) for(let data of data1.data) {
            fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
            .then(res => res?.json())
            .then((out) => {
              if (out.result) {
                var finded = false;
                for (let value of out.result.rows) {

                  if (value.user_login.toLowerCase().trim() == data.split('@').join('').toLowerCase().trim()) {
                    finded = true;
                    fetch(socket.stream_url)
                    .then(res => res?.json())
                    .then((out) => {

                      let response = {
                        method: 'PUT',
                        body: `{"user_id":${value.user_id},"stream_id":${out.result.media_container.media_container_streams[0].stream_id}}`,
                        headers: {'Content-Type': 'application/json'},
                      }
                      fetch(`https://wasd.tv/api/channels/${out.result.channel.channel_id}/banned-users`, response)
                      .then(res => res?.json())
                      .then((out) => {
                        //console.log(out)
                        if (out.error.code == 'STREAMER_BAN_ALREADY_EXISTS') {
                            socket.send(`@${user_login} Пользователь @${value.user_login} уже заблокирован`);
                        } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
                            socket.send(`@${user_login} Вы не можете этого сделать`);
                        }
                      })
                    })
                    break;
                  }
                }
                if (!finded) {
                  socket.send('Пользователь не найден')
                }
              }
            })
          } else {
            socket.send('Пользователь не найден')
          }
        }
        return;
      case 'unban':
        if (settings.bot.cmdBan) {
          if (this.isMod(JSData))  if (data1.data) for(let data of data1.data) {
            fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
            .then(res => res?.json())
            .then((out) => {
              if (out.result) {
                var finded = false
                for (let value of out.result.rows) {
                  if (value.user_login.toLowerCase().trim() == data.split('@').join('').toLowerCase().toLowerCase().trim()) {
                    finded = true;
                    if (socket.stream_url != null) fetch(socket.stream_url)
                    .then(res => res?.json())
                    .then((out) => {

                      let response = {
                        method: 'DELETE',
                      }
                      fetch(`https://wasd.tv/api/channels/${out.result.channel.channel_id}/banned-users/${value.user_id}`, response)
                      .then(res => res?.json())
                      .then((out) => {
                        if (out.error.code == 'STREAMER_BAN_NOT_FOUND') {
                          socket.send(`@${user_login} Пользователь @${value.user_login} не забанен`)
                        } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
                          socket.send(`@${user_login} Вы не можете этого сделать`);
                        }
                      })
                    })
                    break;
                  }
                }
                if (!finded) {
                  socket.send('Пользователь не найден')
                }
              }
            })
          } else {
            socket.send('Пользователь не найден')
          }
        }
        return;
      case 'mod':
        if (settings.bot.cmdMod) {
          if (this.isMod(JSData)) if (data1.data) {
            for(let data of data1.data) {
              fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
              .then(res => res?.json())
              .then((out) => {
                if (out.result) {
                  var finded = false;
                  for (let value of out?.result?.rows) {

                    if (value.user_login.toLowerCase().trim() == data.split('@').join('').toLowerCase().trim()) {
                      finded = true;
                      fetch(socket.stream_url)
                      .then(res => res?.json())
                      .then((out) => {

                        let response = {
                          method: 'PUT',
                          body: `{"user_id":${value.user_id}}`,
                          headers: {'Content-Type': 'application/json'},
                        }
                        fetch(`https://wasd.tv/api/channels/${out.result.channel.channel_id}/moderators`, response)
                        .then(res => res?.json()) //err
                        .then((out) => {
                          //console.log(out)
                          if (out.error.code == 'STREAMER_MODERATOR_ALREADY_EXISTS') {
                            socket.send(`@${user_login} Пользователь @${value.user_login} уже назначен модератором`);
                          } else if (out.error.code == 'USER_CANT_ASSIGN_MODERATOR') {
                            socket.send(`@${user_login} Вы не можете этого сделать`);
                          }
                        })
                        // socket.send(`Пользователь @${value.user_login} назначен модератором`, 'success')
                      })
                      break;
                    }
                  }
                  if (!finded) {
                    socket.send('Пользователь не найден')
                  }
                }
              })
            }
          } else {
            socket.send('Пользователь не найден')
          }
        }
        return;
      case 'unmod':
        if (settings.bot.cmdMod) {
          if (this.isMod(JSData)) if (data1.data) for(let data of data1.data) {
            fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
            .then(res => res?.json())
            .then((out) => {
              if (out.result) {
                var finded = false
                for (let value of out.result.rows) {
                  if (value.user_login.toLowerCase().trim() == data.split('@').join('').toLowerCase().toLowerCase().trim()) {
                    finded = true;
                    fetch(socket.stream_url)
                    .then(res => res?.json())
                    .then((out) => {

                      let response = {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json'}, // , 'Access-Control-Allow-Origin': 'https://wasd.tv'
                      }
                      fetch(`https://wasd.tv/api/channels/${out.result.channel.channel_id}/moderators/${value.user_id}`, response)
                      .then(res => res?.json()) //err
                      .then((out) => {
                        if (out.error.code == 'STREAMER_MODERATOR_NOT_FOUND') {
                          socket.send(`@${user_login} Пользователь @${value.user_login} не назначен модератором`)
                        } else if (out.error.code == 'USER_CANT_ASSIGN_MODERATOR') {
                          socket.send(`@${user_login} Вы не можете этого сделать`)
                        }
                        /* else {
                          socket.send(`Пользователь @${value.user_login} разбанен`)
                        }*/
                      })
                      // socket.send(`Пользователь @${value.user_login} уже не модератор`, 'success')
                    })
                    break;
                  }
                }
                if (!finded) {
                  socket.send('Пользователь не найден')
                }
              }
            })
          } else {
            socket.send('Пользователь не найден')
          }
        }
        return;
      case 'raid':
        if (settings.bot.cmdRaid) {
          if (this.isMod(JSData)) if (data1.data) {
            url = data1.data[0].split('@').join('').toLowerCase().trim()
            if (url.indexOf('://') == -1) { url = `https://wasd.tv/${url}` }
            fetch(socket.stream_url)
            .then(res => res?.json())
            .then((out) => {
              fetch(`https://wasd.tv/api/v2/channels/${out.result.channel.channel_id}/raid?raid_channel=${url}`, {method: 'POST'})
              .then(res => res?.json())
              .then((out) => {
                //console.log(out)
                if (out.error.code == 'ERROR') {
                  socket.send('Неизвестная ошибка')
                } else if (out.error.code == 'RAID_INFO_ALREADY_EXISTS') {
                  socket.send('Рейд уже начался')
                } else if (out.error.code == 'NO_CHANNEL_WITH_CURRENT_ALIAS') {
                  socket.send('Канал не найден')
                }

              })
              socket.send(`Рейд начался`, 'success')
              socket.send(`@${user_login} Начал рейд на канал ${url}`)
            })
          } else {
            socket.send('Пользователь не найден')
          }
        }
        return;
      case 'game':
        if (settings.bot.cmdGame) {
          data1 = this.parseCmd(JSData[1].message, false, '/')
          if (this.isMod(JSData)) if (data1.data != null) {
            var game = data1.data.split('@').join('').toLowerCase().trim()
            fetch(`https://wasd.tv/api/search/games?limit=999&offset=0&search_phrase=${encodeURIComponent(game.toLowerCase())}`)
            .then(res => res?.json())
            .then((out) => {
              //console.log(out.result)
              if (out.result.rows.length) {
                let isFindGame = false
                for (let value of out.result.rows) {
                  if (game.toLowerCase() == value.game_name.toLowerCase()) {
                    isFindGame = true
                    fetch(`https://wasd.tv/api/profiles/current/settings`, {
                      method: 'PATCH',
                      body: `{"new_settings":[{"setting_key":"STREAM_GAME","setting_value":${value.game_id}}]}`,
                      headers: {
                        'Content-Type': 'application/json'
                      },
                    })
                    .then(res => res?.json())
                    .then((out) => {
                      if (out.result[0].setting_key == "STREAM_GAME") {
                        socket.send(`@${user_login} Категория была изменена на '${value.game_name}'`)
                      }
                    })
                  }
                }
                if (!isFindGame) socket.send(`@${user_login} Категория '${game}' не найдена`)
              } else {
                socket.send(`@${user_login} Категория '${game}' не найдена`)
              }
            })
          } else {
            fetch(`https://wasd.tv/api/profiles/current/settings`)
            .then(res => res?.json())
            .then((out) => {
              for(let setting_key of out.result) {
                if (setting_key.setting_key == 'STREAM_GAME') {
                  socket.send(`@${user_login} категория стрима '${setting_key.setting_value.game_name}'`)
                }
              }
            })
          }
        }
        return;
      case 'title':
        if (settings.bot.cmdTitle) {
          data1 = this.parseCmd(JSData[1].message, false, '/')
          if (this.isMod(JSData)) if (data1.data != null) {
            let title = data1.data.split('@').join('').trim()
            fetch(`https://wasd.tv/api/profiles/current/settings`, {
              method: 'PATCH',
              body: `{"new_settings":[{"setting_key":"STREAM_NAME","setting_value":"${title}"}]}`,
              headers: {
                'Content-Type': 'application/json'
              },
            })
            .then(res => res?.json())
            .then((out) => {
              if (out.result[0].setting_key == "STREAM_NAME") {
                socket.send(`@${user_login} Название было изменено на '${title}'`)
              }
            })
          } else {
            fetch(`https://wasd.tv/api/profiles/current/settings`)
            .then(res => res?.json())
            .then((out) => {
              for(let setting_key of out.result) {
                if (setting_key.setting_key == 'STREAM_NAME') {
                  socket.send(`@${user_login} название стрима '${setting_key.setting_value}'`)
                }
              }
            })
          }
        }
        return;
      case 'followers':
        if (settings.bot.cmdFollowers) {
          if (this.isMod(JSData)) {
            fetch(socket.stream_url)
            .then(res => res?.json())
            .then((out) => {

              fetch(`https://wasd.tv/api/chat/streams/${out.result.media_container.media_container_streams[0].stream_id}/settings`, {
                method: 'POST',
                body: `{"chatRoleLimitMode":"1"}`,
                headers: {
                  'Content-Type': 'application/json'
                },
              })
              .then(res => res?.json())
              .then((out) => {
                if (out.error) if (out.error.code == "AUTH_FORBIDDEN") {
                  socket.send(`@${user_login} Вы не можете этого сделать`)
                } else if (out.error) if (out.error.code == "VALIDATION") {
                  socket.send('Неизвестная ошибка')
                }
              })
            })
          }
        }
        return;
      case 'followersoff':
        if (settings.bot.cmdFollowers) {
          if (this.isMod(JSData)) {
            fetch(socket.stream_url)
            .then(res => res?.json())
            .then((out) => {

              fetch(`https://wasd.tv/api/chat/streams/${out.result.media_container.media_container_streams[0].stream_id}/settings`, {
                method: 'POST',
                body: `{"chatRoleLimitMode":"0"}`,
                headers: {
                  'Content-Type': 'application/json'
                },
              })
              .then(res => res?.json())
              .then((out) => {
                if (out.error) if (out.error.code == "AUTH_FORBIDDEN") {
                  socket.send(`@${user_login} Вы не можете этого сделать`)
                } else if (out.error) if (out.error.code == "VALIDATION") {
                  socket.send('Неизвестная ошибка')
                }
              })
            })
          }
        }
        return;
      case 'subscribers':
        if (settings.bot.cmdSubscribers) {
          if (this.isMod(JSData)) {
            fetch(socket.stream_url)
            .then(res => res?.json())
            .then((out) => {

              fetch(`https://wasd.tv/api/chat/streams/${out.result.media_container.media_container_streams[0].stream_id}/settings`, {
                method: 'POST',
                body: `{"chatRoleLimitMode":"2"}`,
                headers: {
                  'Content-Type': 'application/json'
                },
              })
              .then(res => res?.json())
              .then((out) => {
                if (out.error) if (out.error.code == "AUTH_FORBIDDEN") {
                  socket.send(`@${user_login} Вы не можете этого сделать`)
                } else if (out.error) if (out.error.code == "VALIDATION") {
                  socket.send('Неизвестная ошибка')
                }
              })
            })
          }
        }
        return;
      case 'subscribersoff':
        if (settings.bot.cmdSubscribers) {
          if (this.isMod(JSData)) {
            fetch(socket.stream_url)
            .then(res => res?.json())
            .then((out) => {

              fetch(`https://wasd.tv/api/chat/streams/${out.result.media_container.media_container_streams[0].stream_id}/settings`, {
                method: 'POST',
                body: `{"chatRoleLimitMode":"0"}`,
                headers: {
                  'Content-Type': 'application/json'
                },
              })
              .then(res => res?.json())
              .then((out) => {
                if (out.error) if (out.error.code == "AUTH_FORBIDDEN") {
                  socket.send(`@${user_login} Вы не можете этого сделать`)
                } else if (out.error) if (out.error.code == "VALIDATION") {
                  socket.send('Неизвестная ошибка')
                }
              })
            })
          }
        }
        return;
      case 'timeout':
          if (settings.bot.cmdTimeout) {
            if (this.isMod(JSData)) if (data1.data) {
              let data = data1.data[0]
              let duration = Number(data1?.data?.[1])
              if (isNaN(duration)) duration = 10
              if (duration != 1 && duration != 10 && duration != 60) { duration = 10 }
              fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
              .then(res => res?.json())
              .then((out) => {
                if (out.result) {
                  var finded = false;
                  for (let value of out.result.rows) {

                    if (value.user_login.toLowerCase().trim() == data.split('@').join('').toLowerCase().trim()) {
                      finded = true;
                      fetch(socket.stream_url)
                      .then(res => res?.json())
                      .then((out) => {

                        let response = {
                          method: 'PUT',
                          body: `{"user_id":${value.user_id},"stream_id":${out.result.media_container.media_container_streams[0].stream_id}, "keep_messages": true, "duration": ${duration}}`,
                          headers: {'Content-Type': 'application/json'},
                        }
                        fetch(`https://wasd.tv/api/channels/${out.result.channel.channel_id}/banned-users`, response)
                        .then(res => res?.json())
                        .then((out) => {
                          //console.log(out)
                          if (out.error.code == 'STREAMER_BAN_ALREADY_EXISTS') {
                            socket.send(`@${user_login} Пользователь @${value.user_login} уже заблокирован`);
                          } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
                            socket.send(`@${user_login} Вы не можете этого сделать`);
                          }
                        })
                      })
                      break;
                    }
                  }
                  if (!finded) {
                    socket.send('Пользователь не найден')
                  }
                }
              })
            } else {
              socket.send('Пользователь не найден')
            }
          }
          return;
    }

    let data2 = this.parseCmd(JSData[1].message, false, settings.bot.cmdPrefixBotUser[0])
    if (data2.cmd != null) console.log('bot user', data2)
    if (data2.prefix == settings.bot.cmdPrefixBotUser[0]) switch (data2.cmd) {
      case 'uptime':
        if (settings.bot.cmdUptime) {
          fetch(socket.stream_url)
          .then(res => res?.json())
          .then((out) => {
            if (typeof out.result.media_container.published_at !== 'undefined') {
              var date1 = new Date(out.result.media_container.published_at)
              var dater = new Date(new Date() - date1);
              var textdate = `${(dater.getUTCHours() < 10) ? '0' + dater.getUTCHours() : ((dater.getUTCDate()*24) + dater.getUTCHours())}:${(dater.getUTCMinutes() < 10) ? '0' + dater.getUTCMinutes() : dater.getUTCMinutes()}:${(dater.getUTCSeconds() < 10) ? '0' + dater.getUTCSeconds() : dater.getUTCSeconds()}`
              socket.send(`@${user_login} стрим идет ${textdate}`)
            }
          })
        }
        return;
      case 'game':
        if (settings.bot.cmdUserGame) {
          fetch(`https://wasd.tv/api/profiles/current/settings`)
          .then(res => res?.json())
          .then((out) => {
            for(let setting_key of out.result) {
              if (setting_key.setting_key == 'STREAM_GAME') {
                socket.send(`@${user_login} категория стрима '${setting_key.setting_value.game_name}'`)
              }
            }
          })
        }
        return;
      case 'title':
          if (settings.bot.cmdUserTitle) {
            fetch(`https://wasd.tv/api/profiles/current/settings`)
            .then(res => res?.json())
            .then((out) => {
              for(let setting_key of out.result) {
                if (setting_key.setting_key == 'STREAM_NAME') {
                  socket.send(`@${user_login} название стрима '${setting_key.setting_value}'`)
                }
              }
            })
          }
          return;
    }

    for (let cmd in settings.bot.usercmds) {
      let item = settings.bot.usercmds[cmd]

      let data3 = socket.parseCmd(JSData[1].message, false, item.prefix)

      let res = wasd.replacetext(item.result, JSData)

      if (item.privilege == 0 && socket.isMod(JSData)) {
        if (data3.cmd == item.cmd && data3.prefix == item.prefix) {
          socket.send(res)
          return;
        }
      }

      if (item.privilege == 1 && socket.isSub(JSData) || socket.isMod(JSData)) {
        if (data3.cmd == item.cmd && data3.prefix == item.prefix) {
          socket.send(res)
          return;
        }
      }

      if (item.privilege == 2) {
        if (data3.cmd == item.cmd && data3.prefix == item.prefix) {
          socket.send(res)
          return;
        }
      }
    }
  },
  onOpen() {
    intervalSave = setInterval(() => {
      wasd.saveUserList()
    }, 30000)
    wasd.saveUserList()
  },
  setTimeouts(JSData) {
    if (JSData[1].user_login != socket.current.user_profile.user_login) {

      for ( let int in settings.bot.usercmdstimeout ) {

        if (!socket.intervalLastMessages[int]) socket.intervalLastMessages[int] = []
        socket.intervalLastMessages[int].push(JSData[1])

        let data = settings.bot.usercmdstimeout[int]
        if (!!data.minMessages ? socket.intervalLastMessages[int].length >= data.minMessages : true) {

          if (socket.startedTimeouts[data.name]) continue

          socket.startedTimeouts[data.name] = {name: data.name}

          setTimeout(() => {

            delete socket.startedTimeouts[int]
            delete socket.intervalLastMessages[int]
            socket.send(data.message)

          }, data.interval*1000)

        }
      }

      console.log('startedTimeouts', socket.startedTimeouts, 'intervalLastMessages', socket.intervalLastMessages)
    }
  },
  punishment(type, JSData) {
    let user_login = JSData.user_login

    if (type.toString() == '0') {
      // socket. Удалить

      let response = {
        method: 'POST',
        body: `{"ids":["${JSData.id}"],"messages_owner_id":${JSData.user_id}}`,
        headers: {'Content-Type': 'application/json'},
      }
      fetch(`https://wasd.tv/api/chat/streams/${socket.streamId}/delete-messages`, response)
      .then(res => res?.json())
      .then((out) => {
        // console.log(out)
        // if (out.error.code == 'STREAMER_BAN_ALREADY_EXISTS') {
        //   console.log(`@${user_login} Пользователь @${JSData.user_login} уже заблокирован`);
        // } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
        //   console.log(`@${user_login} Вы не можете этого сделать`);
        // }
      })

    } else if (type.toString() == '1') {
      // socket. Тайм-аут

      let response = {
        method: 'PUT',
        body: `{"user_id":${JSData.user_id},"stream_id":${socket.streamId}, "keep_messages": true, "duration": 1}`,
        headers: {'Content-Type': 'application/json'},
      }
      fetch(`https://wasd.tv/api/channels/${socket.channelId}/banned-users`, response)
      .then(res => res?.json())
      .then((out) => {
        //console.log(out)
        if (out.error.code == 'STREAMER_BAN_ALREADY_EXISTS') {
          console.log(`@${user_login} Пользователь @${JSData.user_login} уже заблокирован`);
        } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
          console.log(`@${user_login} Вы не можете этого сделать`);
        }
      })

    } else if (type.toString() == '2') {
      // socket. Бан

      let response = {
        method: 'PUT',
        body: `{"user_id":${JSData.user_id},"stream_id":${socket.streamId}}`,
        headers: {'Content-Type': 'application/json'},
      }
      fetch(`https://wasd.tv/api/channels/${socket.channelId}/banned-users`, response)
      .then(res => res?.json())
      .then((out) => {
        //console.log(out)
        if (out.error.code == 'STREAMER_BAN_ALREADY_EXISTS') {
            console.log(`@${user_login} Пользователь @${JSData.user_login} уже заблокирован`);
        } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
            console.log(`@${user_login} Вы не можете этого сделать`);
        }
      })

    }
  }
}

const wasd = {
  users: [],
  lastFiveMessages: [],
  messages: [],
  saveUserList() {
    wasd.users = []
    getall = (limit, offset) => {
      fetch(`https://wasd.tv/api/chat/streams/${socket.streamId}/participants?limit=${limit}&offset=${offset}`)
      .then(res => res?.json())
      .then((out) => {
        wasd.users.push(...out.result)
        if(out.result.length == limit) {
          getall(limit, offset+1)
        } else {
          console.log('saveUserList', wasd.users)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
    getall(10000, 0)
  },
  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  },
  getRndUser() {
    if (wasd.users) {
      return '@'+wasd.users[wasd.getRndInteger(0, wasd.users.length-1)].user_login
    } else {
      return '@undefined'
    }
  },
  replacetext(text, JSData) {
    let res = text

    try {
      res  = res.replace(/(randomInt\(([^)]+[^ ]))/ig, (match) => {
        match = match.replace('randomInt', '').replace(/([()])/ig, '').split(',')
        if (match[0] && match[1]) {
          return wasd.getRndInteger(parseInt(match[0].trim()), parseInt(match[1].trim()))
        } else {
          return '0'
        }
      })

      res = res.replace('randomUser()', () => {
        return wasd.getRndUser()
      })
      
      res = res.replace(/(randomVar\(([^)]+[^ ]))/ig, (match) => {
        match = match.replace('randomVar', '').replace(/([()])/ig, '').split('&')
        return match[wasd.getRndInteger(0, match.length-1)].trim()
      })

      res = res.replace('user()', () => {
        if (JSData) {
          return '@' + JSData[1].user_login
        } else {
          return '@undefined'
        }
      })

      res = res.replace(/(timer\(([^)]+[^ ]))/ig, (match) => {
        match = match.replace('timer', '').replace(/([()])/ig, '')
        if (match) {
            return moment(new Date(match.trim())).fromNow();
        } else {
          return 'Invalid date'
        }
      })

      res = res.replace('uptime()', () => {
        var date1 = new Date(socket.currentChannel.media_container.published_at)
        var dater = new Date(new Date() - date1);
        return `${(dater.getUTCHours() < 10) ? '0' + dater.getUTCHours() : ((dater.getUTCDate()*24) + dater.getUTCHours())}:${(dater.getUTCMinutes() < 10) ? '0' + dater.getUTCMinutes() : dater.getUTCMinutes()}:${(dater.getUTCSeconds() < 10) ? '0' + dater.getUTCSeconds() : dater.getUTCSeconds()}`
      })
    } catch (err) {
      console.log(err)
    }

    return res
  }
}


const protection = {
  // Настройки защиты от заглавных букв
  findCaps(message) {
    let caps = message.match(/([A-ZА-Я])/g);
    if (!caps) return false
    const percent = caps.length / message.length * 100
    const removed = (caps.length > settings.protectionCaps.minCaps && percent >= settings.protectionCaps.percentCaps) || caps.length >= settings.protectionCaps.maxCaps
    // console.log(`${removed ? 'removed' : 'not removed'}`, '(caps.length >= minCaps):', caps.length > settings.protectionCaps.minCaps, '(caps.length >= maxCaps):', caps.length >= settings.protectionCaps.maxCaps, '(percent >= percentCaps):', percent >= settings.protectionCaps.percentCaps, '(caps.length):', caps.length, 'length:', message.length, 'percent:', percent)
    return removed
  },

  // Максимум. Длина сообщения
  maxLength(message) {
    const removed = message.length >= settings.protectionSymbol.maxLength
    // console.log(`${removed ? 'removed' : 'not removed'}`, 'message.length:', message.length)
    return removed
  },

  // Настройки защиты от ссылок
  findLink(message, data = { blacklist: { 'wasd.tv': {hostname: 'wasd.tv'} } } ) {
    // data.blacklist
    var links = linkify.find(message)
    var removed = false

    for (let link of links) {

      let find = link.type = "url" ? data.blacklist[new URL(link.href).hostname] : false
      if (find) {
        removed = true
        console.log('find', find.hostname)
        break;
      }

    }
    
    console.log(`${removed ? 'removed' : 'not removed'}`, 'links:', links)
    
    return removed
  },

  permit(role, JSData) {
    if (role.toString == '0') {
      return false
    } else if (role.toString == '1') {
      return socket.isSub(JSData)
    }
  },

  protect(JSData) {
    if (JSData.user_login != socket.current.user_profile.user_login) {

      if (settings.protectionCaps.status && this.findCaps(JSData.message)) {
        if (this.permit(settings.protectionCaps.autoPermit, JSData)) return
        if (settings.protectionCaps.sendPunishmentMessage[1]) {
          socket.send(settings.protectionCaps.sendPunishmentMessage[0].replace('{user_login}', '@'+JSData.user_login))
        }
        socket.punishment(settings.protectionCaps.punishment, JSData)
      }

      if (settings.protectionSymbol.status && this.maxLength(JSData.message)) {
        if (this.permit(settings.protectionSymbol.autoPermit, JSData)) return
        if (settings.protectionSymbol.sendPunishmentMessage[1]) {
          socket.send(settings.protectionSymbol.sendPunishmentMessage[0].replace('{user_login}', '@'+JSData.user_login))
        }
        socket.punishment(settings.protectionSymbol.punishment, JSData)
      }

      // this.findLink(JSData.message, )

    }
    
  }
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.from == "popup_bot" || request.log == true) {
      chrome.runtime.sendMessage({
        from: 'background_bot',
        logs: [...socket.logs]
      })
    }
  }
);