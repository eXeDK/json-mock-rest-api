'use strict';

module.exports = [
    {
        name: 'customers',
        validation: {
            id: 'integer',
            name: {
                type: 'string',
                maxLength: 255,
                minLength: 2
            }
        },
        data: [
            {
                id:   1,
                name: 'Thomas Stig Jacobsen'
            },
            {
                id:   2,
                name: 'Stefan Hovgaard'
            },
            {
                id:   3,
                name: 'Ashir Ejaz'
            }
        ]
    }
];