'use strict';

xdescribe('Controller: HistoryCtrl', function () {

  // load the controller's module
  beforeEach(module('lumiataFoosballApp'));

  var HistoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HistoryCtrl = $controller('HistoryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('has no tests', function () {
  });
});
