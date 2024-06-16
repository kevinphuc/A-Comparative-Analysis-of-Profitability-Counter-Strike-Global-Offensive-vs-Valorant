function loadEMEACSCSV(svg, width, height, margin) {
    d3.csv("data/emeacs.csv").then(data => {
        const parsedData = data.map(d => ({
            name: d.Events,
            value: parseFloat(d["Prizes"])
        }));

        svg.selectAll("*").remove();

        const x = d3.scaleLinear()
            .domain([0, d3.max(parsedData, d => d.value)])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(parsedData.map(d => d.name))
            .range([0, height])
            .padding(0.1);

        svg.selectAll(".bar")
            .data(parsedData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("width", d => x(d.value))
            .attr("y", d => y(d.name))
            .attr("height", y.bandwidth())
            .attr("fill", "#0000ff");

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));
    });
}