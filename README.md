
# Counting Day

Mini library to count your day. sometime we just need to add some day to define a date like *today, yesterday, last week, last 7 days, last 30 days, etc*. But you feel too expensive to include a popular library with a big size of file. Now, you can do it with **5kB** library. So, let's count your day!

## Install
You can import [counting-day.min.js](./dist/counting-day.min.js) to your js file like [this](./examples/index.js) and process it with your preprocessor.

You can install it via NPM
```bash
npm install counting-day
```


## Import Module
```javascript
import CountingDay from 'counting-day'
// Or
var CountingDay = require('counting-day');
```

## Usage
```javascript
const couting = new CountingDay({ date: 1, month: 1, year: 2017 })

let info = counting.addDay(31).get()
console.log(info);
/** Will return object with full date info
{
  day: index of day (number: 0 - 6),
  date: the date (number: 1 - 31),
  month: index of month (number: 1 - 12),
  maxDay: the max day of the month (number: 28 - 31),
  year: current year,
}
*/

// will mutate the state of the instance
let last7Days = couting.addDay(-7).get() // date: 25, month: 12, year: 2016

// will directly return the object wihtout get() method and doesn't mutate the instance state
let last30Days = counting.addDay(-7, 1, 2, 2017) // date: 25, month: 1, year: 2017

// Will mutate instance state
let addMonth = counting.addMonth(2).get() // date: 25, month: 2, year: 2017

// Will not mutate the instance state since it has a initial date manually
let addMonthWithManualInit = counting.addMonth(2, 1, 2, 2017).get() // date: 1, month: 4, year: 2017

// Will mutate instance state
let addYear = counting.addYear(2).get() // date: 25, month: 2, year: 2020

// Will not mutate the instance state
let addYearWithInit = counting.addYear(2, 1, 1, 2017) // date: 1, month: 1, year: 2017

// Produce SQL format
let SQLFormat = counting.getSQLDate() // 2020-02-25

// return Date instance with current state as its arguments
let DateInstance = counting.getDate()

// then() function will return a new instance of CountingDay, so it will never mutate the last `counting` instance
let differentCounting = addYearWithInit.then()
  .addDay(5)
  .addMonth(1)
  .addYear(10)
  .getSQLDate()
// Will Return 2027-02-06

console.log(counting === differentCounting); // false
```


## Methods
### `Constructor` (Object: { date, month, year }) => (Instance)
First of all we need to init our Constructor.
```javascript
const couting = new CountingDay({ date: 1, month: 1, year: 2017 })
console.log(counting.get());
```


### `fromDate` (Date: date) => (Instance)
Another way to create a new instance from the `new Date()` Object
```javascript
const now = new Date()
const couting = CountingDay.fromDate(now)
console.log(counting.get());
```



### `isLeap` (Number: year) => (Boolean)
It cares about the leap.
```javascript
const couting = new CountingDay({ date: 1, month: 1, year: 2017 })
console.log(counting.isLeap()); // false
counting.addYear(3) // year: 2020
console.log(counting.isLeap()); // true

const withManualInit = counting.isLeap(2040)
console.log(withManualInit); // true
```



### `maxDayCount` (Number: month, Number: year) => (Number)
It can also count the max day of the month.
```javascript
const couting = new CountingDay({ date: 1, month: 2, year: 2017 })
const maxDayOfFebruary = counting.maxDayCount()
console.log(maxDayOfFebruary); // 28

const anotherFebruary = counting.maxDayCount(2, 2020)
console.log(anotherFebruary); // 29
```



### `addDay` (Number: count, [Number: date, [Number: month, [Number: year]]]) => (Object)
It can add your day with positive or negative value of `count` argument. Other arguments next to `count` is custom initial and it is optional, you can pass all of them or one of them. When you pass the custom initial arguments you will get a new CountingDay in the `then()` function.
```javascript
const couting = new CountingDay({ date: 1, month: 1, year: 2017 })
// Will mutate the state
counting.addDay(6)
console.log(couting.get()); // date: 7, month: 1, year: 2017

// Will not mutate the state
const customInit = counting.addDay(-2, 5) // start from date: 5
console.log(customInit); // date: 3, month: 1, year: 2017

const anotherCustomInit = customInit.then().addDay(-5, 15, 2, 2020)
console.log(anotherCustomInit) // date: 10, month: 2, year: 2020
```



### `addMonth` (Number: count, [Number: date, [Number: month, [Number: year]]]) => (Object)
Just like `addDay` method, but it will add your month instead your date.
```javascript
const couting = new CountingDay({ date: 1, month: 1, year: 2017 })
// Will mutate the state
counting.addMonth(6)
console.log(couting.get()); // date: 1, month: 7, year: 2017

// Will not mutate the state
const customInit = counting.addMonth(-6, 1, 12) // start from date: 1, month: 12
console.log(customInit); // date: 1, month: 6, year: 2017

const anotherCustomInit = customInit.then().addMonth(12, 1, 1, 2020)
console.log(anotherCustomInit) // date: 1, month: 1, year: 2021
```



### `addYear` (Number: count, [Number: date, [Number: month, [Number: year]]]) => (Object)
Has some behaviout with `addDay` and `addMonth` method. It will add your Year.
```javascript
const couting = new CountingDay({ date: 1, month: 1, year: 2017 })
// Will mutate the state
counting.addYear(6)
console.log(couting.get()); // date: 1, month: 1, year: 2023

// Will not mutate the state
const customInit = counting.addYear(-10, 1, 2, 2000) // start from date: 1, month: 2, year: 2000
console.log(customInit); // date: 1, month: 2, year: 1990

const anotherCustomInit = customInit.then().addYear(12, 1, 1, 2020)
console.log(anotherCustomInit) // date: 1, month: 1, year: 2022
```



### `then` () => (Object)
`then()` method is not a instance method, it is a function returned by `addDay`, `addMonth`, or `addYear` method that run with custom initial argument.
```javascript
const couting = new CountingDay({ date: 1, month: 1, year: 2017 })

// Will not mutate the state
const customInit = counting.addMonth(6, 1, 2) // start from date: 1, month: 2
console.log(customInit); // date: 1, month: 8, year: 2017

const anotherCustomInit = customInit.then().addMonth(12, 1, 1, 2020)
console.log(anotherCustomInit) // date: 1, month: 1, year: 2021
```


### `get` () => (Object)
Will return current state instance as an Object.
```javascript
const now = new Date()
const couting = CountingDay.fromDate(now)
console.log(counting.get());
/*
  => {
    day: index of day (number: 0 - 6),
    date: the date (number: 1 - 31),
    month: index of month (number: 1 - 12),
    maxDay: the max day of the month (number: 28 - 31),
    year: current year,
  }
*/
```


### `getDate` () => (Object)
This method will create Date instance from the current state
```javascript
const couting = new CountingDay({ date: 1, month: 1, year: 2017 })
counting.getDate() // => new Date(2017, 1, 1)
```



### `getSQLDate` () => (Object)
This method will create Date instance from the current state
```javascript
const couting = new CountingDay({ date: 1, month: 1, year: 2017 })
counting.getDate() // => new Date(2017, 1, 1)
```


## Thank You for Making this useful~

## Let's talk about some projects with me
Just Contact Me At:
- Email: [bosnaufalemail@gmail.com](mailto:bosnaufalemail@gmail.com)
- Skype Id: bosnaufal254
- twitter: [@BosNaufal](https://twitter.com/BosNaufal)

## License
[MIT](http://opensource.org/licenses/MIT)
Copyright (c) 2016 - forever Naufal Rabbani
