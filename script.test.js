const test = require('node:test');
const assert = require('node:assert/strict');
const { getPartyState } = require('./script.js');

const start = Date.parse('2027-01-16T10:00:00-06:00');
const end = Date.parse('2027-01-16T12:00:00-06:00');

test('the Plano party starts at 16:00 UTC and ends at 18:00 UTC', () => {
    assert.equal(getPartyState(Date.parse('2027-01-16T15:59:59.999Z'), start, end), 'upcoming');
    assert.equal(getPartyState(Date.parse('2027-01-16T16:00:00Z'), start, end), 'active');
    assert.equal(getPartyState(Date.parse('2027-01-16T17:59:59.999Z'), start, end), 'active');
    assert.equal(getPartyState(Date.parse('2027-01-16T18:00:00Z'), start, end), 'ended');
});

test('the party does not stay active after its end date', () => {
    assert.equal(getPartyState(Date.parse('2027-02-01T12:00:00Z'), start, end), 'ended');
});

test('missing or inverted event dates do not open RSVPs', () => {
    assert.equal(getPartyState(start, NaN, end), 'unavailable');
    assert.equal(getPartyState(start, start, NaN), 'unavailable');
    assert.equal(getPartyState(start, end, start), 'unavailable');
    assert.equal(getPartyState(start, start, start), 'unavailable');
});
