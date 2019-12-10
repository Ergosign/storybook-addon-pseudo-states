class StateHandler {
  static instance: StateHandler;

  isDisabled: boolean;

  constructor() {
    if (!StateHandler.instance) {
      StateHandler.instance = this;
    }
    return StateHandler.instance;
  }

  get disabled(): boolean {
    return this.isDisabled;
  }

  set disabled(value: boolean) {
    this.isDisabled = value;
  }
}

/*
const stateHandling = {
  disabled: false
};
*/

// export default stateHandling;

export default new StateHandler();
