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
  type = PermutationStatesObjectType.PROPERTY;

  constructor(
    name: AttributeStatesEnum | string,
    value: unknown = true,
    type: PermutationStatesObjectType = PermutationStatesObjectType.PROPERTY
  ) {
    super(name, value);
    this.type = type;
  }

  static fromPermutationState(item: PermutationState): PermutationStatsObj {
    if ((item as PermutationStatesObject).attr) {
      return item as PermutationStatsObj;
    }
    const itemTmp = item as string;
    return new PermutationStatsObj(itemTmp);
  }
}
