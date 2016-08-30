angular.module 'pirhoo'
  .directive 'activity', ($http)->
    restrict: 'E'
    replace: yes
    template: '<svg class="main__activity__chart"></svg>'
    scope:
      commits: "="
    link: (scope, el) ->
      svg = d3.select el[0]
      # Build tooltips function
      tip = d3.tip().attr('class', 'd3-tip').html (d)->
        # Tooltips content
        months[ d.month.getMonth() ] + " " + d.month.getFullYear() + ": <strong>" + d.count + " commits</strong><br />on " + _.keys(d.repositories).length + " project(s)"
      svg.call tip
      # Available "globaly"
      width = height = 0
      padding = 10
      heightScale = commits = null
      barWidth = 20
      barGutter = 5
      # English months
      months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"]
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
            count: scope.commits.months_count[month].count
            repositories: scope.commits.months_count[month].repositories
          result
        , []), "month")
      # Maximum count value
      commitMax = _.max(data.commits, "count").count

      line = d3.svg.line()
        .x( (d)-> xscale d.month )
        .y( (d)-> heightScale d.count )
      # Setup chart
      init = ->
        [ width, height ] = [ (barWidth + barGutter) * (data.commits.length), el.height() - padding * 2]
        # Set SVG sizes
        svg.style "width", width + "px"
        # Scale on x according to the svg with
        xscale.range([padding * 2, width - barWidth - padding])
        # Dynamic scale
        heightScale = d3.scale.linear().domain([0, commitMax]).range([height - padding, padding])
        # Create groups
        svg = svg.append("g").attr "class", "main__activity__chart__commits"
        # Then draw
        do draw

      # Draw the rects
      draw = ->
        svg.selectAll "g.year"
          .data years
          .enter()
            .append "g"
            .attr "class", "year"
            .append "rect"
              .attr "x", (y)-> xscale( new Date(y, 0, 1) )
              .attr "y", 0
              .attr "width", yearWidth
              .attr "height", height + padding * 2

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

        svg.append("path")
          .datum data.commits
          .attr "class", "line"
          .attr "d", line

        svg.selectAll "circle.dot"
            .data data.commits
            .enter()
            .append "circle"
            .attr "class", "dot"
            .attr "cx", (d)->  xscale(d.month)
            .attr "cy", (d)-> heightScale(d.count)
            .attr "r", 3
            .on 'mouseover', tip.show
            .on 'mouseout', tip.hide

        svg.selectAll "text.bar-label"
            .data data.commits
            .enter()
            .append "text"
            .attr "class", "bar-label"
            .attr "text-anchor", "left"
            .attr "x", (d)->  xscale(d.month) + 6
            .attr "y", (d)-> heightScale(d.count) + 3
            .text (d)-> if heightScale(d.count) >= 25 then d.count else ''


      do init
