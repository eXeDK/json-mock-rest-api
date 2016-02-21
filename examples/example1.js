module.exports = {
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
    },
    "data": [
      {
        "id": 1,
        "name": "Thomas Stig Jacobsen"
      },
      {
        "id": 2,
        "name": "Stefan Ejaz"
      },
      {
        "id": 3,
        "name": "Ashir Hovgaard"
      }
    ]
  }
}