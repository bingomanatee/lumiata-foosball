'use strict';

xdescribe('Controller: PlayersCtrl', function () {

  // load the controller's module
  beforeEach(module('lumiataFoosballApp'));

  var PlayersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayersCtrl = $controller('PlayersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('has no tests', function () {

  });
});
