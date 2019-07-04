# -*- coding: utf-8 -*-
"""
Created on Mon Jun 24 18:03:38 2019

@author: Mandeep

"""
import pandas as pd
import numpy as np
from scipy import optimize

N_FEATURES = 10   #After trying with various values
LAMBDA = 10
FREQ_RANDOM = 5

def optimal_x_theta(y_arr, N_FEATURES, LAMBDA, freq_random):
    flag = True
    for i in range(freq_random):
        theta_arr = np.random.rand(y_arr.shape[1]*N_FEATURES)
        x_arr = np.random.rand(y_arr.shape[0]*N_FEATURES)
        tup =(y_arr, (y_arr.shape[0], N_FEATURES), (y_arr.shape[1], N_FEATURES), LAMBDA)
        x_theta_arr = np.concatenate((x_arr, theta_arr))
        optimal_temp = optimize.fmin_cg(reg_cost, x_theta_arr,fprime=reg_gradient, args=tup, full_output=True)
        print("Function value "+str(optimal_temp[1]))
        if flag:
            optimal = optimal_temp
            flag = False
        else:
            if optimal_temp[1] < optimal[1]:
                optimal = optimal_temp
            else:
                pass
        x_size = y_arr.shape[0]*N_FEATURES
        x_arr = optimal[0][:x_size].reshape(y_arr.shape[0], N_FEATURES)
        theta_arr = optimal[0][x_size:].reshape(y_arr.shape[1], N_FEATURES)
    return x_arr, theta_arr, optimal[1]

def create_genre_file(movies):
    temp = pd.DataFrame(movies["movieId"], index=range(len(movies)))
    for i in range(len(movies)):
        cat = movies["genres"][i].split("|")
        for item in cat:
            if item in temp:
                temp[item].iloc[i] = 1
            else:
                temp[item] = pd.Series([])
                temp[item].iloc[i] = 1
    temp.fillna(0, inplace=True)
    temp.to_excel("genre.xlsx")
    return 

def movies_users_table(movies, ratings, n_movies):
    y = pd.DataFrame([], index=movies["movieId"])
    for i in range(len(ratings)):
        u_id = int(ratings.iloc[i]["userId"])
        m_id = ratings.iloc[i]["movieId"]
        rate = ratings.iloc[i]["rating"]
        if u_id in y.columns:
            y[u_id][m_id] = rate
        else:
            y[u_id] = pd.Series([])
            y[u_id][m_id] = rate
    return y

def reg_cost(x_theta_arr, *tup):
    y_arr,x_shape, theta_shape, reg_con = tup
    x_arr = x_theta_arr[:np.product(x_shape)].reshape(x_shape)
    theta_arr = x_theta_arr[np.product(x_shape):].reshape(theta_shape)
    without_reg = 0.5*(np.nansum(np.square(np.dot(x_arr, theta_arr.T)-y_arr)))
    with_reg = reg_con*0.5*(sum(np.square(theta_arr))+sum(np.square(x_arr)))
    return sum(without_reg+with_reg)

def reg_gradient(x_theta_arr, *tup):
    y_arr,x_shape, theta_shape, LAMBDA = tup
    x_arr = x_theta_arr[:np.product(x_shape)].reshape(x_shape)
    theta_arr = x_theta_arr[np.product(x_shape):].reshape(theta_shape)
    nan_loc = np.isnan(y_arr)
    temp = np.dot(x_arr, theta_arr.T)-y_arr
    temp[nan_loc] = 0
    x_grad = np.dot(temp, theta_arr) + LAMBDA*x_arr
    theta_grad = np.dot(temp.T, x_arr)+LAMBDA*theta_arr
    x_grad_1d = x_grad.reshape(np.product(x_grad.shape))
    theta_grad_1d = theta_grad.reshape(np.product(theta_grad.shape))
    return np.concatenate((x_grad_1d, theta_grad_1d))

def split_train_set(num):
    test_set = dict()
    for j in range(y_arr.shape[1]):
        c = num
        for i in range(j, y_arr.shape[0]):
            if not np.isnan(y_arr[i][j]):
                test_set[(i, j)] = y_arr[i][j].copy();
                y_arr[i][j] = np.nan
                c -= 1
            if c == 0:
                break
    return test_set

def RMSE(test_set):
    rmse = 0
    for item in test_set.keys():
        i, j = item[0], item[1]
        rmse += (predicted_rating[i][j]-test_set[item])**2
        rmse = np.sqrt(rmse)/len(test_set)
    return rmse

movies_loc = r"ml-latest-small\movies.csv"
ratings_loc = r"ml-latest-small\ratings.csv"

movies = pd.read_csv(movies_loc)
ratings = pd.read_csv(ratings_loc)

ratings.drop(["timestamp"], axis=1, inplace=True)

create_genre_file(movies)

y = movies_users_table(movies, ratings, len(movies))
y.to_excel("actual_rating.xlsx")

y_arr = y.drop(["movieId"], axis=1)
y_arr = y_arr.values

test_set = split_train_set(1)      
avg_rating = np.nanmean(y_arr, axis=1)
temp = np.isnan(avg_rating)
avg_rating[temp] = 0
y_arr = y_arr-avg_rating[:,None]

x_arr, theta_arr, min_func = optimal_x_theta(y_arr, N_FEATURES, LAMBDA, FREQ_RANDOM)

predicted_rating = np.dot(x_arr, theta_arr.T)+avg_rating[:,None]

rmse = RMSE(test_set)

x = pd.DataFrame(x_arr, index=y["movieId"])
x.to_excel("movie_vec_"+str(min_func)+".xlsx")

theta = pd.DataFrame(theta_arr, index=y.columns[1:])
theta.to_excel("user_vec_"+str(min_func)+".xlsx")

predicted_rating = pd.DataFrame(predicted_rating, index=y["movieId"], columns=y.columns[1:])
predicted_rating.to_excel("predicted_rating_"+str(min_func)+".xlsx")
