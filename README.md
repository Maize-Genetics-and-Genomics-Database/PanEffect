# PanEffect
PanEffect is a JavaScript framework to explore variant effects across a pangenome.  The tool has two views that allows a user to (1) explore all possible amino acid substitutions and their variant effects for a reference genome, and (2) view the natural variation and their effects across a pangenome.

# Building PanEffect datasets

## Requirements

- Python
- Python librairies argparse, biopython, collections, csv, pandas, torch
- The esm-variant tools works using a CPUs but runs a lot faster on GPU hardware.

## Variant effect heat maps for a reference genome

Clone and install the tool esm-variants from github: https://github.com/ntranoslab/esm-variants and run the following command.

Run esm-variants on your protein FASTA file (see examples) and save it to a CSV file:
```bash
python esm_score_missense_mutations.py --input-fasta-file proteins.fasta --output-csv-file proteins.csv
```

Use the split_esm_output_for_website.py script to convert the esm-variant output file into a CSV file for each gene model.  Save the files into the csv directory.  These files contains the x and y position of the heatmap, the variant score, and the amino acid code for the wild-type (B73) and the substitution. 
```bash
python split_esm_output_for_website.py proteins.csv ./csv/
```
## Variant effect heat maps for a pan-genome

These next steps combine the output from the esm-variants with the multiple seqeunce alignments of the proteins in a pangenome.  Step 1, download or generate multiple sequence alignments and store the FASTA seqeunces in a FASTA file.  Next, run three Python scripts to create heatmap, target, and query TSV files.

Step 2: use format_pan_heatmap.py to convert each FASTA file into a TSV that list the x and y position of the heatmap, the variant score, the positions of the amino acid in B73 and target protein, and the amino acid codes at those positions.
```bash
python format_pan_heatmap.py ./msa/ ./heatmap/
```
Step 3: use format_pan_target.py to convert each FASTA file into a TSV that list the y position of the heatmap and the gene model and genome name associated with that row of the heatmap.  This script will need to be modified for the genomes in the desired pangenome. 

```bash
python format_pan_target.py ./msa/ ./target/
```
Step 4: use format_pan_query.py to convert each FASTA file into a TSV that list the x position in the heatmap with the correspond x position in the reference protein (they might be different due to insertions and deletions in the alignments) and the amino acid at that position.
```bash
python format_pan_query.py ./msa/ ./query/
```

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
| Files/Parameters        | Description                                                                           |
|-------------------------|---------------------------------------------------------------------------------------|
| `gene_model.gff`        | Gene model annotation GFF                                                              |
| `gwas_snp.gff`          | GWAS GFF that associates a trait or phenotype to a SNP location                        |
| `gene_model_gwas.tsv`   | output filename                                                                       |
| `1000`                  | How many base pairs to expand the start and end positions of a gene model when searching for a nearby SNP |
| `'name'`                | What is the trait named in the last column of the GFF, examples include 'id' 'name' 'trait'   |
| `'Wallace et. al'`      | Short name of the source or reference for the data                                     |


Next, if you have multiple sources of trait data, combine thae data into a singele file then run the script make_trait_tsv_files.py, that creates a TSV file listing the gene model, trait, and source for each gene model.
```bash
python make_trait_tsv_files.py gene_model_gwas.tsv ./traits/
```

## Functional annotations

This step most likely will need to be customized for the organism that is being used as the reference.  Create a TSV file for the annotations that will be displayed in the gene summary section of PanEffect.  For example the TSV for annotations downloaded from MaizeGDB include the following headers:  

| Parameters                      |
|---------------------------------|
| `B73_v5_model`                  |
| `B73_v5_canonical_transcript`   |
| `Chr`                           |
| `Start`                         |
| `End`                           |
| `Uniprot_id`                    |
| `Uniprot_description`           |
| `Uniprot_GO_terms`              |
| `MaizeGDB_gene_symbol`          |
| `MaizeGDB_gene_name`            |


The script make_gene_model_annotation_files.py will take the input TSV and create sperate files for each gene model transcript.
```bash
python make_gene_model_annotation_files.py annotations.tsv ./uniprot/
```

## Secondary protein structures

The secondary structure assignemnts are based on PDB files for each gene model isoform.  The PDB files can be from either AlphaFold, ESMFold, or another 3D protein prediction method.  For the MaizeGDB instance, protein structures were predicted using ESMFold at https://github.com/facebookresearch/esm.

Next, Install DSSP by using conda or pip
```bash
pip install -c salilab dssp
```
Use the make_dssp_files.sh shell script that calls both mkdssp and process_dssp_tsv.py that loops through all the PDB files in a directory and creates a TSV file with the position, amino acid, and secondary structure code for each B73 isoform.
```bash
make_dssp_files.sh ./PDB/ ./dssp_tmp/ ./dssp/ ./python/
```
Where 
| Directories/Parameters   | Description                                                                         |
|-------------------------|-------------------------------------------------------------------------------------|
| `./PDB/`                | Directory where the PDBs are located                                                |
| `./dssp_tmp/`           | A temporary directory that stores the direct output from mkdssp                     |
| `./dssp/`               | The directory that stores the TSV files                                             |
| `.`                     | The directory where `process_dssp_tsv.py` is located                                 |

