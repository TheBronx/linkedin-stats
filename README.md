![linkedin and kibana](https://github.com/TheBronx/linkedin-stats/raw/master/dashboard-blur.png)

## Linkedin stats
A script that parses the `*.csv` file with all your messages exported from LinkedIn and stores them on ElasticSearch. Includes a dashboard with a lot of visializations for you to start messing around with the data.

### How to use it
#### Messages from LinkedIn
First of all you need a `messages.csv` file from LinkedIn. Go to your profile, Settings and Privacy. Select the Privacy tab. Now scroll to "How LinkedIn uses your data" and clic on Download. Select **messages** cause that's what this script can handle and wait for the download.  

#### Instal the script
Clone this repo and run:  
`npm install`  
Done, installation finished :D

#### Configure the script
Place your `messages.csv` on the same folder as this script. You should see a `messages.csv` file already, replace it.  
Edit `elastic.js` with your ElasticSearch cluster URL and credentials. If you don't have one, use the free trial provided by Elastic.co: https://www.elastic.co/cloud/as-a-service/signup

#### Run it!
Ready? Run `node index` on your terminal and wait for it to complete. It will log all the messages as it stores them on ElasticSearch.  
In case something goes wrong, I recommend you delete all the data from ElasticSearch cause otherwise messages will get duplicated next time you run the script. So go to **Dev Tools** on Kibana and write `DELETE linkedin` then click on the green play button next to it. That will delete all the index so you can start inserting data again.

### Kibana
Once you have the data on ElasticSearch, open Kibana and create an Index Pattern, name it "linkedin*" for example and make sure to select the date field: `date`.  
Now, I have exported all the visualizations, searches and dashboards so you can import them on your Kibana.  
You will find them on the **kibana** folder of this repo.  
Just go to **Management -> Saved objects** and **import** all the files.
