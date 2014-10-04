(function() {

	var app = angular.module('portfolio', []);

	app.controller('JsonLoaderCtrl', ['$scope', '$http', function ($scope, $http) {

		$http.get('data/portfolio.json').success(function (data) {

			$scope.projects = data;
		});

	}]);


	app.directive('content', function () {
		return {

			restrict: 'E',
			templateUrl: 'templates/content.html',
			controller: function () {

				this.page = 0;

				this.isSet = function (checkPage) {

					return this.page === checkPage;
				};

				this.setPage = function (activePage) {
					
					this.page = activePage;
				};
			},
			controllerAs: 'ContentCtrl'
		};
	});


	app.directive('projects', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/projects.html',
			controller: function () {

				var self = this;
				self.detailMode = false;
				self.currentProject = -1;

				this.setMode = function (clickedProject) {

					self.detailMode = clickedProject != -1;
					self.currentProject = clickedProject;
				};
			},
			controllerAs: 'ProjectsCtrl'
		};
	});


	app.directive('navigation', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/navigation.html'
		};
	});
	

}());