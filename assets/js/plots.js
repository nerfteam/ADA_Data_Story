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
    },
    tooltip: {
      format: {
        value: function (value, ratio) {
          var length = Math.log(value) * Math.LOG10E + 1 | 0;
          var percentFormat = d3.format('.1%');
          var twoDecimal = d3.format(`,.${length}r`);
          return '<ul class="list-inline">' +
            '<li><span class="badge badge-pill badge-secondary">' + percentFormat(ratio) + '</span></li>' +
            '<li><span class="badge badge-pill badge-secondary">' + twoDecimal(value) + '</span></li>' +
            '<ul>';
        }
      }
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
        expand: true,
        format: function (value, ratio, id) {
          var length = Math.log(value) * Math.LOG10E + 1 | 0;
          var twoDecimal = d3.format(`,.${length}r`);
          return twoDecimal(value);
        }
      }
    },
    tooltip: {
      format: {
        value: function (value, ratio) {
          var length = Math.log(value) * Math.LOG10E + 1 | 0;
          var percentFormat = d3.format('.1%');
          var twoDecimal = d3.format(`,.${length}r`);
          return `<ul class="list-inline">
                    <li><span class="badge badge-pill badge-secondary">${percentFormat(ratio)}</span></li>
                    <li><span class="badge badge-pill badge-secondary">${twoDecimal(value)}</span></li>
                  <ul>`;
        }
      }
    }
  });
}

function generateTimeseriesChart(name, data) {
  columns = ['x'];
  values = [data[0][1]];

  for (let i = 1; i < data.length; i++) {
    columns.push(data[i][0])
    values.push(parseFloat(data[i][1]))
  }

  return c3.generate({
    bindto: `#${name}`,
    data: {
      x: 'x',
      columns: [columns, values]
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d'
        }
      },
      y: {
          label: {
              text: 'number of quotes',
              position: 'outer-center'
          }
      }
    }
  });
}

chart = null;
democraticIdx = [0, 2, 3, 4, 5, 7]
republicanIdx = [1, 6]
totalNum = 8;

republicanColor = "#C82D2F";
democraticColor = "#426AE4";

chartName = "top-speakers";

function topSpeakers() {
  chart = c3.generate({
    bindto: `#${chartName}`,

    data: {
      json: [
        { label: "Barack Obama", quotes: 2720 },
        { label: "Donald Trump", quotes: 2493 },
        { label: "Bernie Sanders", quotes: 1497 },
        { label: "Jerry Brown", quotes: 1054 },
        { label: "Jay Inslee", quotes: 993 },
        { label: "Al Fore", quotes: 924 },
        { label: "Scott Pruitt", quotes: 772 },
        { label: "Alexandra Ocasio-Cortez", quotes: 661 }
      ],
      keys: {
        x: 'label',
        value: ["quotes"],
      },
      type: 'bar',
      color: function (color, d) {
        return republicanIdx.includes(d.index) ? republicanColor : democraticColor;
      },
    },
    axis: {
      x: {
        type: 'category',
        tick: { centered: true },
        position: 'outer-center',
      },
      y: {
        label: {
          text: 'number of climate change quotes',
          position: 'outer-middle'
        }
      },
    },
    legend: {
      show: true
    },
    tooltip: {
      contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
        return `<table class="c3-tooltip">
                  <tbody>
                    <tr>
                      <th colspan="2">${chart.categories()[d[0].index]}</th>
                    </tr>
                    <tr class="c3-tooltip-name-quotes">
                      <td class="name">
                        <span style="background-color:${republicanIdx.includes(d[0].index) ? republicanColor : democraticColor}"></span>${d[0].id}
                      </td>
                      <td class="value">${d[0].value}</td>
                    </tr>
                  </tbody>
                </table>`
      },
    },
  });


  d3.select('.panel-body').insert('div')
    .attr('class', 'legend col-md-2 display-inline-block float-right')
    .insert('ul').attr('class', 'list-group')
    .selectAll('span')
    .data(['Republican Party', 'Democratic Party'])
    .enter().append('li').attr('class', function (id) {
      mainClass = "badge badge-pill";
      return id == 'Republican Party' ? `${mainClass} badge-republican` : `${mainClass} badge-democratic`;
    })
    .append('div').attr('class', 'legend-label')
    .attr('data-id', function (id) {
      return id;
    })
    .append('div', '.legend-label')
    .html(function (id) {
      return id;
    })
    .on('mouseover', function (id) {
      democraticFlag = id == 'Democratic Party';
      for (let i = 0; i < totalNum; i++) {
        isRepublican = republicanIdx.includes(i);
        chart.internal.mainBar[0][i].style.opacity = (isRepublican ^ democraticFlag) ? 1 : 0.5;
      }
    })
    .on('mouseout', function (id) {
      for (let i = 0; i < totalNum; i++) {
        chart.internal.mainBar[0][i].style.opacity = 1;
      }
    });
}
topSpeakers();