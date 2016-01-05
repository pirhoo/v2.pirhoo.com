angular.module "pirhoo"
  .directive "main", ($timeout)->
    restrict: 'EAC'
    link: (scope, el)->
      new class Main
        constructor: ->
          # Wait for the dom to be rendered
          $timeout =>
            # Select elements
            do @ui
            # Create animationFrame object
            @animationFrame = new AnimationFrame
            # Bind request on AnimationFrame or Scroll
            do @bind
          , 700
        ui: =>
          @sections = el.find(".main__section:not(:last)")
        bind: =>
          if do @useFrame
            @animationId = @animationFrame.request @raf
          else
            $(window).on 'scroll', @raf
        useFrame: => 'ontouchstart' in window
        raf: (time)=>
          scrollTop = do $(window).scrollTop
          windowHeight = do $(window).height
          @sections.each ->
            section = $(@)
            # Collection metrics
            sectionHeight = section.height()
            sectionTop = section.offset().top
            # Calcultate delta position
            delta = (scrollTop  - (windowHeight * 0.3) - sectionTop) / sectionHeight
            # Always between 0 and 1
            delta = Math.max(0, Math.min(1, delta) )
            # Calcuulate the new scale (from .5 to 1)
            scale = 1 - .5 * delta
            y = windowHeight - (windowHeight * scale) + 'px'
            # Scale down the section according to the delta
            section.find('.wrapper').css
              transform: 'translateY(' + y + ') '
              opacity: 1 - delta
          # Rebind event when using frame
          do @bind if do @useFrame
