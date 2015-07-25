'use strict';

/**
 * @ngdoc directive
 * @name lumiataFoosballApp.directive:playerGraph
 * @description
 * # playerGraph
 */
angular.module('lumiataFoosballApp')
  .directive('playerGraph', function (Players, lodash) {
    return {
      template: '<div></div>',
      restrict: 'E',
      scope: {
        playerid: '=',
        width: '=',
        height: '='
      },

      link: function postLink(scope, element) {
        scope.element = element;
        scope.$watch('playerid', function (pid) {
          if (pid) {
            Players.get({id: pid}, function (player) {
              var raphael = Raphael;
              var paper = raphael(element[0], scope.width, scope.height);
              var back = paper.rect(0, 0, scope.width, scope.height);
              back.attr('fill', 'black');
              back.attr('stroke', 'grey');

              if (!player.games.length) {
                return;
              }

              var maxRank = lodash.reduce(player.games, function (max, game) {
                return Math.max(max, game.newRank);
              }, 0);
              maxRank = Math.ceil(maxRank/100) * 100;
              var rankRatio = scope.height / maxRank;

              var path = lodash.reduce(player.games, function (path, game, i) {
                var x = Math.round(i * scope.width / player.games.length);
                var y = Math.round((maxRank - game.newRank) * rankRatio);
                return path + 'L' + x + ',' + y;
              }, 'M0,' + Math.round((maxRank - 1200) * rankRatio));

              var curve = paper.path(path);
              curve.attr({'stroke': 'white'});
              curve.attr({'stroke-width': 4});
            });
          }
        });
      }
    };
  });
