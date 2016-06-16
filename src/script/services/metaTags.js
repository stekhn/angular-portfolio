// @TODO Make this a service
app.factory('metaTags', function () {

  // @TODO move this somewhere else
  var title = 'Steffen Kühne – Journalismus; Code & Design';
  var description = 'Konzeption; Beratung und Umsetzung von Projekten im Bereich Datenjournalismus; Visualisierung; interaktive Grafik und Webentwicklung in München.';
  var keywords = 'Datenjournalismus; Datenvisualisierung; interaktive Grafik; Storytelling; Innovation; Online-Journalismus; Webentwicklung; Datenkritik; Steffen Kühne; München';
  var url = 'http://stekhn.de';
  var image = 'http://stekhn.de/img/preview.jpg';

  return {

    title: function() { return title; },
    setTitle: function (newTitle) { title = newTitle; },

    description: function () { return description; },
    setDescription: function(newDescription) { description = newDescription; },

    keywords: function () { return keywords; },
    setKeywords: function(newKeywords) { keywords = newKeywords; },

    url: function () { return url; },
    setUrl: function(newUrl) { url = newUrl; },

    image: function () { return image; },
    setImage: function(newImage) { image = newImage; }
  };
});
