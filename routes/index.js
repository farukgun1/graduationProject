const adminRoutes = require('./admin/admin')



exports.initRoutes = function (app) {
  app.use('/api/v1/emlakze/admin', adminRoutes)
}