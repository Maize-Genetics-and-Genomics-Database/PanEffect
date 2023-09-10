import csv
from collections import defaultdict
import sys

input_file = sys.argv[1]
output_dir = sys.argv[2]
# Read the TSV file and group by Gene Model
data_by_gene = defaultdict(list)

with open(input_file, 'r') as tsvfile:
    reader = csv.reader(tsvfile, delimiter='\t')
    header = next(reader)  # Skip the header row
    for row in reader:
        gene_model = row[0]
        data_by_gene[gene_model].append(row)

# For each unique Gene Model, write to a new file
for gene_model, rows in data_by_gene.items():
    filename = f"{output_dir}{gene_model}.tsv"
    with open(filename, 'w', newline='') as outfile:
        writer = csv.writer(outfile, delimiter='\t')
        #writer.writerow(header)  # Write header to each file
        writer.writerows(rows)
