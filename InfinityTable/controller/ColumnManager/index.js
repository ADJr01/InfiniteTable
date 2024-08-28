import * as helper from '../../utility/utility.js'
import ColumnController from "../../ColumnController/index.js";
import EventManager from "../EventManager/index.js";
import Cell from "../../Cell/Cell.js";

export default class ColumnManager{
    constructor(fromTable=null){
        this.tableID =fromTable;
        this.ColumnList = [];
        this.idList=[]
        this.CURRENT_COLUMN_CHILD_LIST = this.config.Row;
        this.config.EventManager.subscribe(EventManager.EVENTS.addColumn,(e)=>{
            const {position,targetID,title,columnData} = e.detail;
            const atIndex = this.idList.indexOf(targetID);
            if(atIndex<0)throw new Error('ADD Column Failed');
            if(position==='right'){
                this.addNewColumnToRight(atIndex,title,columnData)
            }else if(position==='left'){
                this.addNewColumnToLeft(atIndex,title,columnData)
            }
            this.config.EventManager.raise(EventManager.EVENTS.RenderingComplete)
        });


        this.config.EventManager.subscribe(EventManager.EVENTS.addLayerColumn,e=>this.addLayerColumns(e.detail))
        this.config.EventManager.subscribe(EventManager.EVENTS.deleteColumn,(e)=>{
           let {targetColumnID,mode,count,skipSelf,beforeRemove} = e.detail;
           this.deleteColumn(targetColumnID,mode,count,skipSelf,beforeRemove);
        });
        this.config.EventManager.subscribe(EventManager.EVENTS.addRow,e=>{
            const {cellContext,datasets} = e.detail;
            this.addRow(cellContext,datasets)
            this.config.EventManager.raise(EventManager.EVENTS.RenderingComplete)
        });
        this.config.EventManager.subscribe(EventManager.EVENTS.deleteRow,e=>{
        const {cellContext,ColumnID,totalDelete,skipSelf,recursiveRowDelete} = e.detail;
        const targetColumn = this.ColumnList[this.ColumnList.findIndex(column=>column.columnID===ColumnID)];
        if(!targetColumn)throw new Error('Row Remove Request Failed');
        let fromRow = targetColumn.ChildList.findIndex(cell=>cell.cellID===cellContext.cellID);
        const UPDATE_FROM = !skipSelf?fromRow:fromRow+1;
        if(skipSelf) fromRow++;
        for (let i = 0; i < this.ColumnList.length; i++) {
          const currentColID = this.ColumnList[i].columnID;
          const newChildrenList = this.removeCellItem(this.ColumnList[i].ChildList,fromRow,totalDelete,currentColID,UPDATE_FROM,recursiveRowDelete);
          newChildrenList && newChildrenList.length && (this.ColumnList[i].ChildList=newChildrenList);
          !newChildrenList  && console.error('Empty Column Detected');
          if(this.CURRENT_COLUMN_CHILD_LIST!==newChildrenList.length-1){
            this.CURRENT_COLUMN_CHILD_LIST=newChildrenList.length-1;
          }
        }

      })
    }


    addColumn(column){
        this.ColumnList.push(column)
        this.idList.push(column.columnID)
        return true
    }

    removeCellItem(cellList,atIndex,count=1,columnID,startFrom,recursiveCallback=null,){
    let iterate_count = 0;
    while(iterate_count<count) {
      if(!cellList[atIndex] || !cellList[atIndex].CellElement)return cellList
      if(typeof recursiveCallback === 'function')try {recursiveCallback(cellList[atIndex])}catch(e){console.error(e);}
      cellList[atIndex].CellElement.remove();
      cellList.splice(atIndex,1);
      iterate_count++;
    }
    while(cellList[startFrom]){
      const getNextID = helper.default.getNextCEllID(columnID,cellList[startFrom-1]?cellList[startFrom-1].cellID:null)
      cellList[startFrom].cellID=getNextID;
      cellList[startFrom].self.id=getNextID;
      startFrom++;
    }
    return cellList;
  }

    addLayerColumns(layerConf){

    }

    deleteColumn(targetColumnID,mode,count=1,skipSelf=false,beforeRemove=null){
        if(skipSelf){
            targetColumnID = this.getNextColumnId(targetColumnID);
            if(targetColumnID===-1)throw new Error('Delete Request Failed.ID not Found')
        }
        count = count || 1;
        if(!targetColumnID)throw new Error('Invalid Delete Request');
        if(mode!=='collapse'){
            for (let j = 0; j <count ; j++) {
                const columnIndex = this.ColumnList.findIndex(column => column.columnID === targetColumnID);
                const idIndex = this.idList.indexOf(targetColumnID);
                if(columnIndex<0 || idIndex<0)throw new Error(`Invalid Delete Request to find next of ${targetColumnID}`);
                if(typeof beforeRemove==='function'){
                    try {
                        beforeRemove(this.ColumnList[columnIndex])
                    }catch (e) {
                        console.error(e)
                    }
                }
                targetColumnID = this.getNextColumnId(targetColumnID);
                this.ColumnList[columnIndex].getColumn().remove();
                this.ColumnList.splice(columnIndex,1);//removing column from register
                this.idList.splice(idIndex,1);//removing column specific id from register
                for (let i = columnIndex; i <this.ColumnList.length ; i++) {
                    this.ColumnList[i].columnIndex-=1;
                }
            }
        }else{
            const targetColumn = this.ColumnList[columnIndex];
            targetColumn.setState('collapse')
        }
    }

    getNextColumnId(colId){
      let indexOfCurrentColumn = -1;
      for (let i = 0; i < this.ColumnList.length; i++) {
         if(this.ColumnList[i].columnID===colId){
           indexOfCurrentColumn = i;
         }
         if(indexOfCurrentColumn>-1 && i>indexOfCurrentColumn){
           return this.ColumnList[i].columnID;
         }
      }
      return indexOfCurrentColumn;
    }


    get config(){
        return window.infiniteTable[this.tableID]
    }



    addRow(cell,dataset){
        let dataRow = Array.isArray(dataset) && dataset.length===this.ColumnList.length?dataset:null;
        const targetColumn = this.ColumnList.find(column => column.columnID === column.columnID);
        const targetID = cell.cellID;
        const afterIndex = targetColumn.ChildList.findIndex(cell => cell.cellID === targetID);
        for (let i = 0; i < this.ColumnList.length; i++) {
            const newCellData = dataRow?dataRow[i]:'';
           this.attachNewCell(this.ColumnList[i].ChildList,afterIndex,this.ColumnList[i].ChildList[afterIndex],newCellData);

        }
        this.CURRENT_COLUMN_CHILD_LIST+=1;
    }
    //IN ROW CELL ATTACHMENT
    attachNewCell(cellList,afterIndex,targetCell,textDataForCell=''){
        const colID = cellList[afterIndex].columnID;
        const newCellID = helper.default.getNextCEllID(colID,cellList[afterIndex]?.cellID || '')
        const newCell = new Cell({
            cellID: newCellID,
            classNames:targetCell.classNames,
            innerText: textDataForCell ,
            cellSettings: this.config.getColumnSetting('cell:conf'),
            isHeader:false,
            columnID:targetCell.columnID,
            settings:targetCell.Settings
        });
        cellList.splice(afterIndex+1,0,newCell)
        targetCell.CellElement.insertAdjacentElement('afterend',newCell.CellElement)

      //updating remaining cell id
      for (let i = afterIndex+1; i <cellList.length ; i++) {
        const prevColumnID = cellList[i-1].cellID;
        // const seperated = helper.default.separateNumAndStr(currentColumnID);
        cellList[i].cellID=helper.default.getNextCEllID(colID,prevColumnID) //`${seperated.string}${seperated.number+1}`;
        cellList[i].self.id = cellList[i].cellID;
      }
      //end updating current cell id

    }

    addNewColumnToRight(index,title,columnData){
        if(index>=this.ColumnList.length || index<0)throw new Error('Invalid Column Index on Request to add Right');
        const {newColumn,newID} = this.processAppendRequest(this.ColumnList[index],title,'right')
        if(index===this.ColumnList.length-1){
            this.addColumn(newColumn)
        }else if(index>=0 && index<this.ColumnList.length-1){
            for (let i = index+1; i < this.ColumnList.length; i++) {
                this.ColumnList[i].columnIndex +=1;
            }
            this.ColumnList.splice(index+1,0,newColumn)
            this.idList.splice(index+1,0,newID);
        }
        this.attachChildCells(newID,newColumn,columnData);
        this.config.setColumn(this.config.Column+1)
        this.config.EventManager.raise(EventManager.EVENTS.NewColumnInTable,{detail: {
                position: 'right',
                afterIndex: index,
                addedColumn: newColumn,
                addedColumnID:newID,
                totalColumnOnTable: this.config.Column
            }})
    }

    addNewColumnToLeft(index,title){
        return //implement left first
        if(index>=this.ColumnList.length || index<0)throw new Error('Invalid Column Index on Request to add Right');
        const {newColumn,newID} = this.processAppendRequest(this.ColumnList[index],title,'right')
        if(index===this.ColumnList.length-1){
            this.addColumn(newColumn)
        }else if(index>=0 && index<this.ColumnList.length-1){
            for (let i = index+1; i < this.ColumnList.length; i++) {
                this.ColumnList[i].columnIndex +=1;
            }
            this.ColumnList.splice(index+1,0,newColumn)
        }
        this.attachChildCells(newID,newColumn);
        this.config.setColumn(this.config.Column+1)
        this.config.EventManager.raise(EventManager.EVENTS.NewColumnInTable,{
            position: 'right',
            afterIndex: index,
            addedColumn: newColumn,
            addedColumnID:newID,
            totalColumnOnTable: this.config.Column
        })
    }

    processAppendRequest(targetColumn,newColumnTitle,appendRequestPosition){
        const columnTitle = newColumnTitle;
        const targetID = targetColumn.columnID;
        const targetIndex = targetColumn.columnIndex;
        const tableID = targetColumn.tableID;
        const newID= helper.default.newColumnID(appendRequestPosition,targetID,this.idList)
        const newColumn = new ColumnController(newID,targetIndex+1,tableID,columnTitle)
        return {newColumn,newID};
    }

    attachChildCells(newCellID,newColumn,columnData){
        const current_len = newColumn.ChildList.length
        for (let i =current_len; i <=this.CURRENT_COLUMN_CHILD_LIST ; i++) { // REQUIRES INDEPTH R&D
                newColumn.addChild({
                    cellID: newCellID + `${i}`,
                    innerText:Array.isArray(columnData) && columnData.length ? columnData.shift() : '',
                    cellSettings:this.config.getColumnSetting('cell:conf'),
                })
        }
    }
}

