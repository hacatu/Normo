import math
from statistics import NormalDist as N
N_01 = N()

def pAgtB(A, B):
	return N_01.cdf((A.mean - B.mean)/math.hypot(A.stdev, B.stdev))

def pAgtB_sim(A, B, *, trials = 10000):
	successes = 0
	for a, b in zip(A.samples(trials), B.samples(trials)):
		if a > b:
			successes += 1
	return successes/trials

def eA_AgtB(A, B):
	return A.mean + A.stdev**2*(A - B).pdf(0)/(pAgtB(A, B))

def eA_AgtB_sim(A, B, *, trials = 10000):
	tot = 0
	successes = 0
	for a, b in zip(A.samples(trials), B.samples(trials)):
		if a > b:
			tot += a
			successes += 1
	return tot/successes

def eB_AgtB(A, B):
	return B.mean - B.stdev**2*(A - B).pdf(0)/(pAgtB(A, B))

def eB_AgtB_sim(A, B, *, trials = 10000):
	tot = 0
	successes = 0
	for a, b in zip(A.samples(trials), B.samples(trials)):
		if a > b:
			tot += b
			successes += 1
	return tot/successes

def vA_AgtB(A, B):
	ubma = B.mean - A.mean
	vbma = A.stdev**2 + B.stdev**2
	fbma = math.exp(-ubma**2/(2*vbma))/math.sqrt(vbma*2*math.pi)
	P = pAgtB(A, B)
	return A.stdev**2 + A.stdev**4*fbma*(ubma/vbma - fbma/P)/P

def vA_AgtB_sim(A, B, *, trials = 10000):
	tot = 0
	sq_tot = 0
	successes = 0
	for a, b in zip(A.samples(trials), B.samples(trials)):
		if a > b:
			tot += a
			sq_tot += a**2
			successes += 1
	return sq_tot/successes - (tot/successes)**2

A = N(0, 1)
B = N(-1, 1)
trials = 10000
successes = 0

print("Estimating P(A>B|A~N(0,1),B~N(-1,1)...")
print("Emperical: {}\nTheoretical: {}".format(pAgtB_sim(A, B), pAgtB(A, B)))

print("Estimating E(A|A>B,A~N(0,1),B~N(-1,1)...")
print("Emperical: {}\nTheoretical: {}".format(eA_AgtB_sim(A, B), eA_AgtB(A, B)))

print("Estimating E(B|A>B,A~N(0,1),B~N(-1,1)...")
print("Emperical: {}\nTheoretical: {}".format(eB_AgtB_sim(A, B), eB_AgtB(A, B)))

print("Estimating Var(A|A>B,A~N(0,1),B~N(-1,1)...")
print("Emperical: {}\nTheoretical: {}".format(vA_AgtB_sim(A, B), vA_AgtB(A, B)))

