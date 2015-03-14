angular.module 'pirhoo'
  .directive 'activity', ($http)->
    restrict: 'E'
    link: (scope, el) ->
