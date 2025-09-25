export class EventBus extends EventTarget {
  on(eventName, handler) {
    const listener = (event) => handler(event.detail);
    this.addEventListener(eventName, listener);
    return () => this.removeEventListener(eventName, listener);
  }

  once(eventName, handler) {
    this.addEventListener(eventName, (event) => handler(event.detail), {
      once: true,
    });
  }

  emit(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}
