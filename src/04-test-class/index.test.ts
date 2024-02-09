/* eslint-disable prettier/prettier */
import { getBankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100
    const account = getBankAccount(initialBalance)
    expect(account.getBalance()).toEqual(initialBalance)
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 100
    const account = getBankAccount(initialBalance)
    try {
      account.withdraw(initialBalance + 5)
    } catch (e) {
      expect(e).toEqual(new InsufficientFundsError(account.getBalance()))
    }
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 100
    const account = getBankAccount(initialBalance)
    const secAcc = getBankAccount(0)
    try {
      account.transfer(initialBalance + 5, secAcc)
    } catch (e) {
      expect(e).toEqual(new InsufficientFundsError(account.getBalance()))
    }
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 100
    const account = getBankAccount(initialBalance)
    try {
      account.transfer(initialBalance, account)
    } catch (e) {
      expect(e).toEqual(new TransferFailedError())
    }
  });

  test('should deposit money', () => {
    const initialBalance = 100
    const deposit = 20
    const account = getBankAccount(initialBalance)
    account.deposit(deposit)
    expect(account.getBalance()).toEqual(initialBalance + deposit)
  });

  test('should withdraw money', () => {
    const initialBalance = 100
    const withdrawSum = 20
    const account = getBankAccount(initialBalance)
    account.withdraw(withdrawSum)
    expect(account.getBalance()).toEqual(initialBalance - withdrawSum)
  });

  test('should transfer money', () => {
    const initialBalance = 100
    const account = getBankAccount(initialBalance)
    const secAcc = getBankAccount(0)
    account.transfer(initialBalance, secAcc)
    expect(secAcc.getBalance()).toEqual(initialBalance)
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initialBalance = 100
    const account = getBankAccount(initialBalance)

    const checkBalance = async (): Promise<number> => {
        const ans = await account.fetchBalance()
        return ans || await checkBalance()
    }
    const balance = await checkBalance()
    expect(typeof balance === "number").toBeTruthy()
    
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = -1
    const account = getBankAccount(initialBalance)

    const checkBalance = async () => {
      try {
        await account.synchronizeBalance()
      } catch {
        await checkBalance()
      }
    }
    await checkBalance()
    expect(account.getBalance()).not.toEqual(initialBalance)
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = -1
    const account = getBankAccount(initialBalance)
    let error

    const checkBalance = async () => {
      try {
        await account.synchronizeBalance()
        await checkBalance()
      } catch(e) {
        error = e
      }
    }
    await checkBalance()
    expect(error).toEqual(new SynchronizationFailedError())
  });
});
