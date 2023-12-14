function loadData(url) {
  return d3.csv(url).then(function(data) {
    const objects = data.map(function(row) {
      return {
        caught: row.Caught,
        bowled: row.Bowled,
        stumped: row.Stumped,
        lbw: row.LBW,
        run_out: row.Run_Out,
        caught_behind: row.Caught_Behind,
        others: row.Others
      };
    });

    return objects;
  });
}

const url = "https://raw.githubusercontent.com/Abhik-Biswas/Project-CSV/main/Data_Player_dismissial_preprocessed.csv";
loadData(url).then(function(objects) {
  console.log(objects);

  const data = objects;
  const width = 550,
    height = 450,
    margin = 75;

  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select("div#plot")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(295, 220)`);

  const color = d3.scaleOrdinal()
    .domain(["caught", "bowled", "stumped", "caught_behind", "lbw", "run_out", "others"])
    .range(d3.schemeDark2);

  const tooltip = d3.select("div#plot")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function update(data) {
    const pie = d3.pie()
      .value(function(d) { return d[1]; })
      .sort(function(a, b) { return d3.ascending(a.key, b.key); });
    const data_ready = pie(Object.entries(data));

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const u = svg.selectAll("path")
      .data(data_ready);

    u
      .join('path')
      .on("mouseover", function(event, d) {
        const percentage = d3.format(".1%")(d.data[1] / d3.sum(data_ready, d => d.data[1]));
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${d.data[0]}: ${d.data[1]} (${percentage})`)
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .attr('d', arc)
      .attr('fill', function(d) { return color(d.data[0]); })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1);

    svg.selectAll(".annotation-line")
      .data(data_ready)
      .join("line")
      .on("mouseover", function(event, d) {
        const percentage = d3.format(".1%")(d.data[1] / d3.sum(data_ready, d => d.data[1]));
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${d.data[0]}: ${d.data[1]} (${percentage})`)
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .attr("class", "annotation-line")
      .attr("x1", function(d) { return d3.arc().innerRadius(radius).outerRadius(radius * 1.16).centroid(d)[0]; })
      .attr("y1", function(d) { return d3.arc().innerRadius(radius).outerRadius(radius * 1.16).centroid(d)[1]; })
      .attr("x2", function(d) { return d3.arc().innerRadius(radius * 0.75).outerRadius(radius * 1.16).centroid(d)[0]; })
      .attr("y2", function(d) { return d3.arc().innerRadius(radius * 0.75).outerRadius(radius * 1.16).centroid(d)[1]; })
      .attr("stroke", "black")
      .style("stroke-width", "1.2px");

    svg.selectAll(".annotation-text")
      .data(data_ready)
      .join("text")
      .on("mouseover", function(event, d) {
        const percentage = d3.format(".1%")(d.data[1] / d3.sum(data_ready, d => d.data[1]));
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${d.data[0]}: ${d.data[1]} (${percentage})`)
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .attr("class", "annotation-text")
      .text(function(d) { return `${d.data[0]}`; })
      .attr("transform", function(d) {
        const pos = d3.arc().innerRadius(radius * 1.23).outerRadius(radius * 1.28).centroid(d);
        return `translate(${pos[0]}, ${pos[1]})`;})
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "black");
  }

  update(data[0]);

  var dropdown = d3.select("div#plot")
    .append("select")
    .attr("class", "dropdown-btn")
    .on("change", function() {
      update(data[this.value]);
    });

  dropdown.selectAll("option")
    .data(["SR Tendulkar", "KC Sangakkara", "V Kohli", "RT Ponting", "ST Jayasuriya", "DPMD Jayawardene", "Inzamam-Ul-Haq", "JH Kallis", "SC Ganguly", "R Dravid", "MS Dhoni"])
    .enter().append("option")
    .attr("value", (d, i) => i)
    .text(function(d) { return d; });
});



