var tour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-theme-arrows',
    scrollTo: true
  }
});


//before-show complete

tour.addStep({
  title: '',
  text: 'Bezoekers moeten vijf stappen voltooien om een bestelling te plaatsen. Van alle bezoeken die de funnel betreden, haalt slechts 30% de laatste stap.',
  attachTo: {element: '#custom-funnel-chart', on: 'top'},
  when: {
    "before-show": function() {
      $(".funnel-chart g:nth-child(5) .step-drop text:nth-child(2)").css({'fill':'orange'});
    }
  },
  buttons: [
    {
      text: 'Next',
      action: function () {
         tour.next();
      }
    }
  ]
});

tour.addStep({
  title: '',
  text: 'Van de mobiele bezoeken haalt slechts 15,3% de laatste stap.',
  attachTo: {element: $('.apparaatcategorie-chart').parent()[0], on: 'bottom'},
  when: {
    "before-show": function() {
      funnelConversieratioPerApparaatCategorieChart.filter(null).filter("mobile").redrawGroup();
    }
  },
  buttons: [
    {
      text: 'Next',
      action: function () {
         tour.next();
      }
    }
  ]
});

tour.addStep({
  title: '',
  text: 'Activeer een filter door op één van de labels te klikken.',
  attachTo: {element: $('.apparaatcategorie-chart').parents('.row')[0], on: 'bottom'},
  when: {
    "before-show": function() {
       dc.filterAll();
       dc.redrawAll();
       $(".funnel-chart g:nth-child(5) .step-drop text:nth-child(2)").css({'fill':'black'});
    }
  },
  buttons: [
    {
      text: 'Got it',
      action: function () {
        dc.filterAll();
        dc.redrawAll();
        //window.scrollTo(0, 0);
        $("html, body").animate({ scrollTop: 0 }, "slow");
        tour.cancel();
      }
    }
  ]
});