'use strict';

/**
 * @ngdoc directive
 * @name lumiataFoosballApp.directive:avatarUpload
 * @description
 * # avatarUpload
 */
angular.module('lumiataFoosballApp')
  .directive('avatarUpload', function () {
    return {
      templateUrl : '/views/avatarUpload.html',
      restrict: 'E',
      link: function postLink(scope, element) {
        scope.interface = {};
        element.find('.avatar-file').on('change', function () {
          try {
            var file = this.files[0];
            if (file) {
              var reader = new FileReader(file);
              reader.onload = function (e) {
                element.find('.avatar-file-data').val(e.target.result);
                scope.avatar = e.target.result;
              };
              reader.readAsBinaryString(file);
            }
          } catch(err){
            console.log('can\'t read file data; must be bad api', err);
          }
        });

        var lastId = 0;
        scope.$watch('newPlayer', function(p){
          if (p && p.id !== lastId){
            element.find('.avatar.file').val('');
            element.find('.avatar-file-upload').val();
            lastId = p.id;
            // doesn't work
          }
        });
        scope.$on('$dropletReady', function whenDropletReady() {
          scope.interface.allowedExtensions(['png', 'jpg', 'bmp', 'gif']);
        });

      }
    };
  });
