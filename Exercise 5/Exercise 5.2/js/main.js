(() => {

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 60, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid black");

    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const drawLineChart = data => {

        // Both axes are continuous, so both are linear scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))        // [1998, 2024]
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.price)])
            .range([innerHeight, 0])
            .nice();

        // Axes (tickFormat "d" stops years showing as 1,998 or 1998.5)
        const bottomAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format("d"));
        const leftAxis = d3.axisLeft(yScale);

        innerChart.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(bottomAxis)
            .style("font-size", "13px");

        innerChart.append("g")
            .call(leftAxis)
            .style("font-size", "13px");

        // Axis labels
        innerChart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -innerHeight / 2)
            .attr("y", -margin.left + 20)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Average spot price ($/MWh)");

        innerChart.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + 45)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Year");

        // Scatter plot: one circle per data point
        innerChart.selectAll(".dot")
            .data(data)
            .join("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.price))
            .attr("r", 4)
            .attr("fill", "steelblue");

        // Line generator: turns each data row into an [x, y] pixel point
        const lineGenerator = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.price));

        // Draw the line as a path
        innerChart.append("path")
            .datum(data)                       // ONE path for the whole data set
            .attr("class", "line")
            .attr("d", lineGenerator)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);
    };

d3.csv("data/ARE_Spot_Prices.csv", d => ({
    year: +d.Year,
    price: +d["Average Price (notTas-Snowy)"]
})).then(data => {
    console.log(data);
    data.sort((a, b) => a.year - b.year);
    drawLineChart(data);
});

})();