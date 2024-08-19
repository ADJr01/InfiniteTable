import EventManager from "../controller/EventManager/index.js";

export default function(context){
    const config = context.Settings
    function expandColumn(){

    }

    function collapseColumn(){

    }

    function addColumn(position,targetID,title){
        config.EventManager.raise(EventManager.EVENTS.addColumn,{detail: {position,targetID,title}})
    }
    function addRow(cellContext,cellDataSet){
        config.EventManager.raise(EventManager.EVENTS.addRow,{detail:{cellContext:cellContext,datasets:cellDataSet}})
    }

    function removeRow(){
    }

    function removeColumn(targetColumnID){
        config.EventManager.raise(EventManager.EVENTS.deleteColumn,{detail: {targetColumnID}})
    }

    return {expandColumn,collapseColumn,addColumn,addRow,removeColumn}
}