/* eslint-disable prettier/prettier */
// import { , throwCustomError, resolveValue, MyAwesomeError, rejectCustomError } from './index';
import { resolveValue, throwError, MyAwesomeError, throwCustomError, rejectCustomError } from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = 'test'
    const answer = await resolveValue(value)
    expect(answer).toEqual(value)
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const message = 'test'
    try {
      throwError(message)
    } catch(e) {
      expect(e).toEqual(new Error(message))
    }
  });

  test('should throw error with default message if message is not provided', () => {
    const defaultMessage = 'Oops!'
    try {
        throwError()
      } catch(e) {
        expect(e).toEqual(new Error(defaultMessage))
      }
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    try {
        throwCustomError()
      } catch(e) {
        expect(e).toEqual(new MyAwesomeError())
      }
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
  });
});
