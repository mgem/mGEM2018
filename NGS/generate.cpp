#include <iostream>
#include <stdlib.h>
#include <fstream>
#include <ctime>
#include <vector>
#include <map>
#include <array>

using namespace std;

struct mutant {
    vector<unsigned int> positions;
    vector<char> amino_acids;
};

map<string, char> abbrev_amino = {
    {
        "stop", '!'
    },
    {
        "isoleucine", 'I'
    },
    {
        "leucine", 'L'
    },
    {
        "valine", 'V'
    },
    {
        "phenylalanine", 'F'
    },
    {
        "methionine", 'M'
    },
    {
        "cysteine", 'C'
    },
    {
        "alanine", 'A'
    },
    {
        "glycine", 'G'
    },
    {
        "proline", 'P'
    },
    {
        "threonine", 'T'
    },
    {
        "serine", 'S'
    },
    {
        "tyrosine", 'Y'
    },
    {
        "tryptophan", 'W'
    },
    {
        "glutamine", 'Q'
    },
    {
        "asparagine", 'N'
    },
    {
        "histidine", 'H'
    },
    {
        "glutamic acid", 'E'
    },
    {
        "aspartic acid", 'D'
    },
    {
        "lysine", 'K'
    },
    {
        "arginine", 'R'
    }
};

const char STOP = '!';
map<char,unsigned int> base_to_int = {
    {
        'T', 0
    },
    {
        'C', 1
    },
    {
        'A', 2
    },
    {
        'G', 3
    }
};
map<unsigned int,string> int_to_base = {
    {
        0, "T"
    },
    {
        1, "C"
    },
    {
        2, "A"
    },
    {
        3, "G"
    }
};
// chart from http://andromedar.info/wp-content/uploads/2018/02/codon-chart-dna-to-rna-protein-flowchart.jpg
const char ints_to_aa[4][4][4] = {
    {
        {
            'F', 'F', 'L', 'L'
        },
        {
            'S', 'S', 'S', 'S'
        },
        {
            'Y', 'Y', STOP, STOP
        },
        {
            'C', 'C', STOP, 'W'
        }
    },
    {
        {
            'L', 'L', 'L', 'L'
        },
        {
            'P', 'P', 'P', 'P'
        },
        {
            'H', 'H', 'Q', 'Q'
        },
        {
            'R', 'R', 'R', 'R'
        }
    },
    {
        {
            'I', 'I', 'I', 'M'
        },
        {
            'T', 'T', 'T', 'T'
        },
        {
            'N', 'N', 'K', 'K'
        },
        {
            'S', 'S', 'R', 'R'
        }
    },
    {
        {
            'V', 'V', 'V', 'V'
        },
        {
            'A', 'A', 'A', 'A'
        },
        {
            'D', 'D', 'E', 'E'
        },
        {
            'G', 'G', 'G', 'G'
        }
    }
};
map<char, string> aa_to_codon;
map<string, char> codon_to_aa;
string translate(string cDNA)
{
    //intialize AA string
    string AA = "";
    //loop to convert codons into AA
    const size_t cDNA_len_minus_two = cDNA.length() - 2;
    for (unsigned int i = 0; i < cDNA_len_minus_two; i = i + 3)
    {
        //isolate codon
        const string codon = cDNA.substr(i, 3);
        const char aa = codon_to_aa[codon];
        if (aa == STOP) {
            break;
        }
        AA += aa;
    }
    return AA;
}


vector<string> split_reads(string read, string AA)
{
    // we'll randomly split the read in 2
    const size_t read_len = read.length();
    // split should not be too close to either end
    const unsigned int split = (rand() % (read_len - 10)) + 5;
    const string read1 = read.substr(0, split);
    const string read2 = read.substr(split);

    // also split the AA
    const unsigned int modulo = split % 3;
    const unsigned int AA_split = (split - modulo) / 3;
    const size_t AA_len = AA.length();
    string AA1 = "";
    string AA2 = "";

    if (AA_split != 0)
    {
        AA1 = AA.substr(0, AA_split);
    }
    if (modulo == 0 && AA_split < AA_len)
    {
        AA2 = AA.substr(AA_split);
    }
    else if (modulo != 0 && AA_split + 1 < AA_len)
    {
        AA2 = AA.substr(AA_split + 1);
    }
    vector<string> fragments(4);
    fragments[0] = read1;
    fragments[1] = read2;
    fragments[2] = AA1;
    fragments[3] = AA2;
    return fragments;
}

int main()
{
    //initialize text documents
    ofstream reads_file;
    ofstream AA_file;
    reads_file.open("reads.fa");
    AA_file.open("AA.fa");

    //seed pseudorandom number generator with time
    srand(time(NULL)); // (delete this line if we want non-random results)

    //initialize n_reads which stores number of sequences to generate
    long n_reads;

    //amyloid beta cDNA
    const string amyloid = "GATGCAGAATTCCGACATGACTCAGGATATGAAGTTCATCATCAAAAATTGGTGTTCTTTGCAGAAGATGTGGGTTCAAACAAAGGTGCAATCATTGGACTCATGGTGGGCGGTGTTGTCATAGCGTAACATCATCACCATCACCACTAA";
    const size_t amyloid_len = 150;

    const string amyloid_AA = "DAEFRHDSGYEVHHQKLVFFAEDVGSNKGAIIGLMVGGVVIA";
    const size_t amyloid_AA_len = 42;

    // most reads will be mutated to match one of these targets
    const mutant targets[2] = {
        {
            {
                // positions at which mutations will occur.
                5, 12, 17, 21, 35
            },
            {
                // the amino acid that will be placed at the specified position.
                // you can specify the single-character abbreviation,
                // or abbrev_amino["full name of amino acid"],
                // or amyloid_AA[n] (conserve AA at position n),
                // or STOP or abbrev_amino["stop"] or '!' (stop codon)
                'E', abbrev_amino["glutamic acid"], amyloid_AA[17], amyloid_AA[21], STOP
            }
        },
        {
            {
                7, 9, 17, 18, 26, 28
            },
            {
                'A', amyloid_AA[9], amyloid_AA[17], amyloid_AA[18], amyloid_AA[26], 'M'
            }
        }
    };
    const size_t n_targets = sizeof(targets) / sizeof(*targets);

    // initialize maps between amino acid and DNA codon
    for (unsigned int i = 0; i < 4; ++i)
    {
        for (unsigned int j = 0; j < 4; ++j)
        {
            for (unsigned int k = 0; k < 4; ++k)
            {
                const char aa = ints_to_aa[i][j][k];
                const string codon = int_to_base[i] + int_to_base[j] + int_to_base[k];
                aa_to_codon[aa] = codon;
                codon_to_aa[codon] = aa;
            }
        }
    }

    //prompt user to enter the number of sequences to generate
    cout << "How many sequences to generate: ";
    cin >> n_reads;

    long i = 0;
    while (i < n_reads)
    {
        string read = "";
        for (const auto& amy_base : amyloid)
        {
            const unsigned int r = rand() % 1000;
            if (r < 900)
            {
                //no mutation
                read += amy_base;
            }
            else if (r < 950)
            {
                //mutate
                read += int_to_base[rand() % 4];
            }
            else if (r < 980)
            {
                //insert
                read += amy_base + int_to_base[rand() % 4];
            }
            else
            {
                //deletion
            }
        }

        string AA = translate(read);

        // for most reads, change to match a target
        if (n_targets > 0 && rand() % 20 < 19)
        {
            // match a random target from the array of targets
            const mutant target = targets[rand() % n_targets];
            const size_t n_loci = target.positions.size();
            for (unsigned int j = 0; j < n_loci; ++j)
            {
                const unsigned int position = target.positions[j];
                const char amino_acid = target.amino_acids[j];
                if (AA.length() > position) {
                    read.replace(position * 3, 3, aa_to_codon[amino_acid]);
                    if (amino_acid == STOP) {
                        AA = AA.substr(0, position);
                    } else {
                        AA[position] = amino_acid;
                    }
                }
            }
        }

        // split the reads, just like NGS involves fragmenting the DNA
        const vector<string> fragments = split_reads(read, AA);
        reads_file << ">seq" << i + 1 << endl
            << fragments[0] << endl
            << ">seq" << i + 2 << endl
            << fragments[1] << endl;
        AA_file << ">seq" << i + 1 << endl
           << fragments[2] << endl
           << ">seq" << i + 2 << endl
           << fragments[3] << endl;

        // show progress
        if (i % 10000 == 0)
        {
            cout << (float)i / n_reads * 100 << "% complete" << endl;
        }
        i += 2; // we make two reads per iteration
    }

    return 0;
}
