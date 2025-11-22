"use strict";
const fs = jest.createMockFromModule('fs');
fs.writeFileSync = jest.fn();
fs.mkdirSync = jest.fn();
fs.existsSync = jest.fn(() => false);
module.exports = fs;
