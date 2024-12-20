// src/routes/health.routes.ts

import { Router } from 'express';
import os from 'os';

// Create a new router instance
const router = Router();

/**
 * @route GET /health
 * @desc Health check endpoint
 * @access Public
 * @returns {string} OK - Indicates that the service is running
 */
router.get('/', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    process: {
      pid: process.pid,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      version: process.version,
      versions: process.versions,
      env: process.env.NODE_ENV,
    },
    system: {
      platform: os.platform(),
      release: os.release(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      loadAverage: os.loadavg(),
      uptime: os.uptime(),
    },
  };
  // Send a 200 OK response with the message system health check stats 
  res.status(200).json(healthCheck);
});

export default router;

