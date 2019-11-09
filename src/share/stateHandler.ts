class StateHandler {

  static instance: StateHandler;
  static isDisabled: boolean;

  constructor() {
    if (!StateHandler.instance) {
      StateHandler.instance = this;
    }
    return StateHandler.instance;
  }

  get disabled(): boolean {
    return StateHandler.isDisabled;
  }

  set disabled(value: boolean) {
    StateHandler.isDisabled = value;
  }

}

/*
const stateHandling = {
  disabled: false
};
*/

// export default stateHandling;


export default new StateHandler();
