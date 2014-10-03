(function() {

	var app = angular.module('portfolio', []);

	app.controller('JsonLoaderCtrl', ['$scope', '$http', function ($scope, $http) {

		$http.get('data/portfolio.json').success(function (data) {

			$scope.projects = data;
			console.log(data);
		});

	}]);

	app.directive("content", function() {
		return {
			restrict: "E",
			templateUrl: "templates/content.html",
			controller: function() {
				this.tab = 1;
				this.isSet = function(checkTab) {
					return this.tab === checkTab;
				};
				this.setTab = function(activeTab) {
					this.tab = activeTab;
				};
			},
			controllerAs: "tab"
		};
	});

	app.directive('project', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/project.html'
		};
	});

	app.directive('projectList', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/project-list.html'
		};
	});

}());