import csv
import os
import sys

filename = sys.argv[1]
out = sys.argv[2]

# Ensure 'uniprot' directory exists or create it
if not os.path.exists(out):
    os.makedirs(out)

# Open and read the TSV file
with open(filename, 'r') as tsvfile:
    reader = csv.reader(tsvfile, delimiter='\t')

    # Skip headers
    next(reader)

    for row in reader:
        # Use the first column's value as the file name and append .tsv suffix
        output_file_name = os.path.join('uniprot', row[0] + '.tsv')

        # Write the current row to the respective file
        with open(output_file_name, 'w', newline='') as outfile:
            writer = csv.writer(outfile, delimiter='\t')
            writer.writerow(row)
