angular.module('feedReader', [])
  .controller('RssFeedCtrl', ['$http', '$interval', '$scope', '$sce',
    function ($http, $interval, $scope, $sce) {

  $scope.articles = [];
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

      $scope.articles = data.data.responseData.feed.entries.map(function (el) {

        return parseEntry(el);
      });
    });
  };

  // update initially
  $scope.updateModel();
}]);
