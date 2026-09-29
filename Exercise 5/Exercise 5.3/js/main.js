(() => {

    const width = 600;
    const height = 400;

    // Radius: half the shortest side, minus padding so labels have room
    const radius = Math.min(width, height) / 2 - 20;

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid black");

    // Move (0,0) to the middle: arcs are drawn around the origin
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const drawDonutChart = data => {

        // Colour scale: one colour per category
        const colourScale = d3.scaleOrdinal()
            .domain(data.map(d => d.size))
            .range(d3.schemeSet2);

        // Pie: converts counts into start/end angles
        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);                 // keep the order of our data

        // Arc generator: turns angles into a curved path
        const arcGenerator = d3.arc()
            .innerRadius(radius * 0.6)   // 0 would make a pie chart
            .outerRadius(radius)
            .padAngle(0.02)
            .cornerRadius(4);

        // One <g> per slice, holding the arc and its label
        const arcs = innerChart.selectAll(".arc")
            .data(pie(data))
            .join("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arcGenerator)
            .attr("fill", d => colourScale(d.data.size));

        // Labels at the middle of each slice
        arcs.append("text")
            .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("font-size", "14px")
            .text(d => d.data.size);
    };

    d3.csv("data/Data_exercise 5.3.csv", d => ({
        size: d.Screensize_Category,
        count: +d.Count
    })).then(data => {
        console.log(data);

        // Sizes have a natural order, so use it instead of sorting by count
        const order = ["small", "medium", "large"];
        data.sort((a, b) => order.indexOf(a.size) - order.indexOf(b.size));

        drawDonutChart(data);
    });

})();