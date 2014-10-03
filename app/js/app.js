(function() {

	var app = angular.module('portfolio', []);

	app.controller('JsonLoaderCtrl', ['$scope', '$http', function ($scope, $http) {

		$http.get('data/portfolio.json').success(function (data) {

			$scope.projects = data;
			console.log(data);
		});

	}]);

	app.directive('project', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/project.html'
		};
	});

}());