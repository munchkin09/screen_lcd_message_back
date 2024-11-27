LCD Screen 
Requirements:
Node >= v22.11.0

## Usage:

After clone the repo make:
```
# Install dependencies
npm i
# Put server running on local with default config
npm run dev:backend
```

Usefull commands:

- Run suite tests
```
npm run test 
```


- With the server running this endpoint call are available:
```
curl --request GET \
    --url http://localhost:3000/api/v1/messages \
    --header 'apikey: 111111111' \
    --header 'content-type: application/json' \
    --header 'devid: 1'
````


```
curl --request POST \
    --url http://localhost:3000/api/v1/messages \
    --header 'apikey: 111111111' \
    --header 'content-type: application/json' \
    --header 'devid: 1' \
    --data '{
    "message": "STRING"
    }'
```
