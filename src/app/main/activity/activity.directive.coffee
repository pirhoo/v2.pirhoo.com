angular.module 'pirhoo'
  .directive 'activity', ->
    restrict: 'E'
    link: (scope, el) ->

      visibleMonths = 12
      start = new Date()
      start.setMonth start.getMonth() - (visibleMonths-1)
      cal = new CalHeatMap

      cal.init
        itemSelector: el[0]
        domain: 'month'
        range: visibleMonths
        start: start
        cellSize: 10
        cellPadding: 2
        itemName: "commit"
        tooltip: yes
        data: 'assets/json/activity.json'
        displayLegend: no
        legend: [5, 10, 20, 30]
        legendColors: ['#F5AFBA', '#B12037']
