# PanEffect
PanEffect is a JavaScript framework to explore variant effects across a pangenome.  The tool has two views that allows a user to (1) explore all possible amino acid substitutions and their variant effects for a reference genome, and (2) view the natural variation and their effects across a pangenome.

# Building PanEffect datasets


## Requirements

- Python
- Python librairies argparse, biopython, collections, csv, pandas, torch
- The esm-variant tools works using a CPUs but runs a lot faster on GPU hardware.

## Variant effect heat maps for a reference genome

Download and install the tool esm-variants from github: https://github.com/ntranoslab/esm-variants and run the following command.

Run esm-variants on your protein FASTA file (see examples) and save it to a CSV file:
```bash
python esm_score_missense_mutations.py --input-fasta-file proteins.fasta --output-csv-file proteins.csv
```

Use the split_esm_output_for_website.py script to convert the esm-variant output file into a CSV file for each gene model.  Save the files into the csv directory.  These files contains the x and y position of the heatmap, the variant score, and the amino acid code for the wild-type (B73) and the substitution. 
```bash
python split_esm_output_for_website.py proteins.csv ./csv/
```
## Variant effect heat maps for a pan-genome


## Pfam domains

Run the make_pfam_files.py script on a Interproscan output file (see examples). The script generates a separate TSV file containing the Interproscan (including PfAM position, ID, name, and Gene Ontology terms) for each transcript and saves them in the pfam directory.
```bash
python make_pfam_files.py proteins_interproscan.tsv ./pfam/B73/
```

## GWAS trait annotations

Run the create_trait_file.py script to find any SNP position within N base pairs of the start and end position of a gene model. 

```bash
python create_trait_file.py gene_model.gff gwas_snp.gff gene_model_gwas.tsv 1000 'name' 'Wallace et. al'
```
The data for the three datasets are merged and a final TSV file is created for each gene model listing the trait name and which study it came from. 

Arguments:
gene_model.gff             #Gene model annotation GFF
gwas_snp.gff               #GWAS GFF that associates a trait or phenotyp to a SNP location
gene_model_gwas.tsv        #output filename
1000                       #How many base pairs to expand the start annd end positions of a gene model when searching for a nearby SNP
'name'                     #What is the trait named in the last column of the GFF, examples include 'id' 'name' 'trait'
'Wallace et. al'           #Short name of the source or reference for the data

Next, if you have multiple sources of trait data, combine thae data into a singele file then run the script make_trait_tsv_files.py, that creates a TSV file listing the gene model, trait, and source for each gene model.


## Functional annotations

## Secondary protein structures



