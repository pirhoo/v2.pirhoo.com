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
      barGutter = 1
      # Prepare data
      data =
        # Commits list by month must be an array
        commits: _.sortBy( _.reduce( _.keys(scope.commits), (result, month)->
          console.log month
          result.push
            month: new Date(month)
            count: scope.commits[month]
          result
        , []), "month")
      # Maximum count value
      commitMax = _.max(data.commits, "count").count

      # Setup chart
      init = ->
        [ width, height ] = [ (barWidth + barGutter) * data.commits.length, el.height() ]
        # Set SVG sizes
        svg.style "width", width + "px"
        # Dynamic scale
        heightScale = d3.scale.linear().domain([0, commitMax]).range([0, height/2])
        # Create groups
        commits = svg.append("g").attr "class", "main__activity__chart__commits"

        do draw

      # Draw the rects
      draw = ->
        commits.selectAll "rect"
          .data data.commits
          .enter()
          .append "rect"
          .attr "x", (d, i)-> i * (barGutter + barWidth)
          .attr "y", (d)-> height - heightScale d.count
          .attr "width", barWidth
          .attr "height", (d)-> heightScale d.count

        commits.selectAll "text"
            .data data.commits
            .enter()
            .append "text"
            .attr "text-anchor", "middle"
            .attr "x", (d, i)-> i * (barGutter + barWidth) + barWidth/2
            .attr "y", (d)-> (height - heightScale d.count) - barGutter
            .text (d)-> d.count


      do init
