const margin = {top: 20, right: 30, bottom: 40, left: 300};
const width = 960 - margin.left - margin.right;
const height = 1500 - margin.top - margin.bottom;

const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


document.getElementById("game").addEventListener("change", function() {
    switch(this.value) {
        case 'val':
            document.getElementById("region").addEventListener("change", function() {
                switch(this.value) {
                    case 'america':
                        loadAmericaVALCSV(svg, width, height, margin);
                        break;
                    case 'emea':
                        loadEMEAVALCSV(svg, width, height, margin);
                        break;
                    case 'pacific':
                        loadPacificVALCSV(svg, width, height, margin);
                        break;
                    default:
                        break;
                }
            });
            break;
        case 'cs':
            document.getElementById("region").addEventListener("change", function() {
                switch(this.value) {
                    case 'america':
                        loadAmericaCSCSV(svg, width, height, margin);
                        break;
                    case 'emea':
                        loadEMEACSCSV(svg, width, height, margin);
                        break;
                    case 'pacific':
                        loadPacificCSCSV(svg, width, height, margin);
                        break;
                    default:
                        break;
                }
            });
            break;
        default:
            break;
    }
});