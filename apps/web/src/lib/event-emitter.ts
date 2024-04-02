export default class EventEmitter {
  private events: Map<string, Function>;

  constructor() {
    this.events = new Map();
  }

  on<T extends Function>(event: string, callback: T) {
    this.events.set(event, callback);
  }

  removeListener(event: string) {
    this.events.delete(event);
  }
}