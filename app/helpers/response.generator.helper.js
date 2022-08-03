class MyOwnMethods {
  static responseGenerator = (res, statusCode, data, message) => {
    res.status(statusCode).send({
      apiStatus: statusCode == 200,
      data,
      message,
    });
  };
}
module.exports = MyOwnMethods;
