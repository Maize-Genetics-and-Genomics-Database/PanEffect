//Define gloabl variables
let main_id = "";
let main_option = "both";
let can_flag = false;
let gene_model, transcript, protein, gm_can, protein_can, gs, gn, unip_id, unip_desc, gene_model_file, pfamArray, alignment_length;
let gene_model_length = 0;
let pfam_domain_array = [];

let X2_to_X_array = {}; //converts reference coordinates to MSA coordinates
let GM_array = {};
let GN_array = {};
let X_to_WT = {}; //converts  MSA coordinates to wild-typoe amino acid
let X_to_X2 = {}; //converts  MSA coordinates to reference coordinates
let GN_size = 0; //Gene number

let scaleFactor = 0;
let scaleFactorPan = 0;
const window_length = 1200;  //View window size, everything is normalized based on this value
let scaleFactorZoom = window_length / 50;  //Normalization of the size of each cell in the heatmap
let scaleFactorZoomPan = window_length / 50;  //Normalization of the size of each cell in the heatmap
let currentlyVisibleTooltip = null;  //Controls what tooltip is visible

//This section loads the MaizeGDB specific annotations including Uniprot and gene annotations, this section would be customized for other model specific annotations
let uniprot_filename = './uniprot/' + gene_model + '.tsv';
let synonym_filename = './synonym/maize_synonym.tsv';

async function openUniprot(id) {
    try {
        let uniprot_filename = './uniprot/' + id + '.tsv';

        let response = await fetch(uniprot_filename);
        if (!response.ok) {
            return false;
        }

        let data = await response.text();

        if(data.includes("<html") || data.includes("<script"))
        {
            return false;
        }

        let rows = data.split('\n');

        rows.forEach(row => {
            let dataU = row.split("\t");
            if (dataU.length >= 7) {
                let [gm, gm_can_local, unip_id_local, uni_desc_local, goU, gs_local, gn_local] = dataU;
                gm_can = gm_can_local;
                protein_can = gm_can.replace("_T", "_P");
                gs = gs_local;
                gn = gn_local;
                unip_id = unip_id_local;
                unip_desc = uni_desc_local;
                if (can_flag) {
                    transcript = gm_can;
                    protein = gm_can.replace("_T", "_P");
                }
            }
        });

        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
        return false;
    }
}

//This function loads the CSV containing the positions of the heatmap, the variant effect score, and the amino acids for the WT and Substitution
//HEADER in CSV: X,Y,Score,WT,Sub
//SMAPLE DATA: 1,9,-9.54,M,K

async function openGM(protein) {
gene_model_file = "./csv/" + protein + ".csv";
gene_model_length = 0;

try {
    let response = await fetch(gene_model_file);

    if (!response.ok) {
        console.error("Failed to fetch gene model CSV file.");
        return false;
    }

    let data = await response.text();

    if(data.includes("<html") || data.includes("<script"))
    {
        return false;
    }

    let rows = data.trim().split("\n");
    let lastLine = rows[rows.length - 1];

    if (lastLine) {
        let lastData = lastLine.split(",");

        if (lastData.length > 0) {
            gene_model_length = parseInt(lastData[0], 10);
            scaleFactor = window_length / gene_model_length;
        }
    }

    return true;

} catch (error) {
    console.error("There was an error:", error.message);
    return false;  // Returns -1 to indicate an error occurred, but this can be adjusted to your needs
}
}

async function fetchAndProcessQueryData(queryFilename) {
    let queryArray = [];

    try {
        // Fetch the TSV content
        let response = await fetch(queryFilename);
        if (!response.ok) {
            document.getElementById("pan-genome").innerHTML = '<div class="text-content" style="color: red;">Pan-genome data for the gene, transcript, or protein id <b>' + main_id + '</b> was not found.  Use the search tab to enter a new search term.</div>';
            return false;
            //throw new Error("Failed to fetch the file.");
        }

        let data = await response.text();

        if(data.includes("<html") || data.includes("<script"))
        {
            document.getElementById("pan-genome").innerHTML = '<div class="text-content" style="color: red;">Pan-genome data for the gene, transcript, or protein id <b>' + main_id + '</b> was not found.  Use the search tab to enter a new search term.</div>';
            return false;
        }

        const lines = data.trim().split("\n");

        // Loop through the lines (skipping the header) to process the data
        for (let i = 1; i < lines.length; i++) {
            const [X, X2, WT] = lines[i].split("\t");

            // Populating the X_to_X2 and X_to_WT maps
            X_to_X2[X] = X2;
            X_to_WT[X] = WT;

            // Populating the queryArray and other variables
            queryArray.push({
                X: parseInt(X, 10),
                X2: X2,
                WT: WT
            });

            if (X !== null && parseInt(X, 10) > 0) {
                alignment_length = parseInt(X, 10);
                scaleFactorPan = window_length / alignment_length;
            }
            X2_to_X_array[X2] = parseInt(X, 10);
        }

        return true;

    } catch (error) {
        document.getElementById("pan-genome").innerHTML = '<div class="text-content" style="color: red;">Pan-genome data for the gene, transcript, or protein id <b>' + main_id + '</b> was not found.  Use the search tab to enter a new search term.</div>';
        console.log("Error fetching or processing the file:", error);
        return false;
    }
}

async function fetchTargetData(targetFilename) {
    try {
        // Fetch the TSV content
        let response = await fetch(targetFilename);
        let data = await response.text();

        // Split the TSV content into lines
        const lines = data.trim().split("\n");

        // Loop through the lines (skipping the header) to process the data
        for(let i = 1; i < lines.length; i++) {
            const [Y, GM, GN] = lines[i].split("\t");
            GM_array[Y] = GM;
            GN_array[Y] = GN;
        }

        GN_size = lines.length;
        let heatmapContainer = document.querySelector('.heatmap-container-pan');
        let heatmap_div_height = (GN_size  * 5);
        heatmapContainer.style.height = `${heatmap_div_height}px`;

        const zoomedContainer = document.getElementById('heatmap-container-zoom-pan');
        zoomedContainer.style.height = ((GN_size - 1) * 20) + "px";
        return true;

    } catch (error) {
        document.getElementById("pan-genome").innerHTML = '<div class="text-content" style="color: red;">Pan-genome data for the gene, transcript, or protein id <b>' + main_id + '</b> was not found.  Use the search tab to enter a new search term.</div>';
        console.log("Target Error fetching or processing the TSV file:", error);
    }
}

async function fetchPfamData(transcript) {
    let pfam_filename = './pfam/B73/' + transcript + '.tsv';
    let query_filename = './query/' + gm_can + '.tsv';

    try {
        await fetchAndProcessQueryData(query_filename);
        populateSummary();
        loadAndDisplayTraits(gene_model);

        let response = await fetch(pfam_filename);

        if (!response.ok) {
            offLoadingIcon();
            document.getElementById("pfam-wrap").innerHTML = '<div class="text-content"><br>There are no PFam domains for this gene model.</div>';
            document.getElementById("pfam-wrapl-pan").innerHTML = '<div class="text-content"><br>There are no PFam domains for this gene model.</div>';
            return;
        }

        let data = await response.text();
        let rows = data.trim().split("\n");

        rows.forEach(row => {
            let columns = row.split("\t");

            // Assuming each line has 13 or 14 columns
            if (columns.length >= 13) {
                let gm, gm_length, pfam_name, pfam_desc, pfam_start, pfam_end, pfam_score, inter_name, inter_desc, go_terms;

            if (columns.length == 13)
            {
                [gm, , gm_length, , pfam_name, pfam_desc, pfam_start, pfam_end, pfam_score, , , inter_name, inter_desc] = columns;
                go_terms = "N/A";
            }

            if (columns.length == 14)
            {
                [gm, , gm_length, , pfam_name, pfam_desc, pfam_start, pfam_end, pfam_score, , , inter_name, inter_desc, go_terms] = columns;
            }
                pfam_name = pfam_name || "N/A";
                pfam_desc = pfam_desc || "N/A";
                inter_name = inter_name || "N/A";
                inter_desc = inter_desc || "N/A";
                go_terms = go_terms || "N/A";

                let domainObject = {
                    start: parseInt(pfam_start, 10),
                    end: parseInt(pfam_end, 10),
                    start2: parseInt(X2_to_X_array[pfam_start], 10),
                    end2: parseInt(X2_to_X_array[pfam_end], 10),
                    pfam_id: pfam_name,
                    pfam_name: pfam_desc,
                    inter_id: inter_name,
                    inter_name: inter_desc,
                    go: go_terms
                };

                pfam_domain_array.push(domainObject);
            }
        });

        offLoadingIcon();
        return pfam_domain_array;

    } catch (error) {
        offLoadingIcon();
        console.log("Error in fetchPfamData:", error);
    }
}

document.addEventListener("DOMContentLoaded", async function() {

    onLoadingIcon(); //Turn loading Icon on

    //Check for Synonyms

    try {
       const result_syn = await checkSynonym(gene_model);
       if (result_syn !== false) {
          gene_model = result_syn;
       }

   } catch (error) {
        // Handle other errors that may occur during the await operation
        console.log("No synonym found");
   }

    openUniprot(gene_model).then((UniProtresult) => {
        if (UniProtresult) {

            openGM(protein).then((result) => {
                scaleFactor = window_length / gene_model_length;
                let b73_flag = true;
                let pan_flag = true;

                if(protein == protein_can)
                {
                    pan_flag = true
                } else {
                    pan_flag = false;
                    document.getElementById("pan-genome").innerHTML="<div class='text-content'>The pan-genome view is only available for canonical transcripts. The canonical transcript is a single representative transcript chosen from a gene that can produce multiple transcripts due to alternative splicing, promoter usage, or other mechanisms.  The canonical transcript for this gene model is <a href='./index.html?=" + protein_can + "'>" + protein_can + "</a></div>";
                }

                if(main_option == "b73")
                {
                    pan_flag = false;
                    b73_flag = true;
                    document.getElementById("pan-genome").innerHTML="<div class='text-content'>The pan-genome view is disabled. </div>";
                }

                if(main_option == "pan")
                {
                    b73_flag = false;
                    pan_flag = true;
                    document.getElementById("b73").innerHTML="<div class='text-content'>The B73 view is disabled. </div>";
                }

                if (result) {
                    showContent("summary");
                    highlightTab('summary_button');
                    fetchDataAndSetup(protein, protein_can, b73_flag, pan_flag);
                } else {
                    if(main_id)
                    {
                        errorInnerHTML();
                    }
                    showContent("search");
                    highlightTab('search_button');
                    offLoadingIcon();
                }
            });

        } else {

            if(main_id)
            {
                errorInnerHTML();
            } else {
                emptyInnerHTML();
            }

            showContent("search");
            highlightTab('search_button');
            offLoadingIcon();
        }
    });
});

//This function checks the synonym file for gene names
async function checkSynonym(id) {
  return new Promise((resolve, reject) => {
    // Use the Fetch API to fetch the file content
    fetch(synonym_filename)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        return response.text(); // Get the file content as text
      })
      .then((fileContents) => {
        // Split the file contents into lines
        const lines = fileContents.split('\n');
        // Iterate through each line to check for the ID in the 2nd column
        let xx = 1;
        for (const line of lines) {
          const columns = line.split(/\s+|\t+/);
          if (columns.length >= 2 && columns[1] == id) {
            //console.log(`ID '${id}' found.`);
            resolve(columns[0]); // Resolve the Promise with the value
            return; // Exit the function after finding the ID
          }
        }
        // If the ID is not found, reject the Promise with false
        reject(false);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Main function that loads most of the data sets
async function fetchDataAndSetup(protein, protein_can, b73_flag, pan_flag) {
    try {
        let gene_model_file = "./csv/" + protein + ".csv";
        let target_filename = './target/' + gm_can + '.tsv';
        let query_filename = './query/' + gm_can + '.tsv';
        let pfam_filename = './pfam/B73/' + transcript + '.tsv';
        let pfam_flag = true;
        let response = await fetch(gene_model_file);

        if (!response.ok) {
            throw new Error("Failed to fetch gene model CSV file.");
        }

        let responseP = await fetch(pfam_filename);
        let dataP = await responseP.text();

        if (!responseP.ok) {
            pfam_flag = false;
        }

        if(dataP.includes("<html") || dataP.includes("<script"))
        {
            pfam_flag = false;
        }

        let data = await response.text();

        const parsedData = d3.csvParse(data);
        if(b73_flag)
        {
            updateHeatmapZoom(parsedData, 1);
            updateHighlightBox(+this.value); // Note: `this` may not work as expected if used outside of the event context
            createZoomedWTLine(document.getElementById('zoomWTLine'), parsedData, 1);
            renderHeatmap(parsedData);
        }

        if(pan_flag)
        {
            let responseQ = await fetchAndProcessQueryData(query_filename);

            if (!responseQ) {
                pan_flag = false;
            }
        }

        let responseTarget;
        let parsedDataCan;

        if(b73_flag)
        {
            sliderInnerHTML("slider");

            let heatmapContainer2 = document.querySelector('.heatmap-container');
            let heatmap_div_height2 = (30  * 10);
            heatmapContainer2.style.height = heatmap_div_height2 + 'px';

            const zoomedContainer2 = document.getElementById('heatmap-container-zoom');
            zoomedContainer2.style.height = ((29) * 14) + "px";
        }

        if(pan_flag)
        {
            try {
                    responseTarget = await fetchTargetData(target_filename);
                    if (responseTarget) {

                        sliderInnerHTMLPan("slider-pan");

                        let heatmap_filename = './heatmap/' + gm_can + '.tsv';
                        let response_can = await fetch(heatmap_filename);

                        if (!response_can.ok) {
                            document.getElementById("pan-genome").innerHTML = '<div class="text-content" style="color: red;">Pan-genome data for the gene, transcript, or protein id <b>' + main_id + '</b> was not found.  Use the search tab to enter a new search term.</div>';
                            throw new Error("Failed to fetch gene model canonical CSV file.");
                        }
                        let data_can = await response_can.text();

                        if(data_can.includes("<html") || data_can.includes("<script"))
                        {
                            document.getElementById("pan-genome").innerHTML = '<div class="text-content" style="color: red;">Pan-genome data for the gene, transcript, or protein id <b>' + main_id + '</b> was not found.  Use the search tab to enter a new search term.</div>';
                            throw new Error("Failed to fetch gene model canonical CSV file.");
                        }

                        parsedDataCan = d3.tsvParse(data_can);
                        updateHeatmapZoomPan(parsedDataCan, 1);
                        updateHighlightBoxPan(1);
                        renderHeatmapPan(parsedDataCan);
                    } else {
                        pan_flag = false;
                    }
                } catch (error) {
                    offLoadingIcon();
                    document.getElementById("pan-genome").innerHTML = '<div class="text-content" style="color: red;">Pan-genome data for the gene, transcript, or protein id <b>' + main_id + '</b> was not found.  Use the search tab to enter a new search term.</div>';
                    console.error("There was an error:", error.message);
                }
      }

        fetchPfamData(transcript).then(pfam_domain_array => {
            pfamArray = pfam_domain_array;
            scaleFactor = window_length / gene_model_length;

            if(b73_flag)
            {
                if (pfam_flag) {
                    renderDomains(document.getElementById('pfamGeneModel'), pfamArray);
                    createNumberLine(document.getElementById('pfamNumberLine'));
                } else {
                    document.getElementById("pfam-wrap").innerHTML = '<div class="text-content"><br>There are no PFam domains for this gene model.</div>';
                }

                createNumberLine(document.getElementById('heatNumberLine'));
                createZoomedNumberLine(document.getElementById('zoomNumberLine'),1);
                loadDSSP();
            }

            if(pan_flag)
            {
                if (pfam_flag) {
                    renderDomainsPan(document.getElementById('pfamGeneModel-pan'), pfamArray);
                    createNumberLinePan(document.getElementById('pfamNumberLine-pan'));
                } else {
                    document.getElementById("pfam-wrap-pan").innerHTML = '<div class="text-content"><br>There are no PFam domains for this gene model.</div>';
                }

                createNumberLinePan(document.getElementById('heatNumberLine-pan'));
                createZoomedNumberLinePan(document.getElementById('zoomNumberLine-pan'),1);
                loadDSSPPan();
            }
        });

        if(b73_flag)
        {
            // Add listener for slider change
            const slider = document.getElementById("zoom-slider");
            const sliderValueDisplay = document.getElementById("slider-value");

            slider.addEventListener("input", function() {
                // Update the display value
                sliderValueDisplay.textContent = this.value;

                // Update heatmap based on slider value
                updateHeatmapZoom(parsedData, +this.value);
                createZoomedWTLine(document.getElementById('zoomWTLine'), parsedData, +this.value);
                updateHighlightBox(+this.value);
                createZoomedNumberLine(document.getElementById('zoomNumberLine'), +this.value);
            });
        }

        if(pan_flag)
        {
            // Add listener for slider change
            const sliderPan = document.getElementById("zoom-slider-pan");
            const sliderValueDisplayPan = document.getElementById("slider-value-pan");

            sliderPan.addEventListener("input", function() {
                // Update the display value
                sliderValueDisplayPan.textContent = this.value;

                // Update heatmap based on slider value
                updateHeatmapZoomPan(parsedDataCan, +this.value);
                updateHighlightBoxPan(+this.value);
                createZoomedNumberLinePan(document.getElementById('zoomNumberLine-pan'), +this.value);
            });
        }

    } catch (error) {
        offLoadingIcon();
        console.error("There was an error:", error.message);
    }
}
