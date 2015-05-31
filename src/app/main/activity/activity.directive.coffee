angular.module 'pirhoo'
  .directive 'activity', ($http)->
    restrict: 'E'
    replace: yes
    template: '<svg class="main__activity__chart"></svg>'
    scope:
      commits: "="
    link: (scope, el) ->
      svg = d3.select el[0]
      # Available "globaly"
      width = height = 0
      heightScale = commits = null
      barWidth = 25
      barGutter = 0
      # To scale x alongside months
      older = new Date(scope.commits.older_commit.timestamp*1000)
      newer = new Date(scope.commits.newer_commit.timestamp*1000)
      # List of years
      years = ( y for y in [ older.getFullYear() .. newer.getFullYear() ] )
      # Month scale
      xscale = d3.time.scale().domain([older, newer])
      # Width of a year
      yearWidth = (y)-> xscale( new Date(y + 1, 0, 1) ) - xscale( new Date(y, 0, 1) )
      # Prepare data
      data =
        # Commits list by month must be an array
        commits: _.sortBy( _.reduce( _.keys(scope.commits.months_count), (result, month)->
          result.push
            month: new Date(month)
            count: scope.commits.months_count[month]
          result
        , []), "month")
      # Maximum count value
      commitMax = _.max(data.commits, "count").count

      # Setup chart
      init = ->
        [ width, height ] = [ (barWidth + barGutter) * (data.commits.length), el.height() ]
        # Set SVG sizes
        svg.style "width", width + "px"
        # Scale on x according to the svg with
        xscale.range([0, width - barWidth])
        # Dynamic scale
        heightScale = d3.scale.linear().domain([0, commitMax]).range([0, height])
        # Create groups
        svg = svg.append("g").attr "class", "main__activity__chart__commits"
        # Then draw
        do draw

      # Draw the rects
      draw = ->
        gradirent = svg
                      .append "defs"
                        .append "linearGradient"
                        .attr
                          id: "yeargradient"
                          x1: 0
                          x2: 0
                          y1: 0
                          y2: 1

        gradirent.append "stop"
              .attr "offset", "0%"
              .attr "stop-color", "white"
              .attr "stop-opacity", 0

        gradirent.append "stop"
              .attr "offset", "100%"
              .attr "stop-color", "white"
              .attr "stop-opacity", 0.2

        svg.selectAll "g.year"
          .data years
          .enter()
            .append "g"
            .attr "class", "year"
            .append "rect"
              .attr "x", (y)-> xscale( new Date(y, 0, 1) )
              .attr "y", 0
              .attr "width", yearWidth
              .attr "height", height

        svg.selectAll "g.year"
            .append "text"
              .attr "class", "year-label"
              .text (y)-> y
              .attr "text-anchor", "middle"
              .attr "x", (y)->
                x = xscale( new Date(y, 0, 1) ) + yearWidth(y)/2
                # Avoid label to go outside the svg
                x = Math.min width - 25, x
                x = Math.max 25, x
              .attr "y", 20

        svg.selectAll "rect.bar"
          .data data.commits
          .enter()
          .append "rect"
          .attr "class", "bar"
          .attr "x", (d)-> xscale(d.month)
          .attr "y", (d)-> height - heightScale d.count
          .attr "width", barWidth
          .attr "height", (d)-> heightScale d.count

        svg.selectAll "text.bar-label"
            .data data.commits
            .enter()
            .append "text"
            .attr "class", "bar-label"
            .attr "text-anchor", "middle"
            .attr "x", (d)->  xscale(d.month) + barWidth/2
            .attr "y", (d)-> (height - heightScale d.count) + 10
            .text (d)-> d.count


      do init
