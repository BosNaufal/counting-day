
import assert from 'assert'
import chai, { expect } from 'chai';

import CountingDay from '../src/index.js';


const getValue = ({ date, month, year, instance }) => {
  const dateInstance = new Date(year, month - 1, date)
  const returnValue = {
    day: dateInstance.getDay(),
    date,
    month,
    maxDay: CountingDay.fromDate(dateInstance).maxDayCount(month, year),
    year,
  }
  if (instance) returnValue.then = instance
  return returnValue
}

describe('CountingDay:', () => {

  const Init = () => {
    describe('Init', () => {
      it("Only need date options", function () {
        const counting = new CountingDay({ date: 1 })
        expect(counting).to.be.an.instanceof(CountingDay)
        expect(counting.get()).to.be.an.instanceof(Object)
        expect(counting.get()).to.have.property('day')
        expect(counting.get()).to.have.property('date')
        expect(counting.get()).to.have.property('month')
        expect(counting.get()).to.have.property('year')
      });
    })
  }

  const isLeap = () => {
    describe('isLeap()', () => {
      it('Arguments is optional', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        counting.state.year = 2020
        expect(counting.isLeap()).to.be.true
        expect(counting.isLeap(2025)).to.be.false
      });
    })
  }

  const maxDayCount = () => {
    describe('maxDayCount()', () => {
      it('Arguments is optional', () => {
        const counting = new CountingDay({ date: 1, month: 2, year: 2017 })
        expect(counting.maxDayCount()).to.equal(28)
        expect(counting.maxDayCount(1)).to.equal(31)
      });

      it('Need valid month', () => {
        const counting = new CountingDay({ date: 1, month: 2, year: 2017 })
        expect(counting.maxDayCount.bind(counting, "25")).to.throw("[CountingDay]: Invalid month index")
        expect(counting.maxDayCount.bind(counting, "a")).to.throw()
      });

      it('Should Return a max day count of the month', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.maxDayCount(1)).to.equal(31)
        expect(counting.maxDayCount(2)).to.equal(28)
        expect(counting.maxDayCount(3)).to.equal(31)
        expect(counting.maxDayCount(4)).to.equal(30)
      });

      it('Should care about the Leap', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })

        counting.state.year = 2020
        expect(counting.isLeap()).to.be.true
        expect(counting.maxDayCount(2)).to.equal(29)

        counting.state.year = 2010
        expect(counting.isLeap()).to.be.false
        expect(counting.maxDayCount(2)).to.equal(28)
      });
    })
  }

  const addDay = () => {
    describe('addDay()', () => {
      it('Need valid dayCount', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addDay.bind(counting)).to.throw("[CountingDay]: Invalid count argument")
        expect(counting.addDay.bind(counting, "0")).to.throw()
        expect(counting.addDay.bind(counting, 0)).to.not.throw()
        expect(counting.addDay.bind(counting, null)).to.throw()
        expect(counting.addDay.bind(counting, NaN)).to.throw()
      });

      it('Should return an valid object', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addDay(0, 1)).to.be.an.instanceof(Object)
        expect(counting.addDay(0, 1)).to.have.property('day')
        expect(counting.addDay(0, 1)).to.have.property('date')
        expect(counting.addDay(0, 1)).to.have.property('month')
        expect(counting.addDay(0, 1)).to.have.property('year')
      });

      it("Should return Object there's initDay or initMonth or initYear", () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(instance.addDay(0, 1, 1, 2017)).to.be.an.instanceof(Object)
        expect(instance.addDay(0, 1, 1, 2017)).to.deep.equal(getValue({ date: 1, month: 1, year: 2017, instance }))
        expect(instance.addDay(1, 1, 1, 2017)).to.deep.equal(getValue({ date: 2, month: 1, year: 2017, instance }))
      });

      it('Should return its instance if no initDay', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addDay(0)).to.be.an.instanceof(CountingDay)
        expect(counting.addDay(10)).to.be.an.instanceof(CountingDay)
      });

      it('Should Return the next date', () => {
        let instance = new CountingDay({ date: 1, month: 1, year: 2017, instance })
        expect(instance.addDay(0)).to.be.an.instanceof(CountingDay)
        expect(instance.get()).to.deep.equal(getValue({ date: 1, month: 1, year: 2017, instance }))

        expect(instance.addDay(31)).to.be.an.instanceof(CountingDay)
        expect(instance.get()).to.deep.equal(getValue({ date: 1, month: 2, year: 2017, instance }))

        instance = new CountingDay({ date: 1, month: 1, year: 2017, instance })
        expect(instance.addDay(0, 1)).to.deep.equal(getValue({ date: 1, month: 1, year: 2017, instance }))
        expect(instance.addDay(31, 1)).to.deep.equal(getValue({ date: 1, month: 2, year: 2017, instance }))
        expect(instance.addDay(28, 1, 2)).to.deep.equal(getValue({ date: 1, month: 3, year: 2017, instance }))
        expect(instance.addDay(29, 1, 2, 2020)).to.deep.equal(getValue({ date: 1, month: 3, year: 2020, instance }))
        expect(instance.addDay(365, 1)).to.deep.equal(getValue({ date: 1, month: 1, year: 2018, instance }))
        expect(instance.addDay(365 * 2 + 30, 1)).to.deep.equal(getValue({ date: 31, month: 1, year: 2019, instance }))
        expect(instance.addDay(365 * 3 + 31 + 29, 1)).to.deep.equal(getValue({ date: 1, month: 3, year: 2020, instance }))
      });

      it('Should care about the leap', () => {
        const instance = new CountingDay({ date: 1, month: 2, year: 2020 })
        expect(instance.isLeap()).to.be.true
        expect(instance.addDay(29, 1)).to.deep.equal(getValue({ date: 1, month: 3, year: 2020, instance }))

        expect(instance.isLeap(2017)).to.be.false
        expect(instance.addDay(28, 1, 2, 2017)).to.deep.equal(getValue({ date: 1, month: 3, year: 2017, instance }))
      });

      it('Should accept negative count', () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })
        expect(instance.addDay(-31, 1)).to.deep.equal(getValue({ date: 1, month: 12, year: 2019, instance }))
        expect(instance.addDay(-31 - 30, 1)).to.deep.equal(getValue({ date: 1, month: 11, year: 2019, instance }))
        expect(instance.addDay(-31 - 30 - 31, 1)).to.deep.equal(getValue({ date: 1, month: 10, year: 2019, instance }))
      });

      it('Should Care about date: 0', () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })
        expect(instance.addDay(-1, 1)).to.deep.equal(getValue({ date: 31, month: 12, year: 2019, instance }))
        expect(instance.addDay(-9, 9, 8, 2020)).to.deep.equal(getValue({ date: 31, month: 7, year: 2020, instance }))
      });

    })
  }

  const addMonth = () => {
    describe("addMonth", () => {
      it('Need valid monthCount', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addMonth.bind(counting)).to.throw("[CountingDay]: Invalid count argument")
        expect(counting.addMonth.bind(counting, "0")).to.throw()
        expect(counting.addMonth.bind(counting, null)).to.throw()
        expect(counting.addMonth.bind(counting, NaN)).to.throw()
      });

      it('Should return an valid object', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addMonth(0, 1)).to.be.an.instanceof(Object)
        expect(counting.addMonth(0, 1)).to.have.property('day')
        expect(counting.addMonth(0, 1)).to.have.property('date')
        expect(counting.addMonth(0, 1)).to.have.property('month')
        expect(counting.addMonth(0, 1)).to.have.property('year')
        expect(counting.addMonth(0, 1)).to.have.property('then')
      });

      it("Should return Object there's initDay or initMonth or initYear", () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(instance.addMonth(0, 1, 1, 2017)).to.be.an.instanceof(Object)
        expect(instance.addMonth(0, 1, 1, 2017)).to.deep.equal(getValue({ date: 1, month: 1, year: 2017, instance }))
        expect(instance.addMonth(1, 1, 1, 2017)).to.deep.equal(getValue({ date: 1, month: 2, year: 2017, instance }))
      });

      it('Should return its instance if no initMonth', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addMonth(0)).to.be.an.instanceof(CountingDay)
        expect(counting.addMonth(10)).to.be.an.instanceof(CountingDay)
      });

      it('Should accept negative count', () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })
        expect(instance.addMonth(-1, 1, 1, 2017)).to.deep.equal(getValue({ date: 1, month: 12, year: 2016, instance }))
        expect(instance.addMonth(-2, 1, 1, 2017)).to.deep.equal(getValue({ date: 1, month: 11, year: 2016, instance }))
        expect(instance.addMonth(-3, 1, 1, 2017)).to.deep.equal(getValue({ date: 1, month: 10, year: 2016, instance }))
        expect(instance.addMonth(-24, 1, 1, 2017)).to.deep.equal(getValue({ date: 1, month: 1, year: 2015, instance }))
      });

      it('Should Care about month: 0', () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })
        expect(instance.addMonth(-1, 1, 1)).to.deep.equal(getValue({ date: 1, month: 12, year: 2019, instance }))
      });
    });
  }

  const fromDate = () => {
    describe("fromDate()", function () {
      it('Should Return a new instance of CountingDay', function () {
        const counting = CountingDay.fromDate(new Date())
        expect(counting).to.be.an.instanceof(CountingDay)
        const { date, month, year } = counting.get()
        expect(counting).to.deep.equal(new CountingDay({year, month, date}))
      });
    });
  }

  const get = () => {
    describe("get()", function () {
      it('Should Return a valid Object', function () {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.get()).to.deep.equal(getValue({ date: 1, month: 1, year: 2017 }))
        expect(counting.get()).to.be.an.instanceof(Object)
        expect(counting.get()).to.have.property('day')
        expect(counting.get()).to.have.property('date')
        expect(counting.get()).to.have.property('month')
        expect(counting.get()).to.have.property('maxDay')
        expect(counting.get()).to.have.property('year')
      });
    });
  }

  const getDate = () => {
    describe("getDate()", function () {
      it('Should return Date Instance', function () {
        const counting = CountingDay.fromDate(new Date())
        expect(counting.getDate()).to.be.an.instanceof(Date)
      });
    });
  }

  const getSQLDate = () => {
    describe("getSQLDate()", function () {
      it('Should return correct SQL date format', function () {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.getSQLDate()).to.be.equal('2017-01-01')
      });
    });
  }

  const all = () => {
    Init()
    isLeap()
    maxDayCount()
    addDay()
    addMonth()
    fromDate()
    get()
    getDate()
    getSQLDate()
  }

  return all()
});
