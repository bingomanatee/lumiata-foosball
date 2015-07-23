'use strict';

/**
 * @ngdoc service
 * @name lumiataFoosballApp.SimSize
 * @description
 * # SimSize
 * Service in the lumiataFoosballApp.
 */
angular.module('lumiataFoosballApp')
  .service('SimSize', ['EventEmitter', 'lodash', '$window', '$document', '$timeout',
    function (EventEmitter, _, $window, $document, $timeout) {

      function SimSize(elementName, debounce) {
        this.width = this.height = 0;

        this.elementName = elementName;

        var self = this;
        this._resize = debounce ?
          _.debounce(function () {
            return self.resize();
          }) :
          function () {
            return self.resize();
          };

        this.win = angular.element($window);
        this.win.on('resize', this._resize);

        $timeout(function () {
          self.resize();
        }, 0);
      }

      SimSize.prototype = Object.create(EventEmitter.prototype);

      _.extend(SimSize.prototype, {

        destroy: function () {
          this.win.off('resize', this._resize);
        },

        target: function () {
          return $document.find(this.elementName);
        },

        resize: function () {
          var parent = this.target();
          if (!parent[0]) {
            this.destroy();
          }
          var w = parent.width();
          var h = parent.height();

          if (w === this.width && h === this.height) {
            return;
          }

          this.width = w;
          this.height = h;

          this.emit('resize', _.pick(this, ['width', 'height']));
        }

      });

      return SimSize;

    }]);


