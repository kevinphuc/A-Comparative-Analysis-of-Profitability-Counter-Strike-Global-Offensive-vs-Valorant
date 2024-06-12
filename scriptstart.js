const margin = { top: 70, right: 30, bottom: 40, left: 80 }; 
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

// Load the CSV file
d3.csv("Valodata.csv").then(function(data) {
  console.log("Data loaded:", data); // Debugging step

  // Parse the date and value from the CSV file
  const parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.value = +d.value;
  });

  console.log("Parsed data:", data); // Debugging step

  // Set the domains of the scales
  x.domain(d3.extent(data, d => d.date));
  y.domain([0, d3.max(data, d => d.value)]);

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

  // Create the line generator
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

  // Add the line path
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);
}).catch(function(error) {
  console.error('Error loading or parsing data:', error);
});
