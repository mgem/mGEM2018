#!/usr/bin/env python3

"""
Extract SAM files of mutations.

Output the 10 most common mutations,
create a SAM file containing the reads associated with each,
cache results in "./mutations/".
"""

import pysam
import os
from collections import Counter, defaultdict
import pickle
import pathlib
from bisect import bisect_left
from functools import lru_cache
import sys

samlines = []


@lru_cache(maxsize=1024)
def get_samline(name):
    """Binary search to find samline starting with name."""
    # Note: cache the queried samlines
    # (maxsize should be the smallest 2^n that still exceeds
    # the # of samlines in split SAM files)
    return samlines[bisect_left(samlines, name)]


def mutation_bai_exists(mutation):
    """Check whether bam.bai file exists for given mutation."""
    bai = os.path.join("./mutations", mutation + ".bam.bai")
    return os.path.isfile(bai)


def count_mutations_in_file(ref, file):
    """Return counter of mutations in file."""
    mutated_reads = get_mutated_reads_from_file(ref, file)
    mutations = Counter({mutation: len(names)
                         for mutation, names in mutated_reads.items()})
    return mutations


def get_mutated_reads_from_file(ref, file):
    """Return dict associating this file's mutations with read names."""
    try:
        with open("./mutations/{}.mutated_reads.pkl".format(
            os.path.basename(file)
        ), "rb") as f:
            mutated_reads = pickle.load(f)
    except (OSError, IOError) as e:
        samfile = pysam.AlignmentFile(
            file, "rb", reference_filename="./ref.fa")
        mutated_reads = defaultdict(list)
        for pileupcolumn in samfile.pileup("ref", 0, 150):
            pos = pileupcolumn.reference_pos
            sequences = pileupcolumn.get_query_sequences(False, False, True)
            names = pileupcolumn.get_query_names()
            refbase = ref[pos]
            for seq, name in zip(sequences, names):
                if seq != refbase:
                    if seq == "*":
                        seq = "d"
                    if len(seq) == 1:
                        seq = refbase + "~" + seq
                    # pad to 3 digits b/c ref length is max 3 digits
                    mutation = format(pos + 1, "03") + "_" + seq
                    mutated_reads[mutation].append(name)
        samfile.close()
        with open("./mutations/{}.mutated_reads.pkl".format(
            os.path.basename(file)
        ), "wb") as f:
            pickle.dump(mutated_reads, f)

    return mutated_reads


# get reference sequence
print("Getting reference sequence...")
reffile = pysam.FastaFile("ref.fa")
ref = reffile.fetch("ref", 0, 150)
reffile.close()

# get counter of all mutations
print("Counting all mutations...")
pathlib.Path('./mutations').mkdir(exist_ok=True)
mutation_counter = Counter()
for file in [f for f in os.listdir("./split") if f.endswith(".bam")]:
    mutation_counter += count_mutations_in_file(
        ref, os.path.join("./split", file))

# list 10 most common mutations
mutation_list = mutation_counter.most_common(10)
print("Most common mutations: " + str(mutation_list))

# remove mutations that already have .bam.bai files in cache
mutation_list = [m for m in mutation_list if not mutation_bai_exists(m[0])]

if not mutation_list:
    print("SAM and BAM files already exist for these mutations.")
    sys.exit()
else:
    print("Generating SAM and BAM files for these mutations...")

# get SAM file header
with open("header.txt", "r") as f:
    header = f.read()

# add header to the SAM files we're making for each mutation
for m in mutation_list:
    samfile = os.path.join("./mutations", m[0] + ".sam")
    with open(samfile, "w+") as f:
        f.write(header)
print("SAM files created with header. Populating SAM files...")

# for each mutated_reads pickle in cache
for file in [
    f for f in os.listdir("./mutations") if f.endswith(".mutated_reads.pkl")
]:

    # get mutated_reads
    with open(os.path.join("./mutations", file), "rb") as f:
        mutated_reads = pickle.load(f)

    # get associated SAM file (remove "bam.mutated_reads.pkl", add "sam")
    samfile = file[:-21] + "sam"
    with open(os.path.join("./split", samfile), "r") as f:
        samlines = f.readlines()
    # sort now so that we can binary search later
    samlines.sort()

    # for each of the top 10 mutations
    for m in mutation_list:
        mutation = m[0]
        # if there are any corresponding reads in this SAM file
        if mutation in mutated_reads:
            samfile = os.path.join("./mutations", mutation + ".sam")
            with open(samfile, "a") as f:
                # write the reads to (mutation + ".sam")
                for name in mutated_reads[mutation]:
                    f.write(get_samline(name))

print("SAM files populated. Generating and indexing BAM files...")
for m in mutation_list:
    samfile = os.path.join("./mutations", m[0] + ".sam")
    # use pysam to sort the reads by each alignment's leftmost coordinates
    pysam.sort("-o", samfile, samfile)
    # convert to BAM file and create corresponding index
    bambytes = pysam.view("-S", "-b", samfile)
    bamfile = samfile[:-3] + "bam"
    with open(bamfile, "wb+") as f:
        f.write(bambytes)
    pysam.index(bamfile)
    # print(pysam.idxstats(bamfile))

os.remove("ref.fa.fai")
print("Complete!")
