#!/usr/bin/env bash

# Aligns reads, prepares aln.bam for viewing with IGV, and splits aln.bam into multiple SAM files for easier processing

# Ref must be called ref.fa, reads must be called reads.fq
# If reads are reads.fa, consider running "perl fasta_to_fastq.pl reads.fa > reads.fq" first
# You must already have samtools (or bcftools), minimap2, and perl in your $PATH

samtools faidx ref.fa && \
printf '\n%s\n' "Testing alignment on a small subset of reads..." && \
perl fasta-splitter.pl --n-parts 1 --part-size 10000 --measure count reads.fa && \
minimap2 -a -k3 -w3 ref.fa reads.part-1.fa | samtools sort -o aln.sam && \
samtools view -Sb aln.sam > aln.bam && \
samtools index aln.bam && \
printf '\n%s\n' "If the following stats show low alignment, please Ctrl-C and adjust minimap2's parameters." && \
samtools idxstats aln.bam && \
printf '\n%s\n' "Assuming that alignment on the subset was successful. Aligning all reads..." && \
minimap2 -a -k3 -w3 ref.fa reads.fa | samtools sort -o aln.sam && \
samtools view -Sb aln.sam > aln.bam && \
samtools index aln.bam && \
printf '\n%s\n' "Alignment complete! Stats for all reads:" && \
samtools idxstats aln.bam && \
printf '\n%s\n' "Splitting reads for ease of processing..." && \
samtools view -H aln.bam > header.txt && \
mkdir -p split && \
samtools view aln.bam | split - aln- -l 1000 --filter='cat header.txt - > ./split/$FILE.sam && samtools view -Sb ./split/$FILE.sam > ./split/$FILE.bam && samtools index ./split/$FILE.bam' && \
rm ref.fa.fai && \
printf '\n%s\n' "Complete!"
