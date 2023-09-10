from Bio import SeqIO
import os
import sys

input_directory = sys.argv[1]
output_directory = sys.argv[2]

# Create output directory if it doesn't exist
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

# Read all fasta files
fasta_files = [f for f in os.listdir(input_directory)]
#print("Check 0")
# Iterate through the fasta files to find sequences with the specified ID
for fasta_file in fasta_files:
    file_path = os.path.join(input_directory, fasta_file)
    with open(file_path, 'r') as file:
        sequences = list(SeqIO.parse(file, 'fasta'))
        #print("Check 1")
        for query_seq in sequences:
            if "Zm00001eb" in query_seq.description:
                #print(query_seq.id)
                output_file_path = os.path.join(output_directory, f"{query_seq.id}.tsv")

                # Open the output file for writing
                with open(output_file_path, 'w') as out_file:
                    # Write header
                    out_file.write('X\tX2\tWT\n')

                    # Loop through all sequences and compare to the query sequence
                    x2 = 0
                    for idx, aa in enumerate(query_seq.seq):
                        if aa != '-':
                            x2 += 1
                            out_file.write(f"{idx + 1}\t{x2}\t{query_seq.seq[idx]}\n")
                        else :
                            out_file.write(f"{idx + 1}\t-\t{query_seq.seq[idx]}\n")
