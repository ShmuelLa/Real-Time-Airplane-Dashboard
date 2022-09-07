import csv
from bs4 import BeautifulSoup as bs
import os
import re


file = open('csvFile/israel_flights_gov.csv', errors="ignore")
reader = csv.reader(file)
CounterWaitingToLand = 0
CounterWaitingToflight = 0
for row in reader:
    if row[11] == 'ISRAEL' and row[15] == 'LANDED':
        CounterWaitingToLand += 1
    
    if row[11] == 'ISRAEL' and row[15] == 'ON TIME':
        CounterWaitingToflight += 1
        

print("the number of flight that waiting to take off is: " + str(CounterWaitingToLand))
print("the number of flight that waiting to land is: " + str(CounterWaitingToflight))




base = os.path.dirname(os.path.abspath(__file__))
html = open(os.path.join(base, 'index.html'))
soup = bs(html, 'html.parser')
old_text = soup.find("h3", {"id" : "Lnum"})
new_text = old_text.find(text = re.compile('9')).replace_with(str(CounterWaitingToLand))

old_text2 = soup.find("h3", {"id" : "TOnum"})
new_text = old_text2.find(text = re.compile('9')).replace_with(str(CounterWaitingToflight))

with open("index.html", "wb") as f_output:
    f_output.write(soup.prettify("utf-8"))