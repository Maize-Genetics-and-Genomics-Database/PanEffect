//Set the colors for the Pfam domains
const pastelColors = [
    "#FFD1DC",  // Pink
    "#FFDACD",  // Peach
    "#E7FFAC",  // Light Green
    "#ACD8AA",  // Mint
    "#D5AAFF",  // Lavender
    "#FFC8A2",  // Salmon
    "#A2C8FF"   // Baby Blue
];

//Normalize the a position based on the length of the view window for the gene view for the zoomed out heatmap
function scale(position) {
    return position * scaleFactor;
}

//Normalize the a position based on the length of the view window for the pangenome view for the zoomed out heatmap
function scalePan(position) {
    return position * scaleFactorPan;
}

//Normalize the a position based on the length of the view window for the gene view for the zoomed in heatmap
function scaleZoom(position) {
    return position * scaleFactorZoom + (scaleFactorZoom / 2);
}

//Normalize the a position based on the length of the view window for the pangenome view for the zoomed in heatmap
function scaleZoomPan(position) {
    return position * scaleFactorZoomPan + (scaleFactorZoomPan / 2);
}

//Converts a number to an amino acid string, Double A to start since the array starts at 0 and the input starts at 1
function numberToAminoAcid(number) {
    const aminoAcids = ['A', 'A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y'];

    // Check if the number is within the valid range
    if (number >= 0 && number < aminoAcids.length) {
        return aminoAcids[number];
    } else {
        throw new Error("Invalid number. The number should be between 0 and 19 inclusive.");
    }
}

//retuns the value of a GET variable given a key
function getQueryStringValue(key) {
    let searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key);
}

//Returns a color value based on a variant effect score for the gene view
function colorScale(score) {
    if (score === undefined) return 'white';
    if (score === 0) return 'black';

    if (score <= -22) return "#93003a";
    if (score > -22 && score <= -20) return "#bd2147";
    if (score > -20 && score <= -18) return "#db4c4d";
    if (score > -18 && score <= -16) return "#f1784d";
    if (score > -16 && score <= -14) return "#fea447";
    if (score > -14 && score <= -12) return "#ffd337";
    if (score > -12 && score <= -10) return "#ffff00";
    if (score > -10 && score <= -8) return "#c1e19e";
    if (score > -8 && score <= -6) return "#9ac0b3";
    if (score > -6 && score <= -4) return "#78a0b7";
    if (score > -4 && score <= -2) return "#587fb3";
    if (score > -2 && score <= 0) return "#3860aa";
    if (score > 0) return "#00429d";

    // Fallback, you can adjust this if needed
    return 'black';
}

//Returns a color value based on a variant effect score for the pangenome view, Exact matches are blue instead of black
function colorScalePan(score) {
    if (score === undefined) return '#DDDDDD';
    if (score === 0) return '#00429d';

    if (score <= -22) return "#93003a";
    if (score > -22 && score <= -20) return "#bd2147";
    if (score > -20 && score <= -18) return "#db4c4d";
    if (score > -18 && score <= -16) return "#f1784d";
    if (score > -16 && score <= -14) return "#fea447";
    if (score > -14 && score <= -12) return "#ffd337";
    if (score > -12 && score <= -10) return "#ffff00";
    if (score > -10 && score <= -8) return "#c1e19e";
    if (score > -8 && score <= -6) return "#9ac0b3";
    if (score > -6 && score <= -4) return "#78a0b7";
    if (score > -4 && score <= -2) return "#587fb3";
    if (score > -2 && score <= 0) return "#3860aa";
    if (score > 0) return "#00429d";

    // Fallback, you can adjust this if needed
    return '#DDDDDD';
}

//Turn loading icon off
function offLoadingIcon() {
    const loadingIcon = document.getElementById('loading-icon');
        loadingIcon.style.display = "none";
}

//Turn loading icon on
function onLoadingIcon() {
    const loadingIcon = document.getElementById('loading-icon');
        loadingIcon.style.display = "flex";
}

function parseDSSP(output) {
    //console.log(output);
    const lines = output.split('\n');
    let structure = "";

        for (let line of lines) {
        const columns = line.trim().split(/\s+/);
        if (columns[2]) {
            structure += columns[2];
        }
    }

return structure;
}
