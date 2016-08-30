angular.module 'pirhoo'
  .directive 'projects', ($timeout)->
    restrict: 'EA'
    link: (scope, el) ->
      $timeout ->
        imagesLoaded el, ->
          # Create grade on images
          Grade document.querySelectorAll('.main__projects__cascading__item a')
          # Change layout
          $(el).isotope
            itemSelector: '.main__projects__cascading__item'
            # stamp: $(el).find('.main__section__panel')
            percentPosition: true
