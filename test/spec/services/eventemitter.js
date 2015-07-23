'use strict';

describe('Service: EventEmitter', function () {

  // load the service's module
  beforeEach(module('lumiataFoosballApp'));

  // instantiate service
  var EventEmitter;
  beforeEach(inject(function (_EventEmitter_) {
    EventEmitter = _EventEmitter_;
  }));

  it('should do something', function () {
    expect(!!EventEmitter).toBe(true);
  });

});
