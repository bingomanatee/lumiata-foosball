'use strict';

/**
 * @ngdoc function
 * @name lumiataFoosballApp.controller:PlayersCtrl
 * @description
 * # PlayersCtrl
 * Controller of the lumiataFoosballApp
 */
angular.module('lumiataFoosballApp')
  .controller('PlayersCtrl', function ($scope, Players, $mdDialog, lodash, $timeout) {

    $scope.newPlayer = null;

    var playerId = 1;

    $scope.players = [];

    function _reload() {
      Players.query(function (players) {
        $scope.players = players;
        lodash.each(players, function (player) {
          if (player.avatar) {
            try {
              player.avatarImage = new Image();
              player.avatarImage.src = player.avatar;
            } catch (err) {
              player.avatarImage = null;
            }
          }
        });
      });
    }

    _reload();

    $scope.resetPlayerForm = function () {
      var form = angular.element('[name=newPlayerForm')[0];
      if (form) {
        form.reset();
      }
    };

    function __updateMulti() {
      if (!$scope.playersText) {
         $scope.multiPlayers = [];
        return;
      }
      var lines = $scope.playersText.split("\n");
      $scope.multiPlayers = lodash(lines).map(
        function (line) {
          return line.split(',');
        })
        .flatten()
        .map(lodash.trim)
        .select(function (name) {
          return /^[ \w]+$/.test(name);
        })
        .compact()
        .uniq()
        .value();

    }

    var _updatePlayers = lodash.debounce(__updateMulti, 1200);

    $scope.$watch('playersText', _updatePlayers);

    $scope.addPlayers = function () {
      __updateMulti();

      $timeout(function () {
        $mdDialog.show(
          $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Create multiple players')
            .content('Create ' + $scope.multiPlayers.length + ' players?')
            .ok('Yes')
            .cancel('Cancel')
        ).then(function () {
            Players.addMany({names: $scope.multiPlayers}, _reload);
          });
      }, 1500);
    };

    $scope.destroyPlayers = function () {
        $mdDialog.show(
          $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Destroy ALL PLAYERS AND GAMES')
            .content('Destroy ALL players and their games')
            .ok('BRING IT ALL DOWN')
            .cancel('Cancel')
        ).then(function () {
            Players.destroy({}, _reload);
          });
    };

    $scope.createPlayer = function () {
      $scope.resetPlayerForm();
      $scope.newPlayer = {
        name: '',
        id: ++playerId
      };
    };

    $scope.updatePlayersText = _updatePlayers;

    $scope.playersText = '';

    $scope.createPlayer();

    $scope.addPlayer = function () {
      if ($scope.newPlayer) {
        if ($scope.newPlayer.name) {
          if ($scope.avatar) {
            $scope.newPlayer.avatar = $scope.avatar;
          }
          Players.save($scope.newPlayer, _reload,
            function (err) {
              if (err.status === 409) {
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Duplicate Record')
                    .content('There is already a user by the name of "' + err.data.name + '".')
                    .ok('Thanks')
                );
              } else if (err.status === 413) {
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Icon too big')
                    .content('Please use a smaller avatar image.')
                    .ok('Thanks')
                );
              }
            });
          $scope.createPlayer();
        }
      }
    };

  }
);
