import Vuex from 'vuex';
import Vue from 'vue';
const fs = require('fs');
const moment = require('moment');
const Write = require('../write.js');
const write = new Write({
    configName: 'config'
});
Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        config: {
            user: '',
            quickTags: [],
            dayCount: 2
        },
        show: {
            history: false,
            na: false,
            todo: false,
            reminder: false,
            script: false,
            collection: false,
            urls: false,
            conf: false
        },
        searchStr: '',
        count: 10,
        files: {
            history: [],
            todo: [],
            reminder: [],
            collection: [],
            scripts: []
        },
        days: [],
        showComp: false,
        focusDay: '',
        selectedDay: '',
        scriptKey: '',
        script: ''
    },

    getters: {
        historyFilter(state) {
            if (state.searchStr) {
                let data = state.searchStr;
                let filteredHistory = state.files.history.filter((history) => {
                    return history.name.toLowerCase().includes(data.toLowerCase()) || history.date.toLowerCase().includes(data.toLowerCase()) || history.notes.toLowerCase().includes(data.toLowerCase());
                });
                return filteredHistory.slice(filteredHistory.length - state.count, filteredHistory.length);
            } else {
                return state.files.history.slice(state.files.history.length - state.count, state.files.history.length);
            }
        },
        getDays(state) {
            let days = state.days.map((day) => {
                var tot = 0;
                for (let i = 0; i < state.files.reminder.length; i++) {
                    const element = state.files.reminder[i];
                    if (day.alt === element.date) {
                        tot += 1;
                    }
                }
                day['tot'] = tot;
                day.alt === state.selectedDay ? day.active = true : day.active = false;
                return day;
            })
            return days;
        },
        filteredReminders(state) {
            let today = state.files.reminder.filter((reminder, index) => {
                reminder.orgIndex = index;
                return reminder.date === state.selectedDay;
            });
            let comp = 0;
            today.map((reminder) => {
                if (reminder.comp === true) {
                    comp += 1;
                }
            });
            let filteredReminders = today.filter((reminder) => {
                return reminder.comp === state.showComp;
            });
            return {
                comp,
                act: today.length - comp,
                data: filteredReminders
            }
        },
        filteredScripts(state) {
            if (state.scriptKey) {
                return state.files.scripts[0][state.scriptKey]
            } else {
                return state.files.scripts[0]
            }
        }
    },

    mutations: {
        userSet(state, data) {
            state.config.user = data;
            write.set('user', data);
        },
        show(state, payload) {
            payload === 'history' ? state.count = 10 : 10;
            state.show[payload] = !state.show[payload];
        },
        quickTagsSet(state, payload) {
            state.config.quickTags = payload;
        },
        incCount(state) {
            state.count += 10;
        },
        searchStr(state, payload) {
            state.searchStr = payload;
        },
        editKey(state, payload) {
            if (payload.subKey) {
                state[payload.loc][payload.subKey] = payload.val;
            } else {
                state[payload.loc] = payload.val;
            }
        },
        mountData(state, payload) {
            state.files[payload.loc].push(payload.data)
        },
        initData(state, payload) {
            state.files[payload.loc] = payload.data;
        },
        modData(state, payload) {
            if (payload.type === 'put') {
                if (payload.subKey) {
                    state.files[payload.loc][payload.orgIndex][payload.key][payload.subKey] = payload.val;
                    return;
                } else {
                    state.files[payload.loc][payload.orgIndex][payload.key] = payload.val;
                }
            } else if (payload.type === 'push') {
                if (payload.subKey) {
                    state.files[payload.loc][payload.orgIndex][payload.key][payload.subKey].push(payload.val);
                    return;
                } else {
                    state.files[payload.loc][payload.orgIndex][payload.key].push(payload.val);
                }
            } else {
                console.error('TYPE not specified')
            }
        },
        delData(state, payload) {
            state.files[payload.loc].splice(payload.orgIndex, 1);
        },
        writeData(state, payload) {
            fs.writeFile(`./${payload.loc}.json`, JSON.stringify(state.files[payload.loc]), 'utf8', err => {
                if (err) throw err;
            });
        },
        initDays(state, payload) {
            state.focusDay = payload;
            state.selectedDay = payload;
        },
        setDays(state) {
            state.days = [];

            function checkToday(day) {
                return moment(day, 'ddd Do MMM').isSame(moment(), 'day') ? true : false;
            }
            for (let i = 1; i < state.config.dayCount + 1; i++) {
                state.days.unshift({
                    'day': checkToday(moment(state.focusDay, 'YYYY-MM-DD').subtract(i, 'days').format('ddd Do MMM')) ? 'Today' : moment(state.focusDay, 'YYYY-MM-DD').subtract(i, 'days').format('ddd Do MMM'),
                    'alt': moment(state.focusDay, 'YYYY-MM-DD').subtract(i, 'days').format('YYYY-MM-DD'),
                    'active': false
                });
            }
            state.days.push({
                'day': checkToday(moment(state.focusDay, 'YYYY-MM-DD').format('ddd Do MMM')) ? 'Today' : moment(state.focusDay, 'YYYY-MM-DD').format('ddd Do MMM'),
                'alt': moment(state.focusDay, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                'active': false
            });
            for (let i = 1; i < state.config.dayCount + 1; i++) {
                state.days.push({
                    'day': checkToday(moment(state.focusDay, 'YYYY-MM-DD').add(i, 'days').format('ddd Do MMM')) ? 'Today' : moment(state.focusDay, 'YYYY-MM-DD').add(i, 'days').format('ddd Do MMM'),
                    'alt': moment(state.focusDay, 'YYYY-MM-DD').add(i, 'days').format('YYYY-MM-DD'),
                    'active': false
                });
            }
        }
    },

    actions: {
        init({
            commit,
            state
        }) {
            Object.keys(state.files).forEach((key, index) => {
                if (fs.existsSync(`./${key}.json`)) {
                    let payload = {};
                    payload.loc = key;
                    fs.readFile(`./${key}.json`, 'utf8', (err, data) => {
                        if (data[0] !== "["){
                            data = JSON.parse(data)
                            if (key === 'collection'){
                                let i = [];
                                Object.keys(data).forEach((key) => {
                                    i.push({key , names : data[key]})
                                });
                                payload.data = i;
                            }else{
                                if (data.table) {
                                    payload.data = data.table;
                                } else {
                                    payload.data = [data];
                                }
                            }
                        }else{
                            data = JSON.parse(data)
                            if (data.table) {
                                payload.data = data.table;
                            } else {
                                payload.data = data;
                            }
                        }
                        commit('initData', payload);
                    });
                } else {
                    fs.writeFile(`./${key}.json`, JSON.stringify([]), 'utf8', err => {
                        if (err) throw err;
                    });
                }
            });
            write.get('user') ? commit('userSet', write.get('user')) : commit('userSet', '');
            write.get('quickTags') ? commit('quickTagsSet', write.get('quickTags')) : commit('quickTagsSet', []);
            commit('initDays', moment().format('YYYY-MM-DD'));
            commit('setDays');
        },
        create({
            commit
        }, payload) {
            commit('mountData', payload);
            commit('writeData', payload);
        },
        modify({
            commit
        }, payload) {
            commit('modData', payload);
            commit('writeData', payload);
        },
        delete({
            commit
        }, payload) {
            commit('delData', payload);
            commit('writeData', payload);
        }
    }
});