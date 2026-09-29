const width = 600;
const height = 400;
const margin = { top: 40, right: 30, bottom: 60, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("border", "1px solid black");

const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const drawBarChart = data => {

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.screen))
        .range([0, innerWidth])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energy)])
        .range([innerHeight, 0])
        .nice();

    innerChart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).tickSize(0))
        .style("font-size", "14px");

    innerChart.append("g")
        .call(d3.axisLeft(yScale))
        .style("font-size", "13px");

    innerChart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Mean energy consumption (kWh/year)");

    innerChart.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.screen))
        .attr("y", d => yScale(d.energy))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.energy))
        .attr("fill", "steelblue");

    innerChart.selectAll(".bar-label")
        .data(data)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.screen) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.energy) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text(d => Math.round(d.energy));
};

// Option B: original file, untouched
 d3.csv("data/Data_exercise 5.1.csv", d => ({
     screen: d.Screen_Tech.toUpperCase(),
     energy: +d["Mean(Labelled energy consumption (kWh/year))"]
 })).then(data => {
    console.log(data);
    data.sort((a, b) => b.energy - a.energy);
    drawBarChart(data);
});
