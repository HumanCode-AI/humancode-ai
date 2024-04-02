import EventEmitter from "./event-emitter";

export default class KeyStore extends EventEmitter {
  set<T extends object>(key: string, value: T) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string, initialValue?: T) {
    const localValue = window.localStorage.getItem(key);
    if (localValue) return JSON.parse(localValue) as T;
    return initialValue ?? null;
  }

  static #instance: KeyStore;

  static get instance() {
    if (!KeyStore.#instance) KeyStore.#instance = new KeyStore();
    return KeyStore.#instance;
  }
}