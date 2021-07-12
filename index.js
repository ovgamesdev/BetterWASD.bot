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
                /*cmdFollowage: true,*/

                cmdPrefix: [['/', true], ['/', true]],
                cmdUser: [true, true],

                eventFollow: [['{user_login} Спасибо за подписку!', false], ['{user_login} Спасибо за подписку!', false]],
                eventSub: [['{user_login} Спасибо за платную подписку на {product_name}!', false], ['{user_login} Спасибо за платную подписку на {product_name}!', false]],
            }
        };
    },
    getSettings() {
        return new Promise((resolve, reject) => {
            if (typeof chrome !== 'undefined') {
                chrome.storage[storageType].get((items) => {
                    let defaultSettings = this.getDefaultSettings();
                    items = items || {};

                    for (let key in defaultSettings) {
                        if (defaultSettings.hasOwnProperty(key)) {
                            items[key] = Object.assign(defaultSettings[key], items[key] || {});
                        }
                    }
                    resolve(items);
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

                help: {
                    title: 'БОТ (beta)',
                    type: 'title'
                },
                cmdPrefix: {
                    title: 'Префикс команд.',
                    type: 'botevent'
                },
                cmdUser: {
                    title: '/user - Эта команда открывает карточку профиля пользователя.',
                    type: 'boolean'
                },

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
                <li class="active"><a data-tab="bot">БОТ</a></li>
                <li><a data-tab="changelog">Журнал изменений</a></li>
                <!--li><a data-tab="backup">Бэкап</a></li-->
            </ul>
        </header>

        <main class="text" data-tab="about">
            <div class="aboutHalf">
                <img style="width: 50px;" class="aboutIcon" src="${chrome.extension.getURL("img/icon128.png")}">
                <h2>BetterWASD.bot v${changelogList[0].version}</h2>
                <h1>от ваших друзей в <a href="https://ovgamesdev.github.io/ru/" target="_blank">OvGames</a></h1>
                <br>
            </div>
            <div class="aboutHalf">
                <h1 style="margin-top: 25px;">Думаете, этот аддон классный?</h1>
                <br><h1> Напишите отзыв на <a target="_blank" href="https://chrome.google.com/webstore/detail/fdgepfaignbakmmbiafocfjcnaejgldb">Chrome Webstore</a> </h1><br>
            </div>
        </main>

        <main class="active" id="bot" data-tab="bot">
            <span style="display: block; padding: 10px;"> Бот отвечает от вашего имени </span>
            ${Helper.Settings.build('bot')}
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
            <h4 style="margin-top:10px;padding-left: 10px;padding-right: 0px;margin-bottom: 0px;"> Информацию о будущих версиях можно найти <a href="https://wasd.tv/ovgames/posts">тут</a></h4>
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

