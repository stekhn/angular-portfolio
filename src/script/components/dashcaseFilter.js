app.filter('dashcase', function () {

  return function (input) {

    return input.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/\u00df/g, 'ss')
      .replace(/[^a-z0-9-]/g, '');
  };
});
