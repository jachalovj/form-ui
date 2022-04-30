module.exports = {
  apps: [{
    name: 'H5Form',
    script: 'app',
    watch: false,
    ignore_watch: ['node_modules', 'build', 'logs'],
    max_memory_restart: '4G',
    env: {
      NODE_ENV: 'production'
    },
    instances: 4,
    autorestart: true
  }]
}