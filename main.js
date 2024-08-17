import InfiniteTable from "./InfinityTable/InfiniteTable.js";

document.addEventListener("DOMContentLoaded", () => {
     const it = new InfiniteTable({
        table_id: 'test_table',
        row: 10,
        column: 10,
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
                    const leftArrow = document.createElement('span');
                    leftArrow.innerText='<'
                    leftArrow.style.fontWeight='bolder';
                    leftArrow.style.color='#ffffff'
                    leftArrow.style.fontSize='18px'
                    leftArrow.style.position='absolute';
                    leftArrow.style.top='0px'
                    leftArrow.style.left='0px'
                    cell.appendChild(leftArrow)
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