import * as helper from '../../utility/utility.js'
import ColumnController from "../../ColumnController/index.js";
import EventManager from "../EventManager/index.js";
export default class ColumnManager{
    constructor(fromTable=null){
        this.tableID =fromTable;
        this.ColumnList = []
        this.idList=[]
        this.CURRENT_COLUMN_CHILD_LIST = this.config.Row;
    }

    get config(){
        return window.infiniteTable[this.tableID]
    }

    addColumn(column){
        this.ColumnList.push(column)
        this.idList.push(column.columnID)
        return true
    }



    addNewColumnToRight(index,title){
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
        const {newID,generatedColumns} = helper.default.newColumnID(appendRequestPosition,targetID,this.idList)
        const newColumn = new ColumnController(newID,targetIndex+1,tableID,columnTitle)
        this.idList = generatedColumns;
        return {newColumn,newID};
    }

    attachChildCells(newCellID,newColumn){
        for (let i =1; i <=this.CURRENT_COLUMN_CHILD_LIST ; i++) {
                newColumn.addChild({
                    cellID: newCellID + `${i}`,
                    cellSettings:this.config.getColumnSetting('cell:conf'),
                })
        }
    }
}