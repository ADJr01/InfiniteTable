import ColumnManager from "../controller/ColumnManager/index.js";
import Cell from "../Cell/Cell.js";
import EventManager from "../controller/EventManager/index.js";


function cellUpdater(cell,data,_this){
    const context = _this;
    return new Promise((resolve,reject)=>{
        if(!cell instanceof Cell)throw new Error(`Invalid Entity Error`);
        try{
            requestAnimationFrame(_=>{
                if(data instanceof HTMLElement){
                    cell.innerText=null;
                    cell.CellElement.appendChild(data);
                    context.CONFIG.EventManager.raise(EventManager.EVENTS.CellRenderComplete,{detail:{id:cell.cellID,dataType: typeof data,data}});
                }else if(typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean' || typeof data === 'bigint'){
                    cell.innerText=data;
                    cell.CellElement.innerText = cell.innerText;
                    context.CONFIG.EventManager.raise(EventManager.EVENTS.CellRenderComplete,{detail:{id:cell.cellID,dataType: typeof data,data}});
                }else{
                    console.error(`Invalid Data Entry Error when trying to set: ${data}`);
                }

            })
            resolve(true)
        }catch (e){
            console.error(`Failed To Update Data For Cell ${cell.cellID}`);
            reject(e);
        }

    })
}

export default class TableQuery{

    constructor(columManager,configuration) {
        if(!columManager instanceof ColumnManager) throw new Error('Requires ColumManager Instance to activate TableQuery');
        this.ColumnManager = columManager;
        this.dataSet = {};
        this.isRendered = false;
        this.CONFIG = configuration;
        this.CONFIG.EventManager.subscribe(EventManager.EVENTS.InitiateDataRendering,()=>{
            this.isRendered=true;
            this.applyDataToTable();
        })
        this.CONFIG.EventManager.subscribe(EventManager.EVENTS.queryUpdateRow,event=>{
            const {cell,data} = event.detail;
            cellUpdater(cell,data,this)
        })
    }

    applyDataToTable(){
        if(!this.isRendered)return
        const dataSetKeys = Object.keys(this.dataSet).sort();
        let column_index = 0;
        for(let keyIndex = 0; keyIndex < dataSetKeys.length; keyIndex++) {
            const key = dataSetKeys[keyIndex];
            if(column_index>=this.ColumnManager.ColumnList.length)break
            const ColumnCells = this.ColumnManager.ColumnList[column_index++].ChildList;
            const dataArrayForColumn = this.dataSet[key]
            for (let i = 1; i < ColumnCells.length; i++) {
                const currentCell = ColumnCells[i];
                if(i-1>=dataArrayForColumn.length || !currentCell)break
                cellUpdater(currentCell,dataArrayForColumn[i-1],this);
            }
        }

    }

    setDataSet(dataObject){
        this.dataSet = dataObject;
        if(this.isRendered){
            this.applyDataToTable();
        }
    }






}