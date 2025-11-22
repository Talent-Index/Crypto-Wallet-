const fs = jest.createMockFromModule<any>('fs');

fs.writeFileSync = jest.fn();
fs.mkdirSync = jest.fn();
fs.existsSync = jest.fn(() => false);

module.exports = fs;
