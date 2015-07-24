'use strict';

/**
 * @ngdoc function
 * @name lumiataFoosballApp.controller:PlayerticketCtrl
 * @description
 * # PlayerticketCtrl
 * Controller of the lumiataFoosballApp
 */
angular.module('lumiataFoosballApp')
  .controller('PlayerticketCtrl', function ($scope, Players, $routeParams, lodash) {
    Players.get({id: $routeParams.id}, function(player){
      $scope.player = player;
      $scope.playerid = $routeParams.id;
      console.log('playerid in PTC: ', $routeParams.id);
      lodash.each(player.games, function(g){
        g.time = new Date(g.date);
      });
    });
  });
