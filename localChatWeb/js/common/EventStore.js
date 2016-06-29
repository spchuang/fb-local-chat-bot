/*
 * @flow
 */

import events from 'events';

const CHANGE_EVENT = 'change';

class EventStore extends events.EventEmitter {
  emitChange(): void {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback: Function): void {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback: Function): void {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

module.exports = EventStore;
