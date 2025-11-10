// PM2 Production Process Configuration for HVI Continuity Platform
module.exports = {
  apps: [{
    name: 'hvi-continuity-backend',
    script: './server.js',
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster', // Cluster mode for load balancing
    env: {
      NODE_ENV: 'development',
      PORT: 3001,
      MONGODB_URI: 'mongodb://localhost:27017/hvi-continuity'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      MONGODB_URI: 'mongodb://localhost:27017/hvi-continuity'
    },
    // Process management settings
    autorestart: true,
    watch: false, // Disable in production, enable in development if needed
    max_memory_restart: '1G', // Restart if memory exceeds 1GB
    // Log management
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    time: true,
    // Health check and monitoring
    max_restarts: 10,
    min_uptime: '10s',
    // Advanced process management
    kill_timeout: 5000,
    listen_timeout: 3000,
    // Environment specific
    node_args: '--max-old-space-size=1024'
  }]
};
