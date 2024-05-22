// 定义事件接口
interface EventHandler {
    (data: any): void;
}

// 事件发射器类
class EventEmitter {
    private events: { [eventName: string]: EventHandler[] } = {};

    // 注册事件监听器
    on(eventName: string, handler: EventHandler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(handler);
    }

    // 触发事件
    emit(eventName: string, data: any) {
        const handlers = this.events[eventName];
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }
}

const emit=new EventEmitter();

export default emit;