const pricingData = [
    { model: "Hourly", cost: 500 },
    { model: "Fixed", cost: 2000 },
    { model: "Subscription", cost: 1000 }
];

let width = 500, height = 300, margin = 40;
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin * 2)
    .attr("height", height + margin * 2)
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

const x = d3.scaleBand()
    .domain(pricingData.map(d => d.model))
    .range([0, width])
    .padding(0.4);

const y = d3.scaleLinear()
    .domain([0, d3.max(pricingData, d => d.cost)])
    .range([height, 0]);

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

const bars = svg.selectAll("rect")
    .data(pricingData)
    .enter()
    .append("rect")
    .attr("x", d => x(d.model))
    .attr("y", d => y(d.cost))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.cost))
    .attr("fill", "steelblue");

function updateChart(newData) {
    y.domain([0, d3.max(newData, d => d.cost)]);

    svg.select(".y-axis").call(d3.axisLeft(y));

    bars.data(newData)
        .transition().duration(500)
        .attr("y", d => y(d.cost))
        .attr("height", d => height - y(d.cost));
}

function updateCosts() {
    const numTasks = document.getElementById("numTasks").value;
    const complexity = document.getElementById("complexity").value;

    const baseRates = { Hourly: 50, Fixed: 500, Subscription: 200 };
    const complexityMultiplier = { Low: 1, Medium: 1.5, High: 2 };

    const updatedData = pricingData.map(d => ({
        model: d.model,
        cost: numTasks * baseRates[d.model] * complexityMultiplier[complexity]
    }));

    updateChart(updatedData);
}

function resizeChart() {
    width = document.getElementById("chart").clientWidth - margin * 2;
    height = document.getElementById("chart").clientHeight - margin * 2;

    d3.select("svg")
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2);

    x.range([0, width]);
    y.range([height, 0]);

    svg.select(".x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.select(".y-axis")
        .call(d3.axisLeft(y));

    bars
        .attr("x", d => x(d.model))
        .attr("y", d => y(d.cost))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.cost));
}

window.addEventListener("resize", resizeChart);
resizeChart();
