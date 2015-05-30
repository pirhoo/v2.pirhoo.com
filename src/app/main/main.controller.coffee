angular.module "pirhoo"
  .controller "MainCtrl", ($scope, $http, $q)->
    $q.all({
      commits:   $http.get('assets/json/commits.json')
      projects:  $http.get('assets/json/projects.json')
      trainings: $http.get('assets/json/trainings.json')
      awards:    $http.get('assets/json/awards.json')
    }).then (hash)->
      $scope.commits   = hash.commits.data
      $scope.projects  = hash.projects.data
      $scope.trainings = hash.trainings.data
      $scope.awards    = hash.awards.data

