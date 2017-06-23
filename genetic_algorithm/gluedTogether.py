import aptamerBreeder as ab
import separation as sp
import hairpins as hp
import replace as rp

#Function List:
# sp.sperate(sequence)
# sp.sperate(sequence)
# rp.mutate(sequence)
# hp.hairpin(sequence, max_hp_len)
# hp.striplist(list, stripval)
# hp.create_hairpin_dict(txtfile)
# hp.inverted_repeat(sequence)
# ab.generateAptamer(length)
# ab.genPool(pool_size)
# ab.breed(sortedAptamerList, top_cutoff, offspring)
'''
Order of how to do thing:

create pool
[
breed pool
for p in pool:
   cutoff = getbestFitnessScoringMembers(poolP) # cutoff is top 10%, can be adjusted
   if isElite(p) == True: # elite is top 2%, can be adjusted
      new_pool.append(p)
   while len(new_pool) < len(pool):
      new_pool.append(crossover(cutoff[randint], cutoff[randint]))
   for member in new_pool:
       new_pool.append(mutate(cutoff[randint])) 
   new_pool = removeChildrenWithHairpins(new_pool)
pool = new_pool
]
repeat [...] for x generations

'''
# generation member: ['seq_1', 'asdasdasdasd', 45]
def runGeneticAlgorithim(populationsize, generations, length):
   firstGen = ab.genPool(populationsize)
   secondGen = ab.breedPool(firstGen)
   secondGenF1 = [#seq for seq in secondGen if hairpin(seq+ == FALSE) ]
   secondGenF2 = [[x[0] + mutate(x[1]) + x[2]] for x in secondGenF1]
