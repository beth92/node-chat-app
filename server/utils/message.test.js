const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    // store res in variable
    let from = 'Beth';
    let text = 'Testing the message module';
    let res = generateMessage(from, text);
    // assert from match
    expect(res.from).toBe(from);
    // assert text match
    expect(res.text).toBe(text);
    expect(typeof res.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let from = 'Beth';
    let lat = 1.00;
    let lng = 2.00;
    let res = generateLocationMessage(from, lat, lng);
    expect(typeof res).toBe('object');
    expect(res.from).toBe(from);
    expect(res.url).toBe(`https://google.com/maps?q=${lat},${lng}`);
    expect(typeof res.createdAt).toBe('number');
  });
});
