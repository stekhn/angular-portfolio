app.controller('MetaCtrl', ['$rootScope', '$location', 'metaTags', 'jsonLoader',
  function ($rootScope, $location, metaTags, jsonLoader) {

  // @TODO Get data from Meta service an save them to the current scope
  if ($rootScope.metadata) {

    setMeta($rootScope.metadata);
  } else {

    jsonLoader.getData().then(function (data) {

      $rootScope.metadata = data.data.metadata;

      setMeta();
    });
  }

  function setMeta() {

    var data = $rootScope.metadata;
    var metadata = data[$location.url()] || data['/'];

    metaTags.setTitle(metadata.title);
    metaTags.setDescription(metadata.description);
    metaTags.setKeywords(metadata.keywords);
    metaTags.setUrl($location.absUrl());
    metaTags.setImage(metadata.image);
  }
}]);
