# recommender-system
Collaborative filtering recommender system for movies using matrix factorisation.
Model is trained offline using data of about 9200 movies from Movie Lens Dataset.
Training set size = 9170
Test set size = 604
Number of features of movies and user = 10  (N_FEATURES)
Lambda (Regularisation constant) = 10
RMSE on test set = 0.1522
Number of random initialization on training set = 5 (FREQ_RANDOM)
fmin_cg best value - 222815.54 

#TODO : 
**Online learning is yet to be enabled.
**New users are still not assigned permanent ids and their learned parameters are discarded after their session ends.
**Item based and user based strategy can be integerated to get better recommendations.
