'use strict';

/**
 * @ngdoc directive
 * @name lumiataFoosballApp.directive:gamesList
 * @description
 * # gamesList
 */
angular.module('lumiataFoosballApp')
  .directive('gamesList', function (lodash) {
    return {
      templateUrl: '/views/gameList.html',
      restrict: 'E',
      scope: {games: '='},
      controller: function ($scope) {

        function getTeamPlayers(game, n) {
          var team = game['team' + n];
          return lodash.uniq(lodash.difference(team, ['(none)']));
        }

        $scope.winners = function (game) {
          return getTeamPlayers(game, game.winner);
        };

        $scope.losers = function (game) {
          if (game.winner === 1) {
            return getTeamPlayers(game, 2);
          } else {
            return getTeamPlayers(game, 1);
          }
        };

      }
    };
  });
