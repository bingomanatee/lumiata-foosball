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
      template: '<div class="inner"><md-select ng-if="players" ng-model="slot.player">' +
      '<md-option value="(none)">(None)</md-option>' +
      '<md-option ng-repeat="player in players" value="{{player.name}}">{{player.name}}</md-option>' +
      '</md-select></div>',
      restrict: 'E',
      scope: {slot: '='},
      link: function postLink(scope) {

        scope.players = false;

        Players.query(function (players) {
          scope.players = players;
        }, function (err) {
          console.log('cannot get players', err);
        });
      }
    };
  });
