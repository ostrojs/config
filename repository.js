const ObjectGet = require('lodash.get')
const ObjectSet = require('lodash.set')
const {Macroable} = require('@ostro/support/macro')
const kConfig = Symbol('config')
class Config extends Macroable{
    constructor($items = {}) {
        super()
        Object.defineProperty(this,kConfig,{
            value:$items,
            writable:true,
        })
    }

    get(configPath, defaultValue = null) {
        return ObjectGet(this[kConfig], configPath, defaultValue);
    }
    set(key, value) {
        return ObjectSet(this[kConfig], key, value);
    }
    __get(target, method) {
        return target.get(method)
    }
    __set(target, key,value) {
        return target.set(key,value);
    }

}
module.exports = Config;