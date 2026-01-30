const path = require('path');

/**
 * PM2 进程配置：管理 Next.js 生产进程
 * 使用方式：在仓库根目录或本目录执行
 *   pm2 start deploy/ecosystem.config.cjs
 *   pm2 start templates/next-app/deploy/ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: 'next-app',
      script: path.resolve(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next'),
      args: 'start',
      cwd: path.resolve(__dirname, '..'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,  // 访问地址：http://localhost:3000 或 http://<本机IP>:3000
      },
      error_file: './deploy/logs/pm2-error.log',
      out_file: './deploy/logs/pm2-out.log',
      merge_logs: true,
    },
  ],
};
