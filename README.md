# Portfolio Site

## **Environment Variables**

Create a `.env` file in the root directory and include the following variables:

```
NOTION_API_KEY=your-notion-api-key
NOTION_SKILLSET_DB=your-skillset-database-id
NOTION_LANDING_PAGE_DB=your-database-id
NOTION_PROJECTS_DB=your-projects-database-id
REDIS_URL=redis-db-url
```

These variables are required for backend functionality and integration with Notion APIs.

## **Running the Application Locally**

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Start the development server:
   ```bash
   yarn start
   ```
   This runs the app in development mode at [http://localhost:8888](http://localhost:8888) using Netlify Dev behind the scenes. No need to install Netlify CLI globally, as it is included as a development dependency in the project.

## **Additional Notes**

Netlify Dev is automatically used by the `yarn start` command to simulate the production environment locally, including serverless functions and environment variables defined in your Netlify configuration. Use this to test backend APIs or integrations that rely on Netlify features before deploying.
