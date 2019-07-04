import pandas as pd
from bs4 import BeautifulSoup
import requests

moviesoriginal= pd.read_csv("./movies.csv",names=["num","name","genre"])
moviesScraped  = moviesoriginal
links= pd.read_csv("./links.csv",skiprows=1,names=["num","imdbId","tmdbId"])
imageLinks=[]
article=[]
linkslist = list(links["imdbId"])
for i in range(resume,len(linkslist)):         # Will save the data after 10 scrap
    rl= str(linkslist[i]).zfill(7)
    page= requests.get("https://www.imdb.com/title/tt"+rl)
    soup = BeautifulSoup(page.content,'html.parser')
    rl= soup.find(class_="poster").find("a")
    image= rl.find("img")
    article= soup.find(class_="summary_text").get_text()
    print(image['src'])    #HERE I GET  THE IMAGE LINK OF THE MOVIE
    print(article)          # HERE I GET THE SUMMARY
