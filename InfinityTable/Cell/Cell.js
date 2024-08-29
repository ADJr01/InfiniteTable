import * as helper from '../utility/utility.js'
import CellManager from "./CellManager.js";
import EventManager from "../controller/EventManager";
export default class Cell{
    constructor(cellConf) {
        const {cellID,classNames,innerText,cellSettings,isHeader,columnID,settings}= cellConf;
        if(!cellID)throw new Error("cellID cannot be empty")
        this.columnID = columnID;
        this.CellStyles = cellSettings.style;
        this.CellEvents = cellSettings.event;
        this.CellExtent = cellSettings.extent;
        this.isHeader = isHeader || false;
        this.cellID = cellID;
        this.userData = {}
        this.Settings = settings;
        this.classNames=classNames
        this.innerText = innerText
        this.attribs=cellSettings.attribs;
        this.self = null;
        this.Settings.EventManager.subscribe(EventManager.EVENTS.CellRenderComplete,(e)=>{
            const {id} = e.detail;
            if(id!==this.cellID)return;
            if (typeof this.CellExtent === 'function') {
                try {
                    this.CellExtent(this.self, this.cellID, this.isHeader, this,new CellManager(this));
                } catch (e) {
                    console.error(`InfinityCellExtent Error: `, e);
                }
            }
        })

    }

    setUserData(userData){
        this.userData = userData;
    }

    get getUserData(){
        return this.userData;
    }


    get CellElement(){
        if(this.self)return this.self;
        this.self = document.createElement("div");
        this.self.id = this.cellID;
        this.classNames && (this.self.classList.add(...this.classNames));
        this.self.innerText = this.innerText;
        for (const attrib in this.attribs) {
            if(typeof this.attribs[attrib]==='function'){
                try{
                    const _ATTRIB_CALCULATION = this.attribs[attrib](this.self,this.cellID,this.isHeader,this);
                    _ATTRIB_CALCULATION!==null && this.self.setAttribute(attrib,_ATTRIB_CALCULATION);
                }catch (e) {
                    console.error(`InfiniteTable Attrib Calculation function error: `,e)
                }
            }else{
                this.self.setAttribute(attrib,this.attribs[attrib]);
            }
        }
        for (const event in this.CellEvents) {
            if(typeof this.CellEvents[event]==='function'){
                this.self.addEventListener(event,(firedEvent)=>{
                    this.CellEvents[event](this.self,this.cellID,this.isHeader,this,new CellManager(this),firedEvent)
                });
            }
        }

        ((context)=>{
            new Promise(async (done, failed) => {
                await helper.default.attachStyleToCell(context.self, context.CellStyles, {
                    cell: context.self,
                    id: context.cellID,
                    header: context.isHeader,
                    context: context
                });
                done(true)
            })
        })(this)
        return this.self;
    }

    setCellInnerText(cellInnerText){
        this.innerText=cellInnerText;
        if(this.self){
            this.self.innerText=cellInnerText;
            return true
        }
        return false;
    }
}
