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

        function _slots() {
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

        //@TODO: make game a self contained class

        //@TODO: use saveable to block saving game at controller

        function _hasPlayer(slots) {
          return lodash.reject(slots, function (slot) {
            return slot.player === '(none)';
          }).length;
        }

        function _watchSlots() {
          var slots = $scope.topSlots.concat($scope.bottomSlots);
          var groups = lodash.groupBy(slots, function (p) {
            return p.player;
          });

          lodash.each(groups, function (items, key) {
            groups[key] = items.length;
          });

          $scope.saveable = _hasPlayer($scope.topSlots) && _hasPlayer($scope.bottomSlots);
          lodash.each(slots, function (slot) {
            if (slot.player === '(none)') {
              return;
            }
            var count = groups[slot.player];

            if (count === 1) {
              if (slot.duplicate) {
                slot.duplicate = false;
              }
            } else {
              $scope.saveable = false;
              if (!slot.duplicate) {
                slot.duplicate = true;
              }
            }
          });

        }

        $scope.updateGame = _watchSlots;

        $scope.$watch('topSlots[0].player', _watchSlots('top'));
        $scope.$watch('topSlots[1].player', _watchSlots('top'));
        $scope.$watch('topSlots[2].player', _watchSlots('top'));
        $scope.$watch('bottomSlots[0].player', _watchSlots('bottom'));
        $scope.$watch('bottomSlots[1].player', _watchSlots('bottom'));
        $scope.$watch('bottomSlots[2].player', _watchSlots('bottom'));

        $scope.saveGame = function () {

          Games.add({
            team1: lodash.pluck($scope.topSlots, 'player'),
            team2: lodash.pluck($scope.bottomSlots, 'player'),
            winner: $scope.winningTeamNumber
          }, function () {
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

        $scope.winClass = function (n) {
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
            $scope.winClass1 = (n === 1) ? 'selected' : 'unselected';
            $scope.winClass2 = (n === 2) ? 'selected' : 'unselected';
          }
        };
      }
    };
  });
