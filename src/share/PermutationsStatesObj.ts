import {
  AttributeStatesEnum,
  PermutationState,
  PermutationStatesObject,
  PermutationStatesObjectType,
} from './types';
import { AttributeStatesObj } from './AttributeStatesObj';

export class PermutationStatsObj
  extends AttributeStatesObj
  implements PermutationStatesObject {
  label: string;

  type = PermutationStatesObjectType.PROPERTY;

  constructor(
    name: AttributeStatesEnum | string,
    value: unknown = true,
    label: string = name,
    type: PermutationStatesObjectType = PermutationStatesObjectType.PROPERTY
  ) {
    super(name, value);
    this.type = type;
    this.label = label;
  }

  static fromPermutationState(item: PermutationState): PermutationStatsObj {
    if ((item as PermutationStatesObject).attr) {
      return item as PermutationStatsObj;
    }
    const itemTmp = item as string;
    return new PermutationStatsObj(itemTmp);
  }
}
