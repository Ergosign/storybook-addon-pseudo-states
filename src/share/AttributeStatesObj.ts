import {
  AttributeState,
  AttributeStatesEnum,
  AttributeStatesObject,
  PermutationStatesObjectType,
} from './types';

export class AttributeStatesObj implements AttributeStatesObject {
  attr: AttributeStatesEnum | string;

  value: unknown | true = true;

  type = PermutationStatesObjectType.PROPERTY;

  constructor(name: AttributeStatesEnum | string, value: unknown = true) {
    this.attr = name;
    this.value = value;
  }

  static fromAttributeState(item: AttributeState): AttributeStatesObj {
    if ((item as AttributeStatesObject).attr) {
      return item as AttributeStatesObj;
    }
    const itemTmp = item as AttributeStatesEnum | string;
    return new AttributeStatesObj(itemTmp);
  }
}
