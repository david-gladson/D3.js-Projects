import "./styles.css";

let margin = { top: 20, bottom: 0, left: 20, right: 20 };

var width = 900,
  height = 400;

let svg = d3
  .select("#app")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  // .attr("viewBox", "0 0 800 800")
  .attr("style", "background-color:#ffffff")
  .append("g")
  .attr("transform", "translate(10, 10)");

var graph_width = 400,
  graph_height = 400;

let x = d3
  .scaleLinear()
  .range([margin.left, graph_width - margin.left - margin.right])
  .domain([-10, 10]);

let y = d3
  .scaleLinear()
  .range([graph_height - margin.bottom - margin.top, margin.top])
  .domain([-10, 10]);

console.log(y(90));
console.log(x(0));

let xAxis = svg
  .append("g")
  .attr("transform", "translate(0, " + (graph_height - y(0)) + " )")
  .call(d3.axisBottom().scale(x));

let yAxis = svg
  .append("g")
  .attr("transform", "translate(" + x(0) + ", 0 )")
  .call(d3.axisLeft().scale(y));

var x_mid = [],
  y_mid = [],
  k_val = 0,
  h_val = 0,
  data = [],
  a_mid = 2;
for (var i = -9; i < 10; i++) {
  y_mid.push(i);
  x_mid.push(((i - k_val) * (i - k_val)) / (4 * a_mid) + h_val);
}

for (var i = -9; i < 10; i = i + 1) {
  data.push(i);
}

// grid lines
// horizontal grids
svg
  .append("g")
  .attr("class", "hzgrid")
  .selectAll("line")
  .data(data)
  .enter()
  .append("line")
  .style("stroke", "#a2a2a2")
  .style("stroke-width", "0.6")
  // .style("stroke-dasharray", "3, 3")
  .attr("x1", x(-10))
  .attr("y1", (d) => y(d))
  .attr("x2", x(10))
  .attr("y2", (d) => y(d));

// vertical grids
svg
  .append("g")
  .attr("class", "hzgrid")
  .selectAll("line")
  .data(data)
  .enter()
  .append("line")
  .style("stroke", "#a2a2a2")
  .style("stroke-width", "0.6")
  // .style("stroke-dasharray", "3, 3")
  .attr("y1", y(-10))
  .attr("x1", (d) => x(d))
  .attr("y2", y(10))
  .attr("x2", (d) => x(d));

// svg
svg
  .append("path")
  .attr("class", "parabola")
  .datum(x_mid)
  .attr(
    "d",
    d3
      .line()
      // .curve(d3.curveCatmullRom)
      // .curve(d3.curveStep)
      .curve(d3.curveCardinal)
      .x((d, i) => x(x_mid[i]))
      .y((d, i) => y(y_mid[i]))
  )
  .attr("stroke-width", 2.5)
  .attr("stroke", "blue")
  .attr("fill", "none");

function draw(val) {
  a_mid = val;
  d3.select(".parabola")
    .attr(
      "d",
      d3
        .line()
        // .curve(d3.curveCatmullRom)
        // .curve(d3.curveStep)
        .curve(d3.curveCardinal)
        .x((d, i) =>
          x(((y_mid[i] - k_val) * (y_mid[i] - k_val)) / (4 * a_mid) + h_val)
        )
        .y((d, i) => y(y_mid[i]))
    )
    .attr("stroke-width", 2.5)
    // .attr("stroke", "red")
    .attr("fill", "none");
}

function draw2(val) {
  h_val = val;

  d3.select(".parabola")
    .attr(
      "d",
      d3
        .line()
        // .curve(d3.curveCatmullRom)
        // .curve(d3.curveStep)
        .curve(d3.curveCardinal)
        .x((d, i) =>
          x(((y_mid[i] - k_val) * (y_mid[i] - k_val)) / (4 * a_mid) + h_val)
        )
        .y((d, i) => y(y_mid[i]))
    )
    .attr("stroke-width", 2.5)
    // .attr("stroke", "red")
    .attr("fill", "none");
}

function draw3(val) {
  k_val = val;
  d3.select(".parabola")
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveCardinal)
        .x((d, i) =>
          x(((y_mid[i] - k_val) * (y_mid[i] - k_val)) / (4 * a_mid) + h_val)
        )
        .y((d, i) => y(y_mid[i] + val))
    )
    .attr("stroke-width", 2.5)
    // .attr("stroke", "blue")
    .attr("fill", "none");
}

// equation
svg
  .append("g")
  .attr("transform", "translate(485,73)")
  .append("text")
  .attr("class", "equ")
  .text("(y - k)^2  =   4a(x - h)");

// text box legends
svg
  .append("g")
  .attr("transform", "translate(415,125)")
  .append("text")
  .attr("class", "legen")
  .attr("fill", "blue")
  .text("a-value");

svg
  .append("g")
  .attr("transform", "translate(415,185)")
  .append("text")
  .attr("class", "legend")
  .attr("fill", "blue")
  .text("h-value");

svg
  .append("g")
  .attr("transform", "translate(415,245)")
  .append("text")
  .attr("class", "legend")
  .attr("fill", "blue")
  .text("k-value");

// #slider
var sliderSimple = d3
  .sliderBottom()
  .min(d3.min(data))
  .max(d3.max(data))
  .width(300)
  // .tickFormat(d3.format(".2%"))
  .ticks(8)
  .handle(d3.symbol().type(d3.symbolCircle).size(200)())
  .default(a_mid)
  .on("onchange", (val) => {
    draw(val);
    // "p#value-simple"
    svg
      .select(".equ")
      .text(
        "(y - " +
          d3.format(".1f")(k_val) +
          ")^2 = 4*" +
          d3.format(".1f")(val) +
          "*(x - " +
          d3.format(".1f")(h_val) +
          ")"
      );
    // svg.select(".equ").text("(y-k)^2 = 4*" + d3.format(".1f")(val) + "*(x-h)");
  });

var sliderSimple2 = d3
  .sliderBottom()
  .min(d3.min(data))
  .max(d3.max(data))
  .width(300)
  // .tickFormat(d3.format(".2%"))
  .ticks(8)
  .handle(d3.symbol().type(d3.symbolCircle).size(200)())
  .default(0)
  .on("onchange", (val) => {
    draw2(val);
    svg
      .select(".equ")
      .text(
        "(y - " +
          d3.format(".1f")(k_val) +
          ")^2 = 4*" +
          d3.format(".1f")(a_mid) +
          "*(x - " +
          d3.format(".1f")(val) +
          ")"
      );

    // d3.select("p#value-simple").text(d3.format(".1f")(val));
  });

var sliderSimple3 = d3
  .sliderBottom()
  .min(d3.min(data))
  .max(d3.max(data))
  .width(300)
  // .tickFormat(d3.format(".2%"))
  .ticks(8)
  .handle(d3.symbol().type(d3.symbolCircle).size(200)())
  .default(0)
  .on("onchange", (val) => {
    draw3(val);
    svg
      .select(".equ")
      .text(
        "(y - " +
          d3.format(".1f")(val) +
          ")^2 = 4*" +
          d3.format(".1f")(a_mid) +
          "*(x - " +
          d3.format(".1f")(h_val) +
          ")"
      );

    // d3.select("p#value-simple").text(d3.format(".1f")(val));
  });

var gSimple = svg
  // .select("div#slider-simple")
  // .append("svg")
  // .attr("width", 500)
  // .attr("height", 100)
  .append("g")
  .attr("transform", "translate(425,133)");

gSimple.call(sliderSimple);

var gS2 = svg
  // .select("div#slider-simple")
  // .append("svg")
  // .attr("width", 500)
  // .attr("height", 100)
  .append("g")
  .attr("transform", "translate(425,193)");

gS2.call(sliderSimple2);

var gS3 = svg
  // .select("div#slider-simple")
  // .append("svg")
  // .attr("width", 500)
  // .attr("height", 100)
  .append("g")
  .attr("transform", "translate(425,253)");

gS3.call(sliderSimple3);
