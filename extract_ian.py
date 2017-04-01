import os
def extract():
  html = os.listdir("./html")
  for i in html:
    print(i)
    file_open = open("./html/"+i,"r")
    print(file_open.read())
extract()
 
