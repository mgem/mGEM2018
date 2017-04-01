import os
def extract():
  html = os.listdir("./html")
  for i in html:
    print(i)
    file_open = open("./html/"+i,"r", encoding="utf8")
    file_lines = file_open.readlines()

    for line in range(len(file_lines)):
      if "<title>" in file_lines[line]:
        print (file_lines[line].split(":")[-1].split("<")[0])
      if "apta-sequence" in file_lines[line]:
        print(file_lines[line+1].split("<")[0])
        
extract()
 
