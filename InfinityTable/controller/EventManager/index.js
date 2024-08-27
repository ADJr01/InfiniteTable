const EventList = {
    'addColumn':'addColumnRequest',
    'addLayerColumn':'addLayerColumnRequest',
    'deleteColumn':'deleteColumnRequest',
    'addRow':'addRowRequest',
    'deleteRow':'deleteRowRequest',
    'NewColumnInTable':'onNewColumn',
    'NewRowInTable':'onNewRow',
    'RemovedColumnInTable':'onRemoveColumn',
    'RemovedRowInTable':'onRemovedRow',
    'RenderingComplete':'onRenderingComplete',
}
export default class EventManager extends EventTarget{

    constructor() {
        super();
        this.validEventList = Object.keys(EventList).map(key=>EventList[key]);

    }

    static get EVENTS(){
        return EventList;
    }

    subscribe(event,onEvent){
        if(!event in this.validEventList || typeof onEvent!=='function')throw new Error('Invalid event registration detected');
        this.addEventListener(event,onEvent)
    }

    raise(event,detail){
        this.dispatchEvent(new CustomEvent(event,detail))
    }

    unsubscribe(event,onEvent){
        this.removeEventListener(event,onEvent);
    }

}



