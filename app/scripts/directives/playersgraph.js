'use strict';

/**
 * @ngdoc directive
 * @name lumiataFoosballApp.directive:playersGraph
 * @description
 * # playersGraph
 */
angular.module('lumiataFoosballApp')
  .directive('playersGraph', function (Players, lodash, amMoment) {

    var _color = lodash.template('rgb(<%= r %>,<%= g %>, <%= b %>)');
    var DEFAULT_OPACITY = 0.25;
    var EASE_OUT_TIME = 800;
    var EASE_IN_TIME = 250;
    var DEFAULT_WIDTH = 2;
    var HOVER_WIDTH = 6;

    function _range(n, min, max) {
      var scope = max - min;
      n -= min;
      n *= 255 / scope;
      return Math.floor(n);
    }

    function _playerMaxRank(player) {
      return lodash(player.games)
        .reduce(function (rank, game) {
          return Math.max(rank, game.oldRank, game.newRank);
        }, 0);
    }

    function _playerMinRank(player) {
      return lodash(player.games)
        .reduce(function (rank, game) {
          return Math.min(rank, game.oldRank, game.newRank);
        }, 2000);
    }

    function _stringToColor(string) {
      var fc = string.charCodeAt(0) % 255;
      var mc = string.charCodeAt(string.length - 1) % 255;
      var lc = string.charCodeAt(Math.round(string.length / 2)) % 255;
      var minColor = Math.min(fc, mc, lc);
      var maxColor = Math.max(fc, mc, lc);
      fc = _range(fc, minColor, maxColor);
      mc = _range(mc, minColor, maxColor);
      lc = _range(lc, minColor, maxColor);

      var key = {
        r: (fc),
        g: (mc),
        b: (lc)
      };
      return _color(key);
    }

    return {
      templateUrl: '/views/playersGraph.html',
      restrict: 'E',
      scope: {
        width: '=',
        height: '=',
        sizer: '='
      },

      link: function postLink(scope, element) {
        scope.element = element;

        var _curves = {};
        var _currentPlayer = null;
        var _animationStates = {};
        var paper;

        function _initRegistry() {

          _curves = {};
          _currentPlayer = null;
          _animationStates = {};
        }

        _initRegistry();

        function _fadeOut(name) {
          if (!_curves[name]) {
            return;
          }

          _curves[name].animate({
            'stroke-opacity': DEFAULT_OPACITY,
            'stroke-width': DEFAULT_WIDTH
          }, EASE_OUT_TIME, '<>', function () {
            if (_animationStates[name] === 'fading in') {
              _animationStates[name] = 'hidden';
            }
          });

          _animationStates[name] = 'fading out';
        }

        scope.hover = function (player, closing) {
          if (closing) {
            _fadeOut(player.name);
            if (_currentPlayer.name === player.name) {
              _currentPlayer = null;
            }
          } else {
            if (_currentPlayer && _currentPlayer.name !== player.name) {
              _fadeOut(_currentPlayer.name);
            }
            if (!player.games.length || !_curves[player.name]) {
              return;
            }
            _currentPlayer = player;
            _animationStates[player.name] = 'fading in';

            _curves[player.name].animate({
              'stroke-opacity': 1,
              'stroke-width': HOVER_WIDTH
            }, EASE_IN_TIME, '<>', function () {
              if (_animationStates[player.name] === 'fading in') {
                _animationStates[player.name] = 'live';
              }
            });

          }
        };

        function _redrawGraph() {
          if (!(scope.width && scope.height)) {
            return;
          }

          Players.query(function (players) {
            scope.players = players;

            lodash.each(players,
              function (player) {
                player.color = player.games.length ? _stringToColor(player.name) : 'rgb(150, 150, 150)';
              });

            var dates = lodash(players)
              .map(function (player) {
                return lodash(player.games)
                  .pluck('date')
                  .value();
              })
              .flatten()
              .map(function (date) {
                return amMoment.preprocessDate(date).toDate();
              })
              .value();

            var times = lodash(dates)
              .map(function (date) {
                return date.getTime();
              });
            var minTime = times.reduce(function (out, value) {
              if (lodash.isNull(out)) {
                return value;
              }
              return Math.min(out, value);
            });

            var maxTime = times.reduce(function (out, value) {
              if (lodash.isNull(out)) {
                return value;
              }
              return Math.max(out, value);
            });

            scope.startDate = new Date(minTime);
            scope.endDate = new Date(maxTime);

            var timeRange = maxTime - minTime;
            var timeScale = scope.width / timeRange;

            _initRegistry();
            if (paper) {
              paper.clear();
            }
            element.find('.graph-frame__graph').empty();
            var raphael = Raphael;

            paper = raphael(element.find('.graph-frame__graph')[0], scope.width, scope.height);
            var back = paper.rect(0, 0, scope.width, scope.height);
            back.attr('fill', 'black');
            back.attr('stroke', 'grey');

            var maxRank = lodash(players)
              .reduce(function (rank, player) {
                return Math.max(rank, _playerMaxRank(player));
              }, 0);

            var minRank = lodash(players)
              .reduce(function (rank, player) {
                return Math.min(rank, _playerMinRank(player));
              }, 2000);

            maxRank = Math.ceil(maxRank / 100) * 100;
            minRank = Math.floor(minRank / 100) * 100;

            var rankRange = maxRank - minRank;
            var rankRatio = scope.height / rankRange;

            function _yValue(y) {
              return Math.round((scope.height - (y - minRank) * rankRatio));
            }

            var path = 'M0,' + _yValue(1200) + 'L' + scope.width + ',' + _yValue(1200);
            var equator = paper.path(path);
            var south = paper.rect(0, _yValue(1200), scope.width, scope.height - _yValue(1200));
            south.attr({'fill': 'rgba(250, 250,255, 0.125)'});
            equator.attr({
              stroke: 'rgb(255,0,0)',
              'stroke-width': 1,
              'stroke-linecap': 'round'
            });

            lodash.each(players, function (player) {
              if (player.games.length < 1) {
                return;
              }

              var path = lodash.reduce(player.games, function (path, game) {
                var time = amMoment.preprocessDate(game.date).toDate().getTime();
                var dTime = time - minTime;

                var x = Math.round(dTime * timeScale);
                var y1 = _yValue(game.oldRank);
                var y2 = _yValue(game.newRank);
                return path + 'L' + x + ',' + y1 + 'L' + x + ',' + y2;
              }, 'M0,' + Math.round((maxRank - 1200) * rankRatio));

              var curve = paper.path(path);
              curve.attr({'stroke': player.color, 'stroke-width': DEFAULT_WIDTH, 'stroke-opacity': DEFAULT_OPACITY});
              _curves[player.name] = curve;
            });
          });
        }

        _redrawGraph();

        var _debouncedRedrawGraph = lodash.debounce(_redrawGraph, 1000);

        scope.$watch('sizer', function (sizer) {
          if (sizer) {
            sizer.on('resize', _debouncedRedrawGraph);
          }
        });

      }
    };
  });
