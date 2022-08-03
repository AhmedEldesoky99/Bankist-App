'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const account1 = {
  owner: 'Ahmed Eldesoky',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2022-07-28T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-GB', // de-DE
};

const account2 = {
  owner: 'Mostafa Elsayed',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-07-29T18:49:59.371Z',
    '2022-08-21T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const userNotfound = document.querySelector('.user-not-found');
/* start App */

// handle user not found
function handleUserNotfound(accounts) {
  containerApp.style.opacity = 0;
  userNotfound.style.display = 'flex';

  accounts.forEach(acc => {
    const html = `<h4>username: ${acc.username} => pin: ${acc.pin}</h4>`;

    userNotfound.insertAdjacentHTML('afterbegin', html);
  });
}

//create username for all accounts
function createUsername(accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(acc => acc[0])
      .join('');
  });
}
createUsername(accounts);

// handle date with internationalization api
function handleTimeAuto(date = new Date()) {
  const lan = currUser.locale || navigator.language;
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  };

  return new Intl.DateTimeFormat(lan, options).format(date);
}
// handle currancy with internationalization api
function handleCurrancy(money, locale, currency) {
  const options = {
    style: 'currency',
    currency,
  };
  return new Intl.NumberFormat(locale, options).format(money);
}
// handle  movement date
function handleTimeManual(date) {
  const calcDate = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDate(new Date(), date);
  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yasterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  // const day = String(date.getDate()).padStart(2, 0);
  // const year = date.getFullYear();
  // const mon = String(date.getMonth() + 1).padStart(2, 0);
  // return `${day}/${mon}/${year}`;
  return handleTimeAuto(date);
}
// handle user login timer
function setLogOutTimer() {
  let time = 60 * 5; // second

  const timerFunc = () => {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let second = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${second}`;

    if (time === 0) {
      clearInterval(timer);
      //hide ui
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }

    time--;
  };
  timerFunc();
  const timer = setInterval(timerFunc, 1000);

  return timer;
}
//update ui
function updateUI(currUser) {
  // hide not found
  userNotfound.style.display = 'none';

  // display Balance
  calcDisplayBalance(currUser);

  //display Movements
  renderMovments(currUser);

  //display summary
  renderMovsSummary(currUser);
}
//login

let currUser, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const usernameValue = inputLoginUsername.value.trim();
  currUser = accounts.find(
    acc => acc.owner === usernameValue || acc.username === usernameValue
  );

  if (+inputLoginPin.value === currUser?.pin) {
    // display welcome message
    labelWelcome.textContent = `Welcome back, ${currUser.owner.split(' ')[0]}`;

    // display curr day
    // const now = new Date();
    // const day = String(now.getDate()).padStart(2, 0);
    // const year = now.getFullYear();
    // const mon = String(now.getMonth() + 1).padStart(2, 0);
    // const hours = String(now.getHours()).padStart(2, 0);
    // const min = String(now.getMinutes()).padStart(2, 0);

    labelDate.textContent = handleTimeAuto();

    //display ui
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = setLogOutTimer();
    //update ui
    updateUI(currUser);
  } else {
    handleUserNotfound(accounts);
  }
});

//render movements
const renderMovments = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, index) => {
    const moveType = mov > 0 ? 'deposit' : 'withdrawal';
    //date
    const date = new Date(acc.movementsDates[index]);
    const movDate = handleTimeManual(date);
    const currancy = handleCurrancy(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${moveType}">${
      index + ' ' + moveType
    } </div>
      <div class="movements__date">${movDate}</div>
      <div class="movements__value">${currancy}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//sort movement
let sort = false;
btnSort.addEventListener('click', function () {
  renderMovments(currUser, !sort);
  sort = !sort;
});

//calc display balance
const calcDisplayBalance = function (acc) {
  acc.Balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = handleCurrancy(
    acc.Balance,
    acc.locale,
    acc.currency
  );
};

//calc the total deposit and withdrawal in dollar
function renderMovsSummary(acc) {
  const euroToUSD = 1.1;

  const incomes = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * euroToUSD)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = handleCurrancy(incomes, acc.locale, acc.currency);
  // calc the total Withdrawal in dollar

  const outComes =
    acc.movements
      .filter(mov => mov < 0)
      .map(mov => mov * euroToUSD)
      .reduce((acc, mov) => acc + mov, 0) * -1;

  labelSumOut.textContent = handleCurrancy(outComes, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interset => interset > 1)
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = handleCurrancy(
    interest,
    acc.locale,
    acc.currency
  );
}

// tranfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiver = accounts.find(acc => inputTransferTo.value === acc.username);
  // console.log(amount, receiver);

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    receiver &&
    receiver.username !== currUser.username &&
    amount > 0 &&
    amount <= currUser.Balance
  ) {
    // transfer mony
    currUser.movements.push(-amount);
    receiver.movements.push(amount);
    // transfer date
    currUser.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());

    updateUI(currUser);

    // Reset Timer
    clearInterval(timer);
    timer = setLogOutTimer();
  }
});
// request lean
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && currUser.movements.some(mov => mov >= amount / 10)) {
    setTimeout(() => {
      currUser.movements.push(amount);
      currUser.movementsDates.push(new Date().toISOString());
      // update ui
      updateUI(currUser);

      // Reset Timer
      clearInterval(timer);
      timer = setLogOutTimer();
    }, 2000);
  }
  inputLoanAmount.value = '';
});

// close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(inputCloseUsername.value, inputClosePin.value);
  if (
    currUser.username === inputCloseUsername.value &&
    currUser.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    handleUserNotfound(accounts);
  }
});
