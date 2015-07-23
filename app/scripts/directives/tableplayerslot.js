'use strict';

/**
 * @ngdoc directive
 * @name lumiataFoosballApp.directive:tablePlayerSlot
 * @description
 * # tablePlayerSlot
 */
angular.module('lumiataFoosballApp')
  .directive('tablePlayerSlot', function (Players) {
    return {
      templateUrl: '/views/tablePlayerSlot.html',
      restrict: 'E',
      scope: {slot: '='},
      link: function postLink(scope) {

        scope.players = false;
        scope.updateGame = function(){
          scope.$parent.$parent.updateGame();
        };

        Players.query(function (players) {
          scope.players = players;
        }, function (err) {
          console.log('cannot get players', err);
        });
      }
    };
  });
