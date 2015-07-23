'use strict';

/**
 * @ngdoc function
 * @name lumiataFoosballApp.controller:HistoryCtrl
 * @description
 * # HistoryCtrl
 * Controller of the lumiataFoosballApp
 */
angular.module('lumiataFoosballApp')
  .controller('HistoryCtrl', function ($scope, Games, lodash) {

    function getTeamPlayers(game, n) {
      var team = game['team' + n];
      return lodash.uniq(lodash.difference(team, ['(none)']));
    }

    Games.query(function (games) {
      $scope.games = lodash.map(games, function(game){
        game.time = Date.parse(game.date);
        return game;
      });
    });

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

    $scope.toDate = function(dateString){
      return new Date(dateString);
    };

  });
