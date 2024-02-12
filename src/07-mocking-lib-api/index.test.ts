import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.useFakeTimers();
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.runAllTimers();
  });

  test('should create instance with provided base url', async () => {
    const createMock = axios.create as jest.Mock;
    createMock.mockReturnValue({
      get: jest.fn().mockReturnValue({ data: 'testData' }),
    });

    await throttledGetDataFromApi('');
    expect(createMock).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = 'test/path';
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi(relativePath);
    expect(mockedAxios.get).toHaveBeenCalledWith(relativePath);
    expect(mockedAxios.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = 'test/path';
    const response = { data: 'testData' };

    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValue(response);

    const data = await throttledGetDataFromApi(relativePath);

    expect(data).toEqual(response.data);
  });
});
