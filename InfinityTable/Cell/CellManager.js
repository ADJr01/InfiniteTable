import EventManager from "../controller/EventManager/index.js";

export default function(context){
    const settings = context.Settings

    function addColumn(position,targetID,title,columnData){
        settings.EventManager.raise(EventManager.EVENTS.addColumn,{detail: {position,targetID,title,columnData}})
    }

    function addLayerColumn(layerConfig){
        const {position,targetID,title,columnData,totalColumnToADD,layerEvents=null} = layerConfig;
        if(!position || !targetID || !totalColumnToADD) throw new Error('Layer Insertion Failed\nnfo Missing');
        settings.EventManager.raise(EventManager.EVENTS.addLayerColumn,{detail: {position,targetID,title,columnData}})
    }
    function addRow(cellContext,cellDataSet){
        settings.EventManager.raise(EventManager.EVENTS.addRow,{detail:{cellContext:cellContext,datasets:cellDataSet}})
    }

    function removeRow(){
    }

    function removeColumn(targetColumnID,mode='collapse',count=1,skipSelf=false,beforeRemove){
        settings.EventManager.raise(EventManager.EVENTS.deleteColumn,{detail: {targetColumnID,mode,count,skipSelf,beforeRemove}})
    }



    return {addColumn,addRow,removeColumn,removeRow,addLayerColumn}
}
