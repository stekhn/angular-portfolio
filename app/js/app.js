(function() {

	var app = angular.module('portfolio', []);

	app.controller('JsonLoaderCtrl', ['$http', function($http) {

		var portfolio = this;
		portfolio.projects = [];

		$http.get('../data/portfolio.json').success(function(data) {

			portfolio.projects = data;
		});

	}]);
}());

