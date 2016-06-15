app.factory('jsonLoader', ['$http', function ($http) {

  return {

    getData: function() {

      var promise = $http.get('data/data.json');

      promise.success(function (data) {

        return data;
      });

      return promise;
    }
  };
}]);
