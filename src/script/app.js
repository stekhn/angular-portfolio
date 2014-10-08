(function() {

	var app = angular.module('portfolio', ['ngRoute', 'feedReader', 'toDashCase']);

	app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when("/", {templateUrl: "template/portfolio.html"})
			.when("/project/:name", {templateUrl: "template/project.html", controller: "ProjectCtrl"})
			.when("/curriculum", {templateUrl: "template/curriculum.html"})
			.when("/contact", {templateUrl: "template/contact.html"})
			.when("/blog", {templateUrl: "template/blog.html", controller: "RssFeedCtrl"})
			.when("/imprint", {templateUrl: "template/imprint.html"})
			.when("/project", {templateUrl: "template/project.html"})
			.otherwise("/404", {templateUrl: "template/portfolio.html"});
	}]);

	app.controller('JsonLoaderCtrl', ['$scope', '$http', function ($scope, $http) {

		$http.get('data/portfolio.json').success(function (data) {

			$scope.projects = data;
		});

	}]);

	app.controller('NavCtrl', function($scope, $location) {

		$scope.isActive = function(route) {
	        return route === $location.path();
	    };
	});

	app.controller('ProjectCtrl', function ($scope, $routeParams) {

		var current;

		for (var key in $scope.projects) {

			var dashcaseTitle = $scope.projects[key].title.replace(/\s+/g, '-').toLowerCase();

			if ($routeParams.name === dashcaseTitle) {
				current = key;
			}
		}
		
		$scope.project = $scope.projects[current];
	});

	angular.module('toDashCase', []).filter('dashcase', function() {
		return function(input) {
			return input.replace(/\s+/g, '-').toLowerCase();
		};
	});

	angular.module('feedReader', []).controller('RssFeedCtrl', ['$http', '$interval', '$scope', '$sce', function ($http, $interval, $scope, $sce) {

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

			$scope.html = el.content;
			$scope.trustedHtml = $sce.trustAsHtml($scope.html);

			return {
				title: el.title,
				content: $scope.trustedHtml,
				read: false,
				date: el.publishedDate || el.pubDate,
				link: el.link,
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

	}]);

}());