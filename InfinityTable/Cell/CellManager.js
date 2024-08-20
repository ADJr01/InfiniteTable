import EventManager from "../controller/EventManager/index.js";

export default function(context){
    const settings = context.Settings
    function expandColumn(){

    }

    function collapseColumn(){

    }

    function addColumn(position,targetID,title,columnData){
        settings.EventManager.raise(EventManager.EVENTS.addColumn,{detail: {position,targetID,title,columnData}})
    }
    function addRow(cellContext,cellDataSet){
        settings.EventManager.raise(EventManager.EVENTS.addRow,{detail:{cellContext:cellContext,datasets:cellDataSet}})
    }

    function removeRow(){
    }

    function removeColumn(targetColumnID,mode='collapse',count=1,skipSelf=false,beforeRemove){
        settings.EventManager.raise(EventManager.EVENTS.deleteColumn,{detail: {targetColumnID,mode,count,skipSelf,beforeRemove}})
    }



    return {expandColumn,collapseColumn,addColumn,addRow,removeColumn}
}
