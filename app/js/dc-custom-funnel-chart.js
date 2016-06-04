
// Adds custom funnel chart method. Returns a chart object.
    
dc.customFunnelChart = function (parent, chartGroup) {
  
  // Variables

  var _g,

      _stepsData = [],

      _chart = dc.baseMixin({}),

      _stepLabels = _chart.keyAccessor(),

      _columnWidth,

      stepDetailsHeight = 57,

      stepCountHeight = 200,

      stepDropHeight = 90,

      y = d3.scale.linear().range( [ 0, stepCountHeight ] );

  // Helper __functions

  function __calculateMetricValue (d,i) {

    return d3.format(",")( _chart.valueAccessor()(d) );
  
  }
  
  function __calculateDropPercent (d,i) {
  
    if ( i == _stepsData.length - 1 )
  
      return d3.format(".1%")( _chart.valueAccessor()(d) / _chart.valueAccessor()(_stepsData[0]) );

    var nextValue = ( _stepsData[ i + 1 ] ) ? _chart.valueAccessor()( _stepsData[ i + 1 ] ) : _chart.valueAccessor()(d);
    
    return d3.format(".1%")( (_chart.valueAccessor()(d) - nextValue) / _chart.valueAccessor()(d) );
  }
  
  function __calculateDropCount (d,i) {
  
    var nextValue = ( _stepsData[ i + 1 ] ) ? _chart.valueAccessor()( _stepsData[ i + 1 ] ) : 0;
  
    return '(' + d3.format(",")( _chart.valueAccessor()(d) - nextValue ) + ')';
  }
  
  function __plotSteps (d,i) {
  
    var nextValue = ( _stepsData[ i + 1] ) ? _chart.valueAccessor()( _stepsData[ i + 1 ] ) : _chart.valueAccessor()(d),
  
        shapeHeight = y( _chart.valueAccessor()(d) ),
  
        nextHeight = y(nextValue),
  
        yOffset = stepCountHeight - shapeHeight;

    return "0," + yOffset + " " +
  
      _columnWidth + "," + ( yOffset + (shapeHeight - nextHeight) ) + " " +
  
      _columnWidth +  "," + ( yOffset + shapeHeight ) + " " +
  
      "0," + ( yOffset + shapeHeight );
  }

  function __drawLine (d,i) {

    var shapeHeight = y( _chart.valueAccessor()(d) ),
    
        yOffset = stepCountHeight - shapeHeight;
    
    return ( i > 0 ) ? yOffset : stepCountHeight;
  }

  function __drawChart () {

    _stepsData = _chart._computeOrderedGroups( _chart.data() );
    
    __createElements();
  }

  function __createElements () {
    
    y.domain( [0, d3.max( _stepsData, function(d) { return _chart.valueAccessor()(d); } ) ] );
    
    var step = _g.selectAll("g")

      .classed('step', true)
    
      .data(_stepsData)
    
      .enter().append("g")
    
      .attr("transform", function(d, i) { return "translate(" + i * _columnWidth + ",0)"; });
    
    var stepDetails = step.append("g")
    
      .classed('step-details', true)
    
      .attr("transform","translate(0,0)");

    var stepCount = step.append("g")
    
      .classed('step-count', true)
    
      .attr("transform","translate(0," + stepDetailsHeight + ")");

    var stepDrop = step.append("g")
    
      .classed('step-drop', true)
    
      .attr("transform","translate(0," + (stepDetailsHeight + stepCountHeight) + ")");
    
    stepDetails.append('text')
    
      .classed('step-number', true)
    
      .attr("x", 0)
    
      .attr("y", 0)
    
      .attr("dx", 9)
    
      .attr("dy", 20)
    
      .text( function (d,i) {
         return "STEP " + (i + 1);
      });

    stepDetails.append('text')
    
      .classed('step-name', true)
    
      .attr("x", 0)
    
      .attr("y", 0)
    
      .attr("dx", 9)
    
      .attr("dy", 45)
    
      .text( function (d,i) {
         return _stepLabels(d,i);
      })
    
      .html(function (d,i) {

        if (this.getBoundingClientRect().width > _columnWidth - 9){
        
          var maxCharLength = Math.floor( (_columnWidth - 20) / 8 );

          return _stepLabels(d,i).slice(0,maxCharLength).trim() + '...' + '<title>' + _stepLabels(d,i) + '</title>';
        }

        return _stepLabels(d,i);
      });

    stepCount.append("polygon")
      
      .attr("y", 20)

      .attr("points", __plotSteps)
      
      .attr("fill", "#B1D4E7");

    stepCount.append('text')
      
      .classed('metric-name', true)
      
      .attr("x", 0)
      
      .attr("y", 0)
      
      .attr("dx", 9)
      
      .attr("dy", 20)
      
      .text( function (d,i) {
         return "SESSIONS";
      });

    stepCount.append('text')
      
      .classed('metric-value', true)
      
      .attr("x", 0)
      
      .attr("y", 0)
      
      .attr("dx", 9)
      
      .attr("dy", 45)
      
      .text(__calculateMetricValue);

    stepDrop.append('text')
      
      .classed('drop-title', true)
      
      .attr("x", 0)
      
      .attr("y", 0)
      
      .attr("dx", 9)
      
      .attr("dy", 20)
      
      .html(function (d,i) {

        if ( i == _stepsData.length - 1 )
        
          return "CONVERSION";
        
        return "DROPOFF";
      });

    stepDrop.append('text')
      
      .classed('drop-percent', true)
      
      .attr("x", 0)
      
      .attr("y", 0)

      .attr("dx", _columnWidth/2)

      .attr("dy", 53)

      .text(__calculateDropPercent);

    stepDrop.append('text')

      .classed('drop-count', true)

      .attr("x", 0)

      .attr("y", 0)

      .attr("dx", _columnWidth/2)

      .attr("dy", 73)

      .text(__calculateDropCount);

    stepDetails.append('rect')

      .attr("width", _columnWidth)

      .attr("height", stepDetailsHeight)

      .attr("stroke-dasharray", function (d,i) {

        if ( i === _stepsData.length - 1 )

          return 0;
        
        return _columnWidth + ',' + stepDetailsHeight + ',' + (_columnWidth + stepDetailsHeight);

      });
  
    stepCount.append('rect')

      .attr("width", _columnWidth)

      .attr("height", stepCountHeight)

      .attr("stroke-dashoffset", function (d,i) {
         return stepCountHeight;
      })

      .attr("stroke-dasharray", function (d,i) {

        if ( i === _stepsData.length - 1 ){
          return stepCountHeight + ',' + _columnWidth;
        }
        
        return stepCountHeight + ',' + ( _columnWidth * 2 + stepCountHeight );

      });

    stepDrop.append('rect')

      .attr("width", _columnWidth)
    
      .attr("height", stepDropHeight)
    
      .attr("stroke-dashoffset", function (d,i) {
    
        if ( i === _stepsData.length - 1 )

          return -_columnWidth;

        return (stepDropHeight + _columnWidth);
    
      })
    
      .attr("stroke-dasharray", function (d,i) {
    
        if ( i === _stepsData.length - 1 )

          return (stepDropHeight * 2 + _columnWidth);
        
        return (stepDropHeight + _columnWidth);
    
      });
      
    stepCount.append('line')
    
      .attr('x1', 0)
    
      .attr('y1', __drawLine)
    
      .attr('x2', 0)
    
      .attr('y2', stepCountHeight)
    
      .style('stroke-width', '1')
    
      .style('stroke', '#fafafa');

    stepDrop.append('circle')
    
      .classed('end-circle', function (d, i) {
         return i == _stepsData.length - 1;
      })
    
      .attr("cy", 0)
    
      .attr("cx", _columnWidth/2)
    
      .attr("r", 17);

    stepDrop.append("text")
    
      .classed('circle-icon', true)
    
      .classed('end-icon', function (d, i) {
         return i == _stepsData.length - 1;
      })
    
      .attr("x", _columnWidth/2)
    
      .attr("y", 0)
    
      .attr("dx", 0)
    
      .attr("dy", 8)
    
      .html(function (d,i) {
    
        if ( i === _stepsData.length - 1)
          
          return ""; // FontAwesome's 'fa-check' [&#xf00c;] or html5's [&check;]
    
        return ""; // FontAwesome's 'fa-arrow-down' [&#xf063;] or html5's [&cudarrr;]
      });
  }

  // Dc internal method overrides

  _chart._doRender = function () {
    
    _chart.resetSvg();

    _g = _chart.svg()

        .append('g')
    
        .classed('funnel-chart', true)
    
        .attr('transform', 'translate(0.5,0.5)');

    _columnWidth = ( _chart.root().node().clientWidth - 1 ) / 5;

    __drawChart();

    return _chart;

  };

  _chart._doRedraw = function () {
  
    _stepsData = _chart._computeOrderedGroups( _chart.data() );

    y.domain( [0, d3.max(_stepsData, function(d) { return _chart.valueAccessor()(d); } ) ] );

    var polygons = _g.selectAll("polygon").data(_stepsData);

    var lines = _g.selectAll('line').data(_stepsData);
    
    dc.transition(polygons, _chart.transitionDuration()).attr("points", __plotSteps);
    
    dc.transition(lines, _chart.transitionDuration()).attr('y1', __drawLine);
    
    _g.selectAll('.metric-value').data(_stepsData).transition()

      .text(__calculateMetricValue);

    _g.selectAll('.drop-percent').data(_stepsData).transition()

      .text(__calculateDropPercent);

    _g.selectAll('.drop-count').data(_stepsData).transition()

      .text(__calculateDropCount);
  };

  // Adds a public method to define step labels

  _chart.stepLabels = function (stepLabels) {
      
      if (!arguments.length)

        return _stepLabels;

      _stepLabels = stepLabels;

      return _chart;
  };

  // Sets chart height

  _chart.height( stepDetailsHeight + stepCountHeight + stepDropHeight + 1 );

  // Register and return chart

  return _chart.anchor(parent, chartGroup);

}; // eof dc.customFunnelChart
