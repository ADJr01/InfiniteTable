export default class MutationListener{

  constructor(cell,callback) {
    this.CallBack = (mutationList, observerInstance) => {
      //callback(this.tableCell,mutationList,observerInstance);
      return new Promise((resolve,reject)=>{
        callback(this.tableCell,mutationList,observerInstance);
        resolve()
      })
    };
    this.config = { attributes: false, childList: true, subtree: false };
    this.tableCell = cell;
    this.observer = new MutationObserver(this.CallBack);
  }

  doObserve(){
    this.observer.observe(this.tableCell,this.config);
  }

}
