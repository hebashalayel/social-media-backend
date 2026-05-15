const validateEnv = () => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  if (process.env.NODE_ENV === 'production') {
    requiredVars.push('REDIS_URL');
  }

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
        'Set these variables before starting the application.'
    );
  }
};

module.exports = {
  validateEnv,
};
