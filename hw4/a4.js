function addTooltip(popLookup) {

 //console.log(popLookup);
 //Reference for tooltip styling : "http://bl.ocks.org/Caged/6476579"


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "Country: Population | <span style='color:red'>" + d.properties.county_nam+ " : " + popLookup.get(d.properties.county_nam)+"</span>";
  });

var svg = d3.select("#map").append("svg");

svg.call(tip);

	d3.select("#map").selectAll(".county")
      .on('mouseover',tip.show)
      .on('mouseout', tip.hide);



}

function addBrushing() {
    //Reference: http://codepen.io/dakoop/pen/yOXWPZ/ 

    var bar = d3.selectAll("#bar>svg>g")

    var abc = bar.select("rect");
    abc.on("mousemove", function(){
      d3.select(this).classed("state", true)
      var county = d3.select(this).datum().County;

      d3.select("#map").selectAll(".county").filter(function(d){
        return d.properties.county_nam == county
      })
      .classed("state", true);
    })

abc.on("mouseout", function(){

      d3.select(this).classed("state", false)
      var county = d3.select(this).datum().County;

      d3.select("#map").selectAll(".county").filter(function(d){
        return d.properties.county_nam == county
      })
      .classed("state", false);
    })


//----------------------------------------------------------

}

function addDistortion() {
  //Reference: http://stackoverflow.com/questions/12999958/d3-fisheye-on-width-on-bar-chart
  //console.log(popData);
var svg = d3.select("#bar").select("svg");
console.log(d3.select("#bar").select("svg"));
console.log(svg[0][0].clientWidth);
console.log(svg[0][0].clientHeight);
// d3.select(g).selectAll("g.bar")
//var maxMag = d3.max(popData, function(d) { return d.value; });
var xScale = d3.fisheye.scale(d3.scale.linear).domain([0, 71]).range([0, +svg[0][0].clientWidth]);
//console.log(xScale(1));

var bar = svg.selectAll("g.bar")
          .call(position);


// Positions the bars based on data.
function position(bar) {
  
  bar.attr("transform", function(d,i) {
          return "translate(" + ((xScale(i+1))) + "," + 200 + ")"});
   var rect=bar.select("rect");
   rect.attr("width", function(d, i) {
         return xScale(i+1) - xScale(i)});
  //       .attr("x", function(d, i) {
  //       return xScale(i);});
          
}


svg.on("mousemove", function() {
    var mouse = d3.mouse(this);
    xScale.distortion(2.5).focus(mouse[0]);

    bar.call(position);
});

}

function addHistogram(popData) {
  // reference :"https://www.youtube.com/watch?v=0CZ7-f9wXiM"
  //console.log(popData[0].Population);
  var pop = [];
  var pop1 = [];
  for(var i=0; i<72; i++)
  {
    pop[i]=popData[i].Population;
    pop1[i]=Math.log2(pop[i])
  }
  console.log(pop1);
  var width = 500, 
      height = 500,
      padding = 50;

  var histogram = d3.layout.histogram()
  .bins(8)
  (pop1);

  var y = d3.scale.linear()
          .domain([0, d3.max(histogram.map(function(i){ return i.y; }))])
          .range([0, height])

  var x = d3.scale.linear()
          .domain([0, d3.max(pop1)+8])
          .range([0, width])

  var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");



  var canvas = d3.select("#hist").append("svg")
  .attr("width", width)
  .attr("height", height + padding)
  .append("g")
      .attr("transform", "translate(10, 0)");

  var group = canvas.append("g")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis);

  var bars=canvas.selectAll(".bar")
  .data(histogram)
  .enter()
  .append("g");
  //.attr("class", "bars")
  //.attr("transform", function(d){ return "translate(" + x(d.x) + "," + y(d.y) + ")";});

//var a = 10;
  bars.append("rect")
  .attr("x", function(d){return x(d.x) ; })
  .attr("y", function(d){return 500 - y(d.y); })
  .attr("width", function(d) { return x(d.dx)  ; })
  .attr("height", function(d) {return y(d.y); })
  .attr("fill", "blue");

  bars.append("text")
      .attr("x", function(d){ return x(d.x);})
      .attr("y", function(d){return 500 - y(d.y); })
      .attr("dy", "20px")
      .attr("dx", function(d){ return x(d.dx)/2; })
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .text(function(d){ return d.y; });

    canvas.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/1.5 + 100)
    .attr("y", height + 40)
    .text("No of Countries - in terms of Population(log2)    ------>");

  console.log(histogram);


}

function addToVisualization() {
    addTooltip(window.popLookup);
    addDistortion();
    addBrushing();
    // for extra credit
    addHistogram(window.popData);
}

// do not remove the getData call!
getData(addToVisualization);