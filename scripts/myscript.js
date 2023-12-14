function loadData(url) {
  return d3.csv(url).then(function(data) {
    // Map each row to an object
    const objects = data.map(function(row) {
      // Modify this part based on your CSV structure
      // For example, if your CSV has columns 'name', 'age', 'city'
      return {
        // player: row.Player,
        // out: row.OUT,
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

// Example usage
const url = "https://raw.githubusercontent.com/Abhik-Biswas/Project-CSV/main/Data_Player_dismissial_preprocessed.csv";
loadData(url).then(function(objects) {
  console.log(objects);

  const data = objects;
  const width = 550,
    height = 400,
    margin = 40;

  // The radius of the pieplot is half the width or half the         height (smallest one). I subtract a bit of margin.
  const radius = Math.min(width, height) / 2 - margin;

// append the svg object to the div called 'my_dataviz'



  const svg = d3.select("div#plot")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);

  const color = d3.scaleOrdinal()
  .domain(["caught", "bowled", "stumped", "caught_behind", "lbw", "run_out", "others"])
  .range(d3.schemeDark2);

  // A function that create / update the plot for a given variable:
function update(data) {

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .value(function(d) {return d[1]; })
    .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  const data_ready = pie(Object.entries(data))

  // map to data
  const u = svg.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .join('path')
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

 // Add annotations with arrows
    svg.selectAll(".annotation-line")
      .data(data_ready)
      .join("line")
      .transition()
      .duration(1000)
      .attr("class", "annotation-line")
      .attr("x1", function(d) { return d3.arc().innerRadius(radius).outerRadius(radius * 1.16).centroid(d)[0]; })
      .attr("y1", function(d) { return d3.arc().innerRadius(radius).outerRadius(radius * 1.16).centroid(d)[1]; })
      .attr("x2", function(d) { return d3.arc().innerRadius(radius * 0.75).outerRadius(radius * 1.16).centroid(d)[0]; })
      .attr("y2", function(d) { return d3.arc().innerRadius(radius * 0.75).outerRadius(radius * 1.16).centroid(d)[1]; })
      .attr("stroke", "black")
      .style("stroke-width", "1.2px");

    svg.selectAll(".annotation-text")
      .data(data_ready)
      .join("text")
      .transition()
      .duration(1000)
      .attr("class", "annotation-text")
      .text(function(d) { return `${d.data[0]}: ${d.data[1]}`; })
      .attr("transform", function(d) {
        const pos = d3.arc().innerRadius(radius * 1.23).outerRadius(radius * 1.28).centroid(d);
        return `translate(${pos[0]}, ${pos[1]})`;
      })
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "black");

}

// Initialize the plot with the first dataset

update(data[0]);

var dropdown = d3.select("div#plot")
  .append("select")
  .attr("id", "datasetDropdown")
  .on("change", function() {
    update(data[this.value]);
  });

dropdown.selectAll("option")
  .data(["SR Tendulkar", "KC Sangakkara", "V Kohli", "RT Ponting", "ST Jayasuriya", "DPMD Jayawardene", "Inzamam-Ul-Haq", "JH Kallis", "SC Ganguly", "R Dravid", "MS Dhoni"])
  .enter().append("option")
  .attr("value", (d,i)=>i)
  .text(function(d) { return d; });


});


