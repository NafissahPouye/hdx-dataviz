function generatingComponent(vardata){

  //var lookUp = genLookup(vargeodata) ;

  var nbDatasetsTrends = dc.compositeChart('#CompositeChart') ;
  var scale_maxDate = new Date(2017, 8, 30);
  var numberFormat = d3.format(',f');

  var dateFormat = d3.time.format("%Y-%m-%d");
  var dateFormatPretty = d3.time.format("%b %Y");
  var dateFormatPretty1 = d3.time.format("%Y");
      vardata.forEach(function (e) {
        e.date = dateFormat.parse(e.date);
    });

  var xScaleRange = d3.time.scale().domain([new Date(2014, 0, 30), scale_maxDate]);
  
  var cf = crossfilter(vardata);

  var all = cf.groupAll();

  var colors = ['#A9A9A9','0000FF'] ;

   var dateDimension = cf.dimension(function (d) { return d.date});

  var groupvalue3 = dateDimension.group().reduceSum(function (d){return d.value3;});
              
           
 nbDatasetsTrends

      .width(1200)

      .height(300)

      .dimension(dateDimension)

      .x(d3.time.scale().domain([new Date(2014, 3, 30), new Date(2017, 7, 30)]))

      .elasticY(true)

      .valueAccessor(function(d){return d.value.avg;})
            
      .shareTitle(false)


      .compose([

        dc.lineChart(nbDatasetsTrends).group(groupvalue3).renderArea(true).colors(colors[1]).title(function (d) { return [ dateFormatPretty(d.key), d.value3 + ' organisations'].join('\n'); }),

        ])

      .brushOn(false)
      //.renderArea(true)
      .renderHorizontalGridLines(true)
      .margins({top: 20, right: 0, bottom: 20, left: 60})
      .xAxis().ticks(7);
      
      

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