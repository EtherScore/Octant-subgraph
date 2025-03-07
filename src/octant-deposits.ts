import { Address, BigDecimal, BigInt, Bytes, Int8, log } from "@graphprotocol/graph-ts";
import {
  Locked as LockedEvent,
  Unlocked as UnlockedEvent
} from "../generated/OctantDeposits/OctantDeposits"
import { OctantEvent, User, CumulativeDailyStat } from "../generated/schema"
import { SECONDS_IN_A_DAY, FIRST_TX_DATE, FIRST_TX_TIMESTAMP } from "./constants";

/**
 * Adjusts the given timestamp to the start of the day (00:00 UTC).
 *
 * @param timestamp - The original timestamp in seconds.
 * @returns The adjusted timestamp in microseconds, set to 00:00 UTC of the same day.
 */
function changeDayHour(timestamp: i64): i64 {
  let date = new Date(timestamp * 1000);
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return (date.getTime() * 1000) as i64;
}

/**
 * Converts a given timestamp to a string representing the date.
 *
 * @param {i64} timestamp - The timestamp in microseconds since the Unix epoch.
 * @returns {string} - The date string in the format "Day Mon Date Year".
 */
function getDayID(timestamp: i64): string {
  let date = new Date(timestamp / 1000);
  return date.toDateString();
}

/**
 * Calculates the number of days since the start date based on the provided timestamp.
 *
 * @param {i64} timestamp - The timestamp in seconds to calculate the days since the start date.
 * @returns {i64} The number of days since the start date. If the timestamp corresponds to the first transaction date, returns 1.
 *
 * @remarks
 * - The function first checks if the given timestamp corresponds to the first transaction date.
 * - If it does, it returns 1.
 * - Otherwise, it converts the timestamp to a Date object, sets the time to 12:00 UTC, and calculates the difference in seconds from the first transaction timestamp.
 * - The difference in seconds is then converted to days and returned.
 */
function getDaysSinceStart(timestamp: i64): i64 {
  if (getDayID(timestamp) == FIRST_TX_DATE)
    return (1 as i64);
  let date = new Date(timestamp / 1000);
  date.setUTCHours(12);
  let differenceInSeconds = ((date.getTime() / 1000) - FIRST_TX_TIMESTAMP);
  return Math.ceil((differenceInSeconds / SECONDS_IN_A_DAY) as f64) as i64;
}

/**
 * Converts a BigInt value to a Bytes object with a specified length, 
 * padding with leading zeros if necessary.
 *
 * @param value - The BigInt value to convert.
 * @param length - The desired length of the resulting Bytes object.
 * @returns A Bytes object representing the BigInt value, padded to the specified length.
 */
function bigIntToPaddedBytes(value: BigInt, length: i32): Bytes {
  let hexString = value.toHexString().slice(2);
  let paddedHexString = hexString.padStart(length * 2, '0');
  return Bytes.fromHexString('0x' + paddedHexString) as Bytes;
}
/**
 * Retrieves the CumulativeDailyStat object for the previous day based on the current day's data.
 *
 * @param current_day - The CumulativeDailyStat object representing the current day.
 * @returns The CumulativeDailyStat object for the previous day. If the current day is the first transaction date, returns the current day.
 *
 * @remarks
 * - The function first checks if the current day is the first transaction date.
 * - If it is, it returns the current day's data.
 * - Otherwise, it loads the CumulativeDailyStat object for the initial day (index 0).
 * - It then attempts to load the previous day's data based on the current index minus one.
 * - If the previous day's data is found and marked as added, it returns the current day's data.
 * - If not, it iterates backwards through the indices until it finds a valid previous day's data or reaches index 0.
 */
function getPreviousDayID(current_day: CumulativeDailyStat): CumulativeDailyStat {
  // Check if the current day is the first transaction date
  if (current_day.date == FIRST_TX_DATE)
    return current_day;

  // Load the initial day's data because the global index is stored inside of it (index 0)
  let day0 = CumulativeDailyStat.load(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromI64(0))));
  if (day0 != null) {
    // Attempt to load the previous day's data based on the current index minus one
    let previous_day = CumulativeDailyStat.load(bigIntToPaddedBytes(day0.CurrentIndex.minus(BigInt.fromString("1")), 8));
    if (previous_day != null && previous_day.isAdded == true)
      return current_day;

    // Iterate backwards through the indices to find a valid previous day's data
    // In theory it is possible to remove the while loop because all days are correctly index from i to i+1
    let index = day0.CurrentIndex.minus(BigInt.fromString("1"));
    while (index > BigInt.fromI64(0)) {
      let loadprevious_day = CumulativeDailyStat.load(bigIntToPaddedBytes(index, 8));
      if (loadprevious_day == null)
        index = index.minus(BigInt.fromString("1"));
      else if (loadprevious_day != null && loadprevious_day.isAdded == true)
        return current_day;
      else
        return loadprevious_day;
    }
  }
  // Return the current day's data if no valid previous day's data is found
  return current_day;
}

/**
 * Retrieves the index ID for the given timestamp.
 *
 * @param timestamp - The timestamp for which to retrieve the index ID.
 * @returns The index ID as a BigInt.
 *
 * @remarks
 * - If the timestamp corresponds to the first transaction date, returns 0.
 * - Otherwise, loads the initial day's data (index 0) to get the current global index.
 * - If the previous day's data exists and the timestamp matches the previous day's timestamp, returns the current index minus one.
 * - If the previous day's timestamp does not match, returns the current index.
 * - If no initial day's data is found, returns 0.
 */
function getIdIndex(timestamp: BigInt): BigInt {
  // Check if the timestamp corresponds to the first transaction date
  if (getDayID(timestamp.toI64()) == FIRST_TX_DATE) {
    return BigInt.fromI64(0);
  } else {
    // Load the initial day's data (index 0) to get the current index
    let day0 = CumulativeDailyStat.load(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromI64(0))));
    if (day0 != null) {
      // Attempt to load the previous day's data based on the current index minus one
      let previous_day = CumulativeDailyStat.load(bigIntToPaddedBytes(day0.CurrentIndex.minus(BigInt.fromString("1")), 8));
      if (previous_day != null) {
        // Check if the timestamp matches the previous day's timestamp
        if (getDayID(timestamp.toI64()) == getDayID(previous_day.timestamp.toI64())) {
          return day0.CurrentIndex.minus(BigInt.fromString("1"));
        } else {
          return day0.CurrentIndex;
        }
      }
      return day0.CurrentIndex;
    } else {
      return BigInt.fromI32(0);
    }
  }
}

/**
 * Creates or updates a CumulativeDailyStat entity based on the provided timestamp, amount, and type.
 *
 * @param timestamp - The timestamp of the event.
 * @param amount - The amount involved in the event.
 * @param type - The type of event ("lock" or "unlock").
 * @returns The updated or newly created CumulativeDailyStat entity.
 */
function setNewData(timestamp: BigInt, amount: BigInt, type: string): CumulativeDailyStat {
  // Generate the ID index for the current day based on the timestamp
  const id_index = bigIntToPaddedBytes(getIdIndex(BigInt.fromI64(changeDayHour(timestamp.toI64()))), 8);
  
  // Load the CumulativeDailyStat entity for the current day
  let newData = CumulativeDailyStat.load(id_index);
  
  // If no entity exists for the current day, create a new one
  if (newData == null) {
    newData = new CumulativeDailyStat(id_index);
    newData.date = getDayID(changeDayHour(timestamp.toI64()));
    newData.CurrentIndex = BigInt.fromString("1");
    newData.timestamp = BigInt.fromI64(changeDayHour(timestamp.toI64()));
    newData.isAdded = false;
    newData.CumulativeDepositsCount = BigInt.fromI32(0);
    newData.CumulativeWithdrawalsCount = BigInt.fromI32(0);
    newData.CumulativeDepositAmount = BigInt.fromI32(0);
    newData.CumulativeWithdrawAmount = BigInt.fromI32(0);
    newData.TotalUsers = BigInt.fromI32(0);
    newData.CurrentTotalUsers = BigInt.fromI32(0);
    newData.CurrentTotalGLMStaked = BigInt.fromI32(0);
    newData.AverageDailyDeposits = BigDecimal.fromString("0");
    newData.AverageDailyGLMDeposits = BigDecimal.fromString("0");
    newData.AverageDailyWithdrawals = BigDecimal.fromString("0");
    newData.AverageDailyGLMWithdrawals = BigDecimal.fromString("0");
    newData.AverageDailyUsers = BigDecimal.fromString("0");

    // If the current day is not the first transaction date, increment the global index
    if (newData.date != FIRST_TX_DATE) {
      let day0 = CumulativeDailyStat.load(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromI64(0))));
      if (day0 != null) {
        day0.CurrentIndex = day0.CurrentIndex.plus(BigInt.fromString("1"));
        day0.save();
      }
    }
  }

  // Update the entity based on the event type
  if (type == "lock") {
    newData.CumulativeDepositAmount = newData.CumulativeDepositAmount.plus(amount);
    newData.CurrentTotalGLMStaked = newData.CurrentTotalGLMStaked.plus(amount);
    newData.CumulativeDepositsCount = newData.CumulativeDepositsCount.plus(BigInt.fromI32(1));
  } else if (type == "unlock") {
    newData.CumulativeWithdrawAmount = newData.CumulativeWithdrawAmount.plus(amount);
    newData.CurrentTotalGLMStaked = newData.CurrentTotalGLMStaked.minus(amount);
    newData.CumulativeWithdrawalsCount = newData.CumulativeWithdrawalsCount.plus(BigInt.fromI32(1));
  }

  // Retrieve the previous day's data
  let previousDayData = getPreviousDayID(newData);

  // If the previous day's timestamp is different, aggregate the data
  if (previousDayData.timestamp != newData.timestamp) {
    newData.CumulativeDepositAmount = newData.CumulativeDepositAmount.plus(previousDayData.CumulativeDepositAmount);
    newData.CurrentTotalGLMStaked = newData.CurrentTotalGLMStaked.plus(previousDayData.CurrentTotalGLMStaked);
    newData.CumulativeWithdrawAmount = newData.CumulativeWithdrawAmount.plus(previousDayData.CumulativeWithdrawAmount);
    newData.TotalUsers = newData.TotalUsers.plus(previousDayData.TotalUsers);
    newData.CurrentTotalUsers = newData.CurrentTotalUsers.plus(previousDayData.CurrentTotalUsers);
    newData.CumulativeWithdrawalsCount = newData.CumulativeWithdrawalsCount.plus(previousDayData.CumulativeWithdrawalsCount);
    newData.CumulativeDepositsCount = newData.CumulativeDepositsCount.plus(previousDayData.CumulativeDepositsCount);
    previousDayData.isAdded = true;
  }

  // Calculate the number of days since the start date
  const DaysSinceStart = BigInt.fromI64(getDaysSinceStart(newData.timestamp.toI64()));

  // If there are days since the start, calculate the averages
  if (DaysSinceStart > BigInt.fromI32(0)) {
    newData.AverageDailyDeposits = newData.CumulativeDepositsCount.toBigDecimal().div(DaysSinceStart.toBigDecimal()).truncate(2);
    newData.AverageDailyGLMDeposits = newData.CumulativeDepositAmount.toBigDecimal().div(DaysSinceStart.toBigDecimal()).truncate(2);
    newData.AverageDailyWithdrawals = newData.CumulativeWithdrawalsCount.toBigDecimal().div(DaysSinceStart.toBigDecimal()).truncate(2);
    newData.AverageDailyGLMWithdrawals = newData.CumulativeWithdrawAmount.toBigDecimal().div(DaysSinceStart.toBigDecimal()).truncate(2);
    newData.AverageDailyUsers = newData.CurrentTotalUsers.toBigDecimal().div(DaysSinceStart.toBigDecimal()).truncate(2);
  }

  // Save the updated or newly created entity
  newData.save();
  previousDayData.save();

  return newData;
}

/**
 * Handles the `Locked` event.
 *
 * This function processes the `Locked` event by performing the following steps:
 * 1. Checks if the locked amount is greater than zero.
 * 2. Creates and saves a new data entry with the lock event details.
 * 3. Creates and saves a new `OctantEvent` with the lock event details.
 * 4. Loads the user associated with the event or creates a new user if it doesn't exist.
 * 5. Updates the user's locked balance and total locked amount.
 * 6. Updates the total and current total users count if necessary.
 * 7. Saves the updated user and data entries.
 *
 * @param {LockedEvent} event - The event containing the lock details.
 */
export function handleLocked(event: LockedEvent): void {
  if (event.params.amount > BigInt.fromI32(0))
  {
    const newData = setNewData(event.block.timestamp, event.params.amount, "lock");
    newData.save()
    const newOctantEvent = new OctantEvent(event.block.timestamp.toString());
    newOctantEvent.type = 0;
    newOctantEvent.isLock = 1;
    newOctantEvent.isUnlock = 0;
    newOctantEvent.user = event.params.user;
    newOctantEvent.depositBeforeLock = event.params.depositBefore;
    newOctantEvent.amountLock = event.params.amount;
    newOctantEvent.whenLock = event.params.when;
    newOctantEvent.blockNumber = event.block.number;
    newOctantEvent.blockTimestamp = event.block.timestamp;
    newOctantEvent.transactionHash = event.transaction.hash;
    newOctantEvent.timestamp = event.block.timestamp.toI64();
    newOctantEvent.amountUnlock = BigInt.fromI32(0);
    newOctantEvent.save();
    let user = User.load(event.params.user);
    if (user == null) {
      user = new User(event.params.user);
      user.balanceLocked = BigInt.fromI32(0);
      user.totalLockedAmount = BigInt.fromI32(0);
      user.totalUnlockedAmount = BigInt.fromI32(0);
      newData.TotalUsers = newData.TotalUsers.plus(BigInt.fromI32(1));
      newData.CurrentTotalUsers = newData.CurrentTotalUsers.plus(BigInt.fromI32(1));
    }
    else if (user != null && event.params.depositBefore == BigInt.fromI32(0))
      newData.CurrentTotalUsers = newData.CurrentTotalUsers.plus(BigInt.fromI32(1));
    user.balanceLocked = user.balanceLocked.plus(event.params.amount);
    if (user.balanceLocked > BigInt.fromI32(0))
      user.isBalancePositive = 1;
    user.totalLockedAmount = user.totalLockedAmount.plus(event.params.amount);
    user.OctantEvents
    user.save()
    newData.save()
  }
}

/**
 * Handles the `Unlocked` event by updating the relevant data and entities.
 *
 * @param {UnlockedEvent} event - The event object containing the details of the unlock event.
 *
 * The function performs the following actions:
 * 1. Checks if the unlocked amount is greater than zero.
 * 2. Creates and saves a new data entry with the event details.
 * 3. Creates and saves a new `OctantEvent` entity with the event details.
 * 4. Loads the user entity associated with the event or creates a new one if it doesn't exist.
 * 5. Updates the user's balance and unlock statistics.
 * 6. Updates the total number of users with a positive balance if necessary.
 * 7. Saves the updated user and new data entities.
 */
export function handleUnlocked(event: UnlockedEvent): void {
  if (event.params.amount > BigInt.fromI32(0))
  {
    const newData = setNewData(event.block.timestamp, event.params.amount, "unlock");
    newData.save()
    const entity = new OctantEvent(event.block.timestamp.toString())
    entity.type = 1;
    entity.isLock = 0;
    entity.isUnlock = 1;
    entity.user = event.params.user;
    entity.depositBeforeUnlock = event.params.depositBefore;
    entity.amountUnlock = event.params.amount;
    entity.whenUnlock = event.params.when;
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
    entity.timestamp = event.block.timestamp.toI64();
    entity.amountLock = BigInt.fromI32(0);
    entity.save();
    let user = User.load(event.params.user);
    if (user == null) 
      user = new User(event.params.user);
    user.balanceLocked = user.balanceLocked.minus(event.params.amount)
    if (user.balanceLocked <= BigInt.fromI32(0))
    {
      newData.CurrentTotalUsers = newData.CurrentTotalUsers.minus(BigInt.fromI32(1));
      user.isBalancePositive = 0;
    }
    user.totalUnlockedAmount = user.totalUnlockedAmount.plus(event.params.amount)
    user.save();
    newData.save()
  }
}
