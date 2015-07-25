'use strict';

/**
 * @ngdoc function
 * @name lumiataFoosballApp.controller:TournamentCtrl
 * @description
 * # TournamentCtrl
 * Controller of the lumiataFoosballApp
 */
angular.module('lumiataFoosballApp')
  .controller('TournamentCtrl', function ($scope, Players, lodash, Games, $mdDialog, $mdToast) {
    $scope.games = 50;

    function _createGame(players, lastGame) {
      var playerNames = lodash(players).pluck('name').shuffle().value();

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

      var team1strength = _strength(team1);
      var team2strength = _strength(team2);
      var winner;

      var oddsOfTeam1 = team1strength / (team1strength + team2strength);
      if (Math.random() > oddsOfTeam1) {
        winner = 1;
      } else {
        winner = 2;
      }

      var startDate = new Date($scope.startDate);
      var lastGameDate = lastGame ? lastGame.time : startDate;
      if (lastGameDate.getTime() > startDate.getTime()) {
        startDate = lastGameDate;
      }
      var startTime = startDate.getTime();
      var date;
      var endDate = new Date($scope.endDate);
      if (endDate.getTime() < startTime) {
        endDate.setTime(endDate.getTime() + Math.random() * 100000);
        date = endDate;
      } else {
        var endTime = endDate.getTime();
        var start = Math.min(startTime, endTime);
        endTime = Math.max(startTime, endTime);
        startTime = start;

        var range = endTime - startTime;
        date = new Date(Math.floor(Math.random() * Math.random() * range + startTime));
      }

      var game = {
        team1: team1,
        team2: team2,
        winner: winner,
        date: date.toISOString()
      };
      Games.add(game, function (err, newGame) {
        $scope.games.push(newGame || game);
      });
    }

    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.games = [];
    $scope.gameCount = 50;

    $scope.screwWithTime = function () {
      $mdDialog.show(
        $mdDialog.confirm()
          .parent(angular.element(document.body))
          .title('Alter the Space Time Continuum')
          .content('Do you want to shift any games made with tournament (and any other games) into the past?')
          .ok('That\'s why I have a TARDIS')
          .cancel('I perfer my current reality')
      ).then(function () {
          Games.screwWithTime(function () {
            $mdToast.simple()
              .content('All games have been shifted into the past!')
              .position('top right')
              .hideDelay(3000);
          });
        });
    };

    $scope.createGames = function () {
      var g = $scope.gameCount;

      function _makeGame() {
        Players.query(function (players) {
          Games.latest(function (lastGame) {
            _createGame(players, lastGame);
            --g;
            if (g > 0) {
              _makeGame();
            }
          }, function (err) {
            if (err.data.error === 'no games') {
              _createGame(players);
              --g;
              if (g > 0) {
                _makeGame();
              }
            }
          });
        });
      }

      _makeGame();
    };
  }
);
