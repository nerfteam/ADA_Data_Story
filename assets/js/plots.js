function parseData(fileName, createPlot) {
  Papa.parse(`assets/data/${fileName}.csv`, {
    download: true,
    complete: function (results) {
      createPlot(fileName, results.data);
    }
  });
}

function generateBarchart(name, data) {
  columns = [];
  colors = {};

  for (let i = 0; i < data.length; i++) {
    colors[data[i][0]] = data[i].pop();

    values = []
    values.push(data[i][0])

    for (let j = 1; j < data[i].length; j++) {
      values.push(parseFloat(data[i][j]))
    }
    columns.push(values);
  }

  return c3.generate({
    bindto: `#${name}`,
    data: {
      columns: columns,
      colors: colors,
      type: 'bar',
    },
    bar: {
      width: {
        ratio: 0.5 // this makes bar width 50% of length between ticks
      }
    }
  });
}

function generatePie(name, data) {
  let columns = [];
  let colors = {};

  for (let i = 0; i < data.length; i++) {
    columns.push([data[i][0], parseFloat(data[i][1])]);
    colors[data[i][0]] = data[i][2];
  }

  return c3.generate({
    bindto: `#${name}`,
    data: {
      columns: columns,
      colors: colors,
      type: 'pie',
    }
  });
}

function generatePieLabel(name, data) {
  let columns = [];
  let colors = {};

  for (let i = 0; i < data.length; i++) {
    columns.push([data[i][0], parseFloat(data[i][1])]);
    colors[data[i][0]] = data[i][2];
  }

  return c3.generate({
    bindto: `#${name}`,
    data: {
      columns: columns,
      colors: colors,
      type: 'pie',
    },
    pie: {
      label: {
        show: true,
        expand:true,
        format: function(value, ratio, id) {
          return d3.format(",.2r")(value);
        }
      }
    }
  });
}

function generateTimeseriesChart(name, data) {
  columns = [data[0]];

  for (let i = 1; i < data.length; i++) {

    values = []
    values.push(data[i][0])

    for (let j = 1; j < data[i].length; j++) {
      values.push(parseFloat(data[i][j]))
    }
    columns.push(values);
  }

  return c3.generate({
    bindto: `#${name}`,
    data: {
      x: 'x',
      columns: columns
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d'
        }
      }
    }
  });
}