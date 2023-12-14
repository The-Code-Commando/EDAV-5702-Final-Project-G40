function loadData(url) {
  return d3.csv(url).then(function(data) {
    // Map each row to an object
    const objects = data.map(function(row) {

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



function calculatePercentage(value, total) {
  return (value / total * 100).toFixed(2) + '%';
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




function update(data) {

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .value(function(d) {return d[1]; })
    .sort(function(a, b) { return d3.ascending(a.key, b.key);} )
  const data_ready = pie(Object.entries(data))


  // map to data
  const u = svg.selectAll("path")
    .data(data_ready)

  const path = u.join('path')
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
  .attr("class", "dropdown-btn")
  .on("change", function() {
    update(data[this.value]);
  });

dropdown.selectAll("option")
  .attr("id", "inDropdown")
  .data(["SR Tendulkar", "KC Sangakkara", "V Kohli", "RT Ponting", "ST Jayasuriya", "DPMD Jayawardene", "Inzamam-Ul-Haq", "JH Kallis", "SC Ganguly", "R Dravid", "MS Dhoni"])
  .enter().append("option")
  .attr("value", (d,i)=>i)
  .text(function(d) { return d; });


});




// Add hover functionality and modify labels

// Assuming the pie chart segments are appended like this (the actual code might be different)
// svg.selectAll(".arc").data(pie(data)).enter().append("path")
// .attr("class", "arc")
// ... (other attributes setting)

// Modify to add hover functionality and label
svg.selectAll(".arc")
  .on("mouseover", function(event, d) {
    // Show value on hover
    // Assuming there's a tooltip or similar element to show the information
    tooltip.text('Value: ' + d.data.value); // Modify 'd.data.value' according to actual data structure
    tooltip.style("visibility", "visible");
  })
  .on("mousemove", function(event) {
    tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
  })
  .on("mouseout", function(){
    tooltip.style("visibility", "hidden");
  });

// Modify labels to show percentages
// This assumes that labels are also created using D3 and bound to the same data as the pie segments
svg.selectAll(".label")
  .text(function(d) {
    return calculatePercentage(d.data.value, total); // Modify 'd.data.value' and 'total' according to actual data structure
  });
