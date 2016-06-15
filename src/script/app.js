var app = angular.module('portfolio', ['ngRoute', 'feedReader']);

app.run(['$rootScope', 'metaTags', 'jsonLoader',
  function ($rootScope, metaTags, jsonLoader) {

  $rootScope.meta = metaTags;

  jsonLoader.getData().then(function (data) {

    $rootScope.projects = data.data.projects;
    $rootScope.metadata = data.data.metadata;
  });
}]);
