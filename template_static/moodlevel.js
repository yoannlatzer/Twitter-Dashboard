(function($, block) {
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
            max: 10
        },
        ticks: [0, 2.5, 5, 7.5, 10]
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

})(jQuery, block);