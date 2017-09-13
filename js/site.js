function generatingComponent(vardata){

 

  var nbOrgTrends = dc.compositeChart('#CompositeChart') ;
  var scale_maxDate = new Date(2017, 7, 30);
  var numberFormat = d3.format(',f');
  var dateFormat = d3.time.format("%Y-%m-%d");
  var dateFormatPretty = d3.time.format("%b %Y");
  var dateFormatPretty1 = d3.time.format("%Y");
      vardata.forEach(function (e) {
        e.date = dateFormat.parse(e.date);
    });

  var xScaleRange = d3.time.scale().domain([new Date(2014, 0, 1), scale_maxDate]);
  
  var cf = crossfilter(vardata);

  var all = cf.groupAll();

  var colors = ['00008B','#FAE61E'] ;

   var dateDimension = cf.dimension(function (d) { return d.date});

  var groupvalue = dateDimension.group().reduceSum(function (d){return d.value;});
              
           
 nbOrgTrends

      .width(1200)

      .height(300)

      .dimension(dateDimension)

      .x(d3.time.scale().domain([new Date(2014, 3, 30), new Date(2017, 7, 30)]))

      .elasticY(false)

      .valueAccessor(function(d){return d.value.avg;})
            
      .shareTitle(false)


      .compose([

        dc.lineChart(nbOrgTrends).group(groupvalue).renderArea(true).colors(colors[0]).title(function (d) { return [ dateFormatPretty(d.key), d.value + ' organisations'].join('\n'); }),

        ])

      .brushOn(false)
      //.renderArea(true)
      .renderHorizontalGridLines(true)
      .margins({top: 20, right: 0, bottom: 20, left: 60})
      .xAxis().ticks(8);
      
      

  dc.dataCount('count-info')

    .dimension(cf)

    .group(all);

  
      dc.renderAll();
     

}

var dataCall = $.ajax({

    type: 'GET',

    url: 'data/data.json',

    dataType: 'json',

});

var geomCall = $.ajax({

    type: 'GET',

    url: 'data/wa.geojson',

    dataType: 'json',

});

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){

    var geom = geomArgs[0];

    geom.features.forEach(function(e){

        e.properties['NAME'] = String(e.properties['NAME']);

    });

    generatingComponent(dataArgs[0],geom);

});