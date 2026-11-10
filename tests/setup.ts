process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://calorie:calorie@localhost:5433/calorie_test';
process.env.REDIS_URL = 'redis://localhost:6380';
process.env.LOG_LEVEL = 'debug';
process.env.CORS_ORIGINS = 'http://localhost:3000';