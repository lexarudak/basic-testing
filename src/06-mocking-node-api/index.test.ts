import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs');
jest.mock('path', () => ({
  join: jest.fn(),
}));
jest.mock('fs');
const mockedExistsSync = existsSync as jest.Mock;
jest.mock('fs/promises');
const mockedReadFile = readFile as jest.MockedFn<typeof readFile>;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 3000;

    doStuffByTimeout(callback, timeout);
    jest.advanceTimersByTime(timeout);

    expect(callback).toHaveBeenCalled();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 3000;

    doStuffByTimeout(callback, timeout);

    jest.advanceTimersByTime(timeout - 100);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 3000;

    doStuffByInterval(callback, timeout);
    jest.advanceTimersByTime(timeout);

    expect(callback).toHaveBeenCalled();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const timeout = 3000;

    doStuffByInterval(callback, timeout);
    jest.advanceTimersByTime(timeout * 2);

    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    mockedExistsSync.mockReturnValue(false);

    const pathToFile = 'test';
    await readFileAsynchronously(pathToFile);

    expect(join).toHaveBeenCalledWith(expect.anything(), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    mockedExistsSync.mockReturnValue(false);

    const pathToFile = 'test';
    const ans = await readFileAsynchronously(pathToFile);

    expect(ans).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'test';
    const fileText = 'testText';

    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValueOnce(fileText);

    const ans = await readFileAsynchronously(pathToFile);
    expect(ans).toEqual(fileText);
  });
});
