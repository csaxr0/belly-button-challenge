// Belly Button Biodiversity - Plotly.js
//--------------------------------------------------------//
  
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      let metadata= data.metadata;
      let resultsarray= metadata.filter(sampleobject => 
        sampleobject.id == sample);
      let result= resultsarray[0]
      let panel = d3.select("#sample-metadata");
      panel.html("");
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
  
    
  
   
    });
  }
  
  
  function buildCharts(sample) {
  
  // Use `d3.json` to fetch the sample data for the plots
  d3.json("samples.json").then((data) => {
    let samples= data.samples;
    let resultsarray= samples.filter(sampleobject => 
        sampleobject.id == sample);
    let result= resultsarray[0]
  
    let ids = result.otu_ids;
    let labels = result.otu_labels;
    let values = result.sample_values;
  
  
  //------------------------------------------------------//
            // Build a BUBBLE Chart 
  //------------------------------------------------------//
  
  
    let LayoutBubble = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };
  
      let DataBubble = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];
  
    Plotly.newPlot("bubble", DataBubble, LayoutBubble);
  
  
  
  //---------------------------------------------------------//
                //  Build a BAR Chart
  //---------------------------------------------------------//  

    let bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
  
      }
    ];
  
    let barLayout = {
      title: "Top 10 Bacteria Cultures",
      margin: { t: 30, l: 150 }
    };
  
    Plotly.newPlot("bar", bar_data, barLayout);
  });
  }
   
  
  function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
  }
  
  function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  }
  
  
  
  // Initialize the dashboard
  init();