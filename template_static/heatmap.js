/**
 * Heatmap block shows map with current weather status and tweets of the day  
 */
(function($, block) {
  google.charts.load('upcoming', {'packages':['geomap']});

/**
 * Get average temprature of certain date for a certain province
 */
function getAvarageTemp(province, date) {
  var result = $.grep(window.weather, function(e) { 
    return e.id == province && e.date == date; 
  });
  if ( result.length > 0 ) {
    return result[0].ta * .1
  }
}

/**
 * Get rain of certain date for a certain province
 */
function getRain(province, date) {
  var result = $.grep(window.weather, function(e) { 
    return e.id == province && e.date == date; 
  });
  if ( result.length > 0 ) {
    return result[0].rain * .1
  }
}

// Initial load geochart
google.charts.setOnLoadCallback(drawRegionsMap.bind(this, 20101009, {
  'Noord-Holland': 0,
  'Utrecht': 0,
  'Friesland': 0,
  'Flevoland': 0,
  'Gelderland': 0,
  'Drenthe': 0,
  'Groningen': 0,
  'Overijssel': 0,
  'Zeeland': 0,
  'Zuid-Holland': 0,
  'Noord-Brabant': 0,
  'Limburg': 0 
}));

// https://developers.google.com/chart/interactive/docs/gallery/geochart
function drawRegionsMap(date, mood) {
  var options = {
    region: 'NL',
    resolution: 'provinces',
    colorAxis: {minValue: 0, maxValue: 30, colors: ['blue','#CDDC39', '#FFEB3B', '#FF6D00']},
    backgroundColor: '#81d4fa',
    datalessRegionColor: '#E0E0E0',
    defaultColor: '#f5f5f5',
  };
  // Check if geocharts are loaded
  if (typeof google.visualization == 'undefined' || typeof google.visualization.arrayToDataTable == 'undefined') {
    return;
  }
  // Set data for map type temperature
  if ( window.type == 'temperature' ) {
    var data = google.visualization.arrayToDataTable([
      ['Province', 'Temperature'],
      ['Noord-Holland', getAvarageTemp(235, date)],
      ['Utrecht', getAvarageTemp(260, date)],
      ['Friesland', getAvarageTemp(270, date)],
      ['Flevoland', getAvarageTemp(273, date)],
      ['Gelderland', getAvarageTemp(275, date)],
      ['Drenthe', getAvarageTemp(280, date)],
      ['Groningen', getAvarageTemp(286, date)],
      ['Overijssel', getAvarageTemp(290, date)],
      ['Zeeland', getAvarageTemp(310, date)],
      ['Zuid-Holland', getAvarageTemp(344, date)],
 	    ['Noord-Brabant', getAvarageTemp(370, date)],
      ['Limburg', getAvarageTemp(380, date)]
    ]);
    
  }
  // Set data for map type rain
  if ( window.type == 'rain' ) {
    var data = google.visualization.arrayToDataTable([
      ['Province', 'Rain'],
      ['Noord-Holland', getRain(235, date)],
      ['Utrecht', getRain(260, date)],
      ['Friesland', getRain(270, date)],
      ['Flevoland', getRain(273, date)],
      ['Gelderland', getRain(275, date)],
      ['Drenthe', getRain(280, date)],
      ['Groningen', getRain(286, date)],
      ['Overijssel', getRain(290, date)],
      ['Zeeland', getRain(310, date)],
      ['Zuid-Holland', getRain(344, date)],
 	    ['Noord-Brabant', getRain(370, date)],
      ['Limburg', getRain(380, date)]
    ]);
    // Change map colors
    options.colorAxis = {minValue: 0, maxValue: 30, colors: ['white', 'blue']}
    
  }
  // Set data for map type tweets
  if ( window.type == 'tweets') {
    var data = google.visualization.arrayToDataTable(mood)
    options.displayMode = 'markers';
  }
  // Render geochart
  var chart = new google.visualization.GeoChart(document.getElementById('geochart-colors'));
  chart.draw(data, options);
};
  // Set base variables
  var currentDate = 0;
  var last = 'temperature'
  var currentDayTweets = []
  // Heatmap block function
  block.fn.heatmap = function(config) {
    this.actions(function(e, tweet) {
      var tweets = [];
      // Check for buffer
      if ( typeof tweet.buffer != 'undefined' ) {
        // Map through tweet buffer
        tweet.buffer.tweets.map(function(t) {
          // add buffer tweet to list
          tweets.push({
            tweet: t,
            date: tweet.date,
          })
        })
      }
      else {
        // add new tweet to list
        tweets.push(tweet)
      }
      
      // Map through tweets
      tweets.map(function(tweet) {
        // Look for map type == temperature, date change and previous map
        if (window.type == 'temperature' && (currentDate != tweet.date || last != 'temperature')) {
          last = 'temperature'
          currentDate = tweet.date
          drawRegionsMap(tweet.date, null)
        }
        // Look for map type == rain, date change and previous map
        else if (window.type == 'rain' && (currentDate != tweet.date || last != 'rain')) {
          last = 'rain'
          currentDate = tweet.date
          drawRegionsMap(tweet.date, null)
        }
        // Look for map type == tweets
        else if (window.type == 'tweets') {
          last = 'tweets'
          // Check for date change and currentDayTweets count > 0
          if ( currentDate == tweet.date && currentDayTweets.length > 0 ) {
            // check if tweet has coordinates
            if ( tweet.tweet.coordinates != null && typeof tweet.tweet.coordinates == 'object' && tweet.tweet.coordinates.type == 'Point') {
              // Add tweet to list
              currentDayTweets.push([tweet.tweet.coordinates.coordinates[1], tweet.tweet.coordinates.coordinates[0], tweet.tweet.text])
            }
          }
          else {
            // Set current date
            currentDate = tweet.date
            // check if tweet has coordinates
            if ( tweet.tweet.coordinates != null && typeof tweet.tweet.coordinates == 'object' && tweet.tweet.coordinates.type == 'Point') {
              // Set currentDayTweets list
              currentDayTweets = [
                ['Lat', 'Long', 'Tweet'],
                [tweet.tweet.coordinates.coordinates[1], tweet.tweet.coordinates.coordinates[0], tweet.tweet.text]
              ]
            }
          }
          // Check if there are tweets in the list
          if (currentDayTweets.length > 0) {
            // Render tweets on the map
            drawRegionsMap(tweet.date, currentDayTweets)
          }
        }
      })
    })
    return this.$element
  }
})(jQuery, block);