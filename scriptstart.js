const margin = { top: 70, right: 300, bottom: 40, left: 80 }; 
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Set up the x and y scales
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// Create the SVG element and append it to the chart container
const svg = d3.select("#chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the CSV files
Promise.all([
  d3.csv("Valodata.csv"),
  d3.csv("csgodata.csv")
]).then(function(files) {
  const valoData = files[0];
  const csgoData = files[1];

  console.log("ValoData loaded:", valoData); // Debugging step
  console.log("CsgoData loaded:", csgoData); // Debugging step

  // Parse the date and value from the CSV files
  const parseDate = d3.timeParse("%Y-%m-%d");
  valoData.forEach(function(d) {
    d.date = parseDate(d.date);
    d.value = +d.value;
  });
  csgoData.forEach(function(d) {
    d.date = parseDate(d.date);
    d.value = +d.value;
  });

  console.log("Parsed ValoData:", valoData); // Debugging step
  console.log("Parsed CsgoData:", csgoData); // Debugging step

  // Set the domains of the scales
  const allData = [...valoData, ...csgoData];
  x.domain(d3.extent(allData, d => d.date));
  y.domain([0, d3.max(allData, d => d.value)]);

  // Add the x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x)
      .ticks(d3.timeMonth.every(3))
      .tickFormat(d3.timeFormat("%b %Y")));

  // Add the y-axis with formatted ticks for large values
  svg.append("g")
    .call(d3.axisLeft(y)
      .ticks(10)
      .tickFormat(d3.format(".2s"))); // Format large numbers

  // Create the line generators
  const valoLine = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

  const csgoLine = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

  // Add the ValoData line path
  svg.append("path")
    .datum(valoData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", valoLine);

  // Add the CsgoData line path
  svg.append("path")
    .datum(csgoData)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1.5)
    .attr("d", csgoLine);

  // Add labels for each dataset at the end of the lines
  // Add labels for each dataset at the end of the lines
svg.append("text")
.attr("transform", `translate(${width + 10},${y(valoData[valoData.length - 1].value)})`) // Move text to the right by 10 units
.attr("dy", "0.35em")
.attr("text-anchor", "start") // Anchor text to the start (left) of the text element
.style("fill", "steelblue")
.text("Valorant")
.style("font-family", "Ariel");

svg.append("text")
.attr("transform", `translate(${width + 10},${y(csgoData[csgoData.length - 1].value)})`) // Move text to the right by 10 units
.attr("dy", "0.35em")
.attr("text-anchor", "start") // Anchor text to the start (left) of the text element
.style("fill", "orange")
.text("CS:GO")
.style("font-family", "Ariel");


}).catch(function(error) {
  console.error('Error loading or parsing data:', error);
});
