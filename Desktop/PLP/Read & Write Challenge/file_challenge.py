
def modify_file(input_file, output_file):
    try:
        with open(input_file, "r") as infile:
            content = infile.read()

        modified_content = content.upper()

        with open(output_file, "w") as outfile:
            outfile.write(modified_content)

        print(f"Modified file has been saved as '{output_file}'.")

    except FileNotFoundError:
        print(f"Error: The file '{input_file}' was not found.")
    except IOError:
        print("Error: Unable to read or write files.")
if __name__ == "__main__":
    filename = input("Enter the filename to read: ").strip()
    output_filename = "modified_" + filename

    modify_file(filename, output_filename)
