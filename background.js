let settings
chrome.storage.onChanged.addListener(function (changes, namespace) {
    settings = Object.entries(changes)[0][1].newValue
    console.log('onChanged', settings)
});


const socket = {
    socketd: null,
    streamId: 0,
    channelId: 0,
    intervalcheck: null,
    current: null,
    stream_url: null,
    isBotInited: false,
    getCurrent() {
        new Promise((resolve, reject) => {
        fetch(`https://wasd.tv/api/profiles/current`)
        .then(res => res.json())
        .then((out) => {
            if (out?.result?.user_profile?.channel_id) {
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
        .then(res => res.json())
        .then((out) => {
            if (!this.isBotInited && out.result.channel_is_live) {
                this.isBotInited = true
                this.start(out.result.channel_name)
                console.log('bot inited to channel')
            } else if (this.isBotInited && !out.result.channel_is_live) {
                this.isBotInited = false
                this.stop(12345, 'LIVE_CLOSED')
                console.log('bot not inited to channel')
            } else if (this.isBotInited && out.result.channel_is_live) {
                console.log('bot worked')
            } else {
                console.log('bot not worked')
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
            .then(res => res.json())
            .then((out) => {
                socket.jwt = out.result
                new Promise((resolve, reject) => {
                    this.stream_url = `https://wasd.tv/api/v2/broadcasts/public?channel_name=${channel_name}`
                    fetch(`https://wasd.tv/api/v2/broadcasts/public?channel_name=${channel_name}`)
                    .then(res => res.json())
                    .then((out) => {
                        if (out.result.media_container && out.result.media_container.media_container_streams) {
                            resolve(out)
                        } else {
                            fetch(`https://wasd.tv/api/v2/profiles/current/broadcasts/closed-view-url`)
                            .then(res => res.json())
                            .then((out) => {
                                this.stream_url = out.result.view_url.replace('https://wasd.tv/private-stream/', 'https://wasd.tv/api/v2/broadcasts/closed/')
                                fetch(out.result.view_url.replace('https://wasd.tv/private-stream/', 'https://wasd.tv/api/v2/broadcasts/closed/') )
                                .then(res => res.json())
                                .then((out) => {
                                    resolve(out)
                                })
                            })
                        }
                    })
                }).then((out) => {

                    socket.streamId = out.result.media_container.media_container_streams[0].stream_id
                    socket.channelId = out.result.channel.channel_id

                    var data = `42["join",{"streamId":${socket.streamId},"channelId":${socket.channelId},"jwt":"${socket.jwt}","excludeStickers":true}]`;
                    socket.socketd.send(data);
                            
                    socket.intervalcheck = setInterval(() => {
                        if (socket.socketd) {
                            try {
                                socket.socketd.send('2')
                            } catch {
                                clearInterval(socket.intervalcheck)
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
            socket.socketd = null
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
                    switch (JSData[0]) {
                        case "joined":
                            console.log(`[${JSData[0]}] ${JSData[1].user_channel_role}`, JSData);
                            socket.send('Bot inited')
                            break;
                        case "system_message":
                            console.log(`[${JSData[0]}] ${JSData[1].message}`, JSData);
                            break;
                        case "message":
                            console.log(`[${JSData[0]}] ${JSData[1].user_login}: ${JSData[1].message}`, JSData)
                            socket.onMessage(JSData)
                            break;
                        case "sticker":
                            console.log(`[${JSData[0]}] ${JSData[1].user_login}: ${JSData[1].sticker.sticker_alias}`, JSData);
                            break;
                        case "viewers":
                            console.log(`[${JSData[0]}] anon: ${JSData[1].anon} auth: ${JSData[1].auth} total: ${JSData[1].total}`, JSData);
                            break;
                        case "event":
                            console.log(`[${JSData[0]}] ${JSData[1].event_type} - ${JSData[1].payload.user_login} ${JSData[1].message}`, JSData);
                            if (settings.cmdFollowers[1][1] && JSData[1].event_type == 'NEW_FOLLOWER') {
                                let text = settings.bot.eventFollow[1][0].replace('{user_login}', '@'+JSData[1].payload.user_login);
                                Helper.socket.send(text)
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
                            if (settings.cmdSubscribers[1][1]) {
                                let text = settings.bot.eventSub[1][0].replace('{user_login}', '@'+JSData[1].user_login);
                                prname = `${(JSData[1].product_name == '30') ? '1 месяц' : ''}${(JSData[1].product_name == '60') ? '2 месяца' : ''}`
                                text.replace('{product_name}', prname);
                                Helper.socket.send(text)
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
            socket.socketd = null
            console.log(`[error] ${error}`);
            //socket.start()
        };
    },
    stop(code, reason) {
        clearInterval(this.intervalcheck)
        this.socketd.close(code, reason)
        this.socketd = null
    },
    send(message) {

        this.socketd.send(`42["message",{"hash":"${this.hash(25)}","streamId":${this.streamId},"channelId":${this.channelId},"jwt":"${this.jwt}","message":"${message}"}]`)
    },
    hash(length) {
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) { result += characters.charAt(Math.floor(Math.random() * charactersLength)); }
        return result;
    },
    parseCmd(message, isDataArray=false, prefix='!') {
        prefix = prefix.trim().toLowerCase()
        message = message.trim().toLowerCase()
        let cmd = message.slice(prefix.length, message.indexOf(" "))
        if (!(message.indexOf(" ") != -1)) cmd = message.slice(prefix.length, message.length)
        if (message.slice(0, prefix.length) != prefix) cmd = null
        let data = message.slice(message.indexOf(" "), message.length).trim()
        if (data == data.slice(data.length-1)) {data = null}
        if (data != null && isDataArray) data = data.split(' ')
        return {cmd: cmd, data: data, prefix: prefix}
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
    onMessage(JSData) {
        let data1 = this.parseCmd(JSData[1].message, true, settings.cmdPrefixBotMod[1][0])
        let user_login = JSData[1].user_login
        if (data1.cmd != null) console.log('data1', data1)

        console.log(JSData[1]?.user_channel_role)

        if (data1.prefix == settings.cmdPrefixBotMod[1][0]) switch (data1.cmd) {
            case 'ban':
                if (settings.cmdBan[1]) {
                    if (this.isMod(JSData)) if (data1.data) for(let data of data1.data) {
                        fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
                        .then(res => res.json())
                        .then((out) => {
                            if (out.result) {
                                var finded = false;
                                for (let value of out.result.rows) {

                                    if (value.user_login.toLowerCase().trim() == data.split('@').join('').toLowerCase().trim()) {
                                        finded = true;
                                        fetch(this.stream_url)

                                        .then(res => res.json())
                                        .then((out) => {

                                            let response = {
                                                method: 'PUT',
                                                body: `{"user_id":${value.user_id},"stream_id":${out.result.media_container.media_container_streams[0].stream_id}}`,
                                                headers: {'Content-Type': 'application/json'},
                                            }
                                            fetch(`https://wasd.tv/api/channels/${out.result.channel.channel_id}/banned-users`, response)
                                            .then(res => res.json())
                                            .then((out) => {
                                                //console.log(out)
                                                if (out.error.code == 'STREAMER_BAN_ALREADY_EXISTS') {
                                                    socket.send(`${user_login} Пользователь @${value.user_login} уже заблокирован`);
                                                } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
                                                    socket.send(`${user_login} Вы не можете этого сделать`);
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
                break;
            case 'unban':
                if (settings.cmdBan[1]) {
                    if (this.isMod(JSData))  if (data1.data) for(let data of data1.data) {
                            fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
                            .then(res => res.json())
                            .then((out) => {
                                if (out.result) {
                                    var finded = false
                                    for (let value of out.result.rows) {
                                        if (value.user_login.toLowerCase().trim() == data.split('@').join('').toLowerCase().toLowerCase().trim()) {
                                            finded = true;
                                            fetch(this.stream_url)
                                            .then(res => res.json())
                                            .then((out) => {

                                                let response = {
                                                    method: 'DELETE',
                                                }
                                                fetch(`https://wasd.tv/api/channels/${out.result.channel.channel_id}/banned-users/${value.user_id}`, response)
                                                .then(res => res.json())
                                                .then((out) => {
                                                    if (out.error.code == 'STREAMER_BAN_NOT_FOUND') {
                                                        socket.send(`${user_login} Пользователь @${value.user_login} не забанен`)
                                                    } else if (out.error.code == 'USER_BAD_BAN_PERMISSIONS') {
                                                        socket.send(`${user_login} Вы не можете этого сделать`);
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
                break;
            case 'mod':
                if (settings.cmdMod[1]) {
                    if (this.isMod(JSData)) if (data1.data) {
                        for(let data of data1.data) {
                            fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
                            .then(res => res.json())
                            .then((out) => {
                                if (out.result) {
                                    var finded = false;
                                    for (let value of out?.result?.rows) {

                                        if (value.user_login.toLowerCase().trim() == data.split('@').join('').toLowerCase().trim()) {
                                            finded = true;
                                            fetch(this.stream_url)
                                            .then(res => res.json())
                                            .then((out) => {

                                                let response = {
                                                    method: 'PUT',
                                                    body: `{"user_id":${value.user_id}}`,
                                                    headers: {'Content-Type': 'application/json'},
                                                }
                                                fetch(`https://wasd.tv/api/channels/${out.result.channel.channel_id}/moderators`, response)
                                                .then(res => res.json()) //err
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
                break;
            case 'unmod':
                if (settings.cmdMod[1]) {
                    if (this.isMod(JSData)) if (data1.data) for(let data of data1.data) {
                        fetch(`https://wasd.tv/api/search/profiles?limit=999&offset=0&search_phrase=${data.split('@').join('').toLowerCase().trim()}`)
                        .then(res => res.json())
                        .then((out) => {
                            if (out.result) {
                                var finded = false
                                for (let value of out.result.rows) {
                                    if (value.user_login.toLowerCase().trim() == data.split('@').join('').toLowerCase().toLowerCase().trim()) {
                                        finded = true;
                                        fetch(this.stream_url)
                                        .then(res => res.json())
                                        .then((out) => {

                                            let response = {
                                                method: 'DELETE',
                                                headers: {'Content-Type': 'application/json'}, // , 'Access-Control-Allow-Origin': 'https://wasd.tv'
                                            }
                                            fetch(`https://wasd.tv/api/channels/${out.result.channel.channel_id}/moderators/${value.user_id}`, response)
                                            .then(res => res.json()) //err
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
                break;
            case 'raid':
                if (settings.cmdRaid[1]) {
                    if (this.isMod(JSData)) if (data1.data) {
                        url = data1.data[0].split('@').join('').toLowerCase().trim()
                        if (url.indexOf('://') == -1) { url = `https://wasd.tv/${url}` }
                        fetch(this.stream_url)
                        .then(res => res.json())
                        .then((out) => {
                            fetch(`https://wasd.tv/api/v2/channels/${out.result.channel.channel_id}/raid?raid_channel=${url}`, {method: 'POST'})
                            .then(res => res.json())
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
                break;
            case 'game':
                if (settings.cmdGame[1]) {
                    data1 = this.parseCmd(JSData[1].message, false, '/')
                    if (this.isMod(JSData)) if (data1.data != null) {
                        var game = data1.data.split('@').join('').toLowerCase().trim()
                        fetch(`https://wasd.tv/api/search/games?limit=999&offset=0&search_phrase=${encodeURIComponent(game.toLowerCase())}`)
                        .then(res => res.json())
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
                                        .then(res => res.json())
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
                        .then(res => res.json())
                        .then((out) => {
                            for(let setting_key of out.result) {
                                if (setting_key.setting_key == 'STREAM_GAME') {
                                    socket.send(`@${user_login} категория стрима '${setting_key.setting_value.game_name}'`)
                                }
                            }
                        })
                    }
                }
                break;
            case 'title':
                if (settings.cmdTitle[1]) {
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
                        .then(res => res.json())
                        .then((out) => {
                            if (out.result[0].setting_key == "STREAM_NAME") {
                                socket.send(`@${user_login} Название было изменено на '${title}'`)
                            }
                        })
                    } else {
                        fetch(`https://wasd.tv/api/profiles/current/settings`)
                        .then(res => res.json())
                        .then((out) => {
                            for(let setting_key of out.result) {
                                if (setting_key.setting_key == 'STREAM_NAME') {
                                    socket.send(`@${user_login} название стрима '${setting_key.setting_value}'`)
                                }
                            }
                        })
                    }
                }
                break;
            case 'followers':
                if (settings.cmdFollowers[1]) {
                    if (this.isMod(JSData)) {
                        fetch(this.stream_url)
                        .then(res => res.json())
                        .then((out) => {

                            fetch(`https://wasd.tv/api/chat/streams/${out.result.media_container.media_container_streams[0].stream_id}/settings`, {
                                method: 'POST',
                                body: `{"chatRoleLimitMode":"1"}`,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            })
                            .then(res => res.json())
                            .then((out) => {
                                if (out.error) if (out.error.code == "AUTH_FORBIDDEN") {
                                    socket.send(`${user_login} Вы не можете этого сделать`)
                                } else if (out.error) if (out.error.code == "VALIDATION") {
                                    socket.send('Неизвестная ошибка')
                                }
                            })
                        })
                    }
                }
                break;
            case 'followersoff':
                if (settings.cmdFollowers[1]) {
                    if (this.isMod(JSData)) {
                        fetch(this.stream_url)
                        .then(res => res.json())
                        .then((out) => {

                            fetch(`https://wasd.tv/api/chat/streams/${out.result.media_container.media_container_streams[0].stream_id}/settings`, {
                                method: 'POST',
                                body: `{"chatRoleLimitMode":"0"}`,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            })
                            .then(res => res.json())
                            .then((out) => {
                                if (out.error) if (out.error.code == "AUTH_FORBIDDEN") {
                                    socket.send(`${user_login} Вы не можете этого сделать`)
                                } else if (out.error) if (out.error.code == "VALIDATION") {
                                    socket.send('Неизвестная ошибка')
                                }
                            })
                        })
                    }
                }
                break;
            case 'subscribers':
                if (settings.cmdSubscribers[1]) {
                    if (this.isMod(JSData)) {
                        fetch(this.stream_url)
                        .then(res => res.json())
                        .then((out) => {

                            fetch(`https://wasd.tv/api/chat/streams/${out.result.media_container.media_container_streams[0].stream_id}/settings`, {
                                method: 'POST',
                                body: `{"chatRoleLimitMode":"2"}`,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            })
                            .then(res => res.json())
                            .then((out) => {
                                if (out.error) if (out.error.code == "AUTH_FORBIDDEN") {
                                    socket.send(`${user_login} Вы не можете этого сделать`)
                                } else if (out.error) if (out.error.code == "VALIDATION") {
                                    socket.send('Неизвестная ошибка')
                                }
                            })
                        })
                    }
                }
                break;
            case 'subscribersoff':
                if (settings.cmdSubscribers[1]) {
                    if (this.isMod(JSData)) {
                        fetch(this.stream_url)
                        .then(res => res.json())
                        .then((out) => {

                            fetch(`https://wasd.tv/api/chat/streams/${out.result.media_container.media_container_streams[0].stream_id}/settings`, {
                                method: 'POST',
                                body: `{"chatRoleLimitMode":"0"}`,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            })
                            .then(res => res.json())
                            .then((out) => {
                                if (out.error) if (out.error.code == "AUTH_FORBIDDEN") {
                                    socket.send(`${user_login} Вы не можете этого сделать`)
                                } else if (out.error) if (out.error.code == "VALIDATION") {
                                    socket.send('Неизвестная ошибка')
                                }
                            })
                        })
                    }
                }
                break;
        }

        let data2 = this.parseCmd(JSData[1].message, false, settings.cmdPrefixBotUser[1][0])
        if (data2.cmd != null) console.log('data2', data2)
        if (data2.prefix == settings.cmdPrefixBotUser[1][0]) switch (data2.cmd) {
            case 'uptime':
                if (settings.cmdUptime[1]) {
                    fetch(this.stream_url)
                    .then(res => res.json())
                    .then((out) => {
                        if (typeof out.result.media_container.published_at !== 'undefined') {
                            var date1 = new Date(out.result.media_container.published_at)
                            var dater = new Date(new Date() - date1);
                            var textdate = `${(dater.getUTCHours() < 10) ? '0' + dater.getUTCHours() : ((dater.getUTCDate()*24) + dater.getUTCHours())}:${(dater.getUTCMinutes() < 10) ? '0' + dater.getUTCMinutes() : dater.getUTCMinutes()}:${(dater.getUTCSeconds() < 10) ? '0' + dater.getUTCSeconds() : dater.getUTCSeconds()}`
                            socket.send(`@${user_login} стрим идет ${textdate}`)
                        }
                    })
                }
                break;
            case 'game':
                if (settings.cmdUserGame[1]) {
                    fetch(`https://wasd.tv/api/profiles/current/settings`)
                    .then(res => res.json())
                    .then((out) => {
                        for(let setting_key of out.result) {
                            if (setting_key.setting_key == 'STREAM_GAME') {
                                socket.send(`@${user_login} категория стрима '${setting_key.setting_value.game_name}'`)
                            }
                        }
                    })
                }
                break;
            case 'title':
                if (settings.cmdUserTitle[1]) {
                    fetch(`https://wasd.tv/api/profiles/current/settings`)
                    .then(res => res.json())
                    .then((out) => {
                        for(let setting_key of out.result) {
                            if (setting_key.setting_key == 'STREAM_NAME') {
                                socket.send(`@${user_login} название стрима '${setting_key.setting_value}'`)
                            }
                        }
                    })
                }
                break;
        }
    },
}

socket.getCurrent()

