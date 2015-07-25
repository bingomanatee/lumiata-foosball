'use strict';

xdescribe('Directive: gamesList', function () {

  // load the directive's module
  beforeEach(module('lumiataFoosballApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('has no tests', inject(function ($compile) {
    element = angular.element('<games-list></games-list>');
    element = $compile(element)(scope);
  }));
});
