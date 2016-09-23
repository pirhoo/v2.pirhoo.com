angular.module "pirhoo"
  .controller "MainCtrl", ($scope, $http, $q, Paginator)->
    $q.all({
      commits:   $http.get('assets/json/commits.json')
      projects:  $http.get('assets/json/projects.json')
      trainings: $http.get('assets/json/trainings.json')
      awards:    $http.get('assets/json/awards.json')
    }).then (hash)->
      $scope.commits   = hash.commits.data
      $scope.trainings = hash.trainings.data
      $scope.awards    = hash.awards.data
      # We use a paginator to add project slice by slice
      $scope.projects  = new Paginator hash.projects.data.slice(0, 10)
      # We override the get function that must return a closure
      $scope.projects.get = (page, limit)=>
        # The callback function if provided by the `next` function in the
        # Paginator (triggered when we need more elements)
        (callback)=>
          # Get a slice from the projects array
          slice = hash.projects.data.slice( (page - 1) * limit, (page - 1) * limit + limit )
          # Add the slice!
          callback slice

      $scope.$on 'images:over', $scope.projects.next
