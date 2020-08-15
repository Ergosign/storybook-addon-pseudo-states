import {
  AttributeState,
  AttributeStatesEnum,
  AttributeStatesObject,
} from './types';

export class AttributeStatesObj implements AttributeStatesObject {
  name: AttributeStatesEnum | string;

  value: unknown | true;

  constructor(name: AttributeStatesEnum | string, value: unknown = true) {
    this.name = name;
    this.value = value;
  }

  static fromAttributeState(item: AttributeState): AttributeStatesObj {
    if ((item as AttributeStatesObject).name) {
      return item as AttributeStatesObj;
    }
    const itemTmp = item as AttributeStatesEnum | string;
    return new AttributeStatesObj(itemTmp);
  }
}
