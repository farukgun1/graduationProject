const errorMessages = (code, detail) => {
  const messages = {
    1000: {
      message: `İstek inputlarınız eksik lütfen kontrol ediniz.`,
      statusCode: 400,
      errorCode: 1000,
      detail,
    },
    1001: {
      message: `Veri bulunamadı.`,
      statusCode: 400,
      errorCode: 1001,
      detail,
    },
    9000: {
      message: `Hay aksi bir şeyler ters gitti.`,
      statusCode: 500,
      errorCode: 9000,
      detail,
    },
    404: {
      message: 'Belirtilen kaynak bulunamadı.',
      statusCode: 404,
      errorCode: 404,
      detail: detail || null,
    },
  }
  return messages[code]
}

module.exports = {
  errorMessages,
}
