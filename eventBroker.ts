// Брокер событий — позволяет подписываться на события и получать уведомления когда они происходят
class EventBroker {
    // хранит список подписчиков: ключ — название события, значение — массив функций которые нужно вызвать
    private subscribers: Record<string, Function[]> = {};

    // подписаться на событие — "когда произойдёт eventName, вызови callback"
    subscribe(eventName: string, callback: Function) {
        // eventName — это просто название события
        // callback — это функция которую нужно вызвать когда событие произошло
        // если для этого события ещё нет массива подписчиков — создаём пустой
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }
        // добавляем функцию в список подписчиков этого события
        this.subscribers[eventName].push(callback);
    }

    // уведомить всех подписчиков — "событие eventName произошло, вот данные data"
    emit(eventName: string, data: unknown) {
        // data — это данные которые передаются вместе с событием
        // если никто не подписался на это событие — ничего не делаем
        if (!this.subscribers[eventName]) {
            return;
        }
        // проходим по каждой функции которая подписалась на это событие
        // и вызываем её, передавая данные
        this.subscribers[eventName].forEach((callback) => {
            callback(data) // callback — это функция которую передали в subscribe
        });
    }
}
export const eventBroker = new EventBroker();