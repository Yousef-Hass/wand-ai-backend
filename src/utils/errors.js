export function createProblemDetails({
  status,
  title,
  detail,
  instance,
  type = 'about:blank',
}) {
  const problem = {
    type,
    title,
    status,
  }

  if (detail) {
    problem.detail = detail
  }

  if (instance) {
    problem.instance = instance
  }

  return problem
}

export function createErrorHandler(environment) {
  return (error, request, reply) => {
    const status = error.statusCode || 500
    const title = status >= 500 
      ? 'Internal Server Error' 
      : 'Bad Request'
    
    const detail = environment === 'production' && status >= 500
      ? undefined
      : error.message

    request.log.error({ err: error }, 'Request error occurred')

    const problem = createProblemDetails({
      status,
      title,
      detail,
      instance: request.url,
    })

    reply
      .code(status)
      .type('application/problem+json')
      .send(problem)
  }
}

