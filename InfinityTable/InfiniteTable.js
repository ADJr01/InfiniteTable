
import * as helper from './utility/utility.js'
import Index from "./ColumnController/index.js";
import Controller from "./controller/Controller.js";
import ColumnController from "./ColumnController/index.js";
import ColumnManager from "./controller/ColumnManager/index.js";
import EventManager from "./controller/EventManager/index.js";
import MutationListener from "./controller/ColumnManager/MutationListener";

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
        this.mutation_Listener_Callback = null;
        this.Row = typeof row === 'number' && row >= 0 ? row : 1
        this.Column = typeof column === 'number' && column >= 0 ? column : 1
        if(!this.Container)throw new Error("Could not find Container");
        this.InifinityTableElement = null;
        this.columnManager = new ColumnManager(table_id);
        //handle Events:
        this.selfController.EventManager.subscribe(EventManager.EVENTS.NewColumnInTable,event=>{
            const {position,afterIndex,addedColumn,addedColumnID} = event.detail;
            if(['right','left'].includes(position)){
                this.insertColumnToRightOrLeft(addedColumn,afterIndex,position);
            }
        })
        this.selfController.EventManager.subscribe(EventManager.EVENTS.RenderingComplete,_=>{
            const context = this;
            if(context.mutation_Listener_Callback){
                cancelAnimationFrame(context.mutation_Listener_Callback);
                context.mutation_Listener_Callback=null;
            }
            context.mutation_Listener_Callback = requestAnimationFrame(_=>{
                const cellList = Array.from(this.columnManager.ColumnList[0].getColumn().children); // Adjust as per actual selection
                // Loop through each cell in the first column
                for (let cellIndex = 0; cellIndex < cellList.length; cellIndex++) {
                    const cellHeight = cellList[cellIndex].getBoundingClientRect().height; // Get the height of each cell
                    // Loop through other columns and set their heights
                    for (let columnIndex = 0; columnIndex < context.columnManager.ColumnList.length; columnIndex++) {
                        const nextColumn = Array.from(context.columnManager.ColumnList[columnIndex].getColumn().children);
                        if (nextColumn[cellIndex]) {
                            nextColumn[cellIndex].style.height = `${cellHeight}px`;
                        }
                    }
                }

            })
        })
    }

    get COLUMN_CHILD_COUNT(){
      return this.columnManager.CURRENT_COLUMN_CHILD_LIST;
    }
    get COLUMN_COUNT(){
      return this.columnManager.ColumnList.length
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
        let dataset = this.controller?.columnConfiguration?.cell?.rowData;
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
        dataset && this.columnManager.setInitialDataToRows(dataset)
        this.InifinityTableElement.id=this.TableID;
        this.Container.appendChild(this.InifinityTableElement);

        this.selfController.EventManager.raise(EventManager.EVENTS.RenderingComplete)
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
            pos==='right'?target.parentNode.insertBefore(newColumn.getColumn(), target.nextSibling):target.parentNode.insertBefore(newColumn.getColumn(), target);
        } else {
            console.error('The value of n is out of bounds.');
        }
        this.selfController.EventManager.raise(EventManager.EVENTS.RenderingComplete)
    }





}
