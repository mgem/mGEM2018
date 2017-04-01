import os
def extract():
  html = os.listdir("./html")
  for i in html:
    print(i)
    file_open = open("./html/" + i, "r")
    for j in range(len(file_open.read())):
      print(file_open.read()[j])
extract()
