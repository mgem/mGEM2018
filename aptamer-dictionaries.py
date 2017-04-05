d_1 = {}
 
d_1["apt_1"] = ["seq_1", 45]
d_1["apt_2"] = ["seq_2", 55]
d_1["apt_3"] = ["seq_3", 65]

d_2 = {}

d_2["apt_1"] = ["seq_1", 4]
d_2["apt_2"] = ["seq_2", 5]
d_2["apt_3"] = ["seq_3", 6]

lst = []
for d in d_1:
    lst.append([d, d_1[d][0], d_1[d][1], d_2[d][1]])
    
sorted_lst = sorted(lst, key=lambda x: x[2])

fo = open("output.txt", "wb")

for i in sorted_lst:
   	fo.write("{}\t{}\t{}\t{}\n".format(i[0], i[1], i[2], i[3]))
fo.close()