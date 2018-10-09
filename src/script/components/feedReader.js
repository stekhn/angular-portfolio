angular.module('feedReader', [])
  .controller('RssFeedCtrl', ['$http', '$interval', '$scope', '$sce',
    function ($http, $interval, $scope, $sce) {

      $scope.articles = [];
      $scope.rssFeed = 'https://ssl.webpack.de/datenkritik.de/feed/';

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

        var queryUrl = 'https://query.yahooapis.com/v1/public/yql';

        var params = {
          'q': 'select * from xml where url = "' + url + '"',
          'format': 'json',
          'env': 'store://datatables.org/alltableswithkeys'
        };

        return $http.jsonp($sce.trustAsResourceUrl(queryUrl), { params: params });
      };

      $scope.updateModel = function () {

        parseRSS($scope.rssFeed).then(function (data) {

          if (data === null) {

            return;
          }

          $scope.articles = data.data.query.results.rss.channel.item.map(function (el) {

            return parseEntry(el);
          });
        });
      };

      // update initially
      $scope.updateModel();
    }
  ]);
