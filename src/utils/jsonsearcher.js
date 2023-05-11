function sumMonthlyPayments(obj) {
    let sum = 0;
  
    function iterate(obj) {
      for (const prop in obj) {
        if (typeof obj[prop] === 'object') {
          iterate(obj[prop]);
        } else if (prop === 'MONTHLYPAYMENT') {
          sum += obj[prop];
        }
      }
    }
  
    iterate(obj);
    return sum;
  };

  export {
    sumMonthlyPayments
  };