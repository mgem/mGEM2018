from rand import randint
import difflib
#made by sid for gluedtogether.py
def generateAptamer(length=20): # function to generate a random aptamer length nucleotides long
   aptamer = ""
   for i in range(0,length):
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

def genPool(pool_size, apt_size=20):
   aptamerList = []
   for i in range(1,pool_size):
      aptamerList.append(['aptamer_' + str(i), generateAptamer(apt_size), randint(0,100)])
   return sorted(aptamerList, key=lambda x: x[2], reverse=True) 

#uses difflib string distance to compute child fitness from parent
# parent1 and parent 2 are in the format [aptamer_1, 'asdasdasdasdasda', 47]
# child is just a string, 'asdasdasdasdasdasdasd'
def computeChildFitness(parent1=None, parent2=None, child=None):
   #take distance to parent1, divide by len(child), then multiply by parent1 fitness. repeat for parent 2 and add the fitness values. ???????????????
   if parent1 == None:
      return parent2[2]
   elif parent2 == None:
      return parent1[2]
   elif parent1 != None and parent2 != None and child != None:
      #compute child fintess
   else:
      raise ValueError('Invalid paramaters, need parent1, parent2 and child to all not be None')

# parent1 and parent 2 are in the format [aptamer_1, 'asdasdasdasdasda', 47]
def crossover(parent1, parent2):
   max_pos = min([len(parent1), len(parent2)])   
   crossOverPos = randint(1,max_pos-2) # random nucleotide postion along the max_pos bp aptamer, except not the 
#   if crossOverPos == 0:
#      # just returns parent 1 since not acutally a crossover
#      child = ["offspring_" + str(i), sortedAptamerList[parent1][1], computeChildFitness(parent1)]
#   elif crossOverPos == max_pos-1:
#      child = ["offspring_" + str(i), sortedAptamerList[parent2][1], computeChildFitness(parent2)]
#   else:
   if crossOverPos%2 == 0:
      # if crossOverpos is even, first half is from parent1, if not first half of child is from parent2
      childseq = parent1[1][:crossOverPos] + parent2[1][crossOverPos1:]
      child = ["offspring_" + str(i), childseq, computeChildFitness(parent1, parent2, childseq)]
   else:
      childseq = parent2[1][:crossOverPos] + parent1[1][crossOverPos1:]
      child = ["offspring_" + str(i), childseq, computeChildFitness(parent1, parent2, childseq)]
   return child

#aptamer list format: [['aptamer_1, 'asdasdasdasd', 45], ['aptamer_2', 'asdasasdasd', 78]]
# the two highest scoring aptamers are randomly crossed over to generate a specified number of offspring
def breed(sortedAptamerList, top_cutoff=-1, offspring=-1):
   bred_aptamers = []
   #elites is top 2%
   for x in range(0, int(len(sortedAptamerList)*0.02)):
      bred_aptamers.append(sortedAptamerList[x]
   if top_cutoff == -1:
      top_cutoff = len(sortedAptamerList)//5
   if offspring == -1:
      offspring = len(sortedAptamerList)
   #assumed all aptamers are the same length
   top_parents = sortedAptamerList[0:top_cutoff-1]
   return bred_aptamers
