'use strict';

xdescribe('Directive: tablePlayerSlot', function () {

  // load the directive's module
  beforeEach(module('lumiataFoosballApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<table-player-slot></table-player-slot>');
    element = $compile(element)(scope);
  }));
});
