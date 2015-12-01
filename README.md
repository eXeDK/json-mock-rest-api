# JSON Mock API

With the JSON Mock API you can have a RESTfull API with input validation 
in a couple of minutes with data and Postman Collections generation.

## Installation
Just clone this repo and run `npm install`

## Creating an API
The overall stucture of an API file is as follows:

``` json
{
  "endpoint-name": {
    endpoint-data
  }
}
```

An example of an API with a `customers` endpoint could look like this:
``` json
{
  "customers": {
    "validation": {
      "id": "number",
      "name": {
        "required": true,
        "type": "string",
        "maxLength": 255,
        "minLength": 2
      }
    },
    "generation": {
      "id": "random.number",
      "name": "name.findName"
    }
  }
}
```
This API contains both validation and data generation specifications. 
If a property is only validated by the type of data then a single string defining the type is sufficient (as with the `id` property), otherwise an object containing validation rules can be specified (as with the `name` property).
You can create your own validation rules very simply by adding a validator to the folder `validationRules` which already contains some basic validation rules for you to get started.

Data generation is also supported when specifying which kind of data each property should contain. In this example I've chosen the `id` property to be a random integer but could have chosen to use a UUID by specifying `random.uuid` instead. The faker package (https://www.npmjs.com/package/faker) is used for generating the data, in the faker documentation you can find the data types supported. The format is as follows `[category].[name]` as can be seen in the example.

## Generating data
For generating the data you must first specify data types in the `generation` part of the endpoint specification (see example in `Creating an API` or in the `examples` folder in the repo).

When the data types have been specified you can run `npm run-script generateData -- --input=examples/example1.json --number 10`. This will populate or append data to the `data` part of your endpoints.

## Generating a Postman Collection for the endpoints
For generating the Postman Collection you should run `npm run-script generatePostman -- --input=examples/example1.json`

## Error handling

## Gotchas
The data is required to have an `id` field.

## Settings and other configuration