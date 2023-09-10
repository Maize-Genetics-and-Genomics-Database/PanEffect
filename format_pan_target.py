from Bio import SeqIO
import os
import sys

input_directory = sys.argv[1]
output_directory = sys.argv[2]


def convert_gm_to_genome(gm: str) -> str:
    if "Zm00001eb" in gm:
        return "B73"
    elif "Zd00001aa" in gm:
        return "Gigi"
    elif "Zd00003aa" in gm:
        return "Momo"
    elif "Zh00001aa" in gm:
        return "RIMHU001"
    elif "Zm00001d" in gm:
        return "B73_v4"
    elif "Zm00001eb" in gm:
        return "B73_v5"
    elif "Zm00004b" in gm:
        return "W22_v2"
    elif "Zm00008a" in gm:
        return "PH207"
    elif "Zm00010a" in gm:
        return "EP1"
    elif "Zm00011a" in gm:
        return "F7"
    elif "Zm00014a" in gm:
        return "Mo17"
    elif "Zm00015a" in gm:
        return "SK"
    elif "Zm00016a" in gm:
        return "DK105"
    elif "Zm00017a" in gm:
        return "PE0075"
    elif "Zm00019ab" in gm:
        return "CML52"
    elif "Zm00020ab" in gm:
        return "CMML69"
    elif "Zm00022ab" in gm:
        return "CML228"
    elif "Zm00023ab" in gm:
        return "CML247"
    elif "Zm00025ab" in gm:
        return "CML322"
    elif "Zm00028ab" in gm:
        return "Il14H"
    elif "Zm00029ab" in gm:
        return "Ki3"
    elif "Zm00032ab" in gm:
        return "M37W"
    elif "Zm00036ab" in gm:
        return "NC350"
    elif "Zm00037ab" in gm:
        return "NC358"
    elif "Zm00039ab" in gm:
        return "Oh43"
    elif "Zm00041ab" in gm:
        return "Tx303"
    elif "Zm00045a" in gm:
        return "Ia453"
    elif "Zm00052a" in gm:
        return "LH244"
    elif "Zm00054a" in gm:
        return "K0326Y"
    elif "Zm00056aa" in gm:
        return "A188"
    elif "Zm00092aa" in gm:
        return "A632"
    elif "Zm00093aa" in gm:
        return "Chang-7_2"
    elif "Zm00094aa" in gm:
        return "Dan340"
    elif "Zm00096aa" in gm:
        return "Jing724"
    elif "Zm00097aa" in gm:
        return "Jing92"
    elif "Zm00100aa" in gm:
        return "S37"
    elif "Zm00101aa" in gm:
        return "Xu178"
    elif "Zm00102aa" in gm:
        return "Ye478"
    elif "Zm00103aa" in gm:
        return "Zheng58"
    elif "Zn00001aa" in gm:
        return "PI615697"
    elif "Zv00002aa" in gm:
        return "TIL11"
    elif "Zx00003aa" in gm:
        return "TIL25"
    elif "Zm00018ab" in gm:
        return "B97"
    elif "Zm00021ab" in gm:
        return "CML103"
    elif "Zm00024ab" in gm:
        return "CML277"
    elif "Zm00026ab" in gm:
        return "CML333"
    elif "Zm00027ab" in gm:
        return "HP301"
    elif "Zm00033ab" in gm:
        return "M162W"
    elif "Zm00034ab" in gm:
        return "Mo18W"
    elif "Zm00035ab" in gm:
        return "Ms71"
    elif "Zm00038ab" in gm:
        return "Oh7B"
    elif "Zm00040ab" in gm:
        return "P39"
    elif "Zm00042ab" in gm:
        return "Tzi8"
    elif "Zv00001aa" in gm:
        return "TIL01"
    elif "Zx00002aa" in gm:
        return "TIL18"
    elif "Zm00030ab" in gm:
        return "Ki11"
    elif "Zm00031ab" in gm:
        return "Ky21"
    elif "Zm00095aa" in gm:
        return "Huangzaosi"
    else:
        return "Unknown"

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
                    out_file.write('Y\tGM\tGN\n')

                    # Loop through all sequences and compare to the query sequence
                    y = 1
                    for target_seq in sequences:
                        if query_seq.id != target_seq.id:
                            out_file.write(f"{y}\t{target_seq.id}\t{convert_gm_to_genome(target_seq.id)}\n")
                            y += 1
