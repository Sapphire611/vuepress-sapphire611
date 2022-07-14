const { series } = require('gulp');
const { parallel } = require('gulp');

function defaultTask(cb) {
    // place code for your default task here
    cb();
}

function test1(cb) {
    console.log('test4liuliyi');
    cb();
}

function test2(cb) {
    console.log('test4liuliyi');
    cb();
}
exports.test = parallel(test1, test2);

exports.default = defaultTask;