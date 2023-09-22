from Bio import SearchIO
import os
import sys

# Path to the output.domains file
input_file = sys.argv[1]    #"./domains/output.domains.small"

# E-value cutoff
e_value_cutoff = float(sys.argv[2]) #0.001

# Make sure the output directory exists or create it
output_directory = sys.argv[3]      #"./pfam/fusarium/"
os.makedirs(output_directory, exist_ok=True)

# Parse the HMMER output using SearchIO
hmmer_results = SearchIO.parse(input_file, "hmmscan3-domtab")

# Iterate over the results
for result in hmmer_results:
    query_name = result.id

    # Open an output file for each query in the specified directory
    with open(os.path.join(output_directory, f"{query_name}.tsv"), 'w') as outfile:

        # Write the headers to the file
        #outfile.write("Query Name\tPFAM ID\tPFAM Name\tQuery Start\tQuery End\n")

        # Iterate over the hits for each query
        for hit in result.hits:

            # The hit ID typically contains the PFAM ID, while hit description contains the PFAM name.
            pfam_id = hit.id
            pfam_name = hit.description
            pfam_acc= hit.accession.split(".")[0]

            # Iterate over the HSPs (high-scoring pairs) for each hit
            for hsp in hit.hsps:
                # Apply E-value filter
                if hsp.evalue <= e_value_cutoff:
                    # Write desired information to the output file
                    outfile.write(f"{query_name}\t{pfam_acc}\t{pfam_id}\t{pfam_name}\t{hsp.query_start}\t{hsp.query_end}\n")
