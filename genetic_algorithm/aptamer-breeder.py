from random import randint

def aptamer_maker(): # function to generate a random aptamer 20 nucleotides long
	aptamer = ""
	for i in range(0,20):
		n = randint(0,3)
		if n == 0:
			aptamer += "A"
		elif n == 1:
			aptamer += "C"
		elif n == 2:
			aptamer += "G"
		else:
			aptamer += "T"
	return aptamer

# array containing 4 randomly generated aptamers, their sequences and affinity scores
parents = 6 # number of parent aptamers 
aptamers = []

for i in range(0,parents):
	aptamers.append(["aptamer_" + str(i),aptamer_maker(),randint(0,100)])

sorted_aptamers = sorted(aptamers, key=lambda x: x[2], reverse=True) # sorts aptamers from highest to lowest affinity scores

print sorted_aptamers

offspring = 8 # desired number of offspring
top_parents = 3 # desired number of top scoring parents to cross
bred_aptamers = []

# the two highest scoring aptamers are randomly crossed over to generate a specified number of offspring
for i in range(0,offspring):
	x = randint(0,19) # random nucleotide postion along the 20 bp aptamer
	y = randint(0,top_parents - 1)
	if x == 0:
		bred_aptamers.append(["offspring_" + str(i),sorted_aptamers[y][1]])	
	elif x == 19:
		bred_aptamers.append(["offspring_" + str(i),sorted_aptamers[y][1]])
	else:
		bred_aptamers.append(["offspring_" + str(i),sorted_aptamers[y][1][0:x] + sorted_aptamers[2 - y][1][x + 1:19]])

print bred_aptamers