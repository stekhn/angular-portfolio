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
			controllerAs: 'contentCtrl'
		};
	});

	app.directive('project', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/project.html',
			controller: function () {

				this.detailMode = false;
				this.currentProject = -1;
				this.getStatus = function() {
					return detailMode;
				},
				this.getCurrentProject = function () {
					return currentProject;
				},
				this.switchMode = function (clickedProject) {

					currentProject = clickedProject; 
					detailMode = true;
					console.log(detailMode, currentProject);
				};
			},
			controllerAs: 'projectCtrl'
		};
	});

	app.directive('projectList', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/project-list.html',
		};
	});

	app.directive('navigation', function () {

		return {
			restrict: 'E',
			templateUrl: 'templates/navigation.html'
		};
	});

}());