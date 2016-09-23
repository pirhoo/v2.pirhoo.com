angular.module 'pirhoo'
  .service 'Paginator', ->
    class Paginator
      constructor: (response)->
        # Alway start at 1
        @page = 1
        # Response objects
        @response = response
        # Every objects
        @objects = if response.data? then response.data else response
        # Paginate according the orignal set size
        @limit = Math.max(1, @objects.length)
        # If no object is given, the set must be empty
        @over = @busy = @objects.length is 0
      get: (page=@page, limit=@limit)=>
        # Copy existing parameters
        params = @objects.reqParams or {}
        # And extend them with the current bounds
        params = angular.extend params, limit: limit, page: page
        # Return a closure
        (callback=angular.noop)=>
          # Use the existing object instance
          @objects.getList(params).then (response)=>
            # Every objects
            callback(response.data or response)
      # Load more object!
      next: =>
        # We are busy to load some object here...
        @busy = yes
        # Increment page
        @page = @page + 1
        # Get more object
        @get(@page, @limit) (objects)=>
          # Just add the new object
          @objects.push object for object in objects
          # We're not buzy anymore.
          # Is there any object left?
          @busy = @over = objects.length < @limit
