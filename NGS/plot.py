#!/usr/bin/env python3

import pysam
import numpy as np
import matplotlib.pyplot as plt
import pickle

# convert DNA to AA
def convertAA(cDNA):
    # intialize AA string
    AA = ""
    # loop to convert codons into AA
    cDNA_len_minus_two = len(cDNA) - 2
    for i in range(0, cDNA_len_minus_two, 3):
        # isolate codon
        codon = cDNA[i:i+3]
        # convert
        if (codon == "TGA" or codon == "TAA" or codon == "TAG"):
            # stop codon
            break
        elif (codon == "ATT" or codon == "ATC" or codon == "ATA"):
            # Isoleucine
            AA += "I"
        elif (codon == "CTT" or codon == "CTC" or codon == "CTA" or codon == "CTG" or codon == "TTA" or codon == "TTG"):
            # Leucine
            AA += "L"
        elif (codon == "GTT" or codon == "GTC" or codon == "GTA" or codon == "GTG"):

            # Valine
            AA += "V"

        elif (codon == "TTT" or codon == "TTC"):

            # Phenylalanine
            AA += "F"

        elif (codon == "ATG"):

            # Methionine
            AA += "M"

        elif (codon == "TGT" or codon == "TGC"):

            # Cysteine
            AA += "C"

        elif (codon == "GCT" or codon == "GCC" or codon == "GCA" or codon == "GCG"):

            # Alanine
            AA += "A"

        elif (codon == "GGT" or codon == "GGC" or codon == "GGA" or codon == "GGG"):

            # Glycine
            AA += "G"

        elif (codon == "CCT" or codon == "CCC" or codon == "CCA" or codon == "CCG"):

            # Proline
            AA += "P"

        elif (codon == "ACT" or codon == "ACC" or codon == "ACA" or codon == "ACG"):

            # Threonine
            AA += "T"

        elif (codon == "TCT" or codon == "TCC" or codon == "TCA" or codon == "TCG" or codon == "AGT" or codon == "AGC"):

            # Serine
            AA += "S"

        elif (codon == "TAT" or codon == "TAC"):

            # Tyrosine
            AA += "Y"

        elif (codon == "TGG"):

            # Tryoptophan
            AA += "W"

        elif (codon == "CAA" or codon == "CAG"):

            # Glutamine
            AA += "Q"

        elif (codon == "AAT" or codon == "AAC"):

            # Asparagine
            AA += "N"

        elif (codon == "CAT" or codon == "CAC"):

            # Histidine
            AA += "H"

        elif (codon == "GAA" or codon == "GAG"):

            # Glutamic Acid
            AA += "E"

        elif (codon == "GAT" or codon == "GAC"):

            # Aspartic Acid
            AA += "D"

        elif (codon == "AAA" or codon == "AAG"):

            # Lysine
            AA += "K"

        elif (codon == "CGT" or codon == "CGC" or codon == "CGA" or codon == "CGG" or codon == "AGA" or codon == "AGG"):

            # Arginine
            AA += "R"

        else:

            # Potential error
            AA += "?"

    return AA

data = np.zeros((42, 2))
ref = "GATGCAGAATTCCGACATGACTCAGGATATGAAGTTCATCATCAAAAATTGGTGTTCTTTGCAGAAGATGTGGGTTCAAACAAAGGTGCAATCATTGGACTCATGGTGGGCGGTGTTGTCATAGCGTAACATCATCACCATCACCACTAA"
amyloid = "DAEFRHDSGYEVHHQKLVFFAEDVGSNKGAIIGLMVGGVVIA"

samfile = pysam.AlignmentFile("aln.bam", "rb")
for read in samfile.fetch():
    shift_start = read.reference_start % 3
    if (shift_start != 0):
        shift_start = 3 - shift_start
    shift_end = read.reference_end % 3
    start_aa = (read.reference_start + shift_start) // 3
    end_aa = (read.reference_end - shift_end) // 3
    ref_aa = amyloid[start_aa:end_aa]
    read_aa = convertAA(read.query_sequence[(
        read.query_alignment_start + shift_start): (read.query_alignment_end - shift_end)])
    for l in range(len(read_aa)):
        i = start_aa + l
        if i >= 42:
            break
        else:
            data[i][1] += 1
            if amyloid[i] == read_aa[l]:
                data[i][0] += 1
samfile.close()

rate = np.zeros(42)
for i in range(42):
    rate[i] = data[i][0]/data[i][1]
print(np.array2string(rate))
with open("./rate.pkl", "wb") as f:
    pickle.dump(rate, f)
plt.plot(range(42), rate)
plt.xlabel('Amino Acid Position')
plt.ylabel('Fraction Conserved')
plt.title('Conservation of Amino Acids in Mutated Amyloid-Beta At Given Timepoint')
plt.grid(True)
plt.savefig("plot.png")
plt.close()
