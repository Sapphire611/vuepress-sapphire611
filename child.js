process.on('message', (message) => {
    console.log(`Message from main process: ${message}`);
    process.send('Hello from the child process!');
  });
  
// 确保子进程不会立即退出
process.stdin.resume();