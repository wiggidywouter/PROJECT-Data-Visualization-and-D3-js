; (function ($, window, undefined) {

  // Variables

  var data,

      stapUrlDimension,

      apparaatCategorieDimension,

      besturingssysteemDimension,

      browserDimension,

      weergavenPerStapUrlGroup,

      funnelConversieratioPerApparaatCategorieGroup,

      funnelConversieratioPerBesturingssysteemGroup,

      funnelConversieratioPerBrowserGroup;

  // Create chart objects associated with the container elements.

  window.funnelConversieratioPerApparaatCategorieChart = dc.rowChart('#funnel-conversion-per-apparaat-categorie');

  window.funnelConversieratioPerBrowserChart =  dc.rowChart('#funnel-conversion-per-browser');

  window.funnelConversieratioPerBesturingssysteemChart =  dc.rowChart('#funnel-conversion-per-besturingssysteem');

  window.customFunnelChart = dc.customFunnelChart('#custom-funnel-chart');

  // Load the csv

  d3.csv('./data/Analytics Dashboards (vanaf 11 mrt, 2014) Trechtergegevens 20140501-20160501.csv', function (csv) {

    data = crossfilter(csv);

    // Crossfilter dimensions

    stapUrlDimension = data.dimension(function (d) {
      return d['Pagina'];
    });

    apparaatCategorieDimension = data.dimension(function (d) {
      return d['Apparaatcategorie'];
    });

    besturingssysteemDimension = data.dimension(function (d) {
      return d['Besturingssysteem'];
    });

    browserDimension = data.dimension(function (d) {
      return d['Browser'];
    });

    // Crossfilter groups

    weergavenPerStapUrlGroup = stapUrlDimension.group().reduceSum(function (d) {
      return +d['Unieke paginaweergaves'];
    });

    funnelConversieratioPerApparaatCategorieGroup = apparaatCategorieDimension.group().reduce(

      function (p, v) {
        
        if ( v['Pagina'] == '/templates/bestellen.asp') p.funnelentries += +v["Unieke paginaweergaves"];
        
        if ( v['Pagina'] == '/shop/psp/IDEC/cfm.asp') p.completions += +v["Unieke paginaweergaves"];

        p.ratio = p.completions / p.funnelentries || 0;

        return p;
      },

      function (p, v) {
        
        if ( v['Pagina'] == '/templates/bestellen.asp') p.funnelentries -= +v["Unieke paginaweergaves"];
        
        if ( v['Pagina'] == '/shop/psp/IDEC/cfm.asp') p.completions -= +v["Unieke paginaweergaves"];

        p.ratio = p.completions / p.funnelentries || 0;

        return p;
      },

      function () {
        return {funnelentries: 0, completions: 0, ratio: 0};
      }
    );

    funnelConversieratioPerBesturingssysteemGroup = besturingssysteemDimension.group().reduce(

      function (p, v) {
        
        if ( v['Pagina'] == '/templates/bestellen.asp') p.funnelentries += +v["Unieke paginaweergaves"];
        
        if ( v['Pagina'] == '/shop/psp/IDEC/cfm.asp') p.completions += +v["Unieke paginaweergaves"];

        p.ratio = p.completions / p.funnelentries || 0;
        
        return p;
      },

      function (p, v) {
        
        if ( v['Pagina'] == '/templates/bestellen.asp') p.funnelentries -= +v["Unieke paginaweergaves"];
        
        if ( v['Pagina'] == '/shop/psp/IDEC/cfm.asp') p.completions -= +v["Unieke paginaweergaves"];

        p.ratio = p.completions / p.funnelentries || 0;
        
        return p;
      },

      function () {
        return {funnelentries: 0, completions: 0, ratio: 0};
      }
    );

    funnelConversieratioPerBrowserGroup = browserDimension.group().reduce(

      function (p, v) {
      
        if ( v['Pagina'] == '/templates/bestellen.asp') p.funnelentries += +v["Unieke paginaweergaves"];

        if ( v['Pagina'] == '/shop/psp/IDEC/cfm.asp') p.completions += +v["Unieke paginaweergaves"];

        p.ratio = p.completions / p.funnelentries || 0;
        
        return p;
      },

      function (p, v) {
      
        if ( v['Pagina'] == '/templates/bestellen.asp') p.funnelentries -= +v["Unieke paginaweergaves"];

        if ( v['Pagina'] == '/shop/psp/IDEC/cfm.asp') p.completions -= +v["Unieke paginaweergaves"];

        p.ratio = p.completions / p.funnelentries || 0;
      
        return p;
      },

      function () {
        return {funnelentries: 0, completions: 0, ratio: 0};
      }
    );

    // Define 'customFunnelChart' attributes

    customFunnelChart

      .width(function () {
        return customFunnelChart.root().node().clientWidth;
      })

      .group(weergavenPerStapUrlGroup)

      .dimension(stapUrlDimension)

      .valueAccessor(function (d) {
         return d.value;
      })

      .keyAccessor(function (d) {
         return d.key;
      })

      .stepLabels(function (d) {
        
        var names = {

          "/templates/bestellen.asp" : "Verzendmethode",

          "/templates/winkelwagen.asp" : "Bestelling bevestigen",

          "/shop/checkout.asp" : "Adresgegevens",

          "/shop/selectpaymentmethod.asp" : "Betalingsmethode",

          "/shop/psp/IDEC/cfm.asp" : "Betaling geslaagd"
        };

        return names[d.key];
      })

      .ordering(function(d) {
        return -d.value;
      });

    // Define 'funnelConversieratioPerApparaatCategorieChart' attributes

    funnelConversieratioPerApparaatCategorieChart

      .margins({top: 10, right: 0, bottom: 30, left: 0})
    
      .x( d3.scale.linear().domain([0,1]).range([0,475]) )
    
      .title(function(d){
        return d.key +': ' + d3.format('.1%')(d.value.ratio) + ' (' + d.value.completions + '/' + d.value.funnelentries + ')';
      })
    
      .controlsUseVisibility(true)
    
      .elasticX(true)
    
      .dimension(apparaatCategorieDimension)
    
      .group(funnelConversieratioPerApparaatCategorieGroup)
    
      .valueAccessor(function (p) {
         return p.value.ratio;
      })
    
      .on('pretransition', function(chart) {

        chart.selectAll(".row rect, .row text").on("click", function (d) {
            
          if (d.key == chart.filter()) {
            chart.filter(null);dc.filterAll();
          } else {
            dc.filterAll();chart.filter(null).filter(d.key);
          }
          
          chart.redrawGroup();
        });

      })

      .ordering(function(d) {
        return -d.value;
      })

      .xAxis().tickFormat( d3.format('%') );

    // Define 'funnelConversieratioPerBesturingssysteemChart' attributes

    funnelConversieratioPerBesturingssysteemChart

      .margins({top: 10, right: 0, bottom: 30, left: 0})

      .x(d3.scale.linear().domain([0,1]).range([0,475]))

      .title(function(d){
        return d.key +': ' + d3.format('.1%')(d.value.ratio) + ' (' + d.value.completions + '/' + d.value.funnelentries + ')';
      })

      .controlsUseVisibility(true)

      .elasticX(true)

      .dimension(besturingssysteemDimension)

      .group(funnelConversieratioPerBesturingssysteemGroup)

      .valueAccessor(function (p) {
         return p.value.ratio;
      })

      .on('pretransition', function(chart) {

        chart.selectAll(".row rect, .row text").on("click", function (d) {
            
          if (d.key == chart.filter()) {
            chart.filter(null);dc.filterAll();
          } else {
            dc.filterAll();chart.filter(null).filter(d.key);
          }
          
          chart.redrawGroup();
        });

      })

      .ordering(function(d) {
        return -d.value;
      })

      .colors('#3182bd')

      .xAxis().tickFormat( d3.format('%') );

    // Define 'funnelConversieratioPerBrowserChart' attributes

    funnelConversieratioPerBrowserChart

      .margins({top: 10, right: 0, bottom: 30, left: 0})

      .x( d3.scale.linear().domain([0,1]).range([0,475]) )

      .title(function(d){
        return d.key +': ' + d3.format('.1%')(d.value.ratio) + ' (' + d.value.completions + '/' +d.value.funnelentries + ')';
      })

      .controlsUseVisibility(true)

      .elasticX(true)

      .dimension(browserDimension)

      .group(funnelConversieratioPerBrowserGroup)

      .valueAccessor(function (p) {
         return p.value.ratio;
      })

      .on('pretransition', function(chart) {

        chart.selectAll(".row rect, .row text").on("click", function (d) {
            
          if (d.key == chart.filter()) {
            chart.filter(null);dc.filterAll();
          } else {
            dc.filterAll();chart.filter(null).filter(d.key);
          }

          chart.redrawGroup();
        });

      })

      .ordering(function(d) { return -d.value; })
      
      .colors('#3182bd')
      
      .xAxis().tickFormat(d3.format('%'));

    // Events


    $('.header-bar .close').on('click', function(){

      $('.container').css({'margin-top':'0px'});

      setTimeout(function() {

        $('.header-bar').hide();
      
      }, 400);

    });

    $('.header-bar .info-button').on('click', function(ev){

      ev.preventDefault();

      dc.filterAll(); dc.redrawAll();

      $('.container').css({'margin-top':'0px'});

      setTimeout(function() {
        
        $('.header-bar').hide();
        
        $(".chart g:nth-child(5) .step-drop text:nth-child(2)").css({'fill':'orange'});
        
        tour.start();
      
      }, 400);

    });

    customFunnelChart.on('postRender', function(chart, filter){
      
      console.log('postRender!');

      $('.header-bar').css({'margin-top':'-41px'});
      
      $(".container").css('opacity',1);
      
      $(".spinner").hide();

    });
    
    window.onresize = function(){ dc.renderAll(); };

    // Init

    dc.renderAll();

  }); // eof load the csv

})(jQuery, window);