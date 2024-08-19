import EventManager from "../controller/EventManager/index.js";

export default function(context){
    const config = context.Settings
    function expandColumn(){

    }

    function collapseColumn(){

    }

    function addColumn(position,targetID,title,columnData){
        config.EventManager.raise(EventManager.EVENTS.addColumn,{detail: {position,targetID,title,columnData}})
    }
    function addRow(cellContext,cellDataSet){
        config.EventManager.raise(EventManager.EVENTS.addRow,{detail:{cellContext:cellContext,datasets:cellDataSet}})
    }

    function removeRow(){
    }

    function removeColumn(targetColumnID,mode='collapse'){
        config.EventManager.raise(EventManager.EVENTS.deleteColumn,{detail: {targetColumnID,mode}})
    }

    return {expandColumn,collapseColumn,addColumn,addRow,removeColumn}
}