/* jshint esversion: 6 */

const expect = require('expect');
const {generateMessage} = require('./message');

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
