(function() {

	var app = angular.module('portfolio', ['ngRoute', 'feedReader']);

	app.config(['$routeProvider', '$locationProvider',
		function ($routeProvider, $locationProvider) {

		$locationProvider.hashPrefix('!');

		$routeProvider
			.when("/", {
				templateUrl: "template/project-list.html",
				controller: "MainMetaCtrl",
			})

			.when("/project/:name", {
				templateUrl: "template/project.html",
				controller: "ProjectMetaCtrl"
			})

			.when("/curriculum", {
				templateUrl: "template/curriculum.html",
				controller: "MainMetaCtrl"
			})

			.when("/contact", {
				templateUrl: "template/contact.html",
				controller: "MainMetaCtrl"
			})

			.when("/blog", {
				templateUrl: "template/blog.html",
				controller: "MainMetaCtrl"
			})

			.when("/imprint", {
				templateUrl: "template/imprint.html",
				controller: "MainMetaCtrl"
			})

			.when("/project", {
				templateUrl: "template/project.html",
				controller: "MainMetaCtrl"})

			.otherwise("/", {
				templateUrl: "template/project-list.html",
				controller: "MainMetaCtrl"
			});
	}]);

	app.run(['$rootScope', 'Meta', 'JsonLoader',
		function ($rootScope, Meta, JsonLoader) {

		$rootScope.Meta = Meta;

		JsonLoader.getData().then(function(data) {

			$rootScope.projects = data.data.projects;
			$rootScope.metadata = data.data.metadata;
		});

		$rootScope.loading = false;

		$rootScope.$on('$routeChangeStart', function () {

			$rootScope.loading = true;
		});

		$rootScope.$on('$routeChangeSuccess', function(e, curr, prev) { 

			$rootScope.loading = false;
		});

		$rootScope.$on('$routeChangeError', function () {

			$rootScope.loading = false;
		});
	}]);

	app.factory('JsonLoader', ['$http', function ($http) {

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

	// @TODO Make this a service
	app.factory('Meta', function () {

		// @TODO move this somewhere else
		var title = "Steffen Kühne – Journalismus; Code & Design";
		var description = "Konzeption; Beratung und Umsetzung von Projekten im Bereich Datenjournalismus; Visualisierung; interaktive Grafik und Webentwicklung in München.";
		var keywords = "Datenjournalismus; Datenvisualisierung; interaktive Grafik; Storytelling; Innovation; Online-Journalismus; Webentwicklung; Datenkritik; Steffen Kühne; München";
		var url = "http://stekhn.de";
		var image = "http://stekhn.de/preview.jpg";

		return {

			title: function() { return title; },
			setTitle: function(newTitle) { title = newTitle; },

			description: function() { return description; },
			setDescription: function(newDescription) { description = newDescription; },

			keywords: function() { return keywords; },
			setKeywords: function(newKeywords) { keywords = newKeywords; },

			url: function() { return url; },
			setUrl: function(newUrl) { url = newUrl; },

			image: function() { return image; },
			setImage: function(newImage) { image = newImage; }
		};
	});

	// @TODO Get data from Meta service an save them to the current scope 
	app.controller('MainMetaCtrl', ['$rootScope', '$location', 'Meta', 'JsonLoader',
		function ($rootScope, $location, Meta, JsonLoader) {

		if ($rootScope.metadata) {

			setMeta();
		} else {

			JsonLoader.getData().then(function(data) {

				$rootScope.metadata = data.data.metadata;

				setMeta();
			});
		}

		function setMeta() {

			var data = $rootScope.metadata;
			var metadata = data[$location.url()] || data['/'];

			Meta.setTitle(metadata.title);
			Meta.setDescription(metadata.description);
			Meta.setKeywords(metadata.keywords);
			Meta.setUrl($location.absUrl());
			Meta.setImage(metadata.image);
		}
	}]);

	app.controller('ProjectMetaCtrl',['$scope', '$location', 'Meta',
		function ($scope, $location, Meta, Data) {

		$scope.$on('projectChanged', function(event, project) {

			Meta.setTitle(project.title);
			Meta.setDescription(project.description);
			Meta.setKeywords('keywords');
			Meta.setUrl($location.absUrl());
			Meta.setImage($location.protocol() + '://' + $location.host() +
				'/img/project/' + project.images[0]);
		});
	}]);

	app.controller('NavCtrl', ['$scope', '$location',
		function ($scope, $location) {

		$scope.isActive = function(route) {

			return route === $location.path();
		};
	}]);

	app.controller('ProjectCtrl', ['$scope', '$routeParams', '$filter', 'JsonLoader',
		function ($scope, $routeParams, $filter, JsonLoader) {


		if ($scope.projects) {

			setProject();
		} else {

			JsonLoader.getData().then(function(data) {

				$scope.projects = data.data.projects;

				setProject();
			});
		}
		
		function setProject() {

			for (var key in $scope.projects) {

				var dashCaseTitle = $filter('dashcase')($scope.projects[key].title);

				if ($routeParams.name === dashCaseTitle) {

					$scope.project = $scope.projects[key];
					$scope.$emit('projectChanged', $scope.project);
				}
			}
		}
	}]);

	app.filter('dashcase', function() {

		return function(input) {
			input = input.replace(/\s+/g, '-')
				.toLowerCase()
				.replace('ä', 'ae')
				.replace('ö', 'oe')
				.replace('ü', 'ue')
				.replace('ß', 'ss')
				.replace(/[^a-z0-9-]/g, '');
			return input;
		};
	});

}());

angular.module('feedReader', [])
	.controller('RssFeedCtrl', ['$http', '$interval', '$scope', '$sce',
		function ($http, $interval, $scope, $sce) {

	$scope.articles = [ ];
	$scope.rssFeed = 'http://datenkritik.de/feed/';

	$scope.existingArticles = function () {

		return $scope.articles.filter(function (a) {

			return !a.cleared;
		})[0] !== null;
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

			$scope.articles = data.data.responseData.feed.entries.map(function (el) {

				return parseEntry(el);
			});

			if (mostRecentDate !== null) {

				$scope.articles = entries.filter(function (el) {
					
					return el.date < mostRecentDate;
				});
			}

			$scope.articles = $scope.articles.sort(function(a,b) {

				return a.date > b.date || false;
			});
		});
	};

	// update initially
	$scope.updateModel();
}]);