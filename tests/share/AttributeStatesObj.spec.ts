import { AttributeStatesObj } from '../../src/share/AttributeStatesObj';
import { AttributeState, AttributeStatesEnum } from '../../src/share/types';

describe('AttributeStatesObj', function () {
  it('create', function () {
    const testobject = new AttributeStatesObj('test', 1);
    expect(testobject.name).toBe('test');
    expect(testobject.value).toBe(1);
  });

  it('create without value', function () {
    const testobject = new AttributeStatesObj('test');
    expect(testobject.name).toBe('test');
    expect(testobject.value).toBeTruthy();
  });

  it('fromAttributeState as string', function () {
    const attr: AttributeState = 'disabled';

    const testobject = AttributeStatesObj.fromAttributeState(attr);
    expect(testobject.name).toBe('disabled');
    expect(testobject.value).toBeTruthy();
  });

  it('fromAttributeState as Enum', function () {
    const attr: AttributeState = AttributeStatesEnum.DISABLED;

    const testobject = AttributeStatesObj.fromAttributeState(attr);
    expect(testobject.name).toBe(AttributeStatesEnum.DISABLED);
    expect(testobject.value).toBeTruthy();
  });

  it('fromAttributeState as Object', function () {
    const attr: AttributeState = {
      name: 'disabled',
      value: 'testvalue',
    };

    const testobject = AttributeStatesObj.fromAttributeState(attr);
    expect(testobject.name).toBe('disabled');
    expect(testobject.value).toBe('testvalue');
  });
});
