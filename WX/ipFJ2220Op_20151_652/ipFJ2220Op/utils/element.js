class element {
  constructor(obj = {}) {
    this.events = {};
    // this.eventField = [];
    for (let i in obj.events) {
      this[i] = obj.events[i].bind(this);
      this.events[i] = obj.events[i];
      // this.eventField.push(i);
    }
    for (let i in obj.methods) {
      this[i] = obj.methods[i].bind(this);
    }
  }
}

module.exports = element;