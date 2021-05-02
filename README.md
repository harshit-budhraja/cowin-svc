# Cowin Microservice

## Developing locally

To run this server on local:

1. Clone this repository and navigate inside it.

```
git clone https://github.com/harshit-budhraja/cowin-svc.git
cd cowin-svc/
```

2. Install package dependencies using npm - `npm install`
3. Copy the config file at the location - `config/<ENV>.json`
4. Create a `.env` file in the root of the project with the environment variables, secrets etc. However, this file would not be commited to github, for obvious reasons.
5. Start the server.

```
node src/app.js
```
