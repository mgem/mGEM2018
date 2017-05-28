import os
import random

'''
This program takes in a aptamer and outputs an a apter with a randomly replaced site
Input: aptamer 
Output: new substituted aptamer 
''' 

#function to replace a random site

#returns sequence with random site substituted (string) 
def repla (input_sequence):
	site=random.randint(0, len(input_sequence)-1)
	s=list(input_sequence)
	choose = random.randint(1,3)
	if s[site]== 'A': 
		if choose == 1:
			s[site]='T'
		elif choose == 2:
			s[site]='G'
		elif choose == 3: 
			s[site]='C'
	elif s[site]== 'T': 
		if choose == 1:
			s[site]='A'
		elif choose == 2:
			s[site]='G'
		elif choose == 3: 
			s[site]='C'
	elif s[site]== 'C': 
		if choose == 1:
			s[site]='A'
		elif choose == 2:
			s[site]='G'
		elif choose == 3: 
			s[site]='T'
	elif s[site]== 'G': 
		if choose == 1:
			s[site]='A'
		elif choose == 2:
			s[site]='T'
		elif choose == 3: 
			s[site]='C'
	input_sequence="".join(s); 
	return input_sequence

aptemer ="AACCGGTT"
newA =repla(aptemer)
print (newA)
#print("hello world")