'use strict';

/**
 * @ngdoc function
 * @name lumiataFoosballApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the lumiataFoosballApp
 */
angular.module('lumiataFoosballApp')
  .controller('MainCtrl', function ($scope, SimSize) {

    $scope.width = 600;
    $scope.height = 400;
    var sizeWatcher = new SimSize('.view-frame');

    sizeWatcher.on('resize', function(size){
      $scope.width = Math.max(400, size.width * 0.8);
      $scope.height = Math.min(size.width * 0.8, size.height * 0.5);
    });

    $scope.sizer = sizeWatcher;

  });
