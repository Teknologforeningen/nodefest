# nodefest
A registration system for the annual ball of Teknologföreningen

## Installation
Install the dependencies:
```
npm install
```

You also need to have PostgreSQL running to have a database for the submissions.

Create the settings file and fill it with required database information:
```
cp settings.template.json settings.json
```
The `code` settings is a secret that is used with the API to retrieve all submitted data.

Run:
```
npm start
```
