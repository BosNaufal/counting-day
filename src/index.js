
/**
*
*   Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
*   Licensed Under MIT (http://opensource.org/licenses/MIT)
*   CountingDay.js
*
*/

class CountingDay {

  MAX_MONTH = 12

  constructor(options) {
    let { date, month, year } = options

    // Default Value
    const now = new Date()
    month = month || now.getMonth() + 1
    year = year || now.getFullYear()

    if (
      (date < 1 || date > 31) ||
      (month < 1 || month > 12) ||
      (typeof date !== "number" || typeof month !== "number" || typeof year !== "number")
    ) {
      throw new Error("[CountingDay]: Invalid constructor argument")
    }

    this.state = { ...options, month, year }
    this.state.day = this.getDate().getDay()
    return this
  }

  static fromDate(dateInstance, options = {}) {
    const validDate = dateInstance.isPrototypeOf(Date)
    if (validDate) throw new Error("[CountingDay]: Invalid Date Instance")
    const day = dateInstance.getDay()
    const date = dateInstance.getDate()
    const month = dateInstance.getMonth() + 1
    const year = dateInstance.getFullYear()
    return new CountingDay({
      ...options,
      day,
      date,
      month,
      year,
    })
  }

  getDate() {
    const { date, month, year } = this.state
    return new Date(year, month - 1, date)
  }

  convertToTwoDigit(num) {
    const string = num.toString()
    const isTwoDigit = string.length >= 2
    if (isTwoDigit) return string
    return `0${string}`
  }

  getSQLDate(date, month, year) {
    date = date || this.state.date
    month = month || this.state.month
    year = year || this.state.year
    const newDate = this.convertToTwoDigit(date)
    const newMonth = this.convertToTwoDigit(month)
    return `${year}-${newMonth}-${newDate}`
  }

  isLeap(year) {
    year = year || this.state.year
    return year % 4 === 0
  }

  maxDayCount(month, year) {
    if (typeof month === "string") throw new Error("[CountingDay]: Invalid month index")

    month = month || this.state.month
    year = year || this.state.year

    const THIRTY_ONE = [1, 3, 5, 7, 8, 10, 12]
    const THIRTY = [4, 6, 9, 11]
    const FEBRUARY = 2

    const isThirtyOne = THIRTY_ONE.find((index) => index === month)
    const isThirty = THIRTY.find((index) => index === month)
    const isFebruary = FEBRUARY === month

    if (isThirtyOne) return 31
    else if (isThirty) return 30
    else if (isFebruary) return this.isLeap(year) ? 30 : 29
    else return false // out of range
  }

  validArgument(variable, errorMessage) {
    if (
      variable === (undefined || null) ||
      isNaN(variable) ||
      typeof variable !== 'number'
    ) {
      throw new Error(errorMessage)
    }
    return true
  }

  addDay(count, initDate, initMonth, initYear) {
    this.validArgument(count, "[CountingDay]: Invalid count argument")
    const typeReturn = initDate || initMonth || initYear ? 'object' : 'this'

    let currentDate = (initDate || this.state.date) + count
    let currentMonth = initMonth || this.state.month
    let currentYear = initYear || this.state.year

    const IS_NEGATIVE = count < 0

    let maxDayMonth = () => {
      const monthToCount = IS_NEGATIVE ? currentMonth - 1 : currentMonth
      const maxDay = this.maxDayCount(monthToCount, currentYear)
      if (!maxDay) {
        if (IS_NEGATIVE) currentYear--
        else currentYear++
        currentMonth = IS_NEGATIVE ? 12 : 1
        return this.maxDayCount(currentMonth, currentYear)
      }
      return maxDay
    }

    const recursive = () => {

      let diff = 0
      let isOutOfRange = currentDate > maxDayMonth()
      if (IS_NEGATIVE) isOutOfRange = currentDate < 0

      if (!isOutOfRange) {
        const dateInstance = new Date(currentYear, currentMonth - 1, currentDate)
        const objectToReturn = {
          day: dateInstance.getDay(),
          date: currentDate,
          month: currentMonth,
          year: currentYear,
        }
        if (typeReturn === 'this') {
          this.state = { ...objectToReturn }
          return this
        }
        return objectToReturn
      }
      else {
        if (IS_NEGATIVE) {
          diff = currentDate + maxDayMonth()
          currentMonth--
        } else {
          diff = currentDate - maxDayMonth()
          currentMonth++
        }
        currentDate = diff
        return recursive()
      }
    }
    return recursive()
  }

  addMonth(count, initDate, initMonth, initYear) {
    const { MAX_MONTH } = this
    this.validArgument(count, "[CountingDay]: Invalid count argument")
    const typeReturn = initDate || initMonth || initYear ? 'object' : 'this'
    const IS_NEGATIVE = count < 0

    let currentDate = initDate || this.state.date
    let currentMonth = (initMonth || this.state.month) + count
    let currentYear = initYear || this.state.year

    const recursive = () => {
      let diff = 0
      let isOutOfRange = currentMonth > MAX_MONTH
      if (IS_NEGATIVE) {
        isOutOfRange = currentMonth < 0
        if (!isOutOfRange && currentMonth === 0) {
          diff = currentMonth + MAX_MONTH
          currentMonth = diff
          currentYear--
        }
      }

      if (!isOutOfRange) {
        const dateInstance = new Date(currentYear, currentMonth - 1, currentDate)
        const objectToReturn = {
          day: dateInstance.getDay(),
          date: currentDate,
          month: currentMonth,
          year: currentYear,
        }
        if (typeReturn === 'this') {
          this.state = { ...objectToReturn }
          return this
        }
        return objectToReturn
      }
      else {
        if (IS_NEGATIVE) {
          diff = currentMonth + MAX_MONTH
          currentYear--
        } else {
          diff = currentMonth - MAX_MONTH
          currentYear++
        }
        currentMonth = diff
        return recursive()
      }
    }
    return recursive()
  }

  get() {
    const newState = {
      ...this.state,
      month: this.state.month,
    }
    const { date, month, year } = newState
    const dateInstance = new Date(year, month - 1, date)
    return {
      ...newState,
      day: dateInstance.getDay(),
      date,
    }
  }
}

module.exports = CountingDay;
