//step 1: Use the D3 library to read in samples.json from the URL 
// https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data) {
  console.log(data);
  var dropdown = d3.select("#selDataset");
  data.names.forEach(function(name) {
    dropdown.append("option").text(name).property("value", name);
  });

    // Step 6: Update all the plots when a new sample is selected. 
    // Make sure the page updates when the dropdown menu selection changes
    function handleDropdownChange() {
      var selectedSample = dropdown.property("value");
      optionChanged(selectedSample);
    }
  
  
    dropdown.on("change", handleDropdownChange);
  
  // Step 6 cont.
  function optionChanged(selectedSample) {

    var selectedData = data.samples.find(sample => sample.id === selectedSample);
    var selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedSample));

    // Step 2: Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
    var topOtuValues = selectedData.sample_values.slice(0, 10).reverse();
    var topOtuIds = selectedData.otu_ids.slice(0, 10).reverse();
    var topOtuLabels = selectedData.otu_labels.slice(0, 10).reverse();

    var trace = {
      type: "bar",
      x: topOtuValues,
      y: topOtuIds.map(id => `OTU ${id}`),
      text: topOtuLabels,
      orientation: "h"
    };

    var layout = {
      title: `Top 10 OTUs for Sample ${selectedSample}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", [trace], layout);

    // Step 3: Create a bubble chart that displays each sample.
    var bubbleValues = selectedData.sample_values;
    var bubbleIds = selectedData.otu_ids;
    var bubbleLabels = selectedData.otu_labels;

    var traceBubble = {
    type: "scatter",
    mode: "markers",
    x: bubbleIds,
    y: bubbleValues,
    text: bubbleLabels,
    marker: {
        size: bubbleValues,
        color: bubbleIds,
        colorscale: "Earth"
        }
    };

    var layoutBubble = {
        title: `Bubble Chart for Sample ${selectedSample}`,
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", [traceBubble], layoutBubble);

    
    displayMetadata(selectedMetadata);
}

// Step 4: Display the sample metadata, i.e., an individual's demographic information and
// Step 5: Display each key-value pair from the metadata JSON object somewhere on the page
function displayMetadata(metadata) {

var metadataDisplay = d3.select("#sample-metadata");


metadataDisplay.html("");

// Step 4 and 5 cont.
Object.entries(metadata).forEach(([key, value]) => {
    metadataDisplay.append("p").text(`${key}: ${value}`);
});
}


  optionChanged(data.names[0]);
});