

export default function (startYear=2014,endYear=2020){
    return new Promise((resolve,reject)=>{
        const worker = new Worker('/PopulationAPP/worker/sync.worker.js');
        let recordClass = null;
        if(!worker)throw new Error("Worker not found");
        worker.postMessage({command: 'init',range:{start:startYear,end:endYear}});
        worker.onmessage = message=>{
            if(message.data.type==='complete'){
                recordClass = message.data.recordClass;
                resolve(recordClass);
            }
        }
    })
}