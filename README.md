# getting started

You should be able to run the service with just two steps:
1. `docker-compose up` from the root directory
2. `npm run seed:docker`

This should allow you to make requests at localhost:8080

# endpoints

There are three endpoints in the system. A postman config (Test Endpoints.postman_collection.json) has been added to the
repo for your convenience.

## GET /
This will return a list of all listing records

## POST /reprice
This endpoint performs the following actions:
1. finds the closest listing records in the system
2. determines if we are able to set a new price
3. attempts to update the target record
4. returns the updated listing

It will return an error 400 response if unable to reprice due to other listings being priced too low

### Input
The input data should be in this form:

```javascript
{
    listingId: uuid,
    eventId: uuid,
    section: string,
    quantity: number,
    row: string,
    cost: number
}
```

## POST /best-match
This will return the search results that reprice uses. It is primarily for debugging. It expects the same input data as reprice.
