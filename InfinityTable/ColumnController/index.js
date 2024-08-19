import Cell from "../Cell/Cell.js";

export default class ColumnController {
    constructor(columnID=null,columnIndex=0,tableID=null,columnTitle=''){
        this.columnID = columnID;
        this.columnIndex = columnIndex;
        this.tableID = tableID;
        this.Column = document.createElement('div')
        this.columnID && (this.Column.id=this.columnID)
        this.Column.classList.add('Infinity_Column');
        this.ChildList = [];
        if(this.config.getColumnSetting('use_title')){
            const confTitle = this.config.getColumnSetting('set_title');
            const title ={
                cellID:this.columnID+"Header",
                isHeader:true,
                cellSettings:this.config.getColumnSetting('cell:conf'),
                innerText: confTitle===''?typeof confTitle==='function'?confTitle(this.columnIndex,this.columnID):confTitle:columnTitle,
            }
            this.addChild(title)
        }
        this.CollapseColumn = false;
        this.ResizeAbility=false;
        this.ExpandedColumn = true;
    }

    get config(){
        return window.infiniteTable[this.tableID]
    }

    addChild(childConf){
        childConf.columnID = this.columnID;
        childConf.settings = this.config
        const newChild = new Cell(childConf)
        this.Column.appendChild(newChild.CellElement);
        this.ChildList.push(newChild);
    }

    getColumn(){
        return this.Column;
    }

    setID(cil_id){
        this.columnID = cil_id;
        this.Column.id=this.columnID;
    }
}