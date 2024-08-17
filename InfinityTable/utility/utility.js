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
    }
    generatedColumns.push(newID);
    return {newID,generatedColumns}
}

export default {
    generateID: generateAlphabeticalIDs,
    newColumnID: appendNewIDProcessor
}