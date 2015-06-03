var margin = {top: 100, right: 50, bottom: 100, left: 50};
var tree_width = window.innerWidth - margin.left - margin.right;
var tree_height = window.innerHeight - margin.top - margin.bottom;

var tree = d3.layout.tree()
    .separation(function(a, b) { return a.parent === b.parent ? 10 : 20; })
    .children(function(d) { return d.littles; })
    .size([tree_width, tree_height]);

var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.x, d.y]; });

var canvas = d3.select("body").append("svg")
    .attr("width", tree_width + margin.left + margin.right)
    .attr("height", tree_height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("json/example.json", function(json) {
  var nodes = tree.nodes(json);

  var link = canvas.selectAll(".link")
      .data(tree.links(nodes))
    .enter()
      .insert("path", "g")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 3)
      .attr("shape-rendering", "crispEdges")
      .attr("class", "link")
      .attr("d", elbow);

  var node = canvas.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      
  node.append("rect")
      .attr("width", 240)
      .attr("height", 100)
      .attr("fill", "lightsteelblue")
      .attr("stroke-width", 3)
      .attr("stroke", "#000")
      .attr("x", function(d) { return d.x - 120;})
      .attr("y", function(d) { return d.y - 40;});

  node.append("text")
      .attr("class", "name")
      .attr("x", function(d){ return d.x; })
      .attr("y", function(d){ return d.y - 15;})
      .style("text-anchor", "middle")
      .text(function(d) { return d.name; });

  node.append("text")
      .attr("x", function(d) { return d.x;})
      .attr("y", function(d) { return d.y + 10})
      .style("text-anchor", "middle")
      .attr("class", "nickname")
      .text(function(d){ return "Nickname: " + d.nickname; });

  node.append("text")
      .attr("x", function(d) { return d.x;})
      .attr("y", function(d) { return d.y + 30 })
      .style("text-anchor", "middle")
      .attr("class", "pledge class")
      .text(function(d) { return "Class: " + d.class; });

  node.append("text")
      .attr("x", function(d) { return d.x})
      .attr("y", function(d) { return d.y + 50})
      .style("text-anchor", "middle")
      .attr("class", "years active")
      .text(function(d) { return d.pledged + " – " + d.graduated; });

});

function elbow(d, i) {
  return "M" + d.source.x + "," + d.source.y
       + "V" + (3*d.source.y + 4*d.target.y)/7
       + "H" + d.target.x
       + "V" + d.target.y;
};
