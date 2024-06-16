var rowConverter = function(d) {
        return {
        y2022: parseFloat(d["2022"]),
        y2023: parseFloat(d["2023"]),
        population_2023: parseFloat(d["2023 Population"]),
        CCA3: d.CCA3,
        country: d["Country/Region"],
        };
    }


d3.csv("data/CS-Geomap.csv", rowConverter).then(function(data){
d3.json("chartScript/geoMap/gistfile1.js").then(function(geojson){

        for (var i = 0; i < geojson.features.length; i++) {
            var jsonCountryName = geojson.features[i].properties.name;

            for (var j = 0; j < data.length; j++) {
                var dataCountry = data[j].country;
                geojson.features[i].properties.value = [null]
                if (dataCountry == jsonCountryName) {
                    var arrValue = [  data[j].y2022, data[j].y2023]
                    geojson.features[i].properties.value = arrValue
                    break;
                }
            }
        }
        draw_geoJSON(geojson, "y2023")

        const year_index = year_indexes["y2023"]

        var valid_data = []
        for (let i = 0; i < geojson.features.length; i++) {
            const feature = geojson.features[i]
            if(feature.properties.value[year_index] != null && !isNaN(feature.properties.value[year_index])){
                valid_data.push(feature)
            }
          }
        
        valid_data = valid_data.sort(function(a, b){
            return - a.properties.value[year_index] + b.properties.value[year_index]
        })
        var used_data = valid_data.slice(0, 1)

        draw_barChart(used_data, valid_data, "y2023")
    })
})

year_indexes = {
    "y2022": 0,
    "y2023": 1
}

function draw_geoJSON(geojson, year){
        var height = 1200
        var width = 1600


        var svg = d3.select("#world_map_SVG")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .style("display", "block")
                    .style("margin", "auto")              
    
        var year_index = year_indexes[year]

                    
        var projection = d3.geoMercator().fitSize([width, height], geojson)
    
        var path = d3.geoPath()
                        .projection(projection);

        var values = geojson.features.map(function(d) {
            return d.properties.value[year_index];
        });

        let maxVal = d3.max(values);
        let minVal = d3.min(values);

        

        var colorScale = d3.scaleLinear()
                  .domain([minVal, maxVal]) // Normalized range
                  .range (["red","orange"]);
        // var colorScale = d3.scaleSequential(d3.interpolateBlues)
          //      .domain([d3.min(values), d3.max(values)]);

        colorScale.range(colorScale.range().reverse());
        
        svg.selectAll("path")
                .data(geojson.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke-width", "0.5")
                .style("stroke", "black")
                .attr("cursor", "pointer")
                .attr("fill", function(d){
                    if(d.properties.value[year_index] == null || d.properties.value[year_index] == 0 || isNaN(d.properties.value[year_index])){
                        return "rgb(128, 128, 128)"
                    }
                    else{
                        return colorScale(d.properties.value[year_index]);
                    }
                })
                .append("svg:title")
                .text(function(d) { 
                    if(d.properties.value[year_index] == null || d.properties.value[year_index] == 0 || isNaN(d.properties.value[year_index])){
                        return "No data"
                    }
                    else{
                        const value = "Country: " + String(d.properties.name) + "\n"
                        + "Player " + year.slice(1) + ": " + String(d.properties.value[year_index]) +"\n" 
                        return value;                    
                    }
                })


        d3.select("#year-select").on("change", function (event, d) {
            let criterion = event.target.value;
            d3.select("svg").remove()
            draw_geoJSON(geojson, criterion)  
        }
        )

        
    }
    