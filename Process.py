import os


'''
This program takes in aptamer text file and counts the number of hairpin structures.
Hairpin: inverse repeats 
Input: aptamer text file
Output: dictionary with aptamer name, and number of hairpin structures.
''' 

#define the minumum length of the hairpin structure
MINIMUM_HAIRPIN_LENGTH = 5
#function to count hairpins (palindromes)

def inverted_repeat (input_sequence):
    input_sequence = input_sequence.replace('A','X')
    input_sequence = input_sequence.replace('T','A')
    input_sequence = input_sequence.replace('X','T')
    input_sequence = input_sequence.replace('C','X')
    input_sequence = input_sequence.replace('G','C')
    input_sequence = input_sequence.replace('X','G')
    return input_sequence[::-1]

def hairpin (sequence):
    hairpin_num =0
    sequence = sequence.strip('5\'')  
    sequence = sequence.strip('3\'')  
    sequence = sequence.strip('-')  
    for x in range (MINIMUM_HAIRPIN_LENGTH, len(sequence)//2):
        for counter in range (0,len(sequence)-x):
            target = inverted_repeat(sequence[counter:counter+x])
            if (sequence[counter+x:].find(target, counter+x)!= -1):
                print (target)
                hairpin_num = hairpin_num +1;
    return hairpin_num
def remove_values_from_list(the_list, val):
   return [value for value in the_list if value != val]

#open aptamer list text file 
file = open("Aptamer_List.txt", 'r')
#create empty hairpin dictionary
hairpin_dict = {}

x=0
name = ""
h_num = 0

list = file.readlines()
list = remove_values_from_list (list, "\n") #remove any empty lines from the list 

for index, item in enumerate(list): #iterate aptamer file lines by index num
    if (index%2==0):
        name = item.strip('\n')
    else:
        h_num = hairpin(item.strip('\n'))
        hairpin_dict [name] = h_num
file.close()
print (hairpin_dict)
print("hello world")