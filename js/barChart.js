
      var margin = {top: 20, right: 20, bottom: 30, left: 60},
          width = 760 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

     

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1, 1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(10);

      var svgBar = d3.select("#assetBar").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.csv("data/bankAssets2012.csv", function(error, data) {

        data.forEach(function(d) {
          d.value = +d.value;
        });

        x.domain(d3.range(data.length))
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        svgBar.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svgBar.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Bank Assets (in millions)");

        svgBar.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.key); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .attr("fill", function(d,i) { return "rgb(0, 0, " + i * 20 + ")"; })

         .on("mouseover",function(d){

            var xPosition = width - 300;
            var yPosition = height;
            var formatValue = d3.format(",d")

            d3.select("#tooltip")
              .style("left",xPosition+"px")
              .style("right",yPosition+"px")
              .select("#key")
              .text(d.key + ":  " + formatValue(d.value))
              
            d3.select(this)
              .attr("fill","teal");
              d3.select("#tooltip").classed("hidden",false);

              var pieData = [1500000,d.value];
              //get newValue
              //if not more than 1 value in array, push new number
              //else if more than 1 value, pop 1st element, then push
              /*
              if(pieData.length > 1){
                pieData.pop();
                pieData.push(d.value);
              }
              else{
                pieData.push(d.value);
              }
              */
              //pieData= pieData.unshift(10000);
              

              var pieChart = d3.layout.pie();
              var pieWidth = 90;
              var pieHeight = 90;
              var outerRadius = pieWidth/2,
                 innerRadius = 00;

              var arc = d3.svg.arc()
                          .innerRadius(innerRadius)
                          .outerRadius(outerRadius)
                          

              var color = d3.scale.category10();

              var pieSvg = d3.select("pie")
                              .append("svg")
                              .attr("width",pieWidth)
                              .attr("height", pieHeight)
                             

              var arcs = svg.selectAll("arc")
                            .data(pieChart(pieData))
                            .enter()
                            .append("g")
                            .attr("class","arc")
                            .attr("transform", "translate(" +xPosition + ", " + yPosition/2 + ")")
                  console.log(pieData);

                  arcs.append("path")
                      .attr("fill", function(d, i) {
                      return color(i); })
                      .attr("d", arc);
                      
               })

             .on("mouseout",function(d,i){
                d3.select(this)
                  .transition()
                  .duration(350)
                  .attr("fill", "rgb(0, 0, " + (i * 20) + ")")            
                //d3.select("#tooltip").classed("hidden",true);
                
             });



        d3.select("input").on("change", change);

        var sortTimeout = setTimeout(function() {
          d3.select("input").property("checked", true).each(change);
        }, 2000);

        function change() {
          clearTimeout(sortTimeout);

          // Copy-on-write since tweens are evaluated after a delay.
          var x0 = x.domain(data.sort(this.checked
              ? function(a, b) { return b.value - a.value; }
              : function(a, b) { return d3.ascending(a.key, b.key); })
              .map(function(d) { return d.key; }))
              .copy();

          var transition = svgBar.transition().duration(750),
              delay = function(d, i) { return i * 50; };

              transition.selectAll(".bar")
                  .delay(delay)
                  .attr("x", function(d) { return x0(d.key); });

              transition.select(".x.axis")
                  .call(xAxis)
                  .selectAll("g")
                  .delay(delay);
        }
      });

