import sys
from intervaltree import IntervalTree
#pip install intervaltree
# Usage 1: python create_trait_file.py B73_v5_genes.gff B73_v5_traits_wallace.gff B73_gene_to_trait_wallace.tsv 1000 trait "Wallace et al."
#Usage 2:

gene_gff = sys.argv[1]      #Gene model annotation GFF
snp_gff = sys.argv[2]       #GWAS trait GFF
out_tsv = sys.argv[3]       #output filename
buffer = int(sys.argv[4])   #How much to expand the start annd end positions of a gene model when searching for a nearby SNP
gff_trait_delimiter = sys.argv[5]   #What is the trait named in the last column of the GFF, examples include 'id' 'name' 'trait'
source = sys.argv[6]        #Short name of the source of the data

from intervaltree import IntervalTree

def parse_gff(file_name):
    with open(file_name, 'r') as f:
        for line in f:
            if not line.startswith('#'):
                yield line.strip().split('\t')

def extract_attribute_value(attribute_str, key):
    for attribute in attribute_str.split(';'):
        k, _, v = attribute.partition('=')
        if k == key:
            return v
    return None

# Build a dictionary of interval trees for genes, indexed by chromosome
genes_trees = {}
for entry in parse_gff(gene_gff):
    if entry[2] == "gene":
        chr = entry[0]
        if chr not in genes_trees:
            genes_trees[chr] = IntervalTree()
        try:
            gene_id = extract_attribute_value(entry[8], 'ID')
            genes_trees[chr].addi(int(entry[3]) - buffer, int(entry[4]) + buffer, gene_id)
        except ValueError:
            print(f"Skipped entry with non-integer coordinates: {entry}")

# Initialize a set to store entries and prevent duplicates
written_entries = set()

with open(out_tsv, 'w') as out:
    out.write("Gene Model\tTrait\tSource\n")
    for entry in parse_gff(snp_gff):
        chr = entry[0]
        if chr in genes_trees:
            try:
                trait = extract_attribute_value(entry[8], gff_trait_delimiter)
                print(entry[0]+" : "+entry[3]+" : "+trait)
                overlapping_genes = genes_trees[chr][int(entry[3]):int(entry[4])]
                for gene in overlapping_genes:
                    # Create a unique identifier for each entry
                    entry_id = f"{gene.data}\t{trait}\t{source}"
                    # Check if entry has not been written before
                    if entry_id not in written_entries:
                        out.write(entry_id + "\n")
                        written_entries.add(entry_id)  # Add to set to mark as written
            except ValueError:
                print(f"Skipped SNP entry with non-integer coordinates: {entry}")
