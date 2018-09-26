app.factory('jsonLoader', ['$http', function ($http) {

  return {

    getData: function() {

      return $http.get('data/data.json')
        .then(function (data) {

          return data;
        });
    }
  };
}]);
