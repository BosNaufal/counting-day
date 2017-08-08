
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
    const { date, month, year } = options
    if (
      (date < 1 || date > 31) ||
      (month < 1 || month > 12) ||
      (typeof date !== "number" || typeof month !== "number" || typeof year !== "number")
    ) {
      throw new Error("[CountingDay]: Invalid constructor argument")
    }

    this.state = { ...options }
    this.state.dateObj = new Date(year, month - 1, date)
    this.state.day = this.state.dateObj.getDay()
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

  isLeap(year) {
    year = year || this.state.year
    return year % 4 === 0
  }

  maxDayCount(month, year) {
    if (month < 1 || typeof month === "string") throw new Error("[CountingDay]: Invalid month index")

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
    let maxDayCurrentMonth = () => {
      const maxDay = this.maxDayCount(currentMonth, currentYear)
      if (!maxDay) {
        currentYear++
        currentMonth = 1
        return this.maxDayCount(currentMonth, currentYear)
      }
      return maxDay
    }
    const recursive = () => {
      const isOutOfRange = currentDate > maxDayCurrentMonth()
      if (!isOutOfRange) {
        const dateInstance = new Date(currentYear, currentMonth - 1, currentDate)
        return typeReturn === 'this' ?
          this
        :
          {
            day: dateInstance.getDay(),
            date: currentDate,
            month: currentMonth,
            year: currentYear,
            dateObj: dateInstance,
          }
      }
      else {
        const diff = currentDate - maxDayCurrentMonth()
        currentDate = diff
        currentMonth += 1
        return recursive()
      }
    }
    return recursive()
  }

  addMonth(count, initDate, initMonth, initYear) {
    const { MAX_MONTH } = this
    this.validArgument(count, "[CountingDay]: Invalid count argument")
    const typeReturn = initDate || initMonth || initYear ? 'object' : 'this'

    let currentDate = initDate || this.state.date
    let currentMonth = (initMonth || this.state.month) + count
    let currentYear = initYear || this.state.year
    const recursive = () => {
      const isOutOfRange = currentMonth > MAX_MONTH
      if (!isOutOfRange) {
        const dateInstance = new Date(currentYear, currentMonth - 1, currentDate)
        return typeReturn === 'this' ?
          this
        :
          {
            day: dateInstance.getDay(),
            date: currentDate,
            month: currentMonth,
            year: currentYear,
            dateObj: dateInstance,
          }
      }
      else {
        const diff = currentMonth - MAX_MONTH
        currentMonth = diff
        currentYear += 1
        return recursive()
      }
    }
    return recursive()
  }

  get() {
    const newState = {
      ...this.state,
      month: this.state.month + 1,
    }
    const { date, month, year } = newState
    const dateInstance = new Date(year, month - 1, date)
    return {
      ...newState,
      day: dateInstance.getDay(),
      date,
      dateObj: dateInstance,
    }
  }
}

module.exports = CountingDay;
