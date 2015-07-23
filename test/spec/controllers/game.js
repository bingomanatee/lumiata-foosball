'use strict';

xdescribe('Controller: GameCtrl', function () {

  // load the controller's module
  beforeEach(module('lumiataFoosballApp'));

  var GameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GameCtrl = $controller('GameCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('has no tests', function () {
  });
});
