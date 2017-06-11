from bs4 import BeautifulSoup
import requests
import csv 

aptamer_data = requests.get('http://www.aptagen.com/aptamer-index/aptamer-list.aspx')
soup = BeautifulSoup(aptamer_data.text, 'html.parser')

div_results = soup.find_all("div", "result-item")

data_categories = []

for label in div_results[0].find_all('label'):
	data_categories.append(label.string.strip())

print data_categories

aptamer_names = []

for result in div_results:
	for a in result.find_all('a'):
		aptamer_names.append(a.string.strip())

print aptamer_names


name_data_dict = {}

for i in range(len(div_results)):
	tmplist = []
	for span in div_results[i].find_all('span'):
		tmplist.append(''.join(filter(None,span.string.split(' '))))
	# 	tmplist.append(span.string.strip())
	# tmplist[3].replace("     nM (reported value)", "")		
	name_data_dict[aptamer_names[i]] = tmplist

print name_data_dict


