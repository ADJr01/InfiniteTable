import EventManager from "./EventManager/index.js";

const column_setting_keys = {
    use_title: 'useTitle',
    set_title:'setTitle',
    titles: 'titleList',
    is_collapsable: 'isCollapsible',
    'cell:conf':['columnConf','cell'],
    'cell:attribs':['columnConf','cell','attribs'],
    'cell:style':['columnConf','cell','style'],
    'cell:event':['columnConf','cell','event'],
}

export default class Controller{
    constructor(forTable=null){
        this.EventManager = new EventManager();
        this.forTable_Key = forTable;
        this.columnConfiguration = null;
        this.Row=-1;
        this.Column=-1
        //saving cache to global
        if(window.infiniteTable){
            const previousStores = Object.keys(window.infiniteTable);
            if(previousStores.includes(this.forTable_Key))throw new Error('Table Cache Exists.Please Initialize table using different ID.')
            window.infiniteTable[this.forTable_Key] = this;
        }else{
            window.infiniteTable={};
            window.infiniteTable[this.forTable_Key] = this;
        }
    }

    setRow(row){
        this.Row = row;
    }
    setColumn(column){
        this.Column = column;
    }


    setColumnConfiguration(columnConfiguration){
        this.columnConfiguration = columnConfiguration;
        return this;
    }

    getColumnSetting(key){
        const registered_key = column_setting_keys[key];
        if(!registered_key)return null
        if(Array.isArray(registered_key)){
            let lastRes;
            const total_keys = registered_key.length;
            for (let i = 0; i < total_keys; i++) {
                lastRes = this.columnConfiguration[registered_key[i]];
            }
            return lastRes;
        }else{
            return this.columnConfiguration[registered_key] || false;
        }
    }
}