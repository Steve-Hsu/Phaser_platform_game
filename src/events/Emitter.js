import Phaser from "phaser";


class EventEmitter extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }
}

// Here we return a new Class, means later all the code just use the same "EventEmitter"
export default new EventEmitter();