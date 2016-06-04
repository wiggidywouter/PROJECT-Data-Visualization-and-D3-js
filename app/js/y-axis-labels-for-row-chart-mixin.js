/*

Example usage:

var myChart = yAxisLabelsForRowChartMixin( dc.rowChart('#my-chart') );

myChart.yAxisLabel("Apparaatcategorie");

*/

var yAxisLabelsForRowChartMixin = function(_chart) {
  
  _chart.yAxisLabel = function (labelText, padding) {

        if (!arguments.length)          
            return _chart._yAxisLabel;

        _chart._yAxisLabel = labelText;

        _chart._yAxisLabelPadding = (padding === undefined) ? -8 : padding;

        return _chart;
  };

 _chart.renderYAxisLabel = function () {
    
    _chart.select('g').append('text')

      .attr('transform','translate(' + _chart._yAxisLabelPadding + ',' + 
        (_chart.height() - _chart.margins().top - _chart.margins().bottom) / 2 + '),rotate(' + -90 + ')')
  
      .attr('class', 'y-axis-label')
  
      .attr('text-anchor', 'middle')
 
      .attr('style', 'font: 11px sans-serif;')
 
      .text(function() { 
        return _chart._yAxisLabel
      });

    return _chart._yAxisLabel;
  };

  dc.override(_chart, '_doRender', function() {
  
    _chart.__doRender();
  
    _chart.renderYAxisLabel();
  
  });

  return _chart;
};