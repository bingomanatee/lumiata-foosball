'use strict';

/**
 * @ngdoc service
 * @name lumiataFoosballApp.games
 * @description
 * # games
 * Service in the lumiataFoosballApp.
 */
angular.module('lumiataFoosballApp')
  .service('Games', function ($resource, $window) {
    var url = '/games';

    if (/lumiata-foosball.com/.test($window.location.host)) {
      url = 'http://lumiata-foosball.com:5000' + url;
    }

    return $resource(url, {id: '@id'}, {
      query: {method: 'GET', isArray: true},
      destroy: {method: 'DELETE', url: url + '/:id', params: {id: '@id'}},
      add: {method: 'POST'}
    });
  });
