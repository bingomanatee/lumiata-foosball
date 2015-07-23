'use strict';

describe('Service: SimSize', function () {

  // load the service's module
  beforeEach(module('lumiataFoosballApp'));

  // instantiate service
  var SimSize;
  beforeEach(inject(function (_SimSize_) {
    SimSize = _SimSize_;
  }));

  it('should do something', function () {
    expect(!!SimSize).toBe(true);
  });

});
