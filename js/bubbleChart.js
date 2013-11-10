

function x(d) { return d.lifeExpectancy; }
function y(d) { return d.income; }
function radius(d) { return d.population; }
function color(d) { return d.region; }
function key(d) { return d.name; }


var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 99.5},
    width = 860 - margin.right,
    height = 500 - margin.top - margin.bottom,

    xScale = d3.scale.log().domain([1e10, 5e13]).range([0, width]),
    yScale = d3.scale.sqrt().domain([1e9, 11e12]).range([height, 0]),

    xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(5, d3.format(",d")),
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5, d3.format(",d")),

    radiusScale = d3.scale.sqrt().domain([0, 1e3]).range([0, 20]),
    colorScale = d3.scale.category10();


var svgBubble = d3.select("#bubbleChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the x-axis.
    svgBubble.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the y-axis.
    svgBubble.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add an x-axis label.
    svgBubble.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 10)
        .text("total institutional assets");

    // Add a y-axis label.
    svgBubble.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 10)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("total institutional deposits");

    svgBubble.append("text")
        .attr("class", "key")
        .attr("y", height- 100)
        .attr("x", width - 100)
        .text("Bank Of America");

    svgBubble.append("rect")
        .attr("x", width - 120)
        .attr("y", height - 110)
        .attr("width", 10)
        .attr("height", 10)

    svgBubble.append("text")
        .attr("class", "key")
        .attr("x", width - 100)
        .attr("y", height- 130)
        .text("JP Morgan Chase");

     svgBubble.append("rect")
        .attr("x", width - 120)
        .attr("y", height - 140)
        .attr("width", 10)
        .attr("height", 10)

    svgBubble.append("text")
        .attr("class", "key")
        .attr("y", height- 160)
        .attr("x", width - 100)
        .text("Citibank");

    svgBubble.append("rect")
        .attr("x", width - 120)
        .attr("y", height - 170)
        .attr("width", 10)
        .attr("height", 10)

    svgBubble.append("text")
        .attr("class", "key")
        .attr("y", height- 190)
        .attr("x", width - 100)
        .text("Wells Fargo");

    svgBubble.append("rect")
        .attr("x", width - 120)
        .attr("y", height - 200)
        .attr("width", 10)
        .attr("height", 10)




// Add the year label; the value is set on transition.
var label = svgBubble.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", 135)
    .attr("x", width - 370)
    .text(2003);

// Load the data.
d3.json("bankData.json", function(nations) {

  // A bisector since many nation's data is sparsely-defined.
  var bisect = d3.bisector(function(d) { return d[0]; });

  // Add a dot per nation. Initialize the data at 1800, and set the colors.
  var dot = svgBubble.append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data(interpolateData(2003))
      .enter().append("circle")
      .attr("class", "dot")
      .style("fill", function(d) { 
        var returnColor;
        if(d.name==="Bank Of America"){
          returnColor="teal"
        }
        else if(d.name==="Citibank, National Association"){
          returnColor="blue"
        }
        else if(d.name==="Wells Fargo"){
          returnColor="green"
        }
        else if(d.name==="JP Morgan Chase"){
          returnColor="teal"
        }
        else{
          returnColor = "grey"
        }
        return returnColor;
        })
      .call(position)
      .sort(order);

  // Add a title.
  dot.append("title")
     .text(function(d) { return d.name + 
                          "\n" + "Total Institutional Assets: " + d.income +
                          "\n" + "Total Institutional Deposits: " + d.lifeExpectancy +
                          "\n" + "Total # Branches: " + d.population; })


  // Add an overlay for the year label.
  var box = label.node().getBBox();

  var overlay = svgBubble.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height)
        
        .on("mouseover", enableInteraction);

  // Start a transition that interpolates the data based on year.
  svgBubble.transition()
      .duration(30000)
      .ease("linear")
      .tween("year", tweenYear)
      .each("end", enableInteraction);

  // Positions the dots based on data.
  function position(dot) {
    dot .attr("cx", function(d) { return xScale(x(d)); })
        .attr("cy", function(d) { return yScale(y(d)); })
        .attr("r", function(d) { return radiusScale(radius(d)); });
  }

  // Defines a sort order so that the smallest dots are drawn on top.
  function order(a, b) {
    return radius(b) - radius(a);
  }

  // After the transition finishes, you can mouseover to change the year.
  function enableInteraction() {
    var yearScale = d3.scale.linear()
        .domain([2003, 2011])
        .range([box.x + 10, box.x + box.width - 10])
        .clamp(true);

    // Cancel the current transition, if any.
    svgBubble.transition().duration(0);

    overlay
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove)
        .on("touchmove", mousemove);

    function mouseover() {
      label.classed("active", true);
    }

    function mouseout() {
      label.classed("active", false);
    }

    function mousemove() {
      displayYear(yearScale.invert(d3.mouse(this)[0]));
    }
  }

  // Tweens the entire chart by first tweening the year, and then the data.
  // For the interpolated data, the dots and label are redrawn.
  function tweenYear() {
    var year = d3.interpolateNumber(2003, 2011);
    return function(t) { displayYear(year(t)); };
  }

  // Updates the display to show the specified year.
  function displayYear(year) {
    dot.data(interpolateData(year), key).call(position).sort(order);
    label.text(Math.round(year));
  }

  // Interpolates the dataset for the given (fractional) year.
  function interpolateData(year) {
    return nations.map(function(d) {
      return {
        name: d.name,
        region: d.region,
        income: interpolateValues(d.income, year),
        population: interpolateValues(d.population, year),
        lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
      };
    });
  }

  // Finds (and possibly interpolates) the value for the specified year.
  function interpolateValues(values, year) {
    var i = bisect.left(values, year, 0, values.length - 1),
        a = values[i];

    if (i > 0) {
      var b = values[i - 1],
          t = (year - a[0]) / (b[0] - a[0]);
      return a[1] * (1 - t) + b[1] * t;
    }
    return a[1];
    
  }
});

