const analyticsMiddleware = (supabase) => {
  return async (req, res, next) => {
    const startTime = Date.now();

    // Override res.json to capture response
    const originalJson = res.json.bind(res);
    res.json = function (data) {
      const duration = Date.now() - startTime;

      // Extract user ID from request (if authenticated)
      const userId = req.user?.id || req.headers['x-user-id'];
      const endpoint = req.path;
      const method = req.method;
      const statusCode = res.statusCode;

      // Log to database asynchronously (don't block response)
      if (supabase && userId) {
        supabase
          .from('analytics_logs')
          .insert({
            user_id: userId,
            endpoint,
            method,
            status_code: statusCode,
            duration_ms: duration,
            timestamp: new Date().toISOString(),
          })
          .catch((err) => {
            console.error('[Analytics Error]', err.message);
          });
      }

      return originalJson(data);
    };

    next();
  };
};

export default analyticsMiddleware;
