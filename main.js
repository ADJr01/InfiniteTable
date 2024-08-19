import InfiniteTable from "./InfinityTable/InfiniteTable.js";
document.addEventListener("DOMContentLoaded", () => {
     const it = new InfiniteTable({
        table_id: 'test_table',
        row: 4,
        column: 2,
        root:'app',
        columnConf:{
            cell:{
                style:{
                    width: (cell,id)=>{
                        if(id.includes('A')){
                            return '300px'
                        }else if(id.includes('B')){
                            return '250px'
                        }
                        return '100px'
                    },
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
                    fontWeight: 'bolder'
                },
                event:{
                    focus:(cell,id)=>{
                        cell.style.outline='none'
                    },
                    blur:(cell,id)=>{
                        cell.style.outline=''
                    },
                    click:(cell,id)=>{
                        //console.log('id is: ',id)
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
                    contenteditable:(cell,id,isHeader)=>{
                        return !isHeader
                    },
                },
                extent:(cell,id,isHeader,context)=>{
                    if(!isHeader)return
                    cell.style.display='flex';
                    cell.style.flexDirection='row-reverse'
                    cell.style.justifyContent='flex-end'
                    const btn = document.createElement('button');
                    btn.innerHTML='-';
                    btn.style.width='20px'
                    btn.style.height='38px'
                    btn.style.cursor='pointer'
                    btn.style.marginRight='10px'
                    cell.appendChild(btn);
                },
                data:{
                    1:["Income","Expense","Loan","Liability"],
                    2:[ 3590,    6288,9474, 85]
                }

            },
            useTitle:true,
            titleList:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            isCollapsible:true,
            setTitle:(column_index,columnID)=>{
                return `${columnID}`
            },
            
        }
    }).render();
    //console.log(it.toString())



});