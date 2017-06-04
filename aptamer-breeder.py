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
aptamers = []
aptamers.append(["aptamer_1",aptamer_maker(),65])
aptamers.append(["aptamer_2",aptamer_maker(),15])
aptamers.append(["aptamer_3",aptamer_maker(),35])
aptamers.append(["aptamer_4",aptamer_maker(),45])

sorted_aptamers = sorted(aptamers, key=lambda x: x[2], reverse=True) # sorts aptamers from highest to lowest affinity scores

print sorted_aptamers

# breeds aptamers by combining the first and second halves of the highest affinity aptamers
offspring_1 = sorted_aptamers[0][1][0:10] + sorted_aptamers[1][1][11:20]
offspring_2 = sorted_aptamers[0][1][11:20] + sorted_aptamers[1][1][0:10]

#array containing the new generation of aptamers with unknown scores, as they need to be experimentally determined
bred_aptamers = []
bred_aptamers.append(["aptamer_5",offspring_1,"unknown"])
bred_aptamers.append(["aptamer_6",offspring_2,"unknown"])

print bred_aptamers
