from flask import Flask,request
import pandas as pd
import json
from flask_cors import CORS

app=Flask(__name__)
CORS(app)
result = pd.read_csv('./movies.csv',skiprows=1,names=["movieId","movie","genre"])
links_summary = pd.read_csv('./movies_info_spaces.csv')

genres= result["genre"]
genres=list(set(list(genres)))
genre=[]
for i in range(len(genres)):
	genre.extend(genres[i].split("|"))
genres=list(set(list(genre)))
genres.sort()
rows=list(result["movie"])
letter = "a"

all_data= pd.merge(result,links_summary,on="movieId")[["movie","imgLink","summary","genre","movieId"]]
real_data= all_data
all_data=list(real_data.values)
all_data=list(map(list,all_data))

sorted_data=sorted(all_data,key=lambda all_data:all_data[0])

movies_sort =[[] for y in range(27)]
for i in range(len(all_data)):
	pos=ord(all_data[i][0][0].lower())%97 if ord(all_data[i][0][0].lower())%97 < 26 else 26
	movies_sort[pos].append(all_data[i])



@app.route("/predict",methods=['POST'])
def predict():
	print("WORKING")
	print(request.get_data());
	print(type(request.get_data()));
	return json.dumps("request.data")


@app.route('/')
def hello_world():
	return json.dumps(sorted_data)


@app.route("/alpha/<character>")
def returnCharacter(character):
	page= request.args.get("page");
	page= page if page!=None else 1;
	pos= ord(character.lower())%97
	#movies_sort[pos].sort();
	print(movies_sort[0])
	return json.dumps(movies_sort[pos][0:(int(page)*10)])

@app.route('/search/<search>')
def searchResult(search):
	result=[]
	firstCharacter = search[0];
	pos= ord(firstCharacter.lower())%97
	for i in range(len(movies_sort[pos])):
		if (search.lower() in movies_sort[pos][i][0].lower().decode("utf-8")):
			result.append(movies_sort[pos][i])
	return json.dumps(result)

@app.route('/genre/<search>')
def genreResult(search):
	page= request.args.get("page");
	page= page if page!=None else 1;
	search=str(search).split("&")
	twoway=real_data
	for i in range(len(search)):
		twoway= twoway[twoway["genre"].str.contains(search[i])]

	print(twoway)
	results= twoway.values
	results=list(map(list,results))

	if(len(result)==0):
		return "404"
	else:
		results.sort()
		return json.dumps(results[0:int(page)*10])

@app.route('/apiv1/getgenre')
def genreReturn():
	return json.dumps(genres)

if __name__ == "__main__":
	app.run(host="127.0.0.1",port=8002)
