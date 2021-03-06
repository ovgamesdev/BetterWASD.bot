let settings = {}
moment.locale('ru')

chrome.storage.onChanged.addListener(function (changes, namespace) {
  settings[Object.entries(changes)[0][0]] = Object.entries(changes)[0][1].newValue
  if (socket.channelId == 0) socket.getCurrent()
  console.log('onChanged', settings)
});

const socket = {
  socketd: null,
  streamId: 0,
  channelId: 0,
  intervalcheck: null,
  intervalSave: null,
  intervalSaveCoins: null,
  current: null,
  stream_url: null,
  closedId: null,
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
        
        fetch(`https://betterwasd.herokuapp.com/api/v1/stat/bot/${out.result.user_profile.user_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_login: out.result.user_profile.user_login,
            channel_image: out.result.user_profile.profile_image.large
          })
        })

        chrome.runtime.setUninstallURL(`https://betterwasd.herokuapp.com/api/v1/stat/bot/delete/${out.result.user_profile.user_id}`,)

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
        // chrome.action.setTitle({title: `????????????????: ${out.result.channel_name}`});
      } else if (this.isBotInited && !out.result.channel_is_live) {
        this.isBotInited = false
        // this.socketd.close(1000, 'LIVE_CLOSED')
        console.log('bot not inited to channel')
      } else if (this.isBotInited && out.result.channel_is_live) {
        // console.log('bot worked')
      } else {
        console.log('bot not worked')
        chrome.browserAction.setIcon({path: "img/noactive48.png"});
        // chrome.action.setTitle({title: `BetterWASD.bot`});
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
      socket.logs = []
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
                  socket.closedId = out.result.view_url.replace('https://wasd.tv/private-stream/', '')
                  fetch('https://wasd.tv/api/v2/broadcasts/closed/' + socket.closedId)
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
            try {
              if (socket.socketd.readyState === socket.socketd.OPEN) socket.socketd.send(data);
            } catch (err) {
              ws.log('[catch]', err)
            }

            socket.onOpen()

            socket.intervalcheck = setInterval(() => {
              if (socket.socketd) {
                try {
                  if (socket.socketd.readyState !== socket.socketd.OPEN) return
                  socket.socketd.send('2')
                } catch {
                  // clearInterval(socket.intervalcheck)
                  // clearInterval(socket.intervalSave)
                  // clearInterval(socket.intervalSaveCoins)
                  console.log('[catch]', socket.socketd)
                  // socket.start()
                }
              }
            }, 5000)

          })
      })
    };

    this.socketd.onclose = function(e) {
      clearInterval(socket.intervalcheck)
      clearInterval(socket.intervalSave)
      clearInterval(socket.intervalSaveCoins)
      socket.socketd = null
      socket.streamId = 0
      if (e.code == 404 || e.wasClean) {
        console.log(`[close] ???????????????????? ?????????????? ??????????, ?????? =`, e.code, `?????????????? =`, e.reason);
      } else {
        console.log('[close] ???????????????????? ????????????????');
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
            if (socket.logs.length >= 100000) socket.logs.splice(0, 1)
            socket.logs.push(log)
          }

          switch (JSData[0]) {
            case "joined":
              console.log(`[${JSData[0]}] ${JSData[1].user_channel_role}`, JSData);
              if (settings.bot.eventInit[1]) socket.send(settings.bot.eventInit[0].replace('{cmd_commands}', settings.bot.cmdCommands.alias))
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
              giveaway.add(JSData)
              if (JSData[1].user_id == giveaway.winner?.user_id) sendMessage({ from: 'background_bot', giveawayWinnerMgs: JSData })
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
                prname = `${(JSData[1].validity_months == 1) ? '1 ??????????' : JSData[1].validity_months + ' ????????????'}`
                text.replace('{product_name}', prname);
                socket.send(text)
              }
              break;
            case "_system":
              console.log(`[${JSData[0]}] ${JSData[1]}`, JSData);
              break;
            case "leave":
              console.log(`[${JSData[0]}] ${JSData[1].streamId}`, JSData);
              socket.socketd.close(1000, 'leave')
              break;
            case "user_ban":
              console.log(`[${JSData[0]}] ${JSData[1].payload.user_login}`, JSData);
              break;
            case "settings_update":
              console.log(`[${JSData[0]}] ${JSData[1]}`, JSData);
              break
            case "streamStopped":
              console.log(`[${JSData[0]}] ${JSData[1].streamId}`, JSData);
              socket.socketd.close(1000, 'streamStopped')
              break
            default:
              console.log('def', code, JSData);
              break;
          }
        }
      }
    };

    this.socketd.onerror = function(err) {
      clearInterval(socket.intervalcheck)
      clearInterval(socket.intervalSave)
      clearInterval(socket.intervalSaveCoins)
      socket.socketd = null
      socket.streamId = 0
      console.log(`[error]`, err);
      //socket.start()
    };
  },
  send(message) {
    if (this.socketd && message.trim() != '') {
      // console.log('send', message)
      this.socketd.send(`42["message",{"hash":"${this.hash(25)}","streamId":${this.streamId},"channelId":${this.channelId},"jwt":"${this.jwt}","message":"${message}"}]`)
    }
  },
  hash(length) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) { result += characters.charAt(Math.floor(Math.random() * charactersLength)); }
    return result;
  },
  parseCmd(message, isDataArray=false) {
    try {
      message = message.trim()
      let cmd = message.slice(0, message.indexOf(" "))
      if (!(message.indexOf(" ") != -1)) cmd = message.slice(0, message.length)
      let data = message.slice(message.indexOf(" "), message.length).trim()
      if (data == message.slice(cmd.length-1, cmd.length+data.length-1)) {data = null}
      if (data != null && isDataArray) data = data.split(' ')
      return {cmd: cmd, data: data}
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
    let data1 = this.parseCmd(JSData[1].message, true)
    let user_login = JSData[1].user_login
    // if (data1.cmd != null) console.log('bot mod', data1)
    switch (data1.cmd) {
      case '/ban':
      case settings.bot.cmdBan.alias:
        if (!settings.bot.cmdBan.enabled) return
        if (settings.bot.cmdBan.alias == '' && data1.cmd == '/ban' || data1.cmd == settings.bot.cmdBan.alias)
        {
          if (this.isMod(JSData)) if (data1.data) for(let data of data1.data) {
            fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
            .then(res => res?.json())
            .then((out) => {
              if (out.result) {
                var finded = false;
                for (let value of out.result.rows) {

                  if (value.user_login?.trim()?.toLowerCase() == data.split('@').join('').toLowerCase().trim()) {
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
                            socket.send(`@${user_login} ???????????????????????? @${value.user_login} ?????? ????????????????????????`);
                        } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
                            socket.send(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`);
                        }
                      })
                    })
                    break;
                  }
                }
                if (!finded) {
                  socket.send('???????????????????????? ???? ????????????')
                }
              }
            })
          } else {
            socket.send('???????????????????????? ???? ????????????')
          }
        }
        return;
      case '/unban':
      case settings.bot.cmdBan.unalias:
        if (!settings.bot.cmdBan.enabled) return
        if (settings.bot.cmdBan.unalias == '' && data1.cmd == '/unban' || data1.cmd == settings.bot.cmdBan.unalias)
        {
          if (this.isMod(JSData))  if (data1.data) for(let data of data1.data) {
            fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
            .then(res => res?.json())
            .then((out) => {
              if (out.result) {
                var finded = false
                for (let value of out.result.rows) {
                  if (value.user_login?.trim()?.toLowerCase() == data.split('@').join('').toLowerCase().toLowerCase().trim()) {
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
                          socket.send(`@${user_login} ???????????????????????? @${value.user_login} ???? ??????????????`)
                        } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
                          socket.send(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`);
                        }
                      })
                    })
                    break;
                  }
                }
                if (!finded) {
                  socket.send('???????????????????????? ???? ????????????')
                }
              }
            })
          } else {
            socket.send('???????????????????????? ???? ????????????')
          }
        }
        return;
      case '/mod':
      case settings.bot.cmdMod.alias:
        if (!settings.bot.cmdMod.enabled) return
        if (settings.bot.cmdMod.alias == '' && data1.cmd == '/mod' || data1.cmd == settings.bot.cmdMod.alias)
        {
          if (this.isMod(JSData)) if (data1.data) {
            for(let data of data1.data) {
              fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
              .then(res => res?.json())
              .then((out) => {
                if (out.result) {
                  var finded = false;
                  for (let value of out?.result?.rows) {

                    if (value.user_login?.trim()?.toLowerCase() == data.split('@').join('').toLowerCase().trim()) {
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
                            socket.send(`@${user_login} ???????????????????????? @${value.user_login} ?????? ???????????????? ??????????????????????`);
                          } else if (out.error.code == 'USER_CANT_ASSIGN_MODERATOR') {
                            socket.send(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`);
                          }
                        })
                        // socket.send(`???????????????????????? @${value.user_login} ???????????????? ??????????????????????`, 'success')
                      })
                      break;
                    }
                  }
                  if (!finded) {
                    socket.send('???????????????????????? ???? ????????????')
                  }
                }
              })
            }
          } else {
            socket.send('???????????????????????? ???? ????????????')
          }
        }
        return;
      case '/unmod':
      case settings.bot.cmdMod.unalias:
        if (!settings.bot.cmdMod.enabled) return
        if (settings.bot.cmdMod.unalias == '' && data1.cmd == '/unmod' || data1.cmd == settings.bot.cmdMod.unalias)
        {
          if (this.isMod(JSData)) if (data1.data) for(let data of data1.data) {
            fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
            .then(res => res?.json())
            .then((out) => {
              if (out.result) {
                var finded = false
                for (let value of out.result.rows) {
                  if (value.user_login?.toLowerCase()?.trim() == data.split('@').join('').trim().toLowerCase()) {
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
                          socket.send(`@${user_login} ???????????????????????? @${value.user_login} ???? ???????????????? ??????????????????????`)
                        } else if (out.error.code == 'USER_CANT_ASSIGN_MODERATOR') {
                          socket.send(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`)
                        }
                        /* else {
                          socket.send(`???????????????????????? @${value.user_login} ????????????????`)
                        }*/
                      })
                      // socket.send(`???????????????????????? @${value.user_login} ?????? ???? ??????????????????`, 'success')
                    })
                    break;
                  }
                }
                if (!finded) {
                  socket.send('???????????????????????? ???? ????????????')
                }
              }
            })
          } else {
            socket.send('???????????????????????? ???? ????????????')
          }
        }
        return;
      case '/raid':
      case settings.bot.cmdRaid.alias:
        if (!settings.bot.cmdRaid.enabled) return
        if (settings.bot.cmdRaid.alias == '' && data1.cmd == '/raid' || data1.cmd == settings.bot.cmdRaid.alias)
        {
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
                  socket.send('?????????????????????? ????????????')
                } else if (out.error.code == 'RAID_INFO_ALREADY_EXISTS') {
                  socket.send('???????? ?????? ??????????????')
                } else if (out.error.code == 'NO_CHANNEL_WITH_CURRENT_ALIAS') {
                  socket.send('?????????? ???? ????????????')
                }

              })
              // socket.send(`???????? ??????????????`, 'success')
              socket.send(`@${user_login} ?????????? ???????? ???? ?????????? ${url}`)
            })
          } else {
            socket.send('???????????????????????? ???? ????????????')
          }
        }
        return;
      case '/game':
      case settings.bot.cmdGame.alias:
        if (!settings.bot.cmdGame.enabled) return
        if (settings.bot.cmdGame.alias == '' && data1.cmd == '/game' || data1.cmd == settings.bot.cmdGame.alias)
        {
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
                        socket.send(`@${user_login} ?????????????????? ???????? ???????????????? ???? '${value.game_name}'`)
                      }
                    })
                  }
                }
                if (!isFindGame) socket.send(`@${user_login} ?????????????????? '${game}' ???? ??????????????`)
              } else {
                socket.send(`@${user_login} ?????????????????? '${game}' ???? ??????????????`)
              }
            })
          } else {
            fetch(`https://wasd.tv/api/profiles/current/settings`)
            .then(res => res?.json())
            .then((out) => {
              for(let setting_key of out.result) {
                if (setting_key.setting_key == 'STREAM_GAME') {
                  socket.send(`@${user_login} ?????????????????? ???????????? '${setting_key.setting_value.game_name}'`)
                }
              }
            })
          }
        }
        return;
      case '/title':
      case settings.bot.cmdTitle.alias:
        if (!settings.bot.cmdTitle.enabled) return
        if (settings.bot.cmdTitle.alias == '' && data1.cmd == '/title' || data1.cmd == settings.bot.cmdTitle.alias)
        {
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
                socket.send(`@${user_login} ???????????????? ???????? ???????????????? ???? '${title}'`)
              }
            })
          } else {
            fetch(`https://wasd.tv/api/profiles/current/settings`)
            .then(res => res?.json())
            .then((out) => {
              for(let setting_key of out.result) {
                if (setting_key.setting_key == 'STREAM_NAME') {
                  socket.send(`@${user_login} ???????????????? ???????????? '${setting_key.setting_value}'`)
                }
              }
            })
          }
        }
        return;
      case '/followers':
      case settings.bot.cmdFollowers.alias:
        if (!settings.bot.cmdFollowers.enabled) return
        if (settings.bot.cmdFollowers.alias == '' && data1.cmd == '/followers' || data1.cmd == settings.bot.cmdFollowers.alias)
        {
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
                  socket.send(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`)
                } else if (out.error) if (out.error.code == "VALIDATION") {
                  socket.send('?????????????????????? ????????????')
                }
              })
            })
          }
        }
        return;
      case '/followersoff':
      case settings.bot.cmdFollowers.unalias:
        if (!settings.bot.cmdFollowers.enabled) return
        if (settings.bot.cmdFollowers.unalias == '' && data1.cmd == '/followersoff' || data1.cmd == settings.bot.cmdFollowers.unalias)
        {
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
                  socket.send(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`)
                } else if (out.error) if (out.error.code == "VALIDATION") {
                  socket.send('?????????????????????? ????????????')
                }
              })
            })
          }
        }
        return;
      case '/subscribers':
      case settings.bot.cmdSubscribers.alias:
        if (!settings.bot.cmdSubscribers.enabled) return
        if (settings.bot.cmdSubscribers.alias == '' && data1.cmd == '/subscribers' || data1.cmd == settings.bot.cmdSubscribers.alias)
        {
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
                  socket.send(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`)
                } else if (out.error) if (out.error.code == "VALIDATION") {
                  socket.send('?????????????????????? ????????????')
                }
              })
            })
          }
        }
        return;
      case '/subscribersoff':
      case settings.bot.cmdSubscribers.unalias:
        if (!settings.bot.cmdSubscribers.enabled) return
        if (settings.bot.cmdSubscribers.unalias == '' && data1.cmd == '/subscribersoff' || data1.cmd == settings.bot.cmdSubscribers.unalias)
        {
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
                  socket.send(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`)
                } else if (out.error) if (out.error.code == "VALIDATION") {
                  socket.send('?????????????????????? ????????????')
                }
              })
            })
          }
        }
        return;
      case '/timeout':
      case settings.bot.cmdTimeout.alias:
        if (!settings.bot.cmdTimeout.enabled) return
        if (settings.bot.cmdTimeout.alias == '' && data1.cmd == '/timeout' || data1.cmd == settings.bot.cmdTimeout.alias)
        {
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

                  if (value.user_login?.trim()?.toLowerCase() == data.split('@').join('').toLowerCase().trim()) {
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
                          socket.send(`@${user_login} ???????????????????????? @${value.user_login} ?????? ????????????????????????`);
                        } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
                          socket.send(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`);
                        }
                      })
                    })
                    break;
                  }
                }
                if (!finded) {
                  socket.send('???????????????????????? ???? ????????????')
                }
              }
            })
          } else {
            socket.send('???????????????????????? ???? ????????????')
          }
        }
        return;
    }

    let data2 = this.parseCmd(JSData[1].message, false)
    // if (data2.cmd != null) console.log('bot user', data2)

    switch (data2.cmd) {
      case '!uptime':
      case settings.bot.cmdUptime.alias:
        if (!settings.bot.cmdUptime.enabled) return
        if (settings.bot.cmdUptime.alias == '' && data2.cmd == '!uptime' || data2.cmd == settings.bot.cmdUptime.alias)
        {
          fetch(socket.stream_url)
          .then(res => res?.json())
          .then((out) => {
            if (typeof out.result.media_container.published_at !== 'undefined') {
              var date = new Date(out.result.media_container.published_at)
              let value = moment.utc(new Date(new Date() - date)).format('HH:mm:ss')
              socket.send(`@${user_login} ?????????? ???????? ${value}`)
            }
          })
        }
        return;
      case '!game':
      case settings.bot.cmdUserGame.alias:
        if (!settings.bot.cmdUserGame.enabled) return
        if (settings.bot.cmdUserGame.alias == '' && data2.cmd == '!game' || data2.cmd == settings.bot.cmdUserGame.alias)
        {
          fetch(`https://wasd.tv/api/profiles/current/settings`)
          .then(res => res?.json())
          .then((out) => {
            for(let setting_key of out.result) {
              if (setting_key.setting_key == 'STREAM_GAME') {
                socket.send(`@${user_login} ?????????????????? ???????????? '${setting_key.setting_value.game_name}'`)
              }
            }
          })
        }
        return;
      case '!title':
      case settings.bot.cmdUserTitle.alias:
        if (!settings.bot.cmdUserTitle.enabled) return
        if (settings.bot.cmdUserTitle.alias == '' && data2.cmd == '!title' || data2.cmd == settings.bot.cmdUserTitle.alias)
        {
          fetch(`https://wasd.tv/api/profiles/current/settings`)
          .then(res => res?.json())
          .then((out) => {
            for(let setting_key of out.result) {
              if (setting_key.setting_key == 'STREAM_NAME') {
                socket.send(`@${user_login} ???????????????? ???????????? '${setting_key.setting_value}'`)
              }
            }
          })
          return;
        }
        return;
      case '!commands':
      case settings.bot.cmdCommands.alias:
        if (!settings.bot.cmdCommands.enabled) return
        if (settings.bot.cmdCommands.alias == '' && data2.cmd == '!commands' || data2.cmd == settings.bot.cmdCommands.alias)
        {
          let commands = ''

          let uptime = settings.bot.cmdUptime.alias == '' ? '!uptime' : settings.bot.cmdUptime.alias
          let game = settings.bot.cmdUserGame.alias == '' ? '!game' : settings.bot.cmdUserGame.alias
          let title = settings.bot.cmdUserTitle.alias == '' ? '!title' : settings.bot.cmdUserTitle.alias
          let points = settings.bot.cmdPoints.alias == '' ? '!points' : settings.bot.cmdPoints.alias
          let store = settings.coins.cmdStore.alias == '' ? '!store' : settings.coins.cmdStore.alias
          let storeinfo = settings.coins.cmdStoreInfo.alias == '' ? '!storeinfo' : settings.coins.cmdStoreInfo.alias
          let redeem = settings.coins.cmdRedeem.alias == '' ? '!redeem' : settings.coins.cmdRedeem.alias

          let allcommands = [
            settings.bot.cmdUptime.enabled ? uptime : '',
            settings.bot.cmdUserGame.enabled ? game : '',
            settings.bot.cmdUserTitle.enabled ? title : '',
            settings.bot.cmdPoints.enabled ? points + ' [USERNAME]' : '',
            settings.coins.cmdStore.enabled ? store : '',
            settings.coins.cmdStoreInfo.enabled ? storeinfo + ' {ID}' : '',
            settings.coins.cmdRedeem.enabled ? redeem + ' {ID}' : ''
          ]

          for( let cmd of allcommands) {
            commands += ' ' + cmd + ','
          }

          for (let cmd in settings.bot.usercmds) {
            commands += settings.bot.usercmds[cmd].enabled ? ' ' + settings.bot.usercmds[cmd].cmd + ',' : ''
          }

          if (commands.trim() != '') {
            socket.send(`@${user_login} ?????????????? ????????: ${commands.replaceLast(',', '')}`)
          } else {
            socket.send(`@${user_login} ?????????????? ???? ?????????????? :(`)
          }
        }
        return;
      case '!vote':
        if (data2.data) poll.addVote(JSData[1].user_id, data2.data, JSData[1].user_login)
      case '!points':
      case settings.bot.cmdPoints.alias:
        if (!settings.bot.cmdPoints.enabled) return
        if (settings.bot.cmdPoints.alias == '' && data2.cmd == '!points' || data2.cmd == settings.bot.cmdPoints.alias)
        {
          if (data1.data != null) for(let data of data1.data) {
            fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
            .then(res => res?.json())
            .then((out) => {
              if (out.result) {
                var finded = false;
                for (let value of out.result.rows) {

                  if (value.user_login?.trim()?.toLowerCase() == data.split('@').join('').toLowerCase().trim()) {
                    finded = true;
                    let points = settings.coins.users[value.user_id]
                    socket.send(`@${user_login} ?? @${data.split('@').join('').trim()} ${points ? points.count : '??????'} ??????????`)
                    break;
                  }
                }
                if (!finded) {
                  socket.send(`@${user_login} ???????????????????????? ???? ????????????`)
                }
              }
            })
          } else {
            let data = settings.coins.users[JSData[1].user_id]
            socket.send(`@${user_login} ?? ?????? ${data ? data.count : '??????'} ??????????`)
            return;
          }
        }
        return;
      case '!store':
      case settings.coins.cmdStore.alias:
        if (!settings.coins.cmdStore.enabled) return
        if (settings.coins.cmdStore.alias == '' && data2.cmd == '!store' || data2.cmd == settings.coins.cmdStore.alias)
        {
          let store = Object.values(settings.coins.store)
          let result = ''

          store = store.sort(function(a, b) { return b.price - a.price; });
          store = store.filter(item => item.quantity != 0 && item.enabled);

          if (store.length == 0) {
            socket.send(`@${user_login} ?????????????? ????????.`)
            return;
          }

          store.forEach((value, index) => {
            result += `${value.name} (id: ${value.id}) - ${value.description}; `
          })

          socket.send(`@${user_login} ?????????????????? ????????????: ${result}`)
        }
        return;
      case '!storeinfo':
      case settings.coins.cmdStoreInfo.alias:
        if (!settings.coins.cmdStoreInfo.enabled) return
        if (settings.coins.cmdStoreInfo.alias == '' && data2.cmd == '!storeinfo' || data2.cmd == settings.coins.cmdStoreInfo.alias)
        {
          let store = Object.values(settings.coins.store)
          let result = ''

          store = store.filter(item => item.id == data1.data);

          if (store.length) {
            socket.send(`@${user_login} ${store[0].name} (${store[0].description}), ????????: ${store[0].price} ${store[0].quantity == -1 ? '' : ', ????????????????: ' + (store[0].quantity - store[0].sold)}`)
          } else {
            socket.send(`@${user_login} ?????????? ???? ???????????? :(`)
          }
        }
        return;
      case '!redeem':
      case settings.coins.cmdRedeem.alias:
        if (!settings.coins.cmdRedeem.enabled) return
        if (settings.coins.cmdRedeem.alias == '' && data2.cmd == '!redeem' || data2.cmd == settings.coins.cmdRedeem.alias)
        {
          let store = Object.values(settings.coins.store)
          store = store.filter(item => item.id == data1.data);

          if (store.length) {

            let buy = coins.buyLoyaltyStore(JSData, store[0].id)

            if (typeof buy === 'string') {
              socket.send(`@${user_login} ${buy}`)
            } else {
              socket.send(`@${user_login} ??????????????: ${store[0].name}`)
            }

          } else {
            socket.send(`@${user_login} ?????????? ???? ???????????? :(`)
          }
        }
        return;

    }

    for (let cmd in settings.bot.usercmds) {
      let item = settings.bot.usercmds[cmd]

      let data3 = socket.parseCmd(JSData[1].message, false)

      if (item.enabled) {
        if (item.privilege == 0 && socket.isMod(JSData)) {
          if (data3.cmd == item.cmd) {
            let res = wasd.replacetext(item.result, JSData)
            socket.send(res)
            return;
          }
        }

        if (item.privilege == 1 && socket.isSub(JSData) || socket.isMod(JSData)) {
          if (data3.cmd == item.cmd) {
            let res = wasd.replacetext(item.result, JSData)
            socket.send(res)
            return;
          }
        }

        if (item.privilege == 2) {
          if (data3.cmd == item.cmd) {
            let res = wasd.replacetext(item.result, JSData)
            socket.send(res)
            return;
          }
        }
      }

    }
  },
  onOpen() {
    socket.intervalSave = setInterval(async () => {
      await wasd.saveUserList()
    }, 50000)

    socket.intervalSaveCoins = setInterval(async () => {
      await wasd.saveUserList()
      await coins.saveUserCoins()
    }, 300000) // 300000

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
          if (!data.enabled) continue

          let timeout = setTimeout(() => {

            delete socket.startedTimeouts[int]
            delete socket.intervalLastMessages[int]
            socket.send(data.message)

          }, data.interval*1000)

          socket.startedTimeouts[data.name] = {name: data.name, timeout: timeout}
        }
      }

      console.log('startedTimeouts', socket.startedTimeouts, 'intervalLastMessages', socket.intervalLastMessages)
    }
  },
  punishment(type, JSData, duration = '1') {
    let user_login = JSData.user_login

    if (type.toString() === '0') {
      // socket. ??????????????

      let response = {
        method: 'POST',
        body: `{"ids":["${JSData.id}"],"messages_owner_id":${JSData.user_id}}`,
        headers: {'Content-Type': 'application/json'},
      }
      fetch(`https://wasd.tv/api/chat/streams/${socket.streamId}/delete-messages`, response)
      // .then(res => res?.json())
      // .then((out) => {
        // console.log(out)
        // if (out.error.code == 'STREAMER_BAN_ALREADY_EXISTS') {
        //   console.log(`@${user_login} ???????????????????????? @${JSData.user_login} ?????? ????????????????????????`);
        // } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
        //   console.log(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`);
        // }
      // })

    } else if (type.toString() === '1') {
      // socket. ????????-??????

      let response = {
        method: 'PUT',
        body: `{"user_id":${JSData.user_id},"stream_id":${socket.streamId}, "keep_messages": true, "duration": ${duration}}`,
        headers: {'Content-Type': 'application/json'},
      }
      fetch(`https://wasd.tv/api/channels/${socket.channelId}/banned-users`, response)
      // .then(res => res?.json())
      // .then((out) => {
      //   //console.log(out)
      //   if (out.error.code == 'STREAMER_BAN_ALREADY_EXISTS') {
      //     console.log(`@${user_login} ???????????????????????? @${JSData.user_login} ?????? ????????????????????????`);
      //   } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
      //     console.log(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`);
      //   }
      // })

    } else if (type.toString() === '2') {
      // socket. ??????

      let response = {
        method: 'PUT',
        body: `{"user_id":${JSData.user_id},"stream_id":${socket.streamId}}`,
        headers: {'Content-Type': 'application/json'},
      }
      fetch(`https://wasd.tv/api/channels/${socket.channelId}/banned-users`, response)
      // .then(res => res?.json())
      // .then((out) => {
      //   //console.log(out)
      //   if (out.error.code == 'STREAMER_BAN_ALREADY_EXISTS') {
      //       console.log(`@${user_login} ???????????????????????? @${JSData.user_login} ?????? ????????????????????????`);
      //   } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
      //       console.log(`@${user_login} ???? ???? ???????????? ?????????? ??????????????`);
      //   }
      // })

    }
  }
}

const wasd = {
  users: [],
  lastFiveMessages: [],
  messages: [],
  async saveUserList() {
    return new Promise(async (resolve, reject) => {
      wasd.users = []
      getall = (limit, offset) => {
        fetch(`https://wasd.tv/api/chat/streams/${socket.streamId}/participants?limit=${limit}&offset=${offset}`)
        .then(res => res?.json())
        .then((out) => {
          if (socket.streamId == 0 || out.error) return
          wasd.users.push(...out.result)
          if(out && out.result && out.result.length == limit) {
            getall(limit, offset+1)
          } else {
            console.log('saveUserList', wasd.users)
            resolve(wasd.users)
          }
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
      }
      getall(10000, 0)
    })
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

      res = res.replace(/randomUser\(\)/ig, () => {
        return wasd.getRndUser()
      })
      
      res = res.replace(/(randomVar\(([^)]+[^ ]))/ig, (match) => {
        match = match.replace('randomVar', '').replace(/([()])/ig, '').split('&')
        return match[wasd.getRndInteger(0, match.length-1)].trim() .replace('U+0029', ')').replace('U+0026', '&')
      })

      res = res.replace(/user\(\)/ig, () => {
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

      res = res.replace(/uptime\(\)/ig, () => {
        var date = new Date(socket.currentChannel.media_container.published_at)
        let value = moment.utc(new Date(new Date() - date)).format('HH:mm:ss')
        return value
      })

      res = res.replace(/userOrMention\(\)/ig, () => {
        if (JSData) {
          let data = socket.parseCmd(JSData[1].message, true)

          let mention = ''
          if (data && data.data) data.data[0]?.replace(/@[a-zA-Z0-9_-]+/gi, ($0) => { mention = $0 })

          return (mention != '' ? mention : '@' + JSData[1].user_login)
        } else {
          return '@undefined'
        }
      })

      res = res.replace(/\*ban\*/ig, () => {
        socket.punishment(2, JSData[1])
        return ''
      })

      res = res.replace(/(\*timeout\*([^*]+[^ ]))/ig, (match) => {
        let duration = match.replace(/\*timeout\*/ig, '').replace(/\*/ig, '')
        if (duration != '1' && duration != '10' && duration != '60') { duration = '10' }
        socket.punishment(1, JSData[1], duration)
        return ''
      })

      res = res.replace(/\*remove\*/ig, () => {
        socket.punishment(0, JSData[1])
        return ''
      })

    } catch (err) {
      console.log(err)
    }

    return res
  }
}


const protection = {
  // ?????????????????? ???????????? ???? ?????????????????? ????????
  findCaps(message) {
    let caps = message.match(/([A-Z??-??])/g);
    if (!caps) return false
    const percent = caps.length / message.length * 100
    const removed = (caps.length > settings.protectionCaps.minCaps && percent >= settings.protectionCaps.percentCaps) || caps.length >= settings.protectionCaps.maxCaps
    // console.log(`${removed ? 'removed' : 'not removed'}`, '(caps.length >= minCaps):', caps.length > settings.protectionCaps.minCaps, '(caps.length >= maxCaps):', caps.length >= settings.protectionCaps.maxCaps, '(percent >= percentCaps):', percent >= settings.protectionCaps.percentCaps, '(caps.length):', caps.length, 'length:', message.length, 'percent:', percent)
    return removed
  },

  // ????????????????. ?????????? ??????????????????
  maxLength(message) {
    const removed = message.length >= settings.protectionSymbol.maxLength
    // console.log(`${removed ? 'removed' : 'not removed'}`, 'message.length:', message.length)
    return removed
  },

  // ?????????????????? ???????????? ???? ????????????
  findLink(message) {
    var links = linkify.find(message)
    var removed = false

    for (let link of links) {
      for(let blacklink in settings.protectionLink.blacklist) {
        blacklink = settings.protectionLink.blacklist[blacklink]
        if (new URL(blacklink.url)[blacklink.type] == new URL(link.href)[blacklink.type]) {
          removed = true
          break;
        }
      }
      let find = link.type = "url" ? settings.protectionLink.blacklist[new URL(link.href).hostname] : false
    }
    
    // console.log(`${removed ? 'removed' : 'not removed'}`, 'links:', links)
    if (links.length && settings.protectionLink.blockType.toString() == '1') removed = !removed
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

      if (settings.protectionCaps?.status && this.findCaps(JSData.message)) {
        if (this.permit(settings.protectionCaps.autoPermit, JSData)) return
        if (settings.protectionCaps.sendPunishmentMessage[1]) {
          socket.send(settings.protectionCaps.sendPunishmentMessage[0].replace('{user_login}', '@'+JSData.user_login))
        }
        socket.punishment(settings.protectionCaps.punishment, JSData)
      }

      if (settings.protectionSymbol?.status && this.maxLength(JSData.message)) {
        if (this.permit(settings.protectionSymbol.autoPermit, JSData)) return
        if (settings.protectionSymbol.sendPunishmentMessage[1]) {
          socket.send(settings.protectionSymbol.sendPunishmentMessage[0].replace('{user_login}', '@'+JSData.user_login))
        }
        socket.punishment(settings.protectionSymbol.punishment, JSData)
      }

      if (settings.protectionLink?.status && this.findLink(JSData.message)) {
        if (this.permit(settings.protectionLink.autoPermit, JSData)) return
        if (settings.protectionLink.sendPunishmentMessage[1]) {
          socket.send(settings.protectionLink.sendPunishmentMessage[0].replace('{user_login}', '@'+JSData.user_login))
        }
        socket.punishment(settings.protectionLink.punishment, JSData)
      }

    }
    
  }
}

chrome.runtime.onMessage.addListener(async (request) => {

  if (request.from == "popup_bot" && request.log == true) {
    sendMessage({ from: 'background_bot', logs: [...socket.logs] })
  }
  if (request.from == "popup_bot" && request.keyWord) {
    giveaway.keyWord = request.keyWord
  }
  if (request.from == "popup_bot" && request.start) {
    giveaway.start()
  }
  if (request.from == "popup_bot" && request.draw) {
    sendMessage({ from: 'background_bot', winner: giveaway.draw() })
  }
  if (request.from == "popup_bot" && request.reset) {
    giveaway.reset()
  }
  if (request.from == "popup_bot" && request.getData) {
    sendMessage({ from: 'background_bot', getData: giveaway.getData() })
  }
  if (request.from == "popup_bot" && request.end) {
    giveaway.end()
  }
  if (request.from == "popup_bot" && request.clearWinner) {
    giveaway.clearWinner()
  }
  if (request.from == "popup_bot" && request.getGiveaweySettings) {
    sendMessage({ from: 'background_bot', getGiveaweySettings: {channel_name: socket.current?.user_profile?.user_login, stream_id: socket.streamId, private_link: socket.closedId} })
  }
  if (request.from == "popup_bot" && request.stopTimeout) {
    let t = socket.startedTimeouts[request.stopTimeout]
    if (t) {
      clearTimeout(t.timeout)
      delete socket.startedTimeouts[request.stopTimeout]
    }
  }
  if (request.from == "popup_bot" && request.settings) {
    sendMessage({ from: 'background_bot', settings: settings })
  }
  if (request.from == "popup_bot" && request.defsettings) {
    sendMessage({ from: 'background_bot', defsettings: Helper.getDefaultSettings() })
  }
  if (request.from == "popup_bot" && request.createPoll) {
    poll.create(request.createPoll.question, request.createPoll.arr, request.createPoll.duration)
  }
  if (request.from == "popup_bot" && request.getPollSettings) {
    sendMessage({ from: 'background_bot', getPollSettings: {question: poll.question, args: poll.pollArgs, duration: poll.duration, startTime: poll.startTime, wins: poll.wins, data: {timeoutWin: poll.timeoutWin, duration: poll.winDuration} } })
    sendMessage({ from: 'background_bot', pollPercent: poll.get() })
  }
  if (request.from == "popup_bot" && request.endPoll) {
    poll.end()
  }
  if (request.from == "popup_bot" && request.removePoll) {
    poll.remove()
  }
  if (request.from == "popup_bot" && request.init) {
    settings = request.init
    if (socket.channelId == 0) socket.getCurrent()
  }
  if (request.from == "popup_bot" && request.sendMessage) {
    socket.send(request.sendMessage)
  }
  // if (request.from == "popup_bot" && request.updateCustomizeBlockLoyaltyStore) {
  //   coins.updateCustomizeBlockLoyaltyStore(request.updateCustomizeBlockLoyaltyStore)
  // }
  // if (request.from == "popup_bot" && request.deleteCustomizeBlockLoyaltyStore) {
  //   coins.deleteCustomizeBlockLoyaltyStore(request.deleteCustomizeBlockLoyaltyStore)
  // }
  if (request.from == "popup_bot" && request.updateCustomizeBlockLoyaltyUsers) {
    coins.updateCustomizeBlockLoyaltyUsers(request.updateCustomizeBlockLoyaltyUsers)
  }
  if (request.from == "popup_bot" && request.deleteCustomizeBlockLoyaltyUsers) {
    coins.deleteCustomizeBlockLoyaltyUsers(request.deleteCustomizeBlockLoyaltyUsers)
  }

  return true

});

const giveaway = {
  registerStart: false,
  registrationArr: [],
  keyWord: '!giveaway',
  winner: null,
  add(JSData) {
    if (JSData[1].message.toLowerCase() == giveaway.keyWord.toLowerCase() && giveaway.registerStart == true) {
      var userFound = false;
    
      for(var i = 0; i < giveaway.registrationArr.length; i++) {
        if(giveaway.registrationArr[i].user_id == JSData[1].user_id) {
          userFound = true;
          i = giveaway.registrationArr.length;
        }
      }

      if(userFound == true) {
        console.log(`@${JSData[1].user_login}, You are  already registered!`);
      }

      if(userFound == false) {
        console.log(`@${JSData[1].user_login}, You are now registered!`);
        giveaway.registrationArr.push({ user_login: JSData[1].user_login, user_id: JSData[1].user_id, user_avatar: JSData[1].user_avatar, user_channel_role: JSData[1].user_channel_role, other_roles: JSData[1].other_roles});
        sendMessage({ from: 'background_bot', register_data: JSData })
      }
    }
  },
  start() {
    if (giveaway.registerStart == false && giveaway.registrationArr.length == 0) {
      giveaway.registerStart = true;
      socket.send(`???????????????? ??????????????! ?????????????????????? ?????????????? '${giveaway.keyWord}', ?????????? ???????????????? ???????? ???? ????????????`);
    }
  },
  draw() {
    if (giveaway.registerStart == true && giveaway.registrationArr.length > 0) {
      var winner = Math.floor((Math.random() * giveaway.registrationArr.length));
      var winnerUsr = giveaway.registrationArr[winner];
      giveaway.winner = winnerUsr
      socket.send(`?????????????????????? ?????????????????? ???????????????????? @${winnerUsr.user_login}`);

      return giveaway.registrationArr[winner]
    }
  },
  reset() {
    if (giveaway.registerStart == true && giveaway.registrationArr.length > 0) {
      giveaway.registrationArr = [];
    }
  },
  end() {
    if (giveaway.registerStart == true) {
      giveaway.registrationArr = [];
      giveaway.registerStart = false;
    }
  },
  clearWinner() {
    giveaway.winner = null
  },
  getData() {
    return {
      registerStart: giveaway.registerStart,
      registrationArr: giveaway.registrationArr,
      keyWord: giveaway.keyWord
    }
  }
}

const poll = {
  question: '',
  pollArgs: [],
  votes: {},
  timeout: null,
  duration: 0,
  startTime: null,
  wins: [],
  timeoutRemove: null,
  timeoutWin: null,
  sendDataInterval: null,

  winDuration: 30000,

  create(question, args, duration = 2) {
    if (this.pollArgs.length != 0) {
      console.log(`?????????????????????? ?????? ????????????????`)
      return false
    }

    this.pollArgs = args
    this.question = question
    this.duration = duration
    this.startTime = new Date()

    for (let arg in args) {
      this.votes[arg] = []
    }

    this.timeout = setTimeout(() => {
      this.end()
    }, duration * 1000*60)
    this.sendDataInterval = setInterval(() => {
      sendMessage({ from: 'background_bot', pollPercent: this.get() })
    }, 100)

    let s = ''
    for (let arg in args) {s += `(${Number(arg)+1}) - ${args[arg]} `}
    let o_time = `${duration==1?'1 ????????????':''}${duration==2?'2 ????????????':''}${duration==3?'3 ????????????':''}${duration==5?'5 ??????????':''}${duration==10?'10 ??????????':''}`

    console.log(`?????????????????????? ${question} ?? ????????????????:${s} ????????????????, !vote [id] ?????????? ??????????????????????????, ?? ?????? ${o_time}.`)
    socket.send(`???????????? ?????????? ??${question}??, ?????????????????????? !vote [id] ?????? ??????????????????????.`);
    socket.send(`???????????????? ??????????????????????: ${s}.`);

    sendMessage({ from: 'background_bot', createdPoll: { question: question, args: args, duration: duration, startTime: this.startTime, data: {timeoutWin: this.timeoutWin, duration: this.winDuration} } })
    return true
  },
  addVote(user_id, arg, user_login) {
    arg = Number(arg)-1

    if (!this.pollArgs[arg]) {
      console.log(`@${user_login} ????????????????`, arg, '???? ????????????????????')
      return false
    }

    if (this.wins.length != 0) {
      console.log(`@${user_login} ?????????????????????? ??????????????????`)
      return false
    }

    for (let i in this.pollArgs) {
      if (this.votes[i].filter(vote => vote == user_id).length == 1) {
        console.log(`@${user_login} ???? ?????? ?????????????????????????? ????`, i)
        return false
      }
    }

    console.log(`@${user_login} ?????? ?????????? ????`, arg, '??????????????')
    this.votes[arg].push(user_id)
    
    // sendMessage({ from: 'background_bot', pollPercent: this.get() })
    
    return true
  },
  get() {
    let percent = {}
    let sum = 0

    for (let vote in this.votes) {
      sum += this.votes[vote].length
    }

    for (let vote in this.votes) {
      percent[vote] = {percent: ( this.votes[vote].length / sum ) * 100, title: this.pollArgs[vote], id: Number(vote), votes: this.votes[vote] }
    }

    console.log('???????????????? ??????????????????????:', percent)
    return percent
  },
  end() {
    let max = -1
    let arr = []


    let percent = {}
    let sum = 0

    for (let vote in this.votes) {
      sum += this.votes[vote].length
    }

    for (let vote in this.votes) {
      percent[Number(vote)] = {percent: ( this.votes[vote].length / sum ) * 100, title: this.pollArgs[vote], id: Number(vote), votes: this.votes[vote] }
    }


    for (let vote in this.votes) { arr.push(this.votes[vote].length) }
    max = Math.max(...arr)

    for (let vote in this.votes) {
      if (this.votes[vote].length >= max) {
        this.wins.push( { id: Number(vote), votes: this.votes[vote], title: this.pollArgs[vote] } )
      }
    }

    console.log('?????????????????????? ?????????????????? ????????????????????:', this.wins)

    let s = ''
    let amount = 50

    this.wins.forEach((value, index, array) => {
      s += `${index == 1 ? ' ??' : ''} ??${value.title}??`
      amount = percent[value.id].percent
    });


    if (this.wins.length == 1) {
      socket.send(`?????????????? ${s} ?????????????? ???????????????????? ???????????????????? ?????????????? ?? ????????????, ???????????? ${Math.round(amount)}% ??????????????.`)
    } else {
      socket.send(`?????????? ???????????? ?? ???????????? ?????????? ${s}.`)
    }

    clearTimeout(this.timeout)
    clearInterval(this.sendDataInterval)

    this.timeoutWin = new Date()
    this.timeoutRemove = setTimeout(() => {
      this.remove()
    }, this.winDuration)

    sendMessage({ from: 'background_bot', winPoll: this.wins, data: {timeoutWin: this.timeoutWin, duration: this.winDuration} })
    return this.wins
  },
  remove() {
    this.question = ''
    this.pollArgs = []
    this.votes = {}
    this.timeout = null
    this.sendDataInterval = null
    this.duration = 0
    this.startTime = null
    this.wins = []
    clearTimeout(this.timeoutRemove)
    this.timeoutRemove = null
    this.timeoutWin = null
    sendMessage({ from: 'background_bot', removePoll: true })
  }
}

const coins = {

  async saveUserCoins() {
    return new Promise(async (resolve, reject) => {
      wasd.users.forEach((data, index) => {
        if (!settings.coins.users[data.user_id]) {
          settings.coins.users[data.user_id] = { count: Number(settings.coins.addCoinCount), user_login: data.user_login, user_id: data.user_id }
        } else {
          settings.coins.users[data.user_id].count = Number(settings.coins.addCoinCount) + settings.coins.users[data.user_id].count
        }
      })

      const callback = () => {
        console.log('saveUserCoins', settings.coins.users);
        sendMessage({ from: 'background_bot', coinUsers: settings.coins.users })

        setTimeout(() => {
          this.updateCustomizeBlockLoyaltyUsers(settings.loyaltyUsers.addCustomBlock)
        }, 250)
      }

      setTimeout(() => {
        chrome.storage['sync'].set(settings, callback)
      }, 50)

    })
  },

  buyLoyaltyStore(JSData, id) {

    // console.log(JSData, id)

    try {

      let buyOnUser = settings.coins.store[id].buyOnUser
      let quantity = settings.coins.store[id].quantity
      let buyUser = settings.coins.store[id].buyers.filter(item => item.user_id == JSData[1].user_id);
      let sold = settings.coins.store[id].sold

      if (sold >= quantity && quantity != -1) return '?????? ????????????????????'

      if ( !(buyOnUser == -1 || buyOnUser > buyUser.length) ) {
        return `???? ?????? ???????????? ${buyUser.length}/${buyOnUser}`
      }


      let left = settings.coins.users[JSData[1].user_id]?.count - settings.coins.store[id].price
      if (settings.coins.users[JSData[1].user_id] && left < 0) return `???????????????????????? ??????????`

      settings.coins.users[JSData[1].user_id].count = left
      sendMessage({ from: 'background_bot', coinUsers: settings.coins.users })


      settings.coins.store[id].buyers.push({
        user_id: JSData[1].user_id,
        user_login: JSData[1].user_login,
        created_at: JSData[1].date_time,
        status: 0,
        price: settings.coins.store[id].price,
        id: id
      })

      settings.coins.store[id].sold ++


      chrome.storage['sync'].set(settings, () => {
        console.log('saveStoreCoins', settings.coins.store[id]);

        setTimeout(() => {
          coins.updateCustomizeBlockLoyaltyUsers(settings.loyaltyUsers.addCustomBlock)
        }, 250)
      });

      switch (Number(settings.coins.store[id].action)) {
        case 1:
          socket.punishment('0', JSData[1])
          break;
        case 2:
          socket.punishment('1', JSData[1], '1')
          break;
        case 3:
          socket.punishment('1', JSData[1], '10')
          break;
        case 4:
          socket.punishment('1', JSData[1], '60')
          break;
        case 5:
          socket.punishment('2', JSData[1])
          break;
      }

      return true
    } catch (err) {
      return false
    }
  },
  // updateCustomizeBlockLoyaltyStore(value) {
  //   // console.log(value)
  //   if (!value[1] && !settings.coins.store_custom_block_id) {
  //     this.deleteCustomizeBlockLoyaltyStore()
  //     return
  //   }

  //   if (!value[1]) return

  //   let test = Object.values(settings.coins.store)
  //   let text = '| ?????? | id | ???????? |\\n| ----- | ----- | ----- |'

  //   test = test.sort(function(a, b) { return a.price - b.price; });
  //   test = test.filter(item => item.quantity != 0 && item.enabled);

  //   test.forEach((value, index) => {
  //     text += `\\n| ${value.name}. | ${value.id} | ${value.price} |`
  //   })

  //   customizeBlock.update(settings.coins.store_custom_block_id, `?????????????? ${settings.coins.cmdStoreInfo?.alias == '' ? '!storeinfo' : settings.coins.cmdStoreInfo?.alias} {id}`, text, value[0]).then(
  //     (result) => {
  //       settings.coins.store_custom_block_id = result.id
  //       chrome.storage['sync'].set(settings, () => {});
  //       // console.log('result', result)
  //     },
  //     (error) => {
  //       console.log('error', error)
  //     }
  //   )

  //   // if (settings.coins.users_custom_blocks)
  // },
  // deleteCustomizeBlockLoyaltyStore() {
  //   customizeBlock.delete(settings.coins.store_custom_block_id).then(
  //     (result) => {
  //       settings.coins.store_custom_block_id = result.id
  //       chrome.storage['sync'].set(settings, () => {});
  //       // console.log('result', result)
  //     },
  //     (error) => {
  //       console.log('error', error)
  //     }
  //   )
  // },
  updateCustomizeBlockLoyaltyUsers(value) {
    if (!value[1] && !settings.coins.users_custom_block_id) {
      this.deleteCustomizeBlockLoyaltyUsers()
      return
    }

    if (!value[1]) return

    let test = Object.values(settings.coins.users)
    test = test.sort(function(a, b) { return b.count - a.count; });
    test = test.slice(0, 10)

    let text = '| ??? | ???????????????????????? | ?????????? |\\n| ----- | ----- | ----- |'

    test.forEach((value, index) => {
      text += `\\n| ${index+1}. | ${value.user_login} | ${value.count} |`
    })

    customizeBlock.update(settings.coins.users_custom_block_id, `???????????????????? ${settings.bot.cmdPoints?.alias == '' ? '!points' : settings.bot.cmdPoints?.alias}`, text, value[0]).then(
      (result) => {
        settings.coins.users_custom_block_id = result.id
        chrome.storage['sync'].set(settings, () => {});
        // console.log('result', result)
      },
      (error) => {
        console.log('error', error)
      }
    )
  },
  deleteCustomizeBlockLoyaltyUsers() {
    customizeBlock.delete(settings.coins.users_custom_block_id).then(
      (result) => {
        settings.coins.users_custom_block_id = result.id
        chrome.storage['sync'].set(settings, () => {});
        // console.log('result', result)
      },
      (error) => {
        console.log('error', error)
      }
    )
  },
}

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    chrome.windows.create({
      url: "popup.html?type=installed",
      type: "popup",
      width: 900,
      height: 560,
      focused: false
    });
  }
  if (details.reason == "update") {
    chrome.windows.create({
      url: "popup.html?type=updated",
      type: "popup",
      width: 900,
      height: 560,
      focused: false
    });
  }
});


// let tvPort = null
// chrome.runtime.onConnectExternal.addListener(function(port) {
//   tvPort = port

//   tvPort.onMessage.addListener(function(msg) {
//     console.log(msg)
//     if (msg.from == "betterwasd_tv" && msg.getCoinUsers) {

//       chrome.management.getAll((info) => {
//         for (let extension of info) {
//           if (extension.id == "cokaeiijnnpcfaoehijmdfcgbkpffgbh" || extension.id == "bmcnekpmigcpbjdjcolfkjgjplmaeede") {

//             // chrome.runtime.sendMessage(extension.id, { from: 'background_betterwasd_bot', userCoins: settings.coins.users[msg.getCoinUsers] })

//             console.log('send to', extension.id)

//             chrome.runtime.connect(extension.id).postMessage({ from: 'background_betterwasd_bot', userCoins: settings.coins.users[msg.getCoinUsers] });
//           // } else if (extension.id == "bmcnekpmigcpbjdjcolfkjgjplmaeede") {
//           //   chrome.runtime.connect("bmcnekpmigcpbjdjcolfkjgjplmaeede").postMessage({ from: 'background_betterwasd_bot', userCoins: settings.coins.users[msg.getCoinUsers] });
//           }
//         }
//       });


//       return true;
//     } else {
//       return false;
//     }
//   });

// });

const customizeBlock = {
  async create(title, text, sorting_number) {
    return new Promise(async (resolve, reject) => {

      try {
        const response = await fetch(`https://wasd.tv/api/v2/channels/${socket.channelId}/custom_blocks`, {
          method: 'POST',
          body: `{"title":"${title}","image":{},"sorting_number":${sorting_number},"block_type":"CUSTOM_BLOCK","link":"","text":"${text}"}`,
          headers: {'Content-Type': 'application/json'},
        })
        const out = await response.json();

        if (out?.result?.id) {
          resolve({id: out.result.id})
        } else {
          reject(out)
        }

      } catch (err) {
        reject(err)
      }

    })
  },
  async update(id, title, text, sorting_number) {
    return new Promise(async (resolve, reject) => {

      try {

        if (!id) {
          customizeBlock.create(title, text, sorting_number).then(
            (result) => resolve(result),
            (error) => reject(error)
          )
        } else {
          const response = await fetch(`https://wasd.tv/api/v2/channels/${socket.channelId}/custom_blocks`, {
            method: 'PATCH',
            body: `{"id":${id},"title":"${title}","image":{},"sorting_number":${sorting_number},"block_type":"CUSTOM_BLOCK","link":"","text":"${text}"}`,
            headers: {'Content-Type': 'application/json'},
          })
          const out = await response.json();

          if (out?.result?.id) {
            resolve({id: out.result.id})
          } else {
            customizeBlock.create(title, text, sorting_number).then(
              (result) => resolve(result),
              (error) => reject(error)
            )
          }
        }

      } catch (err) {
        reject(err)
      }
      
    })
  },
  async delete(id) {
    return new Promise(async (resolve, reject) => {

      try {
        const response = await fetch(`https://wasd.tv/api/v2/channels/${socket.channelId}/custom_blocks/${id}`, {method: 'DELETE'})
        const out = await response.json();

        resolve({id: null})
      } catch (err) {
        reject(err)
      }

    })
  }
}

if (!String.prototype.replaceLast) {
  String.prototype.replaceLast = function(find, replace) {
    var index = this.lastIndexOf(find);

    if (index >= 0) {
      return this.substring(0, index) + replace + this.substring(index + find.length);
    }

    return this.toString();
  };
}


const sendMessage = (args) => {
  if (chrome.runtime && chrome.runtime.id) chrome.runtime.sendMessage(args)
}