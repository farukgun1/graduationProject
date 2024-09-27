const adminRoutes = require('./admin/admin')

console.log("routeee")

exports.initRoutes = function (app) {
  app.use('/api/v1/emlakze/admin', adminRoutes)
}