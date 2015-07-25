'use strict';

/**
 * @ngdoc service
 * @name lumiataFoosballApp.games
 * @description
 * # games
 * Service in the lumiataFoosballApp.
 */
angular.module('lumiataFoosballApp')
  .service('Games', function ($resource, $window, lodash, amMoment) {
    var url = '/games';

    if (/lumiata-foosball.com/.test($window.location.host)) {
      url = 'http://lumiata-foosball.com:5000' + url;
    }

    function _addTime(game) {
      if (!game) {
        return null;
      }

      if (game.date) {
        game.time = amMoment.preprocessDate(game.date).toDate();
      } else {
        game.time = null;
      }

      return game;
    }

    function _transformGames(isArray) {
      if (isArray) {
        return function (body) {
          var data = JSON.parse(body);
          return lodash.map(data, _addTime);
        };
      } else {
        return function (body) {

          var data = JSON.parse(body);
          return _addTime(data);
        };
      }
    }

    return $resource(url, {id: '@id'}, {
      get: {method: 'GET', url: url + '/:id', transformResponse: _transformGames()},
      query: {method: 'GET', isArray: true, transformResponse: _transformGames(true)},
      destroy: {method: 'DELETE', url: url + '/all'},
      add: {method: 'POST'},
      latest: {method: 'GET', url: url + '/latest', transformResponse: _transformGames()},
      screwWithTime: {method: 'POST', url: url + '/screwWithTime', transformResponse: _transformGames()}
    });
  });
