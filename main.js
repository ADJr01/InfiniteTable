import InfiniteTable from "./InfinityTable/InfiniteTable.js";
import population from "./PopulationAPP/Population.js";
import Population from "./PopulationAPP/Population.js";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const recursiveDelete = (column,cellManager)=>{
    const firstChildContext = column.ChildList[0];
    if(firstChildContext.getUserData && firstChildContext.getUserData['isExpanded'] && firstChildContext.getUserData['totalColumns']>0){
        cellManager.removeColumn(firstChildContext.columnID,'delete',firstChildContext.getUserData['totalColumns'],true,column=>{recursiveDelete(column,cellManager)})
        firstChildContext.setUserData({...firstChildContext.getUserData,isExpanded:false,totalColumns:0});

    }
}
document.addEventListener("DOMContentLoaded", async () => {
    const populationRecord = await population();
    if(!populationRecord)throw new Error('Data Generation Failed');
    console.log(populationRecord)
    // for (const continents in populationRecord.ContinetalData) {
    //     for (const countries in populationRecord.ContinetalData[continents]) {
    //         console.log(countries)
    //     }
    // }


    const ARow = Array.from({ length: populationRecord.EndYear - populationRecord.StartYear + 1 }, (v, i) => populationRecord.StartYear + i);
    const queryData = {
        A:ARow,
        B:ARow.map(year=>populationRecord.YEARLY_TOTAL_OF_CONTINENTS[populationRecord.CONTINENT_LIST[0]][year]),
        C:ARow.map(year=>populationRecord.YEARLY_TOTAL_OF_CONTINENTS[populationRecord.CONTINENT_LIST[1]][year]),
        D:ARow.map(year=>populationRecord.YEARLY_TOTAL_OF_CONTINENTS[populationRecord.CONTINENT_LIST[2]][year]),
        E:ARow.map(year=>populationRecord.YEARLY_TOTAL_OF_CONTINENTS[populationRecord.CONTINENT_LIST[3]][year]),
        F:ARow.map(year=>populationRecord.YEARLY_TOTAL_OF_CONTINENTS[populationRecord.CONTINENT_LIST[4]][year]),
        G:ARow.map(year=>populationRecord.YEARLY_TOTAL_OF_CONTINENTS[populationRecord.CONTINENT_LIST[5]][year]),


    }
    console.log(queryData)
     const it = new InfiniteTable({
        table_id: 'test_table',
        row: ARow.length,
        column: populationRecord.CONTINENT_LIST.length,
        root:'app',
        queryData:queryData,
        columnConf:{
            cell:{
                style:{
                    width: '250px',
                    position: 'relative',
                    color:'#ffffff',
                    background:'#011a1a',
                    border: `1px solid #454652`,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    textAlign: 'center',
                    padding:'8px',
                    display: 'grid',
                    justifyContent: 'center',
                    userSelect: 'none',
                    fontWeight: (cell,id)=>id.includes("Header")?'bolder':"normal",
                    cursor: (cell,id)=>id.includes("Header")?'pointer':"default"
                },
                event:{
                    focus:(cell,id)=>{
                        cell.style.outline='none'
                    },
                    blur:(cell,id)=>{
                        cell.style.outline=''
                    },
                    click: (cell,id,isHeader,context,cellManager)=>{



                    },
                    mouseover:(cell,id,isHeader)=>{
                        if(isHeader)return
                        cell.style.background='#ffffff'
                        cell.style.color='#011a1a'
                    },
                    mouseout:(cell,id,isHeader)=>{
                        if(isHeader)return
                        cell.style.background='#011a1a'
                        cell.style.color='#ffffff'
                    }
                },
                attribs:{
                    contenteditable:false
                },
                extent:(cell,id,isHeader,context)=>{
                        //onStartUp
                },

            },
            useTitle:true,
            titleList:['Year',...populationRecord.CONTINENT_LIST],
            isCollapsible:true,
            setTitle:(column_index,columnID)=>{
                return `${columnID}`
            },

        }
    }).render();



});



