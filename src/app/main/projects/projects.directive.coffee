angular.module 'pirhoo'
  .directive 'projects', ($timeout)->
    restrict: 'EA'
    link: (scope, el) ->
      $timeout ->
        imagesLoaded el, ->
          new Isotope el[0],
            itemSelector: '.main__projects__cascading__item'
            gutter: 0
            isHorizontal: yes
