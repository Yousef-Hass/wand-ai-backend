export function formatSuccessPayload(payload, msg = 'Success') {
  return {
    success: true,
    message: msg,
    data: payload,
  }
}

export function formatErrorPayload(errMsg, msg = 'Error') {
  return {
    success: false,
    message: msg,
    error: errMsg,
  }
}
