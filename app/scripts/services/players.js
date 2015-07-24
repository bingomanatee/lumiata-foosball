'use strict';

/**
 * @ngdoc service
 * @name lumiataFoosballApp.players
 * @description
 * # players
 * Service in the lumiataFoosballApp.
 */
angular.module('lumiataFoosballApp')
  .service('Players', function ($resource, $window) {
    var url = '/players';

    if (/lumiata-foosball.com/.test($window.location.host)) {
      url = 'http://lumiata-foosball.com:5000' + url;
    }

    return $resource(url, {id: '@id'}, {
      query: {method: 'GET', isArray: true},
      get: {method: 'GET', url:url + '/:id', params: {id: '@id'}},
      destroy: {method: 'DELETE', url: url + '/:id', params: {id: '@id'}}
    });

  });
