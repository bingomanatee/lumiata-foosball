'use strict';

/**
 * @ngdoc directive
 * @name lumiataFoosballApp.directive:foosballTable
 * @description
 * # foosballTable
 */
angular.module('lumiataFoosballApp')
  .directive('foosballTable', function (SimSize, Games, lodash, $mdToast) {
    return {
      templateUrl: '/views/foosballTable.html',
      restrict: 'E',
      link: function postLink($scope, element) {

        function _slots(){
          return [
            {number: 1, player: '(none)'},
            {number: 2, player: '(none)'},
            {number: 3, player: '(none)'}];
        }

        $scope.topSlots = _slots();
        $scope.bottomSlots = _slots();
        $scope.$applyAsync(function () {
          var ss = new SimSize('.view-frame');

          ss.on('resize', function (size) {
            element.find('.foosball-frame')
              .css('width', size.width + 'px')
              .css('height', size.height + 'px');
          });
        });

        $scope.saveGame = function(){

          Games.add({
            team1: lodash.pluck($scope.topSlots, 'player'),
            team2: lodash.pluck($scope.bottomSlots, 'player'),
            winner: $scope.winningTeamNumber
          }, function(){
            $mdToast.show(
              $mdToast.simple()
                .content('Game Saved!')
                .position('top right')
                .hideDelay(3000)
            );
          });

          $scope.topSlots = _slots();
          $scope.bottomSlots = _slots();
          $scope.selectTeam(0);
        };

        $scope.winClass = function(n){
          if ($scope.winningTeamNumber) {
            if ($scope.winningTeamNumber === n) {
              return 'selected';
            } else {
              return 'unselected';
            }
          } else {
            return '';
          }

        };
        $scope.winClass1 = 'default';
        $scope.winClass2 = 'default';

        $scope.selectTeam = function (n) {
          if (n === $scope.winningTeamNumber) {
            $scope.winningTeamNumber = 0;
            $scope.winClass1 = $scope.winClass2 = '';
          } else {
            $scope.winningTeamNumber = n;
            $scope.winClass1 = (n === 1) ? 'selected': 'unselected';
            $scope.winClass2 = (n === 2) ? 'selected': 'unselected';
          }
        };
      }
    };
  });
