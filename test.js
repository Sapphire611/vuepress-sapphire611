const arr = [
  [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ],
  [
    [11, 12, 13],
    [14, 15, 16],
    [17, 18, 19]
  ],
  [
    [21, 22, 23],
    [24, 25, 26],
    [27, 28, 29]
  ]
];

const myflat = (arr) => {
  let result = [];
  
  for(const each of arr){
    if(Array.isArray(each)) result = result.concat(myflat(each))
    else result.push(each)
  }
  return result;
}

const flattenedArr = myflat(arr);
console.log(flattenedArr);
