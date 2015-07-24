'use strict';

/**
 * @ngdoc function
 * @name lumiataFoosballApp.controller:TournamentCtrl
 * @description
 * # TournamentCtrl
 * Controller of the lumiataFoosballApp
 */
angular.module('lumiataFoosballApp')
  .controller('TournamentCtrl', function ($scope, Players, lodash, Games) {
    $scope.games = 50;

    function _createGame(players) {
      var playerNames = lodash(players).pluck('name').shuffle().value();
      console.log('making game with ', playerNames);

      var targetNumberForTeam1 = Math.floor(Math.random() * 3) + 1;
      var targetNumberForTeam2 = Math.floor(Math.random() * Math.random() * 3) + 1;
      var team1 = [playerNames.pop()];
      var team2 = [playerNames.pop()];

      function _strength(playerNames) {
        var ranks = lodash.reduce(playerNames, function (ranks, playerName) {
          var player = lodash.find(players, 'name', playerName);
          if (player) {
            ranks.push(player.rank);
          }

          return ranks;
        }, []);

        ranks = lodash.sortBy(ranks, lodash.identity).reverse();
        var rank = ranks.shift();
        if (ranks.length) {
          rank += Math.sqrt(ranks[0]);
        }

        return rank;
      }

      function team1short() {
        return team1.length < targetNumberForTeam1;
      }

      function team2short() {
        return team2.length < targetNumberForTeam2;
      }

      while ((team1short() || team2short() ) && playerNames.length) {
        if (team1short() && team2short()) {
          if (Math.random() > 0.5) {
            team1.push(playerNames.pop());
          } else {
            team2.push(playerNames.pop());
          }
        } else if (team1short()) {
          team1.push(playerNames.pop());
        } else if (team2short()) {
          team2.push(playerNames.pop());
        }

      }

      console.log('target team1: ', targetNumberForTeam1, 'result:', team1);
      console.log('target team2: ', targetNumberForTeam2, 'result:', team2);

      var team1strength = _strength(team1);
      var team2strength = _strength(team2);
      var winner;

      var oddsOfTeam1 = team1strength / (team1strength + team2strength);
      if (Math.random() > oddsOfTeam1) {
        winner = 1;
      } else {
        winner = 2;
      }

      var startTime = new Date($scope.startDate).getTime();
      var endTime = new Date($scope.endDate).getTime();
      var start = Math.min(startTime, endTime);
      endTime = Math.max(startTime, endTime);
      startTime = start;

      var range = endTime - startTime;
      var date = new Date(Math.floor(Math.random() * range + startTime));

      var game = {
        team1: team1,
        team2: team2,
        winner: winner,
        date: date.toISOString()
      };
      console.log('odds: ', oddsOfTeam1, 'winner: ', winner, 'game: ', game);
      Games.add(game);
    }

    $scope.startDate = new Date();
    $scope.endDate = new Date();

    $scope.createGames = function () {
      var g = $scope.games;

      function _makeGame() {
        Players.query(function (players) {
          _createGame(players);
          --g;
          if (g > 0) {
            _makeGame();
          }
        });
      }

      _makeGame();
    };
  }
)
;
