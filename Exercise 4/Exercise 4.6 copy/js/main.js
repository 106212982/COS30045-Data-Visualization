const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 500 600")
    .style("border", "1px solid black");

const drawBarChart = data => {

    const labelSpace = 100;   // room on the left for brand names

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([0, 350]);     // 100 + 350 = 450, leaves 50px for value labels

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand))
        .range([0, 600])
        .padding(0.2);

    // One group per brand: holds the bar and both labels together
    const barAndLabel = svg
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

    // Bars
    barAndLabel
        .append("rect")
        .attr("class", d => `bar bar-${d.count}`)
        .attr("x", labelSpace)
        .attr("y", 0)
        .attr("width", d => xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "blue");

    // Brand names (right-aligned, just left of the bars)
    barAndLabel
        .append("text")
        .text(d => d.brand)
        .attr("x", labelSpace - 10)
        .attr("y", yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .style("font-size", "13px");

    // Count values (just past the end of each bar)
    barAndLabel
        .append("text")
        .text(d => d.count)
        .attr("x", d => labelSpace + xScale(d.count) + 5)
        .attr("y", yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .style("font-size", "13px");
};

d3.csv("data/tvBrandCount.csv", d => {
    return {
        brand: d.brand,
        count: +d.count
    };
}).then(data => {
    data.sort((a, b) => b.count - a.count);
    drawBarChart(data);
});