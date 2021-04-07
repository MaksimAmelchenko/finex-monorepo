export default {
  type: 'object',
  properties: {
    total: {
      type: 'integer',
      example: 200,
    },
    limit: {
      type: 'integer',
      example: 50,
      minimum: 1,
      maximum: 100,
    },
    offset: {
      type: 'integer',
      example: 0,
      minimum: 0,
    },
  },
  required: ['total', 'limit', 'offset'],
  additionalProperties: false,
};
