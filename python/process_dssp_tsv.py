import sys

def process_file(input_file, output_file):
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        # Skip lines until a line starts (after trimming) with '#'
        for line in infile:
            if line.strip().startswith('#'):
                break

        # Process the remaining lines
        i=1
        for line in infile:
            # Ensure the line has enough characters to get positions 11 and 13
            if len(line) >= 14:
                char_13 = line[13]  # 0-based index for position 11
                char_16 = line[16]  # 0-based index for position 13
                if not char_16.strip():
                    char_16 = "L"
                outfile.write(f"{i}\t{char_13}\t{char_16}\n")
            i = i + 1

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <input_file> <output_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    process_file(input_file, output_file)
