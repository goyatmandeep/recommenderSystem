# -*- coding: utf-8 -*-
"""
@author: Mandeep
"""
import pandas as pd
import numpy as np
import json
from scipy import optimize

N_FEATURES = 10
LAMBDA = 10
N_RECOMMEND = 10

movie_vector = pd.read_excel("movie_vector.xlsx")
actual_rating = pd.read_excel("actual_rating.xlsx")
with open('new_user_rating.json') as new_user:
    json_data = json.load(new_user)

avg_rating = np.nanmean(actual_rating.iloc[:,1:], axis=1)
temp = np.isnan(avg_rating)
avg_rating[temp] = 0
    
def reg_cost(theta_new2, *tup):
    theta_new = theta_new2.reshape(N_FEATURES, 1)
    new_user_rating, reg_con, movie_vector = tup
    with_reg = 0.5*np.nansum(np.square(np.dot(movie_vector.iloc[:,1:], theta_new)-new_user_rating))
    without_reg = reg_con*0.5*(sum(np.square(theta_new)))
    return with_reg+without_reg

def reg_gradient(theta_new2, *tup):
    theta_new = theta_new2.reshape(N_FEATURES, 1)
    new_user_rating, reg_con, movie_vector = tup
    temp2 = np.dot(movie_vector.iloc[:,1:], theta_new)-new_user_rating
    nan_loc = np.isnan(temp2)
    temp2[nan_loc] = 0
    theta_new_grad = np.dot(temp2.T, movie_vector.iloc[:,1:])+LAMBDA*theta_new.T
    return theta_new_grad.reshape(N_FEATURES)
    
def train_user(json_data, movie_vector, avg_rating):
    temp = json_data
    theta_new = np.random.rand(N_FEATURES)
    new_user_rating = pd.DataFrame(np.nan, index=movie_vector["movieId"], columns=range(1))
    for item in temp.keys():
        new_user_rating.loc[int(item)] = temp[item]
    new_user_rating = np.array(new_user_rating)-avg_rating.reshape(len(new_user_rating), 1)
    tup = new_user_rating, LAMBDA, movie_vector
    optimal_theta = optimize.fmin_cg(reg_cost, theta_new, fprime=reg_gradient, args=tup, full_output=True)
    return np.dot(movie_vector.iloc[:,1:], optimal_theta[0].reshape(10, 1))+avg_rating.reshape(len(avg_rating), 1)
    
    
new_user_rating = pd.DataFrame(train_user(json_data, movie_vector, avg_rating), index=movie_vector["movieId"], columns=["temp_user"])
recommend_movieId = pd.DataFrame(new_user_rating.sort_values(by="temp_user", ascending=False)[:N_RECOMMEND].index)
recommend_movieId.to_csv("new_movieId.csv", header=None, index=None)

