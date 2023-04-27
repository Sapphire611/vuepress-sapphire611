const map = new Map(); // 这个map得是全局的
map.set(1, 1);
map.set(2, 1);

const fibonacci = (n) => {
  if (map.has(n)) return map.get(n);

  let result = fibonacci(n - 1) + fibonacci(n - 2);
  map.set(n, result);

  return result;
};

console.log(fibonacci(50)); // 没问题了
