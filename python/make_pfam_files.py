import csv
import sys
import os

input_file = sys.argv[1]
out_dir = sys.argv[2]

# A dictionary to store rows based on the unique value in column 1
data_dict = {}

# Read the TSV file
with open(input_file, 'r') as file:
    reader = csv.reader(file, delimiter='\t')

    for row in reader:
        key = row[0]

        if key in data_dict:
            data_dict[key].append(row)
        else:
            data_dict[key] = [row]

# Write data to new files
for key, rows in data_dict.items():
    output_file = f"{out_dir}{key}.tsv"

    with open(output_file, 'w', newline='') as outfile:
        writer = csv.writer(outfile, delimiter='\t')

        for row in rows:
            writer.writerow(row)
