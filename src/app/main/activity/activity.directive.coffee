angular.module 'pirhoo'
  .directive 'activity', ->
    restrict: 'E'
    link: (scope, el) ->
      scope.visibleRange = 24
      scope.cals = Array(scope.visibleRange)
      # For each cal
      for cal, idx in scope.cals
        cal   = new CalHeatMap
        start = new Date()
        start.setYear start.getFullYear() - (scope.visibleRange/12)
        start.setMonth start.getMonth() + idx
        cal.init
          itemSelector: el[0]
          domain: "month"
          domainMargin: [0, 10, 0, 0]
          subDomain: "day"
          range: 1
          start: start
          cellSize: 10
          cellPadding: 2
          itemName: "commit"
          tooltip: no
          data: 'assets/json/activity.json'
          domainDynamicDimension: no
          displayLegend: no
          domainLabelFormat: "%b. %Y"
          legend: [5, 10, 20, 30]
          legendColors: ['#F5AFBA', '#B12037']
