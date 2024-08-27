import ColumnManager from "../controller/ColumnManager/index.js";
import Cell from "../Cell/Cell.js";
import EventManager from "../controller/EventManager/index.js";

export default class TableQuery{

    constructor(columManager,configuration) {
        if(!columManager instanceof ColumnManager) throw new Error('Requires ColumManager Instance to activate TableQuery');
        this.ColumnManager = columManager;
        this.dataSet = {};
        this.CONFIG = configuration;
        this.CONFIG.EventManager.subscribe(EventManager.EVENTS.InitiateDataRendering,this.applyDataToTable)
    }

    applyDataToTable(){
        function cellUpdater(cell,data){
            return new Promise((resolve,reject)=>{
                if(!cell instanceof Cell)throw new Error(`Invalid Entity Error`);
              try{
                  requestAnimationFrame(_=>{
                      if(data instanceof HTMLElement){
                          cell.innerText=null;
                          cell.CellElement.appendChild(data);
                      }else if(typeof data === 'string'){
                          cell.innerText=data;
                          cell.CellElement.innerText = cell.innerText;
                      }else{
                          console.error('Invalid Data Entry Error');
                      }
                  })
                  resolve(true)
              }catch (e){
                  console.error(`Failed To Update Data For Cell ${cell.cellID}`);
                  reject(e);
              }

            })
        }
        let column_index = 0;
        for (const key in this.dataSet) {
            if(column_index>=this.ColumnManager.ColumnList.length)break
            const Column = this.ColumnManager.ColumnList[column_index++].ChildList;
            const dataArrayForColumn = this.dataSet[key]
            for (let i = 0; i < Column.length; i++) {
                if(i>=dataArrayForColumn.length)break
                cellUpdater(Column[i],dataArrayForColumn[i]);
            }
        }

    }

    setDataSet(dataObject){
        this.dataSet = dataObject;
    }






}