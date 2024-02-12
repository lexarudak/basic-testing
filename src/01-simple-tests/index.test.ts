/* eslint-disable prettier/prettier */
import { simpleCalculator, Action } from './index';

const testObj = (action: Action | string) => ({
      a: 9,
      b: 3,
      action
    })

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const answer = simpleCalculator(testObj(Action.Add))
    expect(answer).toEqual(12)
  });

  test('should subtract two numbers', () => {
    const answer = simpleCalculator(testObj(Action.Subtract))
    expect(answer).toEqual(6)
  });

  test('should multiply two numbers', () => {
    const answer = simpleCalculator(testObj(Action.Multiply))
    expect(answer).toEqual(27)
  });

  test('should divide two numbers', () => {
    const answer = simpleCalculator(testObj(Action.Divide))
    expect(answer).toEqual(3)
  });

  test('should exponentiate two numbers', () => {
    const answer = simpleCalculator(testObj(Action.Exponentiate))
    expect(answer).toEqual(729)
  });

  test('should return null for invalid action', () => {
    const answer = simpleCalculator(testObj("WrongAction"))
    expect(answer).toEqual(null)
  });

  test('should return null for invalid arguments', () => {
    const answer = simpleCalculator({
      a: "1",
      b: "2",
      action: Action.Add
    })
    expect(answer).toEqual(null)
  });
});
