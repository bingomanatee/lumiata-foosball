'use strict';

/**
 * @ngdoc function
 * @name lumiataFoosballApp.controller:PlayersCtrl
 * @description
 * # PlayersCtrl
 * Controller of the lumiataFoosballApp
 */
angular.module('lumiataFoosballApp')
  .controller('PlayersCtrl', function ($scope, Players, $mdDialog) {

    $scope.newPlayer = null;

    $scope.players = [];

    function _reload() {
      Players.query(function (players) {
        $scope.players = players;
      });
    }

    _reload();

    $scope.createPlayer = function () {
      if (!$scope.newPlayer) {
        $scope.newPlayer = {
          name: 'new player'
        };
      }
    };

    $scope.purgePlayers = function () {
      Players.destroy({id: 'all'}, _reload);
    };

    $scope.addPlayer = function () {
      if ($scope.newPlayer) {
        if ($scope.newPlayer.name) {
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
              }
            });
          $scope.newPlayer = null;
        }
      }
    };

  });
