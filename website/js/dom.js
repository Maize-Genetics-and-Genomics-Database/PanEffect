
function populateSummary() {

    document.getElementById("summary_gm").innerHTML = '<a target="_blank" href="https://www.maizegdb.org/gene_center/gene/' + gene_model + '">' + gene_model + '</a>';
    document.getElementById("summary_transcript").innerHTML = transcript;
    document.getElementById("summary_canonical").innerHTML = gm_can;
    document.getElementById("summary_gs").innerHTML = gs;
    document.getElementById("summary_gn").innerHTML = gn;
    document.getElementById("summary_protein").innerHTML = protein;
    document.getElementById("summary_pl").innerHTML = gene_model_length;
    document.getElementById("summary_msa").innerHTML = alignment_length;

    if (unip_id != "N/A")
    {
        document.getElementById("summary_uniprot").innerHTML = '<a target="_blank" href="https://www.uniprot.org/uniprotkb/'+ unip_id + '">' + unip_id + '</a>';;
    } else {
        document.getElementById("summary_uniprot").innerHTML = unip_id;
    }

    document.getElementById("summary_desc").innerHTML = unip_desc;
    document.getElementById("summary_ss").innerHTML = '<a target="_blank" href="https://www.maizegdb.org/foldseek?uniprot='+ gene_model + '">' + gene_model + '</a>';
    document.getElementById("summary_download").innerHTML = '<a href="' + gene_model_file + '" target="_blank">Download variant effects file</a>';
}

function changeExample(option) {
    document.getElementById("p1").value=option;
}

function showContent(id) {
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    document.getElementById(id).classList.add('active');
}

function changeButton(id) {
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    document.getElementById(id).classList.add('active');
}

function highlightTab(id) {
    // Loop through all elements with class "tab" and remove the 'active' class
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Add the 'active' class to the element with the given id
    const activeTab = document.getElementById(id);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

function errorInnerHTML() {

    const element1 = document.getElementById("search_error");
    if (element1) {
        element1.innerHTML = '<div class="text-content" style="color: red;">The gene, transcript, or protein id <b>' + main_id + '</b> was not found.</div>';
    } else {
        console.error("Element with id:", element1, "not found!");
    }

    const element2 = document.getElementById("gene-summary");
    if (element2) {
        element2.innerHTML = '<p style="color: red;">The gene or transcript id <b>' + main_id + '</b> was not found.</p>';
    } else {
        console.error("Element with id:", element2, "not found!");
    }

    const element3 = document.getElementById("protein-summary");
    if (element3) {
        element3.innerHTML = '<p style="color: red;">The protein id <b>' + main_id + '</b> was not found.</p>';
    } else {
        console.error("Element with id:", element3, "not found!");
    }

    const element4 = document.getElementById("b73");
    if (element4) {
        element4.innerHTML = '<br><br><div class="text-content" style="color: red;">The gene, transcript, or protein id <b>' + main_id + '</b> was not found.  Use the search tab to enter a new search term.</div>';
    } else {
        console.error("Element with id:", element4, "not found!");
    }

    const element5 = document.getElementById("pan-genome");
    if (element5) {
        element5.innerHTML = '<br><br><div class="text-content" style="color: red;">The gene, transcript, or protein id <b>' + main_id + '</b> was not found.  Use the search tab to enter a new search term.</div>';
    } else {
        console.error("Element with id:", element5, "not found!");
    }
}

function emptyInnerHTML() {

    const element2 = document.getElementById("summary");
    if (element2) {
        element2.innerHTML = '<br><br>Use the search tab to enter a gene, transcript, or protein id.</p>';
    } else {
        console.error("Element with id:", element2, "not found!");
    }

    const element4 = document.getElementById("b73");
    if (element4) {
        element4.innerHTML = '<br><br>Use the search tab to enter a gene, transcript, or protein id.</p>';
    } else {
        console.error("Element with id:", element4, "not found!");
    }

    const element5 = document.getElementById("pan-genome");
    if (element5) {
        element5.innerHTML = '<br><br>Use the search tab to enter a gene, transcript, or protein id.</p>';
    } else {
        console.error("Element with id:", element5, "not found!");
    }
}

function sliderInnerHTML(elementId) {
    let slider_window_Length = 50;
    let slider_length = gene_model_length - slider_window_Length + 1;
    let cell_width = window_length / gene_model_length;
    let startPos = cell_width * (slider_window_Length / 2) - 12;
    let endPos = cell_width * (gene_model_length - slider_window_Length) + 12;

    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<input type="range" id="zoom-slider" min="1" max="' + slider_length + '" value="1">';
        var sliderContainer = document.getElementById("slider-container");
        sliderContainer.style.left = startPos + "px";
        sliderContainer.style.width = endPos + "px";
    } else {
        console.error("Element with id:", elementId, "not found!");
    }
}

function sliderInnerHTMLPan(elementId) {
    let slider_window_Length = 50;
    let slider_length = alignment_length - slider_window_Length + 1;
    let cell_width = window_length / alignment_length;
    let startPos = cell_width * (slider_window_Length / 2) - 12;
    let endPos = cell_width * (alignment_length - slider_window_Length) + 12;

    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<input type="range" id="zoom-slider-pan" min="1" max="' + slider_length + '" value="1">';
        var sliderContainer = document.getElementById("slider-container-pan");
        sliderContainer.style.left = startPos + "px";
        sliderContainer.style.width = endPos + "px";
    } else {
        console.error("Element with id:", elementId, "not found!");
    }
}

function loadAndDisplayTraits(genemodel) {
    fetch('./traits/' + genemodel + '.tsv')
        .then(response => {
            // Check if response status is OK (status code 200)
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }

            return response.text();
        })
        .then(data => {

            if(data.includes("<html") || data.includes("<script"))
            {
                document.getElementById('phenotype-summary').innerHTML = "<span>There are currently no traits associated with this gene model.</span>";
                return false;
            }

            const lines = data.split('\n');
            const listItems = [];

            for (let line of lines) {
                const columns = line.split('\t');
                if (columns.length >= 3) {
                    const listItem = `${columns[1]} (${columns[2].trim()})`;
                    listItems.push(listItem);
                }
            }

            const ul = document.createElement('ul');
            ul.className = "spaced-list";
            for (let item of listItems) {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            }

            // Clear existing content (if any) in the phenotype-summary div
            document.getElementById('phenotype-summary').innerHTML = "";
            document.getElementById('phenotype-summary').appendChild(ul);
        })
        .catch(error => {
            document.getElementById('phenotype-summary').innerHTML = "<span>There are currently no traits associated with this gene model.</span>";
            console.error("Error loading or parsing the TSV file:", error);
        });
}
