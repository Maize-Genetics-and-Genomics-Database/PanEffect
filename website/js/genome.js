//Draw the secondary protein structures
function drawStructure(structure) {
    const canvas = document.getElementById('proteinStructure');
    const ctx = canvas.getContext('2d');

    const legendWidth = 200;
    const width = (canvas.width - legendWidth) / structure.length;

    // Draw the structure bars
    for (let i = 0; i < structure.length; i++) {
        let color;
        switch (structure[i]) {
            case 'H':
                color = 'red';
                break;
            case 'E':
                color = 'green';
                break;
            default:
                color = 'white';
        }

        ctx.fillStyle = color;
        ctx.fillRect(i * width, 0, width, canvas.height);
    }

    // Draw the legend on the far right
    const legendData = [
        {color: 'red', label: 'Helix'},
        {color: 'green', label: 'Sheet'},
    ];

    const legendBoxSize = 30; // Size of each colored box in the legend
    const padding = 10; // Space between each legend item
    let yOffset = 5; // Initial vertical position for the first legend item
    let xOffset = 70;

    ctx.font = '15px Arial';

    for (const item of legendData) {
        ctx.fillStyle = item.color;
        ctx.fillRect(canvas.width - legendWidth + padding + xOffset, yOffset, legendBoxSize, legendBoxSize);

        ctx.fillStyle = 'black'; // Text color for the labels
        ctx.fillText(item.label, canvas.width - legendWidth + 2 * padding + legendBoxSize + xOffset, yOffset + legendBoxSize - 5);

        yOffset += legendBoxSize + padding ;
    }
}

function renderHeatmap(data) {
    const heatmapEl = document.getElementById('heatmap');
    const cellWidth = window_length / gene_model_length;
    const cellHeight = 14; // Adjust as per your requirements
    const fullHeatmapEl = document.getElementById('full-heatmap');

    data.forEach(cellData => {
        const xPosition = +cellData["X"];  // + ensures the string is converted to a number
        const yPosition = +cellData["Y"];
        const score = +cellData["Score"];
        const wild_type = +cellData["WT"];
        const mutation = +cellData["Sub"];

        const cell = document.createElement('div');
        cell.style.width = (cellWidth + 0.5) + 'px';
        cell.style.height = cellHeight + 'px';
        cell.style.backgroundColor = colorScale(score);
        cell.style.position = 'absolute';
        cell.style.left = cellWidth * (xPosition - 1) + 'px';  // -1 because X is 1-indexed
        cell.style.top = cellHeight * (yPosition - 1) + 'px';  // -1 because Y is 1-indexed
        cell.dataset.x = cellData["X"];
        fullHeatmapEl.appendChild(cell);

        const tooltip_h = document.createElement("div");
            tooltip_h.classList.add("tooltip");
            document.body.appendChild(tooltip_h);

        cell.addEventListener("mouseover", (e) => {
           tooltip_h.style.visibility = "visible";
           tooltip_h.innerHTML = `
               Position: ${cellData["X"]}<br>
               Substitution: ${cellData["WT"]}->${numberToAminoAcid(cellData["Y"])}<br>
               Score: ${cellData["Score"]}
           `;
           tooltip_h.style.left = (e.pageX + 10) + "px";
           tooltip_h.style.top = (e.pageY + 10) + "px";
       });

       // Mouse move event (so the tooltip_h follows the mouse)
        cell.addEventListener("mousemove", (e) => {
            tooltip_h.style.left = (e.pageX + 10) + "px";
            tooltip_h.style.top = (e.pageY + 10) + "px";
        });

        // Mouse out event
        cell.addEventListener("mouseout", () => {
            tooltip_h.style.visibility = "hidden";
        });

        fullHeatmapEl.appendChild(cell);
    });

    //Create the color bar legend
    const colors = [
        '#00429d', '#3860aa', '#587fb3', '#78a0b7', '#9ac0b3', '#c1e19e',
        '#ffff00', '#ffd337', '#fea447', '#f1784d', '#db4c4d', '#bd2147', '#93003a'
    ];

    const container = document.createElement('div');

    container.style.position = 'absolute';
    container.style.left = (window_length + 75) + 'px';
    container.style.width = '210px';

    const benignEffectLabel = document.createElement('div');
    benignEffectLabel.innerText = 'Benign effect';
    benignEffectLabel.className = 'labelCB';
    benignEffectLabel.style.width = '100px';
    benignEffectLabel.style.fontFamily = 'Arial';
    benignEffectLabel.style.fontSize = '15px';

    container.appendChild(benignEffectLabel);

    const row0 = document.createElement('div');
    row0.className = 'rowCB';

    const box0 = document.createElement('div');
    box0.className = 'colorBox';
    box0.style.backgroundColor = "black";
    row0.appendChild(box0);

    const value0 = document.createElement('div');
    value0.className = 'valueCB';
    value0.innerText = 'Exact match' + '';
    row0.appendChild(value0);

    container.appendChild(row0);

    colors.forEach((color, index) => {
        const row = document.createElement('div');
        row.className = 'rowCB';

        const box = document.createElement('div');
        box.className = 'colorBox';
        box.style.backgroundColor = color;
        row.appendChild(box);

        const value = document.createElement('div');
        value.className = 'valueCB';
        value.style.fontFamily = 'Arial';
        value.style.fontSize = '15px';
        if(index == 0)
        {
            value.innerText = '> 0';
        } else if(index == 12)
        {
            value.innerText = '< -22';
        } else {
            value.innerText = (2 - (index * 2)) + '';
        }
        row.appendChild(value);

        if(index == 5)
        {
            const mildEffectLabel = document.createElement('div');
            mildEffectLabel.innerText = 'Mild effect';
            mildEffectLabel.className = 'labelCB';
            mildEffectLabel.style.width = '100px';
            mildEffectLabel.style.fontFamily = 'Arial';
            mildEffectLabel.style.fontSize = '15px';
            container.appendChild(mildEffectLabel);
        }

        container.appendChild(row);
    });

    const strongEffectLabel = document.createElement('div');
    strongEffectLabel.innerText = 'Strong effect';
    strongEffectLabel.className = 'labelCB';
    strongEffectLabel.style.width = '100px';
    strongEffectLabel.style.fontFamily = 'Arial';
    strongEffectLabel.style.fontSize = '15px';
    container.appendChild(strongEffectLabel);

    fullHeatmapEl.appendChild(container);

}

function updateHighlightBox(start) {
    const highlightBox = document.getElementById('highlight-box');
    const zoomedWidth = 50;  // We're zooming into 50 units

    highlightBox.style.left = (start - 1) * scaleFactor + 'px';  // -1 because we're 1-indexed
    highlightBox.style.width = (zoomedWidth * scaleFactor - 3) + 'px';   //adjust for border length (3px)
}

function renderDomains(geneModelElement, domainsArray) {
        const domainHeight = 20;
        const domainMarginTop = 5;

        if (domainsArray.length > 0) {
            geneModelElement.style.height = domainHeight + (domainHeight + domainMarginTop) * (domainsArray.length - 1) + 'px';
        } else {
            geneModelElement.style.height = '20px';
        }

let currentTopPosition = 0;
let PGM_height = 100;
let colorSave = [];

domainsArray.forEach((domain, index) => {
    const div = document.createElement('div');
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltipdomain");
    tooltip.style.zIndex = "1000"; // Ensure tooltip is on top
    tooltip.style.pointerEvents = "auto"; // Make sure you can interact with the tooltip
    document.body.appendChild(tooltip);

    div.className = 'domain';
    div.style.left = scale(domain.start) + 'px';
    div.style.width = (scale(domain.end) - scale(domain.start)) + 'px';
    div.style.top = ((domainHeight + domainMarginTop) * index) + 'px';
    div.style.backgroundColor = pastelColors[index % pastelColors.length]; // Color assignment

    if (domain.pfam_id) {

            if(colorSave[domain.pfam_id])
            {
                div.style.backgroundColor = colorSave[domain.pfam_id];
            } else {
                colorSave[domain.pfam_id] = pastelColors[index % pastelColors.length];
            }
    }

    if (domain.pfam_name) {

            div.addEventListener("click", (e) => {
                // Check if the tooltip being clicked is the same as the currently visible one
                if (currentlyVisibleTooltip && currentlyVisibleTooltip === tooltip) {
                    // Toggle visibility
                    if (tooltip.style.visibility === "visible") {
                        tooltip.style.visibility = "hidden";
                        currentlyVisibleTooltip = null;
                    } else {
                        tooltip.style.visibility = "visible";
                        tooltip.innerHTML = `
                            Pfam id: <a target="_blank" href="https://www.ebi.ac.uk/interpro/entry/pfam/${domain.pfam_id}">${domain.pfam_id}</a><br>
                            Pfam name: ${domain.pfam_name}<br>
                            Interprot id: ${domain.inter_id}<br>
                            Interprot name: ${domain.inter_name}<br>
                            GO terms: ${domain.go}<br>
                            Start: ${domain.start}<br>
                            End: ${domain.end}<br>
                        `;
                        tooltip.style.left = (e.pageX + 10) + "px";
                        tooltip.style.top = (e.pageY + 10) + "px";
                        currentlyVisibleTooltip = tooltip;
                    }
                } else {
                    // Hide the previously visible tooltip, if any
                    if (currentlyVisibleTooltip) {
                        currentlyVisibleTooltip.style.visibility = "hidden";
                    }
                    // Show the tooltip for the clicked div
                    tooltip.style.visibility = "visible";
                    tooltip.innerHTML = `
                        Pfam id: <a target="_blank" href="https://www.ebi.ac.uk/interpro/entry/pfam/${domain.pfam_id}">${domain.pfam_id}</a><br>
                        Pfam name: ${domain.pfam_name}<br>
                        Interprot id: ${domain.inter_id}<br>
                        Interprot name: ${domain.inter_name}<br>
                        GO terms: ${domain.go}<br>
                        Start: ${domain.start}<br>
                        End: ${domain.end}<br>
                    `;
                    tooltip.style.left = (e.pageX + 10) + "px";
                    tooltip.style.top = (e.pageY + 10) + "px";
                    currentlyVisibleTooltip = tooltip;
                }
            });
        }
geneModelElement.appendChild(div);

// Create a new div for the Pfam name
const pfamNameDiv = document.createElement('div');
pfamNameDiv.innerText = domain.pfam_name;
pfamNameDiv.className = 'truncate';
pfamNameDiv.style.left = scale(domain.start) + 'px';
pfamNameDiv.style.width = (scale(domain.end) - scale(domain.start)) + 'px';
pfamNameDiv.style.top = (((domainHeight + domainMarginTop) * index) + 30) + 'px';

PGM_height = (((domainHeight + domainMarginTop) * index) + 30);

geneModelElement.appendChild(pfamNameDiv);  // Add Pfam name div as a child of the domain div

});

//adjust the height of the pfam conatainer
document.getElementById('pfamGeneModel').style.height = PGM_height + "px";

// Add a global click listener to detect clicks on elements with class "tab"
document.addEventListener('click', function(e) {
    // If the clicked element has class "tab"
    if (e.target.classList.contains('tab')) {
        // If there is a currently visible tooltip, hide it
        if (currentlyVisibleTooltip) {
            currentlyVisibleTooltip.style.visibility = 'hidden';
        }
    }
});

}

function loadDSSP() {
    let dssp_file = './dssp/' + protein + '.tsv';

    fetch(dssp_file)
    .then(response => {
        if (!response.ok) {
            throw new Error('DSSP file not found'); // Throw an error if response is not ok
        }
        return response.text();
    })
    .then(data => {

        if(data.includes("<html") || data.includes("<script"))
        {
            return false;
        }

        const structure = parseDSSP(data);
        drawStructure(structure);  // Call the function here with the parsed data

    })
    .catch(error => {
        document.getElementById("dssp").innerHTML = '<div class="text-content"><br>There is no secondary structure information for this protein.</div>'
        console.log('Error fetching DSSP file:', error);
    });
}
    // Function to create the number line
    function createNumberLine(container) {
        x = 0
        const tick0 = document.createElement('div');
        tick0.className = 'tick';
        tick0.style.left = scale(1) + 'px';

        const label0  = document.createElement('div');
        label0.className = 'label';
        label0.style.left = scale(1) + 'px';
        label0.innerText = 1;

        container.appendChild(tick0);
        container.appendChild(label0);

        for (let i = 99; i <= gene_model_length - 1; i += 100) {
            const tick = document.createElement('div');
            tick.className = 'tick';
            tick.style.left = scale(i) + 'px';

            const label = document.createElement('div');
            label.className = 'label';
            label.style.left = scale(i) + 'px';
            label.innerText = i + 1;

            container.appendChild(tick);
            container.appendChild(label);
            x = i;
        }

        const tick = document.createElement('div');
        tick.className = 'tick-last';
        tick.style.left = scale(gene_model_length - 1) + 'px';

        const label = document.createElement('div');
        label.className = 'label-last';
        label.style.left = (scale(gene_model_length -1) + 20) + 'px';
        label.innerText = gene_model_length;

        container.appendChild(label);
    }

    // Function to create the number line
    function createZoomedNumberLine(container,start) {
        x = 0
        container.innerHTML = "";
        for (let i = 1; i <= 49; i += 2) {
            const tick = document.createElement('div');
            tick.className = 'tick';
            tick.style.left = scaleZoom(i) + 'px';

            const label = document.createElement('div');
            label.className = 'label';
            label.style.left = scaleZoom(i) + 'px';
            label.innerText = i + start;

            container.appendChild(tick);
            container.appendChild(label);
            x = i;
        }
    }

    function updateHeatmapZoom(data, start) {
        const end = start + 49;
        const zoomedHeatmapEl = document.getElementById('zoomed-heatmap');
        //const colorScale = d3.scaleSequential(d3.interpolateRdBu)
        //    .domain([-25, 0]);
        const cellWidth = window_length / 50;
        const cellHeight = 20;

        zoomedHeatmapEl.innerHTML = ''; // Clear previous zoomed heatmap content

        data.forEach(cellData => {
            const x = +cellData["X"];

            if (x >= start && x <= end) {
                const cell = document.createElement('div');
                const xPosition = +cellData["X"];  // + ensures the string is converted to a number
                const yPosition = +cellData["Y"];
                const score = +cellData["Score"];
                const wild_type = +cellData["WT"];
                const mutation = +cellData["Sub"];
                cell.style.width = (cellWidth + 0.5) + 'px';
                cell.style.height = cellHeight + 'px';
                cell.style.backgroundColor = colorScale(score);
                cell.style.position = 'absolute';
                cell.style.left = ((x - start) * cellWidth) + 'px';  // -1 because X is 1-indexed
                cell.style.top = cellHeight * (yPosition - 1) + 'px';  // -1 because Y is 1-indexed
                cell.dataset.x = cellData["X"];
                zoomedHeatmapEl.appendChild(cell);

                const tooltip_h = document.createElement("div");
                    tooltip_h.classList.add("tooltip");
                    document.body.appendChild(tooltip_h);

                cell.addEventListener("mouseover", (e) => {
                   tooltip_h.style.visibility = "visible";
                   tooltip_h.innerHTML = `
                       Position: ${cellData["X"]}<br>
                       Substitution: ${cellData["WT"]}->${numberToAminoAcid(cellData["Y"])}<br>
                       Score: ${cellData["Score"]}
                   `;
                   tooltip_h.style.left = (e.pageX + 10) + "px";
                   tooltip_h.style.top = (e.pageY + 10) + "px";
               });

               // Mouse move event (so the tooltip_h follows the mouse)
                cell.addEventListener("mousemove", (e) => {
                    tooltip_h.style.left = (e.pageX + 10) + "px";
                    tooltip_h.style.top = (e.pageY + 10) + "px";
                });

                // Mouse out event
                cell.addEventListener("mouseout", () => {
                    tooltip_h.style.visibility = "hidden";
                });

                zoomedHeatmapEl.appendChild(cell);
            }
        });

        for (let i = 1; i <= 20; i++) {
            const cell = document.createElement('div');
            x = 50
            yPosition = i
            cell.style.width = cellWidth + 'px';
            cell.style.height = cellHeight + 'px';
            cell.style.backgroundColor = "white";
            cell.style.position = 'absolute';
            cell.style.left = (x * cellWidth + 6) + 'px';  // -1 because X is 1-indexed
            cell.style.top = cellHeight * (yPosition - 1) + 'px';  // -1 because Y is 1-indexed
            cell.innerText = numberToAminoAcid(i);
            zoomedHeatmapEl.appendChild(cell);
        }
    }

    // Function to create the WT residues on the bottom of the heatmap
    function createZoomedWTLine(container,data, start) {
        container.innerHTML = "";
        const end = start + 49;

        i = 0
        data.forEach(cellData => {
            const x = +cellData["X"];
            const yPosition = +cellData["Y"]
            const wild_type = cellData["WT"];

        if (x >= start && x <= end && yPosition == "2") {
            const label = document.createElement('div');
            label.className = 'label_bottom';
            label.style.left = scaleZoom(i) + 'px';
            label.innerText = wild_type;
            //label.innerText = x;
            container.appendChild(label);
            i = i + 1;
        }
    });
  }
