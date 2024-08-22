function generateAlphabeticalIDs(columns) {
    const ids = [];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabetLength = alphabet.length;

    for (let i = 0; i < columns; i++) {
        let repeatCount = Math.floor(i / alphabetLength) + 1;
        let letterIndex = i % alphabetLength;
        let letter = alphabet[letterIndex];
        let id = letter.repeat(repeatCount);
        ids.push(id);
    }

    return ids;
}

function appendNewIDProcessor(to,targetID,generatedColumns=[]){
    const REQUEST_TYPE = ['top','bottom','left','right'];
    if(!REQUEST_TYPE.includes(to))throw ('Infinite Table Request Type Processor Failed')
    let newID='';
    if(to==='right'){
        let nthCol = 1;
         newID = targetID+`_${nthCol++}`;
        while (generatedColumns.includes(newID)){
            newID=targetID+`_${nthCol++}`;
            if(nthCol>=10000){
                throw new Error('Infinite Table Column Generation Failed.')
            }
        }
    }else if(to==='left'){
        let nthCol = 1;
         newID = targetID+`-${nthCol++}`;
        while (generatedColumns.includes(newID)){
            newID=targetID+`-${nthCol++}`;
            if(nthCol>=10000){
                throw new Error('Infinite Table Column Generation Failed.')
            }
        }
    }else if(to==='bottom'){
        let nthCol = 1;
        newID = targetID+`b${nthCol++}`;
        while (generatedColumns.includes(newID)){
            newID=targetID+`_${nthCol++}`;
            if(nthCol>=10000){
                throw new Error('Infinite Table Column Generation Failed.')
            }
        }
    }
    return newID
}

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

function extractNumberAndString(input) {
    const match = input.match(/([a-zA-Z]+)(\d+)/);

    if (match) {
        return {
            string: match[1],
            number: parseInt(match[2], 10)
        };
    } else {
        let string = '';
        let number = '';
        for (let i = 0; i < input.length; i++) {
            if(!isNaN(input[i])){
                number+=`${input[i]}`;
            }else{
                string+=`${input[i]}`;
            }
        }
        return {
            string,
            number
        };
    }
}

const getNextCEllID = (columndID,previousID=null)=>{
            if(!previousID)return `${columndID}1`;
            const numeric_part = previousID.replace(columndID,'');
            if(isNaN(numeric_part))throw new Error('Invalid ID pattern detected');
            return `${columndID}${Number(numeric_part)+1}`;
}

export default {
    getNextCEllID,
    generateID: generateAlphabeticalIDs,
    newColumnID: appendNewIDProcessor,
    attachStyleToCell:attachStyleEvents,
    separateNumAndStr: extractNumberAndString
}