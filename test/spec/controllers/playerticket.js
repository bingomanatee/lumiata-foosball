'use strict';

xdescribe('Controller: PlayerticketCtrl', function () {

  // load the controller's module
  beforeEach(module('lumiataFoosballApp'));

  var PlayerticketCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayerticketCtrl = $controller('PlayerticketCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('has no tests', function () {
  });
});
