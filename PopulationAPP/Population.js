

export default class Population{
     constructor() {
         this.worker = new Worker('/PopulationAPP/worker/sync.worker.js');
         this.recordClass = null;
         if(!this.worker)throw new Error("Worker not found");
         this.worker.postMessage({command: 'init',range:{start:2014,end:2023}});
         this.worker.onmessage = message=>{
             if(message.data.type==='complete'){
                 this.recordClass = message.data.recordClass;
                 console.log(this.recordClass)
             }
         }

    }

}