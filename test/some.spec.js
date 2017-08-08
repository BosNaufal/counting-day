
import assert from 'assert'
import chai, { expect } from 'chai';

import CountingDay from '../src/index.js';


const getValue = ({ date, month, year }) => {
  const dateInstance = new Date(year, month - 1, date)
  return {
    day: dateInstance.getDay(),
    date,
    month,
    year,
    dateObj: dateInstance
  }
}

describe('CountingDay:', () => {

  describe('isLeap()', () => {
    it('Arguments is optional', () => {
      const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
      counting.state.year = 2020
      expect(counting.isLeap()).to.be.true
      expect(counting.isLeap(2025)).to.be.false
    });
  })


  describe('maxDayCount()', () => {
    it('Arguments is optional', () => {
      const counting = new CountingDay({ date: 1, month: 2, year: 2017 })
      expect(counting.maxDayCount()).to.equal(29)
      expect(counting.maxDayCount(1)).to.equal(31)
    });

    it('Need valid month', () => {
      const counting = new CountingDay({ date: 1, month: 2, year: 2017 })
      expect(counting.maxDayCount.bind(counting, 0)).to.throw("[CountingDay]: Invalid month index")
      expect(counting.maxDayCount.bind(counting, -1)).to.throw()
      expect(counting.maxDayCount.bind(counting, "25")).to.throw()
      expect(counting.maxDayCount.bind(counting, "a")).to.throw()
    });

    it('Should Return a max day count of the month', () => {
      const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
      expect(counting.maxDayCount(1)).to.equal(31)
      expect(counting.maxDayCount(2)).to.equal(29)
      expect(counting.maxDayCount(3)).to.equal(31)
      expect(counting.maxDayCount(4)).to.equal(30)
    });

    it('Should care about the Leap', () => {
      const counting = new CountingDay({ date: 1, month: 1, year: 2017 })

      counting.state.year = 2020
      expect(counting.isLeap()).to.be.true
      expect(counting.maxDayCount(2)).to.equal(30)

      counting.state.year = 2010
      expect(counting.isLeap()).to.be.false
      expect(counting.maxDayCount(2)).to.equal(29)
    });
  })

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
      expect(counting.addDay(0, 1)).to.have.property('dateObj')
    });

    it("Should return Object there's initDay or initMonth or initYear", () => {
      const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
      expect(counting.addDay(0, 1, 1, 2017)).to.be.an.instanceof(Object)
      expect(counting.addDay(0, 1, 1, 2017)).to.deep.equal(getValue({ date: 1, month: 1, year: 2017 }))
      expect(counting.addDay(1, 1, 1, 2017)).to.deep.equal(getValue({ date: 2, month: 1, year: 2017 }))
    });

    it('Should return its instance if no initDay', () => {
      const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
      expect(counting.addDay(0)).to.be.an.instanceof(CountingDay)
      expect(counting.addDay(10)).to.be.an.instanceof(CountingDay)
    });

    it('Should Return the next date', () => {
      const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
      expect(counting.addDay(31)).to.be.an.instanceof(CountingDay)
      expect(counting.get()).to.deep.equal(getValue({ date: 1, month: 2, year: 2017 }))

      expect(counting.addDay(0, 1)).to.deep.equal(getValue({ date: 1, month: 1, year: 2017 }))
      expect(counting.addDay(30, 1)).to.deep.equal(getValue({ date: 31, month: 1, year: 2017 }))
      expect(counting.addDay(31, 1)).to.deep.equal(getValue({ date: 1, month: 2, year: 2017 }))
      expect(counting.addDay(366, 1)).to.deep.equal(getValue({ date: 1, month: 1, year: 2018 }))
      expect(counting.addDay(366 * 2 + 30, 1)).to.deep.equal(getValue({ date: 31, month: 1, year: 2019 }))
      expect(counting.addDay(366 * 3 + 31 + 30, 1)).to.deep.equal(getValue({ date: 1, month: 3, year: 2020 }))
    });

    it('Should care about the leap', () => {
      const counting = new CountingDay({ date: 1, month: 2, year: 2020 })
      expect(counting.isLeap()).to.be.true
      expect(counting.addDay(30, 1)).to.deep.equal(getValue({ date: 1, month: 3, year: 2020 }))

      expect(counting.isLeap(2017)).to.be.false
      expect(counting.addDay(29, 1, 2, 2017)).to.deep.equal(getValue({ date: 1, month: 3, year: 2017 }))
    });
  })


  describe("addMonth", () => {
    it('Need valid monthCount', () => {
      const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
      expect(counting.addMonth.bind(counting)).to.throw("[CountingDay]: Invalid count argument")
      expect(counting.addMonth.bind(counting, "0")).to.throw()
      expect(counting.addMonth.bind(counting, 0)).to.not.throw()
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
    });

    it("Should return Object there's initDay or initMonth or initYear", () => {
      const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
      expect(counting.addMonth(0, 1, 1, 2017)).to.be.an.instanceof(Object)
      expect(counting.addMonth(0, 1, 1, 2017)).to.deep.equal(getValue({ date: 1, month: 1, year: 2017 }))
      expect(counting.addMonth(1, 1, 1, 2017)).to.deep.equal(getValue({ date: 1, month: 2, year: 2017 }))
    });

    it('Should return its instance if no initMonth', () => {
      const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
      expect(counting.addMonth(0)).to.be.an.instanceof(CountingDay)
      expect(counting.addMonth(10)).to.be.an.instanceof(CountingDay)
    });
  });

});
