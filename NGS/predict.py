#!/usr/bin/env python3

import pickle
import numpy as np
import matplotlib.pyplot as plt
from sklearn import linear_model

rates = np.zeros((4, 42))

with open("./1/rate.pkl", "rb") as f:
    rates[0] = pickle.load(f)

with open("./2/rate.pkl", "rb") as f:
    rates[1] = pickle.load(f)

with open("./3/rate.pkl", "rb") as f:
    rates[2] = pickle.load(f)

for i in range(42):
    X = np.array(range(3)).reshape(-1, 1)
    Y = np.array([rates[0][i], rates[1][i], rates[2][i]])
    regr = linear_model.LinearRegression()
    regr.fit(X, Y)
    rates[3][i] = regr.predict(np.array([3]).reshape(-1, 1))

print(np.array2string(rates))

plt.plot(range(42), rates[0], 'r-', label="First Timepoint")
plt.plot(range(42), rates[1], 'b-', label="Second Timepoint")
plt.plot(range(42), rates[2], 'g-', label="Third Timepoint")
plt.plot(range(42), rates[3], 'k--', label="Predicted Fourth Timepoint")
plt.legend()
plt.xlabel('Amino Acid Position')
plt.ylabel('Fraction Conserved')
plt.title('Predicting the Conservation of Amino Acids in Mutated Amyloid-Beta')
plt.grid(True)
plt.savefig("plot.png")
plt.close()
