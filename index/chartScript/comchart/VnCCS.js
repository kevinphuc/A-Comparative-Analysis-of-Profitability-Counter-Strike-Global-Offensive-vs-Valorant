// Load data from CSV files
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("display", "none")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

Promise.all([
    d3.csv("data/AvgViewCS.csv"),
    d3.csv("data/AvgStreamCS.csv")
]).then(function(data) {
    const lineData = data[1];
    const barData = data[0];

    // Convert date strings to Date objects and values to numbers
    const parseDate = d3.timeParse("%Y-%m-%d");
    lineData.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    barData.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    // Set up dimensions and margins
    const margin = { top: 100, right: 300, bottom: 300, left: 100 }; // Increased left margin for bar chart text
    const width = 3000 - margin.left - margin.right;
    const height = 1000 - margin.top - margin.bottom;

    // Create SVG canvas
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleTime()
        .domain([
            d3.timeDay.offset(d3.min(lineData, d => d.date), -20), // Adjusted start of x-axis to half a day before the first data point
            d3.timeDay.offset(d3.max(lineData, d => d.date), 20)   // Adjusted end of x-axis to half a day after the last data point
        ])
        .range([0, width]);

    const yLine = d3.scaleLinear()
        .domain([0, d3.max(lineData, d => d.value) * 1.1]) // Adjusted the maximum domain value for a bit of spare space at the top
        .nice()
        .range([height, 0]);

    const yBar = d3.scaleLinear()
        .domain([0, d3.max(barData, d => d.value) * 2.5]) // Adjusted the maximum domain value for a bit of spare space at the top
        .nice()
        .range([height, 0]);

    // Add X axis (bottom)
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "25px");

    // Add Y axis for line chart (left)
    svg.append("g")
        .call(d3.axisLeft(yLine).tickFormat(formatAxis))
        .selectAll("text")
        .style("font-size", "25px");

    // Add Y axis for bar chart (right)
    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yBar).tickFormat(formatAxis))
        .selectAll("text")
        .style("font-size", "25px");

    // Draw line
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => yLine(d.value));

    svg.append("path")
        .datum(lineData)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke-width", 3) // Adjust the stroke width as needed
        .style("stroke", "orange"); // Adjust the line color if necessary

    // Draw bars
    const barWidth = 30;  // Adjust this value to make the bars narrower
    svg.selectAll(".bar")
        .data(barData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.date) - barWidth / 2)
        .attr("y", d => yBar(d.value))
        .attr("width", barWidth)
        .attr("height", d => height - yBar(d.value));

    // Add dots at the end of the line
    svg.selectAll(".dot")
        .data(lineData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date))
        .attr("cy", d => yLine(d.value))
        .attr("r", 7) // Adjust dot size as needed
        .on("mouseover", function(event, d) {
            showTooltip(event, d);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    // Function to show tooltip with combined data
    function showTooltip(event, d) {
        const barDatum = barData.find(data => +data.date.getTime() === +d.date.getTime());
        console.log("Line Data:", d);
        console.log("Bar Data:", barDatum);

        tooltip.style("display", "block")
            .html(`Date: ${d.date.toLocaleDateString()}<br>Viewers: ${formatValue(d.value)}<br>Channels: ${formatValue(barDatum.value)}`);
    }

    // Function to format axis ticks
    function formatAxis(d) {
        if (d >= 1000) {
            return d3.format(".2s")(d).replace("G", "B"); // Format in billions if needed
        }
        return d3.format(".2s")(d).replace("M", "K"); // Format in thousands
    }

    // Function to format tooltip values
    function formatValue(value) {
        return d3.format(".2s")(value); // Format to two decimal places
    }
});
