import { PermutationStatsObj } from '../../src/share/PermutationsStatesObj';
import { AttributeState, AttributeStatesEnum } from '../../src/share/types';

describe('PermutationStatsObj', function () {
  it('create', function () {
    const testobject = new PermutationStatsObj('test', 1);
    expect(testobject.attr).toBe('test');
    expect(testobject.value).toBe(1);
    expect(testobject.label).toBe('test');
  });

  it('create with label', function () {
    const testobject = new PermutationStatsObj('test', 1, 'label');
    expect(testobject.attr).toBe('test');
    expect(testobject.value).toBe(1);
    expect(testobject.label).toBe('label');
  });

  it('create without value', function () {
    const testobject = new PermutationStatsObj('test');
    expect(testobject.attr).toBe('test');
    expect(testobject.value).toBeTruthy();
    expect(testobject.label).toBe('test');
  });

  it('fromAttributeState as string', function () {
    const attr: AttributeState = 'disabled';

    const testobject = PermutationStatsObj.fromAttributeState(attr);
    expect(testobject.attr).toBe('disabled');
    expect(testobject.value).toBeTruthy();
  });

  it('fromAttributeState as Enum', function () {
    const attr: AttributeState = AttributeStatesEnum.DISABLED;

    const testobject = PermutationStatsObj.fromAttributeState(attr);
    expect(testobject.attr).toBe(AttributeStatesEnum.DISABLED);
    expect(testobject.value).toBeTruthy();
  });

  it('fromAttributeState as Object', function () {
    const attr: AttributeState = {
      attr: 'disabled',
      value: 'testvalue',
    };

    const testobject = PermutationStatsObj.fromAttributeState(attr);
    expect(testobject.attr).toBe('disabled');
    expect(testobject.value).toBe('testvalue');
  });
});
