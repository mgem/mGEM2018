import os
def extract():
  html = os.listdir("./html")
  write_lines = []
  for i in html:
    file_open = open("./html/"+i,"r", encoding="utf8")
    file_lines = file_open.readlines()
    seq_num = 0
    for line in range(len(file_lines)):
      if "<title>" in file_lines[line]:
        if seq_num == 0:
          write_lines.append("\n")
        write_lines.append(file_lines[line].split(":")[-1].split("<")[0].strip())
        write_lines.append("\n")
        seq_num = 0
      if "apta-sequence" in file_lines[line] and seq_num == 0:
        raw_seq_string = file_lines[line+1].split("<")[0].strip()
        trim_seq_string = raw_seq_string.replace("dAp","A").replace("dCp","C").replace("dGp","G").replace("dTp","T").replace("rAp","A").replace("rCp","C").replace("rGp","G").replace("rUp","U")
        if trim_seq_string[:3] != "5\'-":
          trim_seq_string = "5\'-" + trim_seq_string
        if trim_seq_string[-3:] != "-3\'":
          trim_seq_string = trim_seq_string + "-\'3"
        write_lines.append(trim_seq_string)
        write_lines.append("\n")
        seq_num += 1
  filename = "./aptamers.txt"
  f = open(filename,"w")
  for line in write_lines:
    f.write(line)
  f.close()
        
extract()
 
