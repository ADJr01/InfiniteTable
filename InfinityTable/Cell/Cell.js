function attachStyleEvents(element,styleObj,cellConf){
    if(typeof styleObj !== 'object')return false;
    return new Promise((done,failed)=>{
        try{
            for (const style in styleObj) {
                if(typeof styleObj[style] === 'function'){
                    try{
                        element.style[style] = styleObj[style](cellConf.cell, cellConf.id, cellConf.header, cellConf.context);
                    }catch (e) {
                        console.error(`InfinityTable style calculation error: `,e);
                    }
                }else{
                    element.style[style] = styleObj[style];
                }
            }
            done(true);
        }catch (e) {
            console.error(e);
            failed(e)
        }
    })
}
export default class Cell{
    constructor(cellConf) {
        const {cellID,classNames,innerText,cellSettings,isHeader}= cellConf;
        if(!cellID)throw new Error("cellID cannot be empty")
        this.CellStyles = cellSettings.style;
        this.CellEvents = cellSettings.event;
        this.CellExtent = cellSettings.extent;
        this.isHeader = isHeader || false;
        this.cellID = cellID;
        this.classNames=classNames
        this.innerText = innerText || "";
        this.attribs=cellSettings.attribs;
        this.self = null;
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
                    const _attrib_caclulation = this.attribs[attrib](this.self,this.cellID,this.isHeader,this);
                    this.self.setAttribute(attrib,_attrib_caclulation);
                }catch (e) {
                    console.error(`InfiniteTable Attrib Calculation function error: `,e)
                }
            }else{
                this.self.setAttribute(attrib,this.attribs[attrib]);
            }
        }
        for (const event in this.CellEvents) {
            if(typeof this.CellEvents[event]==='function'){
                this.self.addEventListener(event,()=>{
                    this.CellEvents[event](this.self,this.cellID,this.isHeader,this)
                });
            }
        }

        ((context)=>{
            new Promise(async (done, failed) => {
                await attachStyleEvents(context.self, context.CellStyles, {
                    cell: context.self,
                    id: context.cellID,
                    header: context.isHeader,
                    context: context
                });
                if (typeof this.CellExtent === 'function') {
                    try {
                        this.CellExtent(this.self, this.cellID, this.isHeader, this);
                    } catch (e) {
                        console.error(`InfinityCellExtent Error: `, e);
                    }
                }
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