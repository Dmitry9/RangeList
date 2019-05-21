// env: NODEv10.13.0
class RangeList {
  /**
   * [model][undefined, 1, 2, 3, 4, undefined, 6, 7...]
   * only enumerable values has ints as values and placed to resprctive indexes 
   */
  constructor() {
    this.model = [];
  }
  
  // renaming static method will break `iterate` method
  static addRoutine({ int, model }) {
    model[int] = int; // index == value
  }

  static removeRoutine({ int, model }) {
    Object.defineProperty(model, int.toString(), {
      enumerable: false, // will not show up in [for in] loop
      configurable: true,
      writable: true,
      value: undefined, // set explicitly (Defaults to undefined)
    })
  }
  
  /**
  * Botleneck of class performance. We should iterate as less time as possible.
  * @param {Array<number, number>} range
  * @param {String} name of the static method to execute with one range elemant at a time
  */
  iterate({ range: {0: start, 1: end}, routineName }) {
    let int = start;

    while (int < end) 
      RangeList[`${routineName}Routine`]({ int: int++, model: this.model });
  }

  /**
  * @param {Array<number>} rangeTocheck
  * @returns {Boolean} if range is not valid it shouldn't processed further 
  */
  isValid(rangeTocheck) {
    if (rangeTocheck[0] > rangeTocheck[1])
    throw Error(`Wrong sequence ${rangeTocheck[0]} is greater then ${rangeTocheck[1]}`);
    
    return [
      rangeTocheck.every(isInt => Number.isInteger(isInt)),
      rangeTocheck.length === 2,
      rangeTocheck[0] !== rangeTocheck[1],
    ].every(Boolean);
  }
  
  /**
  * Adds a range to the list
  * this method accepts user input, so should be validated
  * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
  */
  add(range) {
    if (this.isValid(range))
      this.iterate({ range, routineName: 'add' });
  }
  
  /**
  * Removes a range from the list
  * this method accepts user input, so should be validated
  * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
  */
  remove(range) {
    if (this.isValid(range))
      this.iterate({ range, routineName: 'remove' });
  }
  
  /**
  * Prints out the list of ranges in the range list
  * @shouldPrint only for testing to suppress console output (isolate one test),
  * dont pass [truthy] if you don't want to see otput of ints for particular test.
  * [testArr] for every call contains only ints printed out (in coreect order)
  * @returns {Array<number>} testArr for testing purposes
  */
  print(shouldPrint) {
    const testArr = [];
    for (let i in this.model) { // iterate only over enumerable indexes
      if (shouldPrint)
        console.log(this.model[i]); // prints all added and not removed ints
      testArr.push(this.model[i]);
    }
    
    return testArr;
  }
}

// just another approach
class RangeListMinimalistic {
  constructor() { this.model = new Set(); }
  
  add({0: start, 1: end}) {
    while (start < end) this.model.add(start++);
  }
  
  remove({0: start, 1: end}) {
    while (start < end) this.model.delete(start++);
  }
  
  print(shouldPrint) {
    return [...this.model].sort((a, b) => a - b).map(i => {
      if (shouldPrint) console.log(i);
      return i;
    });
  }
}

const rl = new RangeList();
// const rl = new RangeListMinimalistic();

// set up primitive tests to speed up work
const test = () => {
  const isEqual = (arrA, arrB) => arrA.every((el, i) => el === arrB[i]);
  const res = new Map();
  res.set(true, 'passed');
  res.set(false, 'FAILED!');
  const assertions = [];
  
  rl.add([1, 5]); // Should display: [1, 5)
  assertions.push(isEqual(rl.print(1), [1,2,3,4]));
  
  rl.add([10, 20]); // Should display: [1, 5) [10, 20)
  assertions.push(isEqual(rl.print(1), [1,2,3,4, 10,11,12,13,14,15,16,17,18,19]));
  
  rl.add([20, 20]); // Should display: [1, 5) [10, 20)
  assertions.push(isEqual(rl.print(1), [1,2,3,4, 10,11,12,13,14,15,16,17,18,19]));
  
  rl.add([20, 21]); // Should display: [1, 5) [10, 21)
  assertions.push(isEqual(rl.print(1), [1,2,3,4, 10,11,12,13,14,15,16,17,18,19,20]));
  
  rl.add([2, 4]); // Should display: [1, 5) [10, 21)
  assertions.push(isEqual(rl.print(1), [1,2,3,4, 10,11,12,13,14,15,16,17,18,19,20]));
  
  rl.add([3, 8]); // Should display: [1, 8) [10, 21)
  assertions.push(isEqual(rl.print(1), [1,2,3,4,5,6,7, 10,11,12,13,14,15,16,17,18,19,20]));  
  
  rl.remove([10, 10]); // Should display: [1, 8) [10, 21)
  assertions.push(isEqual(rl.print(1), [1,2,3,4,5,6,7, 10,11,12,13,14,15,16,17,18,19,20]));
  
  rl.remove([10, 11]); // Should display: [1, 8) [11, 21)
  assertions.push(isEqual(rl.print(1), [1,2,3,4,5,6,7, 11,12,13,14,15,16,17,18,19,20]));
  
  rl.remove([15, 17]); // Should display: [1, 8) [11, 15) [17, 21)
  assertions.push(isEqual(rl.print(1), [1,2,3,4,5,6,7, 11,12,13,14, 17,18,19,20]));
  
  rl.remove([3, 19]); // Should display: [1, 3) [19, 21)
  assertions.push(isEqual(rl.print(1), [1,2, 19,20]));
  
  assertions.forEach((ass, i) =>
    console.log(`Test${i+1} ${res.get(ass)}`));
}
test();
