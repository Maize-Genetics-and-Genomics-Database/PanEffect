from Bio import SeqIO
import os
import sys
import csv

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

                #OPEN scores

                # Create an empty dictionary to store the data
                data_dict = {}

                # Open the CSV and read the data
                filename_query = './csv3/'+query_seq.id.replace("_T", "_P")+'.csv'
                with open(filename_query, 'r') as csvfile:
                    reader = csv.reader(csvfile)
                    next(reader)  # skip the header

                    for row in reader:
                        x, y, score, wt, sub = int(row[0]), int(row[1]), float(row[2]), str(row[3]), str(row[4])
                        data_dict[(x, wt, sub)] = score
                        #print(str(x)+" "+wt+" "+sub+" "+str(score))
                        #print(str(x)+str(data_dict[(x, wt, sub)]))

                #print(query_seq.id)
                output_file_path = os.path.join(output_directory, f"{query_seq.id}.tsv")

                # Open the output file for writing
                with open(output_file_path, 'w') as out_file:
                    # Write header
                    out_file.write('X\tY\tScore\tX2\tX3\tWT\tSub\n')

                    # Loop through all sequences and compare to the query sequence
                    y = 1
                    for target_seq in sequences:
                        if query_seq.id != target_seq.id:
                            x3 = 1
                            x2 = 1
                            x1 = 1
                            for idx, aa in enumerate(target_seq.seq):
                                x1 = idx + 1
                                #print("CHECK "+str(x2)+" "+query_seq.seq[idx]+" "+aa+" "+str(data_dict.get((x2, query_seq.seq[idx], aa), None)))
                                out_file.write(f"{x1}\t{y}\t{data_dict.get((x2, query_seq.seq[idx], aa), None)}\t{x2}\t{x3}\t{query_seq.seq[idx]}\t{aa}\n")
                                #NEED to fix when Target has a Gap
                                if query_seq.seq[idx] != '-':
                                    x2 += 1
                                if aa != '-':
                                    x3 += 1
                            y += 1
