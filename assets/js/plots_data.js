const barcharts = ["barchart_test"];
const pies = ["piechart_test", "pie_quotes_party", "pie_climate_quotes_party", "pie_politicians_party"];
const piesLabel = ["pie_politicians", "pie_quotes", "pie_climate_quotes"]
const timeseries = ["timeserieschart_test"]

pies.forEach(chart => parseData(chart, generatePie));
piesLabel.forEach(chart => parseData(chart, generatePieLabel));
barcharts.forEach(chart => parseData(chart, generateBarchart));
timeseries.forEach(chart => parseData(chart, generateTimeseriesChart));