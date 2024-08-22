import InfiniteTable from "./InfinityTable/InfiniteTable.js";
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
document.addEventListener("DOMContentLoaded", () => {
     const it = new InfiniteTable({
        table_id: 'test_table',
        row: 4,
        column: 2,
        root:'app',
        columnConf:{
            cell:{
                style:{
                    width: '250px',
                    position: 'relative',
                    height: '40px',
                    color:'#ffffff',
                    background:'#011a1a',
                    border: `1px solid #454652`,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    textAlign: 'center',
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
                        if(context.getUserData && context.getUserData['isExpanded'] && context.getUserData["totalColumns"]>0){
                            const totalColumns = context.getUserData['totalColumns'];
                            cellManager.removeColumn(context.columnID,'delete',totalColumns,true,column=>{
                                recursiveDelete(column,cellManager)
                            })
                            let userData = context.getUserData
                            userData = {...userData, totalColumns:0,isExpanded:false};
                            context.setUserData(userData)
                            return;
                        }
                        const cellText = cell.innerText;
                        if(isHeader){
                            if(id==='BHeader'){
                                cellManager.addColumn('right',context.columnID,'Q3',[getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000)])
                                cellManager.addColumn('right',context.columnID,'Q2',[getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000)])
                                cellManager.addColumn('right',context.columnID,'Q1',[getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000)])
                                context.setUserData({...context.getUserData,isExpanded:true,totalColumns:3})
                            }else if(cell.innerText.includes('Q')){
                                if(cellText === 'Q1'){
                                    for (let i = 3; i >=0; i--) {
                                        cellManager.addColumn('right',context.columnID,MONTHS[i],[getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000)])
                                    }
                                    context.setUserData({isExpanded:true,totalColumns:4,...context.getUserData})
                                }else if(cellText === 'Q2'){
                                    for (let i = 7; i >=4; i--) {
                                        cellManager.addColumn('right',context.columnID,MONTHS[i],[getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000)])
                                    }
                                    context.setUserData({...context.getUserData,isExpanded:true,totalColumns:4})
                                }else if(cellText === 'Q3'){
                                    for (let i =11; i >=8; i--) {
                                        cellManager.addColumn('right',context.columnID,MONTHS[i],[getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000)])
                                    }
                                    context.setUserData({...context.getUserData,isExpanded:true,totalColumns:4})
                                }
                            }else if(MONTHS.indexOf(cellText)>-1){
                                for (let i = 30; i >0 ; i--) {
                                    setTimeout(_=>{
                                        cellManager.addColumn('right',context.columnID,i,[getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000),getRandomNumber(100,2000)])
                                    },50)
                                }
                                context.setUserData({...context.getUserData,isExpanded:true,totalColumns:30})
                            }

                            return;
                        }



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
                rowData:{
                    1:["Income","Expense","Loan","Liability"],
                    2:[ 3590,6288,9474, 85]
                }

            },
            useTitle:true,
            titleList:['Ledger Type',"Year"],
            isCollapsible:true,
            setTitle:(column_index,columnID)=>{
                return `${columnID}`
            },
            
        }
    }).render();
    console.log(it.toString())



});



