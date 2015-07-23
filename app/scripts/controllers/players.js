'use strict';

/**
 * @ngdoc function
 * @name lumiataFoosballApp.controller:PlayersCtrl
 * @description
 * # PlayersCtrl
 * Controller of the lumiataFoosballApp
 */
angular.module('lumiataFoosballApp')
  .controller('PlayersCtrl', function ($scope, Players, $mdDialog, lodash) {

    $scope.newPlayer = null;

    var playerId = 1;

    $scope.players = [];

    function _reload() {
      Players.query(function (players) {
        $scope.players = players;
        lodash.each(players, function(player){
          if (player.avatar){
           try {
             player.avatarImage = new Image();
             player.avatarImage.src = player.avatar;
           } catch(err){
             player.avatarImage = null;
           }
          }
        })
      });
    }

    _reload();

    $scope.resetPlayerForm = function(){
      angular.element('[name=newPlayerForm')[0].reset();
    };

    $scope.createPlayer = function () {
        $scope.resetPlayerForm();
        $scope.newPlayer = {
          name: 'new player',
          id: ++playerId
        };
    };

    $scope.createPlayer();

    $scope.purgePlayers = function () {
      Players.destroy({id: 'all'}, _reload);
    };

    $scope.addPlayer = function () {
      if ($scope.newPlayer) {
        if ($scope.newPlayer.name) {
          if ($scope.avatar){
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
              } else if (err.status === 413){
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
)
;
