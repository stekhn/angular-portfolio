(function() {

	var app = angular.module('portfolio', ['ngRoute', 'feedReader']);

	app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

		$locationProvider.hashPrefix('!');

		$routeProvider
			.when("/", {templateUrl: "template/project-list.html"})
			.when("/project/:name", {templateUrl: "template/project.html", controller: "ProjectMetaCtrl"})
			.when("/curriculum", {templateUrl: "template/curriculum.html", controller: "MainMetaCtrl"})
			.when("/contact", {templateUrl: "template/contact.html", controller: "MainMetaCtrl"})
			.when("/blog", {templateUrl: "template/blog.html", controller: "MainMetaCtrl"})
			.when("/imprint", {templateUrl: "template/imprint.html", controller: "MainMetaCtrl"})
			.when("/project", {templateUrl: "template/project.html", controller: "MainMetaCtrl"})
			.otherwise("/", {templateUrl: "template/project-list.html"});
	}]);

	app.run(['$rootScope', '$location', '$route', function ($rootScope, $location, $route) {

		$rootScope.config = {};
		$rootScope.config.app_url = $location.url();
		$rootScope.config.app_path = $location.path();
		$rootScope.layout = {};
		$rootScope.layout.loading = false;

		$rootScope.$on('$routeChangeStart', function () {

			$rootScope.layout.loading = true;
		});

		$rootScope.$on('$routeChangeSuccess', function () {

			$rootScope.layout.loading = false;
		});

		$rootScope.$on('$routeChangeError', function () {

			$rootScope.layout.loading = false;
		});
	}]);

	app.factory('Meta', function() {

		var title = 'Steffen Kühne – Journalismus, Code & Design';
		var description = 'Konzeption, Beratung und Umsetzung von Projekten im Bereich Datenjournalismus, Visualisierung, interaktive Grafik und Webentwicklung in München.';
		var author = 'Steffen Kühne';
		var twitter = '@stekhn';
		var keywords = 'keywords" content="Datenjournalismus, Datenvisualisierung, interaktive Grafik, Storytelling, Innovation, Online-Journalismus, Webentwicklung, Datenkritik, Steffen Kühne, München';
		var url = 'http://stekhn.de';
		var image = 'http://stekhn.de/preview.jpg';

		return {

			title: function() { return title; },
			setTitle: function(newTitle) { title = newTitle; },
			description: function() { return description; },
			setDescription: function(newDescription) { description = newDescription; },
			author: function() { return author; },
			setAuthor: function(newAuthor) { author = newAuthor; },
			twitter: function() { return twitter; },
			setTwitter: function(newTwitter) { twitter = newTwitter; },
			keywords: function() { return keywords; },
			setKeywords: function(newKeywords) { keywords = newKeywords; },
			url: function() { return url; },
			setUrl: function(newUrl) { url = newUrl; },
			image: function() { return image; },
			setImage: function(newImage) { image = newImage; }
		};
	});

	app.controller('MainMetaCtrl', ['$scope', '$location', 'Meta', 'Data', function ($scope, $location, Meta, Data) {

		console.log('MainMetaCtrl');
		Meta.setTitle(getTitle($location.path()));
		Meta.setDescription(getDescription());
		Meta.setAuthor('description');
		Meta.setTwitter('description');
		Meta.setKeywords('kewyords');
		Meta.setUrl($location.absUrl());
		Meta.setImage('kewyords');
	}]);

	function getDescription() {

		return angular.element(document.querySelector('.description')).text();
	}

	function getTitle(str) {
		
		return str.replace('\/','').charAt(0).toUpperCase() + str.slice(2);
	}

	app.controller('ProjectMetaCtrl', ['$scope', '$location', 'Meta', 'Data', function ($scope, $location, Meta, Data) {

		console.log('ProjectMetaCtrl');
		Meta.setTitle('title');
		Meta.setDescription('description');
		Meta.setAuthor('description');
		Meta.setTwitter('description');
		Meta.setKeywords('kewyords');
		Meta.setUrl('kewyords');
		Meta.setImage('kewyords');
	}]);

	// @TODO Change JSON loader to factory or provider
	app.factory('Data', ['$http', function ($http) {
		console.log("DataFactory");
		return {
			get: function(callback){
				$http.get('data/portfolio.json').success(callback);
			}
		};
	}]);

	app.controller('DataCtrl', ['$scope', '$http', 'Data', function ($scope, $http, Data) {

		$http.get('data/portfolio.json').success(function (data) {

			$scope.projects = data;
		});
	}]);

	app.controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {

		$scope.isActive = function(route) {

			return route === $location.path();
		};
	}]);

	app.controller('ProjectCtrl', ['$scope', '$routeParams', '$filter', function ($scope, $routeParams, $filter) {

		var current;

		for (var key in $scope.projects) {

			var dashCaseTitle = $filter('dashcase')($scope.projects[key].title);

			if ($routeParams.name === dashCaseTitle) {

				current = key;
			}
		}
		
		$scope.project = $scope.projects[current];
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


angular.module('feedReader', []).controller('RssFeedCtrl', ['$http', '$interval', '$scope', '$sce', function ($http, $interval, $scope, $sce) {

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