const margin = { top: 70, right: 300, bottom: 40, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const svg = d3.selectAll("#line-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

Promise.all([
  d3.csv("./data/Valodata.csv"),
  d3.csv("./data/csgodata.csv")
]).then(function (files) {
  const valoData = files[0];
  const csgoData = files[1];

  const parseDate = d3.timeParse("%Y-%m-%d");
  valoData.forEach((d) => {
    d.date = parseDate(d.date);
    d.value = +d.value;
  });
  csgoData.forEach((d) => {
    d.date = parseDate(d.date);
    d.value = +d.value;
  });

  const allData = [...valoData, ...csgoData];
  x.domain(d3.extent(allData, d => d.date));
  y.domain([0, d3.max(allData, d => d.value)]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x)
      .ticks(d3.timeMonth.every(3))
      .tickFormat(d3.timeFormat("%b %Y")));

  svg.append("g")
    .call(d3.axisLeft(y)
      .ticks(10)
      .tickFormat(d3.format(".2s")));

  const valoLine = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

  const csgoLine = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

  svg.append("path")
    .datum(valoData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", valoLine);

  svg.append("path")
    .datum(csgoData)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1.5)
    .attr("d", csgoLine);

  svg.append("text")
    .attr("transform", `translate(${width + 10},${y(valoData[valoData.length - 1].value)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("VALORANT")
    .style("font-family", "Roboto");

  svg.append("text")
    .attr("transform", `translate(${width + 10},${y(csgoData[csgoData.length - 1].value)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "start")
    .style("fill", "orange")
    .text("CS:GO")
    .style("font-family", "Roboto");

}).catch(function (error) {
  console.error('Error loading or parsing data:', error);
});
