(function($, block) {
  /*
  google.charts.load('upcoming', {'packages':['corechart', 'bar']});
  google.charts.setOnLoadCallback(drawMoodBar.bind(this, 5));
  
  function drawMoodBar(moodLevel){
    if (typeof google.visualization == 'undefined' || typeof google.visualization.arrayToDataTable == 'undefined') {
      return;
    }
    var data = new google.visualization.arrayToDataTable([
      ['xAxis', 'Mood Level', { role: 'style'}],
      ['Mood', moodLevel, '#b87333'],
      ]);

    var options = {
      animation: {
        duration: 1500,
        easing: 'out'
      },
      vAxis: {
        viewWindowMode:'explicit',
        viewWindow: {
            min: 0,
            max: 2
        },
        ticks: [0, 1, 2]
      }
    };
    if (typeof google.charts.Bar == 'undefined') {
      return;
    }
    var material = new google.charts.Bar(document.getElementById('mood_div'));
    material.draw(data, options);
  }
  
  block.fn.moodlevel = function (config){

    this.actions(function(e, tweet) {
      drawMoodBar(tweet.moodGeneral.moodLevel);
    });
    
    return this.$element
  }
  */
  function mapInt(input, in_min, in_max, out_min, out_max) {
    return (input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  function drawMoodBar(moodLevel) {
     console.log(moodLevel);
    $('#mood-div').css({"height": mapInt(moodLevel, 0, 2, 0, 250) + "px"});

    if (moodLevel < 2) {
      $('#mood-div').css({"background-color": "red"});
    }
    if (moodLevel > 2) {
      $('#mood-div').css({"background-color": "green"});
    }
    else {
      $('#mood-div').css({"background-color": "black"});
    }
  }

  block.fn.moodlevel = function(config){

    this.actions(function(e, tweet) {
      drawMoodBar(tweet.moodGeneral.moodLevel);
    });
    
    return this.$element
  }

})(jQuery, block);