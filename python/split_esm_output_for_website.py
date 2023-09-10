import csv
import os
import sys
from collections import defaultdict

input_file = sys.argv[1]
out_dir = sys.argv[2]

# Ensure the output directory exists
if not os.path.exists(out_dir):
    os.makedirs(out_dir)

def number_to_aa(number):
    """Convert a number between 1 and 20 to its corresponding amino acid."""
    aa_dict = {
        1: 'A', 2: 'C', 3: 'D', 4: 'E', 5: 'F',
        6: 'G', 7: 'H', 8: 'I', 9: 'K', 10: 'L',
        11: 'M', 12: 'N', 13: 'P', 14: 'Q', 15: 'R',
        16: 'S', 17: 'T', 18: 'V', 19: 'W', 20: 'Y'
    }
    return aa_dict.get(number)

def aa_to_number(aa):
    """Convert an amino acid to its corresponding number."""
    aa_dict = {
        'A': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5,
        'G': 6, 'H': 7, 'I': 8, 'K': 9, 'L': 10,
        'M': 11, 'N': 12, 'P': 13, 'Q': 14, 'R': 15,
        'S': 16, 'T': 17, 'V': 18, 'W': 19, 'Y': 20
    }
    return aa_dict.get(aa.upper())

# Create file writers
file_writers = {}

print("Opening files",flush=True)

# Read the CSV file
with open(input_file, 'r') as file:
    reader = csv.reader(file)

    # Skip the first row (header)
    next(reader)

    # Process rows as they are read
    for row in reader:
        gene_mode_id = row[0]
        variant_info = row[1]
        wt = variant_info[0]
        aa_substitution = variant_info[-1]
        position = int(variant_info[1:-1])

        # Get or create file writer for the gene_mode_id
        if gene_mode_id not in file_writers:
            outfile = open(os.path.join(out_dir, f"{gene_mode_id}.csv"), 'w', newline='')
            print("Writing to"+gene_mode_id,flush=True)
            writer = csv.writer(outfile)
            writer.writerow(["X", "Y", "Score", "WT", "Sub"])
            file_writers[gene_mode_id] = (writer, outfile)
        else:
            #writer = file_writers[gene_mode_id]
            writer, _ = file_writers[gene_mode_id]

        # Write row data
        writer.writerow([position, aa_to_number(aa_substitution), str(round(float(row[2]), 2)), wt, aa_substitution])

# Close all output files
for writer, outfile in file_writers.values():
    outfile.close()

print("Files generated in the", out_dir, "directory.")
