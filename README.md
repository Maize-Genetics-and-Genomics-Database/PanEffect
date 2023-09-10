# PanEffect
PanEffect is a JavaScript framework to explore variant effects across a pangenome.  The tool has two views that allows a user to (1) explore all possible amino acid substitutions and their variant effects for a reference genome, and (2) view the natural variation and their effects across a pangenome.

# Building PanEffect datasets


## Requirements

- Python
- Python librairies argparse, biopython, collections, csv, pandas, torch
- The esm-variant tools works using a CPUs but runs a lot faster on GPU hardware.

## Variant effects

Download and install the tool esm-variants from github: https://github.com/ntranoslab/esm-variants and run the following command.

Run esm-variants on your protein FASTA file (see examples) and save it to a CSV file:
```bash
python esm_score_missense_mutations.py --input-fasta-file proteins.fasta --output-csv-file proteins.csv
```

Use the split_esm_output_for_website.py script to convert the esm-variant output file into a CSV file for each gene model.  Save the files into the csv directory.  These files contains the x and y position of the heatmap, the variant score, and the amino acid code for the wild-type (B73) and the substitution. 
```bash
python split_esm_output_for_website.py proteins.csv ./csv/
```

## Pfam domains

Run the xxxxx  script on a Interproscan output file (see examples). The script generates a separate TSV file containing the Interproscan (including PfAM position, ID, name, and Gene Ontology terms) for each B73 transcript and saves them in the pfam directory.
```bash
python make_pfam_files.py proteins_interproscan.tsv ./pfam/B73/
```
