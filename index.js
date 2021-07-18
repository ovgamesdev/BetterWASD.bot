let storageType = 'sync';

const Helper = {
    getDefaultSettings() {
        return {
            bot: {
                cmdPrefixBotMod: [['/', true], ['/', true]],
                cmdBan: [true, true],
                cmdMod: [true, true],
                cmdRaid: [true, true],
                cmdTitle: [true, true],
                cmdGame: [true, true],
                cmdFollowers: [true, true],
                cmdSubscribers: [true, true],

                cmdPrefixBotUser: [['!', true], ['!', true]],
                cmdUptime: [true, true],
                cmdUserTitle: [true, true],
                cmdUserGame: [true, true],

                eventFollow: [['{user_login} Спасибо за подписку!', false], ['{user_login} Спасибо за подписку!', false]],
                eventSub: [['{user_login} Спасибо за платную подписку на {product_name}!', false], ['{user_login} Спасибо за платную подписку на {product_name}!', false]],
                
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
                    title: '/ban/unban - Забанить/Разбанить пользователя в чате.',
                    type: 'boolean'
                },
                cmdMod: {
                    title: '/mod/unmod - Повысить пользователя до модератора канала, что даст ему доступ к командам и функциям и наоборот.',
                    type: 'boolean'
                },
                cmdRaid: {
                    title: '/raid  - Эта команда отправит зрителя на другой канал в прямом эфире.',
                    type: 'boolean'
                },
                cmdTitle: {
                    title: '/title - Изменить название стрима.',
                    type: 'boolean'
                },
                cmdGame: {
                    title: '/game - Обновить игру канала (без ошибок).',
                    type: 'boolean'
                },
                cmdFollowers: {
                    title: '/followers/followersoff - Эта команда включает/отключает режим чата только для фолловеров.',
                    type: 'boolean'
                },
                cmdSubscribers: {
                    title: '/subscribers/subscribersoff - Эта команда включает/отключает режим чата только для платных подписчиков.',
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
                    title: '!uptime - Эта команда позволяет узнать сколько идет стрим.',
                    type: 'boolean'
                },
                cmdUserTitle: {
                    title: '!title - Эта команда позволяет узнать название стрима.',
                    type: 'boolean'
                },
                cmdUserGame: {
                    title: '!game - Эта команда позволяет узнать категорию стрима.',
                    type: 'boolean'
                },
                /*cmdFollowage: {
                    title: '!followage - Эта команда позволяет узнать сколько пользователь отслеживает на ваш канал.',
                    type: 'boolean'
                },*/

                event: {
                    title: 'Событие (beta)',
                    type: 'title'
                },
                eventFollow: {
                    title: 'Пользователь подписался ({user_login})',
                    type: 'botevent'
                },
                eventSub: {
                    title: 'Пользователь платно подписался ({user_login}, {product_name})',
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
            textElement.classList.remove(...statusElement.classList);
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
        _basic(title, description, formField, line=false) {
            return `<div class="option">
                <div class="labelField">
                    <span ${line ? 'class="titleline" style="padding-left: 5px;' : 'class="title"'}">${title}</span>
                    <span class="description">${description || ''}</span>
                </div>
                <div class="formField">${formField}</div>
            </div>`;
        },
        save(optionElements) {
            let newSettings = JSON.parse(JSON.stringify(settings));
            for (let option of optionElements) {
                if (!option.dataset.name) {
                    continue;
                }

                let split = option.dataset.name.split('_');
                let value = null;

                if (option.type === 'radio' && option.classList.contains('botevent')) {
                    value = [settings[split[0]][split[1]][0], [settings[split[0]][split[1]][1][0], option.checked && option.value === '1']];
                } else if (option.type === 'text' && option.classList.contains('botevent')) {
                    value = [settings[split[0]][split[1]][0], [option.value, settings[split[0]][split[1]][1][1]] ];
                } else if (option.type === 'radio') {
                    value = [settings[split[0]][split[1]][0], option.checked && option.value === '1'];
                } else if (option.type === 'checkbox') {
                    value = [settings[split[0]][split[1]][0], option.checked];
                } else if (option.dataset.type === 'number' || option.type === 'number') {
                    value = [settings[split[0]][split[1]][0], parseFloat(option.value)];
                } else {
                    value = [settings[split[0]][split[1]][0], option.value];
                }

                if (!newSettings[split[0]]) {
                    newSettings[split[0]] = {};
                }

                newSettings[split[0]][split[1]] = value;

                let onChange = this.availableSettings[split[0]][split[1]].onChange;
                if (typeof onChange === 'function') {
                    onChange(value);
                }
            }
            chrome.storage[storageType].set(newSettings, () => {

                this.showMessage('параметры сохранены');
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
                        html += this.boolean(fieldName, setting.title, setting.description, settings[category][name]);
                    } else if (type === 'text') {
                        html += this.text(fieldName, setting.title, setting.description, settings[category][name]);
                    } else if (type === 'number') {
                        html += this.number(fieldName, setting.title, setting.description, settings[category][name], setting.min, setting.max);
                    } else if (type === 'select') {
                        html += this.select(fieldName, setting.title, setting.description, setting.items, settings[category][name]);
                    } else if (type === 'none') {
                        html += this.none(fieldName, setting.title, setting.description, settings[category][name]);
                    } else if (type === 'title') {
                        html += this.title(fieldName, setting.title, setting.description, settings[category][name]);
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
            if (typeof defaultValue[1] === 'undefined') {
                updateSettingsToNew()
                return ''
            } else {
                return this._basic(title, description, `
                    <ol class="flexibleButtonGroup optionTypeBoolean">
                        <li>
                            <input type="radio" id="boolean_${name}" name="boolean_${name}" value="1" class="optionField" data-name="${name}" ${defaultValue[1] ? 'checked' : ''}>
                            <label for="boolean_${name}" class="green"><span class="icon16 fa-check"></span> ${yesButton}</label>
                        </li>
                        <li>
                            <input type="radio" id="boolean_${name}_no" name="boolean_${name}" value="0" class="optionField" data-name="${name}" ${!defaultValue[1] ? 'checked' : ''}>
                            <label for="boolean_${name}_no" class="red"><span class="icon16 fa-times"></span> ${noButton}</label>
                        </li>
                        <button class="optionField def" data-name="${name}" option-type="boolean"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button>
                    </ol>`);
            }
        },
        text(name, title, description, defaultValue = '') {
            if (typeof defaultValue[1] === 'undefined') {
                updateSettingsToNew()
                return ''
            } else {
                return this._basic(title, description, `
                    <ol class="flexibleButtonGroup optionTypeBoolean">
                        <input type="text" class="optionField" data-name="${name}" value="${defaultValue[1]}" />
                        <button class="optionField def" data-name="${name}" option-type="text"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button>
                    </ol>`);
            }
        },
        number(name, title, description, defaultValue = '', min = 0, max = 0) {
            if (typeof defaultValue[1] === 'undefined') {
                updateSettingsToNew()
                return ''
            } else {
                return this._basic(title, description, `
                    <ol class="flexibleButtonGroup optionTypeBoolean">
                        <input type="number" class="optionField" data-name="${name}" value="${defaultValue[1]}" ${min ? 'min="' + min + '" ' : ''}${max ? 'max="' + max + '"' : ''}/>
                        <button class="optionField def" data-name="${name}" option-type="number"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button>
                    </ol>`);
            }
        },
        select(name, title, description, items = [], defaultValue = '') {
            if (typeof defaultValue[1] === 'undefined') {
                updateSettingsToNew()
                return ''
            } else {
                let selectOptions = '';
                defaultValue[1] = defaultValue[1].toString();
                for (let item of items) {
                    selectOptions += `
                    <option value="${item.value}"${item.value.toString() === defaultValue[1] ? ' selected' : ''}>${item.label}</option>`;
                }
                return this._basic(title, description, `
                    <ol class="flexibleButtonGroup optionTypeBoolean">
                        <select class="optionField" data-name="${name}">${selectOptions}</select>
                        <button class="optionField def" data-name="${name}" option-type="select"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button>
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
            if (typeof defaultValue[1] === 'undefined') {
                updateSettingsToNew()
                return ''
            } else {
                return this._basic(title, description, `
                    <ol class="flexibleButtonGroup optionTypeBoolean">
                        <input type="color" class="optionField" data-name="${name}" value="${defaultValue[1]}" />
                        <button class="optionField def" data-name="${name}" option-type="color"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button>
                    </ol>`);
            }
        },
        botevent(name, title, description, defaultValue = ['', false], yesButton = 'Вкл', noButton = 'Откл') {
            if (typeof defaultValue[1] === 'undefined') {
                updateSettingsToNew()
                return ''
            } else {
                return this._basic(title, description, `
                    <ol class="flexibleButtonGroup optionTypeBoolean">
                        <input type="text" class="optionField botevent" data-name="${name}" value="${defaultValue[1][0]}"/>
                        <li>
                            <input type="radio" id="boolean_${name}" name="boolean_${name}" value="1" class="optionField botevent" data-name="${name}" ${defaultValue[1][1] ? 'checked' : ''}>
                            <label for="boolean_${name}" class="green"><span class="icon16 fa-check"></span> ${yesButton}</label>
                        </li>
                        <li>
                            <input type="radio" id="boolean_${name}_no" name="boolean_${name}" value="0" class="optionField botevent" data-name="${name}" ${!defaultValue[1][1] ? 'checked' : ''}>
                            <label for="boolean_${name}_no" class="red"><span class="icon16 fa-times"></span> ${noButton}</label>
                        </li>
                        <button class="optionField def" data-name="${name}" option-type="botevent"><div class="tooltip-ovg"> Сбросить по умолчанию </div><i _ngcontent-khk-c259="" class="wasd-icons-close"></i></button>
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
        item.innerHTML = `<td><div><p>${data.prefix}</p></div></td> <td><div><p>${data.cmd}</p></div></td> <!--td><div><p>${data.attributes}</p></div></td--> <td><div><p>${data.result}</p></div></td> <td><div><p>${data.privilege == 0 ? 'Модератор' : ''}${data.privilege == 1 ? 'Подписчик' : ''}${data.privilege == 2 ? 'Каждый' : ''}</p></div></td> <td class="td-btn-remove"><div><button class="remove primary ovg basic" data=""><i class="wasd-icons-delete" style="pointer-events: none;"></i></button></div></td>`;
        html.append(item)
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
        item.innerHTML = `<td><div><p>${data.name}</p></div></td> <td><div><p>${data.message}</p></div></td> <td><div><p>${data.interval}</p></div></td> <td class="td-btn-remove"><div><button class="remove primary ovg basic" data=""><i class="wasd-icons-delete" style="pointer-events: none;"></i></button></div></td>`;
        html.append(item)
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
            Helper.Settings.showMessage('Null prefix')
            return
        }
        if (data.cmd.trim() == '') {
            Helper.Settings.showMessage('Null cmd')
            return
        }
        if (data.result.trim() == '') {
            Helper.Settings.showMessage('Null result')
            return
        }

        if (!settings.bot.usercmds[data.cmd]) {
            settings.bot.usercmds[data.cmd] = data
            Helper.addUserCmd(data)
            Helper.Settings.save([document.querySelector('.optionField')]);
        } else {
            Helper.Settings.showMessage('Команда существует');
        }

    },
    tryAddUserTimeout(data) {
        if (data.name.trim() == '') {
            Helper.Settings.showMessage('Null name')
            return
        }
        if (data.message.trim() == '') {
            Helper.Settings.showMessage('Null message')
            return
        }
        if (data.interval < 5) {
            Helper.Settings.showMessage('Interval < 5')
            return
        }

        if (!settings.bot.usercmdstimeout[data.name]) {
            settings.bot.usercmdstimeout[data.name] = data
            Helper.addUserTimeout(data)
            Helper.Settings.save([document.querySelector('.optionField')]);
        } else {
            Helper.Settings.showMessage('Команда существует');
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
                version: '1.0.3.1',
                date: '2021-07-17',
                items: [{
                    text: [
                        `Переменная user().`
                    ],
                    label: 'added'
                }]
            },{
                version: '1.0.3',
                date: '2021-07-17',
                items: [{
                    text: [
                        `Переменные.`
                    ],
                    label: 'added'
                },{
                    text: [
                        `Пользовательские команды.`,
                        `Таймер бота`
                    ],
                    label: 'changed'
                }]
            },{
                version: '1.0.2',
                date: '2021-07-16',
                items: [{
                    text: [
                        `Пользовательские команды.`,
                        `Таймер бота`
                    ],
                    label: 'added'
                }]
            },{
                version: '1.0.1',
                date: '2021-07-13',
                items: [{
                    text: [
                        `Основные ошибки.`
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
            changelogHtml += `<h2 style="color: var(--wasd-color-text-prime);">Version ${changelog.version} (${changelog.date})</h2><ul style="display: grid;">`;

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
                <ul class="nav">
                    <li><a data-tab="about">О нас</a></li>
                    <li class="active"><a data-tab="bot">Команды чата</a></li>
                    <li><a data-tab="cmdbot">Пользовательские команды</a></li>
                    <li><a data-tab="timeoutbot">Таймеры бота</a></li>
                    <li><a data-tab="variables">Переменные</a></li>
                    <li><a data-tab="changelog">Журнал изменений</a></li>
                    <!--li><a data-tab="backup">Бэкап</a></li-->
                </ul>
            </header>

            <main class="text" data-tab="about">
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
                <span style="display: block; padding: 10px;"> Бот отвечает от вашего имени </span>
                ${Helper.Settings.build('bot')}
            </main>

            <main data-tab="cmdbot">
                <h1 style="padding-left: 10px; padding-right: 10px;"> Пользовательские команды </h1>
                <h4 style="margin-top:10px;padding-left: 10px;padding-right: 0px;"> Добавить команду </h4>
                <div style="padding-left: 10px;">
                    <input placeholder="Префикс" id="userCmdPrefix" style="width: 65px;margin-right: 2px;"/>
                    <input placeholder="Команда" id="userCmdCmd" style="width: 80px;margin-right: 2px;"/>
                    <!--input placeholder="Атрибут" id="userCmdAtributes" style="width: 80px;"/-->
                    <input placeholder="Ответ на команду. (Поддерживает переменные)" id="userCmdResult" style="width: 318px;margin-right: 2px;"/>
                    <select id="userCmdPrivilege" style="margin-right: 2px;">
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

            <main data-tab="timeoutbot">
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

            <main data-tab="variables">
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
                            <td><div><p> Отображает случайный аргумент, отправленный в скобках через запятую </p></div></td>
                            <td><div><p> randomVar(1,24,56,3 банана,кто,нет) </p></div></td>
                            <td><div><p> 3 банана </p></div></td>
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
                switch(event.target.getAttribute('option-type')) {
                    case 'boolean':
                        if (settings[split[0]][split[1]][0]) {
                            event.target.parentElement.querySelector(`input[id=boolean_${event.target.getAttribute('data-name')}]`).click()
                        } else {
                            event.target.parentElement.querySelector(`input[id=boolean_${event.target.getAttribute('data-name')}_no]`).click()
                        }
                        break;
                    case 'text':
                        event.target.parentElement.querySelector('input[type="text"]').value = settings[split[0]][split[1]][0]
                        Helper.Settings.save([event.target.parentElement.querySelector('input[type="text"]')])
                        break;
                    case 'number':
                        event.target.parentElement.querySelector('input[type="number"]').value = settings[split[0]][split[1]][0]
                        Helper.Settings.save([event.target.parentElement.querySelector('input[type="number"]')])
                        break; 
                    case 'select':
                        event.target.parentElement.querySelector('select').value = settings[split[0]][split[1]][0]
                        Helper.Settings.save([event.target.parentElement.querySelector('select')])
                        break;
                    case 'color':
                        event.target.parentElement.querySelector('input[type="color"]').value = settings[split[0]][split[1]][0]
                        Helper.Settings.save([event.target.parentElement.querySelector('input[type="color"]')])
                        break;
                    case 'botevent':

                        if (settings[split[0]][split[1]][0]) {
                            event.target.parentElement.querySelector(`input[id=boolean_${event.target.getAttribute('data-name')}]`).click()
                        } else {
                            event.target.parentElement.querySelector(`input[id=boolean_${event.target.getAttribute('data-name')}_no]`).click()
                        }

                        event.target.parentElement.querySelector('input[type="text"]').value = settings[split[0]][split[1]][0][0]

                        Helper.Settings.save([event.target.parentElement.querySelector('input[type="text"]')])
                        break;
                    default:
                        console.log('def')
                }
                //Helper.Settings.save([event.target]);
                //console.log(event.target.parentElement)
            });
        }

        // navigation
        for (let navItem of settingsDiv.querySelectorAll('ul.nav > li > a')) {
            navItem.addEventListener('click', ({ target }) => {
                let links = settingsDiv.querySelectorAll('ul.nav > li');
                let tabs = settingsDiv.querySelectorAll('main');
                for (let element of [...tabs, ...links]) {
                    element.classList.remove('active');
                }
                target.parentNode.classList.add('active');
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

            Helper.tryAddUserCmd(value)
        })

        settingsDiv.querySelector('#addTimeoutBtn').addEventListener('click', () => {
            let name = settingsDiv.querySelector('#timeoutName').value.trim()
            let message = settingsDiv.querySelector('#timeoutMessage').value.trim()
            let interval = Number(settingsDiv.querySelector('#timeoutInterval').value)

            let value = {name: name, message: message, interval: interval, enabled: true}

            Helper.tryAddUserTimeout(value)
        })
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