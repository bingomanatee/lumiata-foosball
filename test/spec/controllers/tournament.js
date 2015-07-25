'use strict';

xdescribe('Controller: TournamentCtrl', function () {

  // load the controller's module
  beforeEach(module('lumiataFoosballApp'));

  var TournamentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TournamentCtrl = $controller('TournamentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('has no tests', function () {
  });
});
