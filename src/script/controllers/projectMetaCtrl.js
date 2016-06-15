app.controller('ProjectMetaCtrl',['$scope', '$location', 'metaTags',
  function ($scope, $location, metaTags) {

  $scope.$on('projectChanged', function(event, project) {

    metaTags.setTitle(project.title);
    metaTags.setDescription(project.description);
    metaTags.setKeywords('keywords');
    metaTags.setUrl($location.absUrl());
    metaTags.setImage($location.protocol() + '://' + $location.host() +
      '/img/project/' + project.images[0]);
  });
}]);
