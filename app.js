const express = require('express');
const path = require('path');
const { Statsig, StatsigUser } = require('@statsig/statsig-node-core');

// Validate required environment variables
const requiredEnvVars = ['STATSIG_SERVER_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please set these environment variables before starting the application.');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;
const dynamicConfigName = process.env.STATSIG_DYNAMIC_CONFIG_NAME || 'colorteller';

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Statsig
const statsig = new Statsig(process.env.STATSIG_SERVER_API_KEY, {
  environment: "production",
  specsSyncIntervalMs: 2000,
});

statsig.initialize().then(() => {
  console.log('Statsig initialized successfully');
  console.log(`Using dynamic config: ${dynamicConfigName}`);
}).catch(err => {
  console.error('Statsig initialization failed:', err);
});

// API endpoint to get color based on user attributes
app.get('/api/color', async (req, res) => {
  try {
    // Extract user data from query parameters
    const { userId = `user-${Math.floor(Math.random() * 1000000)}`, region = 'us-west1' } = req.query;
    
    // Create Statsig user object
    const user = new StatsigUser({
      userID: userId,
      customIDs: {},
      custom: {
        region: region
      },
    });
    
    // Get the config for this user
    const config = statsig.getDynamicConfig(user, dynamicConfigName);
    console.log(JSON.stringify(config.value));
    const color = config.getValue('color', 'blue');
    
    res.json({ color });
  } catch (error) {
    console.error('Error fetching color config:', error);
    res.status(500).json({ error: 'Failed to fetch color config', color: 'gray' });
  }
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`ColorTeller app listening at http://localhost:${port}`);
}); 
