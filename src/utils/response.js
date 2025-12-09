export function createSuccessResponse(data, meta = {}) {
  const response = {
    data,
  }

  if (Object.keys(meta).length > 0) {
    response.meta = meta
  }

  return response
}

export function createErrorResponse(error, code = null, details = {}) {
  const response = {
    error: {
      message: error,
      code: code || 'INTERNAL_ERROR',
    },
  }

  if (Object.keys(details).length > 0) {
    response.error.details = details
  }

  return response
}

export function createPaginatedResponse(data, pagination) {
  return {
    data,
    meta: {
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || 0,
        totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
      },
    },
  }
}
