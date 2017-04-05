import os
def extract():
  # Define where the html/ directory is
  html = os.listdir("./html")

  write_lines = []
  # For each html file
  for i in html:
    # Read it with urf8
    file_open = open("./html/"+i,"r", encoding="utf8")
    file_lines = file_open.readlines()
    seq_num = 0
    # For each line
    for line in range(len(file_lines)):
      # If the title tag is present
      if "<title>" in file_lines[line]:
        # If the previous aptamer didn't have a sequence add a newline buffer
        if seq_num == 0:
          write_lines.append("\n")
        # Append the name of the aptamer to the lines to be written
        write_lines.append(file_lines[line].split(":")[-1].split("<")[0].strip())
        # And go to next line
        write_lines.append("\n")
        # Set the number of sequences found for current aptamer to 0
        seq_num = 0
      # If the sequence tag is present
      if "apta-sequence" in file_lines[line] and seq_num == 0:
        # Grab the sequence
        raw_seq_string = file_lines[line+1].split("<")[0].strip()
        # Replace dAp, etc. with raw base letters
        # Maybe should we leave it as is?
        # If not, have to add other things like F-RNA, BNA, PNA??
        trim_seq_string = raw_seq_string.replace("dAp","A").replace("dCp","C").replace("dGp","G").replace("dTp","T").replace("rAp","A").replace("rCp","C").replace("rGp","G").replace("rUp","U")
        # Add 5' and 3' caps
        # Is this different for F-RNA?
        if trim_seq_string[:3] != "5\'-":
          trim_seq_string = "5\'-" + trim_seq_string
        if trim_seq_string[-3:] != "-3\'":
          trim_seq_string = trim_seq_string + "-\'3"
        # Append the modified string to the lines to be written
        write_lines.append(trim_seq_string)
        write_lines.append("\n")
        # Increase number of sequences for the current aptamer by 1
        seq_num += 1

  # Write lines
  filename = "./aptamers.txt"
  f = open(filename,"w")
  for line in write_lines:
    f.write(line)
  f.close()
        
extract()
 
