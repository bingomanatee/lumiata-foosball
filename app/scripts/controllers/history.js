'use strict';

/**
 * @ngdoc function
 * @name lumiataFoosballApp.controller:HistoryCtrl
 * @description
 * # HistoryCtrl
 * Controller of the lumiataFoosballApp
 */
angular.module('lumiataFoosballApp')
  .controller('HistoryCtrl', function ($scope, Games, $mdDialog) {

    Games.query(function (games) {
      $scope.games = games;
    });

    $scope.destroyGames = function () {
      $mdDialog.show(
        $mdDialog.confirm()
          .parent(angular.element(document.body))
          .title('Duplicate Record')
          .content('Remove ALL the games?')
          .ok('Cleanse the games')
          .cancel('God no!')
      ).then(function () {
          Games.destroy(function () {
            Games.query(function (games) {
              $scope.games = games;
            });
          });
        });
    };

  });
