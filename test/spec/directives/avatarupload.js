'use strict';

xdescribe('Directive: avatarUpload', function () {

  // load the directive's module
  beforeEach(module('lumiataFoosballApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('has no tests', inject(function ($compile) {
    element = angular.element('<avatar-upload></avatar-upload>');
    element = $compile(element)(scope);
  }));
});
