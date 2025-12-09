export function buildProblemResponse({
  status,
  title,
  detail,
  instance,
  type = 'about:blank',
}) {
  const problemObj = {
    type,
    title,
    status,
  }

  if (detail) {
    problemObj.detail = detail
  }

  if (instance) {
    problemObj.instance = instance
  }

  return problemObj
}

export function buildErrorHandler(envMode) {
  return (err, req, res) => {
    const httpStatus = err.statusCode || 500
    const errorTitle = httpStatus >= 500 
      ? 'Internal Server Error' 
      : 'Bad Request'
    
    const errorDetail = envMode === 'production' && httpStatus >= 500
      ? undefined
      : err.message

    req.log.error({ err }, 'Request error occurred')

    const problemData = buildProblemResponse({
      status: httpStatus,
      title: errorTitle,
      detail: errorDetail,
      instance: req.url,
    })

    res
      .code(httpStatus)
      .type('application/problem+json')
      .send(problemData)
  }
}

export function processError(err, req, reply) {
  const handler = buildErrorHandler(process.env.NODE_ENV || 'development')
  return handler(err, req, reply)
}

