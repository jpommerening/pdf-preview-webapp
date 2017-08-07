# API

The middleware contains a very primitive RESTful API for accessing resources/documents.

The available entpoints are documented below.

## `/api`

`GET /api`

```json
{
   "_links": {
      "self": { "href": "/api" },
      "resources": { "href": "/api/resources" },
      "events": { "href": "/api/events" }
   }
}
```

## `/api/events`

`GET /api/events`

([SockJS](https://sockjs.org/) endpoint for updates)

## `/api/resources`

`GET /api/resources`

```json
{
   "_links": {
      "self": { "href": "/api/resources" },
      "items": [
         { "href": "/api/resources/16ca579ea34cfa" },
         { "href": "/api/resources/8f1b34e6c54ab3" }
      ]
   },
   "_embedded": {
      "items": [
         {
            "_links": { "self": { "href": "/api/resources/16ca579ea34cfa" } },
            "nonce": "16ca579ea34cfa",
            "name": "some-document",
            "time": 1502058410312,
            "data": [
               {
                  "_links": { "self": { "href": "/api/resources/16ca579ea34cfa/data?type=application%2Fpdf" } },
                  "type": "application/pdf"
               },
               {
                  "_links": { "self": { "href": "/api/resources/16ca579ea34cfa/data?type=text%2Fhtml" } },
                  "type": "text/html"
               }
            ]
         },
      ]
   }
}
```

`POST /api/resources`
```json
{
   "nonce": "222135f9aceb09",
   "name": "some-new-document",
   "time": 1502058424954,
   "data": [
      {
         "type": "application/pdf",
         "encoding": "base64",
         "data": "<BASE64-encoded-data>"
      }
   ]
}
```

## `/api/resources/:nonce`

`GET /api/resources/8f1b34e6c54ab3`

```json
{
   "_links": { "self": { "href": "/api/resources/8f1b34e6c54ab3" } },
   "nonce": "8f1b34e6c54ab3",
   "name": "some-document",
   "time": 1502058419214,
   "data": [
      {
         "_links": { "self": { "href": "/api/resources/8f1b34e6c54ab3/data?type=application%2Fpdf" } },
         "type": "application/pdf"
      },
      {
         "_links": { "self": { "href": "/api/resources/8f1b34e6c54ab3/data?type=text%2Fhtml" } },
         "type": "text/html"
      }
   ]
}
```
