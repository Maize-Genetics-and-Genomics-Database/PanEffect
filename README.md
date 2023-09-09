# PanEffect
PanEffect is a JavaScript framework to explore variant effects across a pangenome.  The tool has two views that allows a user to (1) explore all possible amino acid substitutions and their variant effects for a reference genome, and (2) view the natural variation and their effects across a pangenome.

# Building PanEffect datasets

## Variant effects

Download the tool esm-variants from github: https://github.com/ntranoslab/esm-variants

Run esm-variants on your protein FASTA file and save it to a CSV file:
python esm_score_missense_mutations.py --input-fasta-file proteins.fasta --output-csv-file proteins.csv

