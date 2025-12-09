export const successResponseSchema = (dataSchema) => ({
  type: 'object',
  properties: {
    data: dataSchema,
  },
})

export const successResponseWithMetaSchema = (dataSchema, metaSchema = {}) => ({
  type: 'object',
  properties: {
    data: dataSchema,
    meta: {
      type: 'object',
      properties: metaSchema,
    },
  },
})

export const errorResponseSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'string' },
        details: { type: 'object' },
      },
      required: ['message', 'code'],
    },
  },
  required: ['error'],
}

