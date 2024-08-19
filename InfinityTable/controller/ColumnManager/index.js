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
            const {position,targetID,title} = e.detail;
            const atIndex = this.idList.indexOf(targetID);
            if(atIndex<0)throw new Error('ADD Column Failed');
            if(position==='right'){
                this.addNewColumnToRight(atIndex,title)
            }else if(position==='left'){
                this.addNewColumnToLeft(atIndex,title)
            }
        });
        this.config.EventManager.subscribe(EventManager.EVENTS.deleteColumn,(e)=>{
           const {targetColumnID} = e.detail;
           if(!targetColumnID)throw new Error('Invalid Delete Request');
            const columnIndex = this.ColumnList.findIndex(column => column.columnID === targetColumnID);
            const idIndex = this.idList.indexOf(targetColumnID);
            if(columnIndex<0 || idIndex<0)throw new Error("Invalid Delete Request");
            this.ColumnList[columnIndex].getColumn().remove();
            this.ColumnList.splice(columnIndex,1);//removing column from register
            this.idList.splice(idIndex,1);//removing column specific id from register
            //this.config.EventManager.raise(EventManager.EVENTS.RemovedColumnInTable,{detail: {targetColumnID}})
            for (let i = columnIndex; i <this.ColumnList.length ; i++) {
                this.ColumnList[i].columnIndex-=1;

            }
        });
        this.config.EventManager.subscribe(EventManager.EVENTS.addRow,e=>{
            const {cellContext,datasets} = e.detail;
            this.addRow(cellContext,datasets)
        })
    }

    setInitialDataToRows(dataset){
        let row_data_stick = 1;
        for (let i = 0; i < this.ColumnList.length; i++) {
            const childrens = this.ColumnList[i].ChildList;
            const datas_for_stick = dataset[row_data_stick++];
            for (let j = 1; j <childrens.length ; j++) {
                const data_for_cell = datas_for_stick[j-1];
                if(!data_for_cell)continue
                childrens[j].self.innerText=data_for_cell;
            }
        }
    }

    get config(){
        return window.infiniteTable[this.tableID]
    }

    addColumn(column){
        this.ColumnList.push(column)
        this.idList.push(column.columnID)
        return true
    }

    addRow(cell,dataset){
        let dataRow = Array.isArray(dataset) && dataset.length===this.ColumnList.length?dataset:null;
        const targetID = cell.cellID;
        const seperateID = helper.default.separateNumAndStr(targetID);
        const afterIndex = seperateID.number;
        for (let i = 0; i < this.ColumnList.length; i++) {
            const newCellData = dataRow?dataRow[i]:null;
            this.attachNewCell(this.ColumnList[i].ChildList,afterIndex,this.ColumnList[i].ChildList[afterIndex],newCellData);
        }
        this.CURRENT_COLUMN_CHILD_LIST+=1;
    }

    attachNewCell(cellList,afterIndex,targetCell,textDataForCell=''){
        const currentCellIDSep = helper.default.separateNumAndStr(targetCell.cellID);
        const newCellID = `${currentCellIDSep.string}${afterIndex+1}`
        //updating current cell id
        for (let i = afterIndex+1; i <cellList.length ; i++) {
            const currentColumnID = cellList[i].cellID;
            const seperated = helper.default.separateNumAndStr(currentColumnID);
            cellList[i].cellID=`${seperated.string}${seperated.number+1}`;
            cellList[i].self.id = cellList[i].cellID;
        }
        //end updating current cell id
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
        this.idList.splice(index+1,0,newID);
        this.attachChildCells(newID,newColumn);
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

    attachChildCells(newCellID,newColumn){
        for (let i =1; i <=this.CURRENT_COLUMN_CHILD_LIST ; i++) {
                newColumn.addChild({
                    cellID: newCellID + `${i}`,
                    cellSettings:this.config.getColumnSetting('cell:conf'),
                })
        }
    }
}
