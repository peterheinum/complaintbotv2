require('dotenv').config();
const vega = require("vega");
const request = require("request");
const fs = require("fs");
const envKey = process.env.KEY;
const GraphGenerator = {
    uploadGraphToSlack: () => {
        request.post(
            {
                url: "https://slack.com/api/files.upload",
                formData: {
                    token: envKey,
                    title: "Image",
                    filename: "stackedBarChart.png",
                    filetype: "auto",
                    channels: "#fuck-shit-up",
                    file: fs.createReadStream("stackedBarChart.png")
                }
            },
            function (err, response) {
                console.log(JSON.parse(response.body));
            }
        );
    },

    generateForecastGraph: data => {
        let stackedBarChartSpec = {
            $schema: "https://vega.github.io/schema/vega/v5.json",
            width: 400,
            height: 200,
            padding: 5,
            background: "white",
            data: [
                {
                    name: "table",
                    values: [
                        { category: data[0].day, amount: (data[0].max + data[0].min) / 2 },
                        { category: data[1].day, amount: (data[1].max + data[1].min) / 2 },
                        { category: data[2].day, amount: (data[2].max + data[2].min) / 2 },
                        { category: data[3].day, amount: (data[3].max + data[3].min) / 2 },
                        { category: data[4].day, amount: (data[4].max + data[4].min) / 2 },
                        { category: data[5].day, amount: (data[5].max + data[5].min) / 2 },
                        { category: data[6].day, amount: (data[6].max + data[6].min) / 2 },
                        { category: data[7].day, amount: (data[7].max + data[7].min) / 2 }
                    ]
                }
            ],

            signals: [
                {
                    name: "tooltip",
                    value: {},
                    on: [
                        { events: "rect:mouseover", update: "datum" },
                        { events: "rect:mouseout", update: "{}" }
                    ]
                }
            ],

            scales: [
                {
                    name: "xscale",
                    type: "band",
                    domain: { data: "table", field: "category" },
                    range: "width",
                    padding: 0.05,
                    round: true
                },
                {
                    name: "yscale",
                    domain: { data: "table", field: "amount" },
                    nice: true,
                    range: "height"
                }
            ],

            axes: [
                { orient: "bottom", scale: "xscale" },
                { orient: "left", scale: "yscale" }
            ],

            marks: [
                {
                    type: "rect",
                    from: { data: "table" },
                    encode: {
                        enter: {
                            x: { scale: "xscale", field: "category" },
                            width: { scale: "xscale", band: 1 },
                            y: { scale: "yscale", field: "amount" },
                            y2: { scale: "yscale", value: 0 }
                        },
                        update: {
                            fill: { value: "steelblue" }
                        },
                        hover: {
                            fill: { value: "red" }
                        }
                    }
                },
                {
                    type: "text",
                    encode: {
                        enter: {
                            align: { value: "center" },
                            baseline: { value: "bottom" },
                            fill: { value: "#333" }
                        },
                        update: {
                            x: { scale: "xscale", signal: "tooltip.category", band: 0.5 },
                            y: { scale: "yscale", signal: "tooltip.amount", offset: -2 },
                            text: { signal: "tooltip.amount" },
                            fillOpacity: [
                                { test: "isNaN(tooltip.amount)", value: 0 },
                                { value: 1 }
                            ]
                        }
                    }
                }
            ]
        }

        // create a new view instance for a given Vega JSON spec
        var view = new vega.View(vega.parse(stackedBarChartSpec))
            .renderer("none")
            .initialize();

        // generate static PNG file from chart
        view
            .toCanvas()
            .then(function (canvas) {
                // process node-canvas instance for example, generate a PNG stream to write var
                //stream = canvas.createPNGStream();
                console.log("Writing PNG to file...");
                fs.writeFile("stackedBarChart.png", canvas.toBuffer(), function (
                    err,
                    result
                ) {
                    console.log("graph created, attempting upload");
                    request.post(
                        {
                            url: "https://slack.com/api/files.upload",
                            formData: {
                                token: envKey,
                                title: "Image",
                                filename: "stackedBarChart.png",
                                filetype: "auto",
                                channels: "#fuck-shit-up",
                                file: fs.createReadStream("stackedBarChart.png")
                            }
                        },
                        function (err, response) {
                            console.log(JSON.parse(response.body));
                        }
                    );
                });
            })
            .catch(function (err) {
                console.log("Error writing PNG to file:");
                console.error(err);
            });
    },

    createDailyGraph: (data) => {
background
        const chart = {
            "$schema": "https://vega.github.io/schema/vega/v5.json",
            "width": 500,
            "height": 200,
            "padding": 5,
            "steppedLine";"true",
            "background": "white",
            "signals": [
              {
                "name": "interpolate",
                "value": "basis",
                "bind": {
                  "input": "select",
                  "options": [
                    "basis",
                    "cardinal",
                    "catmull-rom",
                    "linear",
                    "monotone",
                    "natural",
                    "step",
                    "step-after",
                    "step-before"
                  ]
                }
              }
            ],
          
            "data": [
              {
                "name": "table",
                "values": [
                    {"x": parseInt(data[0].time),  "y": data[0].temp}, 
                    {"x": parseInt(data[1].time),  "y": data[1].temp},
                    {"x": parseInt(data[2].time),  "y": data[2].temp}, 
                    {"x": parseInt(data[3].time),  "y": data[3].temp},
                    {"x": parseInt(data[4].time),  "y": data[4].temp}, 
                    {"x": parseInt(data[5].time),  "y": data[5].temp},
                    {"x": parseInt(data[6].time),  "y": data[6].temp}, 
                    {"x": parseInt(data[7].time),  "y": data[7].temp},
                    {"x": parseInt(data[8].time),  "y": data[8].temp}, 
                    {"x": parseInt(data[9].time),  "y": data[9].temp},
                    {"x": parseInt(data[10].time), "y": data[10].temp}, 
                    {"x": parseInt(data[11].time), "y": data[11].temp},
                    {"x": parseInt(data[12].time), "y": data[12].temp}, 
                    {"x": parseInt(data[13].time), "y": data[13].temp},
                    {"x": parseInt(data[14].time), "y": data[14].temp}, 
                    {"x": parseInt(data[15].time), "y": data[15].temp},
                    {"x": parseInt(data[16].time), "y": data[16].temp}, 
                    {"x": parseInt(data[17].time), "y": data[17].temp},
                    {"x": parseInt(data[18].time), "y": data[18].temp}, 
                    {"x": parseInt(data[19].time), "y": data[19].temp}, 
                    {"x": parseInt(data[20].time), "y": data[20].temp},
                    {"x": parseInt(data[21].time), "y": data[21].temp},
                    {"x": parseInt(data[22].time), "y": data[22].temp},
                    {"x": parseInt(data[23].time), "y": data[23].temp},
                
                  ]  
              }
            ],
          
            "scales": [
              {
                "name": "x",
                "type": "point",
                "range": "width",
                "domain": {"data": "table", "field": "x"}
              },
              {
                "name": "y",
                "type": "linear",
                "range": "height",
                "nice": true,
                "zero": true,
                "domain": {"data": "table", "field": "y"}
              },
              {
                "name": "color",
                "type": "ordinal",
                "range": "category",
                "domain": {"data": "table", "field": "c"}
              }
            ],
          
            "axes": [
              {"orient": "bottom", "scale": "x"},
              {"orient": "left", "scale": "y"}
            ],
          
            "marks": [
              {
                "type": "group",
                "from": {
                  "facet": {
                    "name": "series",
                    "data": "table",
                    "groupby": "c"
                  }
                },
                "marks": [
                  {
                    "type": "line",
                    "from": {"data": "series"},
                    "encode": {
                      "enter": {
                        "x": {"scale": "x", "field": "x"},
                        "y": {"scale": "y", "field": "y"},
                        "stroke": {"scale": "color", "field": "c"},
                        "strokeWidth": {"value": 2}
                      },
                      "update": {
                        "interpolate": {"signal": "interpolate"},
                        "fillOpacity": {"value": 1}
                      },
                      "hover": {
                        "fillOpacity": {"value": 0.5}
                      }
                    }
                  }
                ]
              }
            ]
          }
          
          
          



        // create a new view instance for a given Vega JSON spec
        var view = new vega.View(vega.parse(chart))
            .renderer("none")
            .initialize();

        // generate static PNG file from chart
        view
            .toCanvas()
            .then(function (canvas) {
                // process node-canvas instance for example, generate a PNG stream to write var
                //stream = canvas.createPNGStream();
                console.log("Writing PNG to file...");
                fs.writeFile("AreaChart.png", canvas.toBuffer(), function (
                    err,
                    result
                ) {
                    console.log("graph created, attempting upload");
                    request.post(
                        {
                            url: "https://slack.com/api/files.upload",
                            formData: {
                                token: envKey,
                                title: "Image",
                                filename: "AreaChart.png",
                                filetype: "auto",
                                channels: "#fuck-shit-up",
                                file: fs.createReadStream("AreaChart.png")
                            }
                        },
                        function (err, response) {
                            console.log(JSON.parse(response.body));
                        }
                    );
                });
            })
            .catch(function (err) {
                console.log("Error writing PNG to file:");
                console.error(err);
            });
    }
};

module.exports = GraphGenerator;


