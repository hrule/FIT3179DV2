// main.js
async function embedChart(id, specPath) {
  try {
    const response = await fetch(specPath);
    const spec = await response.json();
    const result = await vegaEmbed('#' + id, spec, { actions: false });
    return result.view;
  } catch (err) {
    console.error('Failed to embed chart', id, err);
  }
}

(async () => {
  const mapView  = await embedChart('trade-map', 'js/map-trade.vg.json');
  const lineView = await embedChart('line-trade', 'js/line-trade.vg.json');
  const bumpView = await embedChart('team-conf-rank', 'js/team-conf-rank.vg.json');
  const eastWestMapView = await embedChart('east-west-map', 'js/east-west-map.vg.json')
  const salaryStackedBarView = await embedChart('salary-stacked-bar', 'js/salary-stacked-bar.vg.json')
  const salaryWinsScatterView = await embedChart('salary-wins-scatter', 'js/salary-wins-scatter.vg.json')
  const gswGamesDiffView = await embedChart('gsw-games-diff', 'js/gsw-games-diff.vg.json')
  const lalGamesDiffView = await embedChart('lal-games-diff', 'js/lal-games-diff.vg.json')
  const salaryDumbbellView = await embedChart('salary-dumbbell', 'js/salary-dumbbell.vg.json')

  // Link brushing from line chart to map chart
  if (lineView && mapView) {
    lineView.addSignalListener('season_brush', (name, value) => {
      if (!value || !value.Season) return;

      const seasons = value.Season.map(d => +d);
      const brushRange = [Math.min(...seasons), Math.max(...seasons)];

      mapView.signal('season_brush', brushRange).runAsync();
    });
  }

  // Toggle edges on trade map
  const toggleButton = document.getElementById('toggleEdges');

  // Initial state
  let edgesVisible = true;

  // Add click listener
  toggleButton.addEventListener('click', () => {
    edgesVisible = !edgesVisible;
    mapView.signal('showEdges', edgesVisible).runAsync();
  });

  // Conference toggle logic
  const btnEast = document.getElementById('btn-east');
  const btnWest = document.getElementById('btn-west');

  function updateConference(conference) {
    btnEast.classList.toggle('active', conference === 'East');
    btnWest.classList.toggle('active', conference === 'West');

    if (salaryStackedBarView) salaryStackedBarView.signal('conferenceSelect', conference).runAsync();
    if (bumpView) bumpView.signal('conferenceSelect', conference).runAsync();
    if (eastWestMapView) eastWestMapView.signal('conferenceSelect', conference).runAsync();
  }

  btnEast.addEventListener('click', () => updateConference('East'));
  btnWest.addEventListener('click', () => updateConference('West'));
})();
