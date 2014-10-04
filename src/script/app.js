(function() {

	var app = angular.module('portfolio', ['feedReader']);

	app.controller('JsonLoaderCtrl', ['$scope', '$http', function ($scope, $http) {

		$http.get('data/portfolio.json').success(function (data) {

			$scope.projects = data;
		});

	}]);


	app.directive('navigation', function () {

		return {
			restrict: 'E',
			templateUrl: 'template/navigation.html'
		};
	});


	app.directive('content', function () {
		return {

			restrict: 'A',
			templateUrl: 'template/content.html',
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
			templateUrl: 'template/projects.html',
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


	app.directive('curriculum', function () {

		return {
			restrict: 'E',
			templateUrl: 'template/curriculum.html'
		};
	});



	app.directive('contact', function () {

		return {
			restrict: 'E',
			templateUrl: 'template/contact.html'
		};
	});


	app.directive('blog', function () {

		return {
			restrict: 'E',
			templateUrl: 'template/blog.html'
		};
	});


	app.directive('imprint', function () {

		return {

			restrict: 'E',
			templateUrl: 'template/imprint.html'
		};
	});


	angular.module('feedReader', []).controller('RssFeedCtrl', ['$http', '$interval', '$scope', function ($http, $interval, $scope) {

		$scope.articles = [ ];
		$scope.rssFeed = 'http://datenkritik.de/feed/';
 

		$scope.existingArticles = function () {

			return _.find($scope.articles, function (a) {
				return !a.cleared;
			}) !== null;
		};
 

		$scope.showOrHideAll = function () {

			var markAsHide = _.every($scope.articles, function (a) {
				return a.show;
			});

			_.each($scope.articles, function (el, index, list) {
				el.show = !markAsHide;
			});
		};
 

		var hostname = (function () {

			var a = document.createElement('a');

			return function (url) {
				a.href = url;
				return a.hostname;
			};
		})();
 

		var parseEntry = function (el) {

			return {
				title	 : el.title,
				content	 : el.content || el.description,
				read		: false,
				date		: el.publishedDate || el.pubDate,
				link		: el.link,
				shortLink : hostname(el.link)
			};
		};
 

		var parseRSS = function (url) {

			return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
		};
 

		$scope.updateModel = function () {

			parseRSS($scope.rssFeed).then(function (data) {

				if (data === null) {
					return;
				}
 
				var mostRecentDate = null;

				var entries = _.map(data.data.responseData.feed.entries, function (el) {
					return parseEntry(el);
				});
 
				if (mostRecentDate !== null) {

					entries = _.filter(entries, function (el) {
						return el.date < mostRecentDate;
					});
				}
 
				$scope.articles = _.union($scope.articles, entries);

				$scope.articles = _.sortBy($scope.articles, function (el) {
					return el.date;
				});
			});
		};
 

		// update initially
		$scope.updateModel();
 
		//then update every 30 secs
		$interval(function () {

			if ($scope.rssFeedFocused) {

				$scope.updateModel();
			}
		}, 30000);

	}]);

}());