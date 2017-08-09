
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
  if (instance) returnValue.then = function then() { return instance }
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
        let info = instance.addDay(0, 1, 1, 2017)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(1)
        expect(info.year).to.be.equal(2017)
      });

      it('Should return its instance if no initDay', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addDay(0)).to.be.an.instanceof(CountingDay)
        expect(counting.addDay(10)).to.be.an.instanceof(CountingDay)
      });

      it('Should Return the next date', () => {
        let instance = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(instance.addDay(0)).to.be.an.instanceof(CountingDay)

        let info = instance.get()
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(1)
        expect(info.year).to.be.equal(2017)

        info = instance.addDay(31, 1)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(2)
        expect(info.year).to.be.equal(2017)

        info = instance.addDay(28, 1, 2)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(3)
        expect(info.year).to.be.equal(2017)
      });

      it('Should care about the leap', () => {
        const instance = new CountingDay({ date: 1, month: 2, year: 2020 })
        expect(instance.isLeap()).to.be.true
        let info = instance.addDay(29, 1)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(3)
        expect(info.year).to.be.equal(2020)

        expect(instance.isLeap(2017)).to.be.false
        info = instance.addDay(28, 1, 2, 2017)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(3)
        expect(info.year).to.be.equal(2017)
      });

      it('Should accept negative count', () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })

        let info = instance.addDay(-31, 1)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(12)
        expect(info.year).to.be.equal(2019)

        info = instance.addDay(-61, 1)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(11)
        expect(info.year).to.be.equal(2019)
      });

      it('Should Care about date: 0', () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })

        let info = instance.addDay(-1, 1)
        expect(info.date).to.be.equal(31)
        expect(info.month).to.be.equal(12)
        expect(info.year).to.be.equal(2019)

        info = instance.addDay(-9, 9, 8, 2020)
        expect(info.date).to.be.equal(31)
        expect(info.month).to.be.equal(7)
        expect(info.year).to.be.equal(2020)
      });

      it("Has 'then' property when has an initial arguments", () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })
        expect(instance.addDay(-1, 1).then).to.be.an('function')
        expect(instance.addDay(-1, 1).then()).to.be.an.instanceof(CountingDay)
      });

    })
  }

  const addMonth = () => {
    describe("addMonth", () => {
      it('Need valid count', () => {
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

        let info = instance.addMonth(0, 1, 1, 2017)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(1)
        expect(info.year).to.be.equal(2017)

        info = instance.addMonth(1, 1, 1, 2017)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(2)
        expect(info.year).to.be.equal(2017)
      });

      it('Should return its instance if no initMonth', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addMonth(0)).to.be.an.instanceof(CountingDay)
        expect(counting.addMonth(10)).to.be.an.instanceof(CountingDay)
      });

      it('Should accept negative count', () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })

        let info = instance.addMonth(-1, 1, 1, 2017)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(12)
        expect(info.year).to.be.equal(2016)

        info = instance.addMonth(-24, 1, 1, 2017)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(1)
        expect(info.year).to.be.equal(2015)
      });

      it('Should Care about month: 0', () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })
        let info = instance.addMonth(-1, 1, 1)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(12)
        expect(info.year).to.be.equal(2019)

        info = instance.addMonth(-13, 1, 1)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(12)
        expect(info.year).to.be.equal(2018)
      });

      it("Has 'then' property when has an initial arguments", () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })
        expect(instance.addMonth(-1, 1).then).to.be.an('function')
        expect(instance.addMonth(-1, 1).then()).to.be.an.instanceof(CountingDay)
      });
    });
  }

  const addYear = () => {
    describe("addYear", () => {
      it('Need valid count', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addYear.bind(counting)).to.throw("[CountingDay]: Invalid count argument")
        expect(counting.addYear.bind(counting, "0")).to.throw()
        expect(counting.addYear.bind(counting, null)).to.throw()
        expect(counting.addYear.bind(counting, NaN)).to.throw()
      });

      it('Should return an valid object', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addYear(0, 1)).to.be.an.instanceof(Object)
        expect(counting.addYear(0, 1)).to.have.property('day')
        expect(counting.addYear(0, 1)).to.have.property('date')
        expect(counting.addYear(0, 1)).to.have.property('month')
        expect(counting.addYear(0, 1)).to.have.property('year')
        expect(counting.addYear(0, 1)).to.have.property('then')
      });

      it("Should return Object there's initDay or initMonth or initYear", () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(instance.addYear(0, 1, 1, 2017)).to.be.an.instanceof(Object)

        let info = instance.addYear(0, 1, 1, 2017)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(1)
        expect(info.year).to.be.equal(2017)

        info = instance.addYear(1, 1, 1, 2017)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(1)
        expect(info.year).to.be.equal(2018)
      });

      it('Should return its instance if no initMonth', () => {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        expect(counting.addYear(0)).to.be.an.instanceof(CountingDay)
        expect(counting.addYear(10)).to.be.an.instanceof(CountingDay)
      });

      it('Should accept negative count', () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })

        let info = instance.addYear(-1, 1, 1, 2017)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(1)
        expect(info.year).to.be.equal(2016)

        info = instance.addYear(-24, 1, 1, 2017)
        expect(info.date).to.be.equal(1)
        expect(info.month).to.be.equal(1)
        expect(info.year).to.be.equal(2017 - 24)
      });

      it("Has 'then' property when has an initial arguments", () => {
        const instance = new CountingDay({ date: 1, month: 1, year: 2020 })
        expect(instance.addYear(-1, 1).then).to.be.an('function')
        expect(instance.addYear(-1, 1).then()).to.be.an.instanceof(CountingDay)
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

  const then = () => {
    describe("then()", function () {
      it('Should return new Instance', function () {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        let thenInstance = counting.addDay(0, 1).then()
        expect(thenInstance).to.not.be.equal(counting)

        thenInstance = counting.addMonth(0, 1).then()
        expect(thenInstance).to.not.be.equal(counting)
      });

      it('New Instance has new state', function () {
        const counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        let state = counting.get()
        let thenInstance = counting.addDay(2, 1).then()
        let thenInstanceState = thenInstance.get()
        expect(thenInstanceState).to.not.deep.equal(state)
        expect(thenInstanceState.date).to.be.equal(3)
        expect(thenInstanceState.month).to.be.equal(1)
        expect(thenInstanceState.year).to.be.equal(2017)

        thenInstance = counting.addMonth(2, 1).then()
        thenInstanceState = thenInstance.get()
        expect(thenInstanceState).to.not.deep.equal(state)
        expect(thenInstanceState.date).to.be.equal(1)
        expect(thenInstanceState.month).to.be.equal(3)
        expect(thenInstanceState.year).to.be.equal(2017)
      });

      it('Should can chain method', () => {
        let counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        let chain = counting.addDay(1).addMonth(1)
        let info = chain.get()
        expect(info.date).to.be.equal(2)
        expect(info.month).to.be.equal(2)
        expect(info.year).to.be.equal(2017)
        expect(chain).to.be.equal(counting)

        counting = new CountingDay({ date: 1, month: 1, year: 2017 })
        chain = counting.addDay(1, 1).then().addMonth(5)
        info = chain.get()
        expect(info.date).to.be.equal(2)
        expect(info.month).to.be.equal(6)
        expect(info.year).to.be.equal(2017)
        expect(chain).to.not.be.equal(counting)
      })
    });
  }

  const all = () => {
    Init()
    isLeap()
    maxDayCount()
    addDay()
    addMonth()
    addYear()
    fromDate()
    get()
    getDate()
    getSQLDate()
    then()
  }

  return all()
});
