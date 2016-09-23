angular.module 'pirhoo'
  .directive 'projects', ($rootScope)->
    restrict: 'EA'
    link: (scope, el, attrs) ->
      init = ->
        # Freeze!
        $(el).imagesLoaded()
          .progress (instance, image)->
            # Get the image parent
            container = $(image.img).parent()
            # Create grade on images
            Grade container[0] unless container.hasClass 'graded'
            # Add a class to avoid grade the image twice
            container.addClass 'graded'
            # Broadcast an event
            $rootScope.$broadcast 'images:progress', image
          .done ->
            # Broadcast an event
            $rootScope.$broadcast 'images:over'
      # Init grade when projects changed
      scope.$watch 'projects.objects.length', init
