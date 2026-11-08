const test = require('node:test');
const assert = require('node:assert/strict');
const { getPartyState, isValidContact } = require('./script.js');

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

test('RSVP contact accepts an email address or a formatted phone number', () => {
    for (const contact of ['parent@example.com', 'parent+party@example.co.uk', ' parent@example.com ', '9725550123', '(972) 555-0123', '+1 972-555-0123', '+44 20 7946 0958']) {
        assert.equal(isValidContact(contact), true, contact);
    }
});

test('RSVP contact rejects blank or incomplete contact details', () => {
    for (const contact of ['', '   ', 'parent', 'parent@', '@example.com', 'parent@example', 'parent name@example.com', '12345', '1234567890123456', 'abc1234567', 'call me maybe']) {
        assert.equal(isValidContact(contact), false, contact);
    }
});
