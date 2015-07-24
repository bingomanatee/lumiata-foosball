'use strict';

xdescribe('Directive: playerGraph', function () {

  // load the directive's module
  beforeEach(module('lumiataFoosballApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('has no tests', inject(function ($compile) {
    element = angular.element('<player-graph></player-graph>');
    element = $compile(element)(scope);
  }));
});
