'use strict';

xdescribe('Directive: foosballTable', function () {

  // load the directive's module
  beforeEach(module('lumiataFoosballApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<foosball-table></foosball-table>');
    element = $compile(element)(scope);
  }));
});
