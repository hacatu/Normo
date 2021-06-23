# Normal Rating System
## and Pokemon ranking demo

[![Demo](https://img.shields.io/badge/-Demo-green)](https://hacatu.github.io/Normo)
[![Explanation](https://img.shields.io/badge/-Explanation-green)](https://hacatu.github.io/Normo/explanation.html)

This is a rating system, similar to Elo or Glicko, that I designed using the normal distribution
to model player performance.  This gives each player a rating that includes both average
performance and performance variance.

Elo and Glicko both use the Logistic distribution to model player performance, which can be more
accurate.  However, Elo uses the same variance for all players, and I could not find a
derivation of Glicko.  The logistic distribution also is not as nice as the normal distribution
in that there is no closed form for the probability, mean, or variance of a posterior distribution
given one logistic random variable is greater than another.  That is, if we have two logistic
random variables with different mean and different variance, there is not closed form for the
probability that one is greater than the other, and there is no closed form for the mean or
variance of one given we know which one is greater.

Rating systems can be used to rank a large set of choices.  If we give the user a set of $k$ of the
choices repeatedly and ask them to select $1$ to $k-1$ of their favorites repeatedly, we can use
a rating system to refine a rating for each choice and rank them accordingly.

This rating system was designed primarily for that use case, and the pokemon ranking demo
demonstrates this.

Note that there are other ways to rank a large set of choices.  Using a directed acyclic graph
whose edges encode preference is probably the best way.  Using a rating system has some advantages,
such as dealing with inconsistent or intransitive preferences better, but also takes longer to
converge.  The current demo picks the sets of choices completely randomly, instead of prioritizing
sets which give the most information, which makes the ranking converge even slower.

The mathematical explanation has a much more in-depth background of the derivation of the rating
system and how sets of choices can be prioritized better in the future to make the ranking converge
faster.

