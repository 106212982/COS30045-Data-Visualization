
const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

d3.csv("data/tvBrandCount.csv", d => {
    return {
        brand: d.brand,
        count: +d.count
    };
}).then(data => {

    console.log(data);
    console.log(data.length);
    console.log(d3.max(data, d => d.count));
    console.log(d3.min(data, d => d.count));
    console.log(d3.extent(data, d => d.count));

    // Sort from highest to lowest
    data.sort((a, b) => b.count - a.count);

    console.log(data);

    // Pass data to the chart function
    drawBarChart(data);
});