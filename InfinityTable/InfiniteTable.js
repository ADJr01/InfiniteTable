
import * as helper from './utility/utility.js'
import Index from "./ColumnController/index.js";
import Controller from "./controller/Controller.js";
import ColumnController from "./ColumnController/index.js";
import ColumnManager from "./controller/ColumnManager/index.js";
import EventManager from "./controller/EventManager/index.js";

export default class InfiniteTable{
    constructor(tableConf={}){
        const {table_id,root,row,column,columnConf}=tableConf;
        this.initialConf = tableConf;
        if(!table_id)throw new Error("No Table ID Provided");
        this.controller = new Controller(table_id).setColumnConfiguration(columnConf);
        this.controller.setRow(row);
        this.controller.setColumn(column)
        this.TableID = table_id;
        this.Container = document.getElementById(root);
        this.Row = typeof row === 'number' && row >= 0 ? row : 1
        this.Column = typeof column === 'number' && column >= 0 ? column : 1
        if(!this.Container)throw new Error("Could not find Container");
        this.InifinityTableElement = null;
        this.columnManager = new ColumnManager(table_id);
        //handle Events:
        this.selfController.EventManager.subscribe(EventManager.EVENTS.NewColumnInTable,(positon,afterIndex,newCol,addedColID)=>{
            if(['right','left'].includes(positon)){
                this.insertColumnToRightOrLeft(newCol,afterIndex,positon);
            }
        })
    }

    get selfController(){
        return this.controller
    }

    toJson() {
        return this.initialConf;
    }
    toString(){
        return `InfiniteTable.ID(${this.TableID}).base{row[${this.Row}],column[${this.Column}]}`;
    }


    render(){
        const ids = helper.default.generateID(this.Column);
        this.InifinityTableElement = document.createElement('div');
        this.InifinityTableElement.classList.add('Infinity_Table');
        const titles = this.selfController.getColumnSetting('titles');
        if(!Array.isArray(titles)||titles.length<1)throw new Error("InfiniteTable Render Error.Titles must be an array");
        let titleT = 0;//on render phase title tracker
        for(let i=0;i<ids.length;i++){
            if(titleT>=titles.length)titleT=0
            const column =new ColumnController(ids[i],i,this.TableID,titles[titleT++]);
            for(let j=1;j<=this.Row;j++){
                column.addChild({
                    cellID:`${ids[i]}${j}`,
                    cellSettings:this.selfController.getColumnSetting('cell:conf'),
                })
            }
            this.columnManager.addColumn(column);
            this.InifinityTableElement.appendChild(column.getColumn());
        }
        this.InifinityTableElement.id=this.TableID;
        this.Container.appendChild(this.InifinityTableElement);
        return this;
    }

    insertColumnToRightOrLeft(newColumn, n,pos='right') {
        // Get the children of the container
        const container = this.InifinityTableElement;
        const children = container.children;

        // Check if n is within the valid range
        if (n >= 0 && n < children.length) {
            // Insert the new element after the nth element
            const target = children[n];
            pos==='right'?target.parentNode.insertBefore(newColumn, target.nextSibling):target.parentNode.insertBefore(newColumn, target);
        } else {
            console.error('The value of n is out of bounds.');
        }
    }


}