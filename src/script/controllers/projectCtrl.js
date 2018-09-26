app.controller('ProjectCtrl', ['$scope', '$routeParams', '$filter', 'jsonLoader',
  function ($scope, $routeParams, $filter, jsonLoader) {

    if ($scope.projects) {

      setProject();
    } else {

      jsonLoader.getData().then(function(data) {

        $scope.projects = data.data.projects;

        setProject();
      });
    }

    function setProject() {

      for (var key in $scope.projects) {

        var dashCaseTitle = $filter('dashcase')($scope.projects[key].title);

        if ($routeParams.name === dashCaseTitle) {

          $scope.project = $scope.projects[key];
          $scope.$emit('projectChanged', $scope.project);
        }
      }
    }
  }
]);
