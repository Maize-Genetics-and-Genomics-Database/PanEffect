#!/bin/bash

# Directory containing the PDB files
DIR=$1
DIR_OUT=$2
DIR_DSSP=$3
HOME_DIR=$4

cd $DIR

# Loop through all PDB files in the directory
for file in *.pdb; do
    # Name the output file based on the input file's name

    inputfile=${file}

    outputfile="${DIR_OUT}/${file%.pdb}_output"

    # Run mkdssp command
    #echo "mkdssp -i $inputfile -o $outputfile"
    mkdssp -i ${inputfile} -o ${outputfile}

    # Process the output file to extract the first and fourth columns
    # Save the extracted columns to a new TSV file named after the input file
    #awk '{print $1 "\t" $4 "\t" $5}' "${outputfile}" > "${DIR_DSSP}/${file%.pdb}.tsv"

    python ${HOME_DIR}/process_dssp_tsv.py ${outputfile} ${DIR_DSSP}/${file%.pdb}.tsv

    # Optionally, remove the intermediate output file
    # rm "$outputfile"
done
