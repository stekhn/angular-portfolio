app.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('!');

    $routeProvider
      .when('/', {
        templateUrl: 'template/project-list.html',
        controller: 'MetaCtrl'
      })

      .when('/project/:name', {
        templateUrl: 'template/project.html',
        controller: 'ProjectMetaCtrl'
      })

      .when('/curriculum', {
        templateUrl: 'template/curriculum.html',
        controller: 'MetaCtrl'
      })

      .when('/contact', {
        templateUrl: 'template/contact.html',
        controller: 'MetaCtrl'
      })

      .when('/blog', {
        templateUrl: 'template/blog.html',
        controller: 'MetaCtrl'
      })

      .when('/imprint', {
        templateUrl: 'template/imprint.html',
        controller: 'MetaCtrl'
      })

      .when('/project', {
        templateUrl: 'template/project.html',
        controller: 'MetaCtrl'})

      .otherwise('/', {
        templateUrl: 'template/project-list.html',
        controller: 'MetaCtrl'
      });
  }
]);
