# Samuel's Portfolio ✨

Welcome to my portfolio! This is where I showcase my work, skills, and projects. I've built this using modern web technologies and Notion as my CMS, making it easy to keep my content fresh and up-to-date.

## 🌟 What's Inside?

- **Dynamic Content with Notion**: All my content is managed through Notion databases, making updates a breeze
- **Smooth Experience**: Each section loads independently with its own loading state
- **Pixel Perfect**: A beautiful, responsive design that works everywhere
- **Lightning Fast**: CDN-cached delivery for snappy content delivery
- **Modern Animations**: Smooth transitions and interactive elements

## 🛠️ Tech Stack

### Frontend

| Tech                                            | Description                                          |
| ----------------------------------------------- | ---------------------------------------------------- |
| [Next.js](https://nextjs.org/)                  | React framework for production-grade applications    |
| [TypeScript](https://www.typescriptlang.org/)   | Static type checking for JavaScript                  |
| [Tailwind CSS](https://tailwindcss.com/)        | Utility-first CSS framework                          |
| [Material-UI](https://mui.com/)                 | React component library implementing Material Design |
| [Framer Motion](https://www.framer.com/motion/) | Production-ready motion library for React            |

### Backend

| Tech                                                                                               | Description                                 |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | Serverless API endpoints with Next.js       |
| [Notion API](https://developers.notion.com/)                                                       | Content management and database integration |
| [Netlify](https://www.netlify.com/)                                                                | Cloud platform for static site deployment   |

### Development

| Tech                                          | Description                                                 |
| --------------------------------------------- | ----------------------------------------------------------- |
| [Turbopack](https://turbo.build/pack)         | Incremental bundler optimized for JavaScript and TypeScript |
| [ESLint](https://eslint.org/)                 | Static code analysis tool                                   |
| [Prettier](https://prettier.io/)              | Code formatter for consistent style                         |
| [TypeScript](https://www.typescriptlang.org/) | Static type checking for JavaScript                         |

## 🔧 Getting Started

Want to run this locally? Here's what you need:

1. Clone the repo
2. Create a `.env` file with:
   ```
   NOTION_API_KEY=your-notion-api-key
   NOTION_SKILLSET_DB=your-skillset-database-id
   NOTION_LANDING_PAGE_DB=your-database-id
   NOTION_PROJECTS_DB=your-projects-database-id
   ```
3. Run `npm install`
4. Start the dev server with `npm run dev`
5. Visit [http://localhost:3000](http://localhost:3000)

Alternatively, you can visit the live site at [samuelrazali.netlify.app](https://samuelrazali.netlify.app/)

## 📦 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   └── hooks/         # Custom React hooks
├── public/            # Static assets
└── styles/           # Global styles
```

## 🚀 Deployment

This site lives on Netlify, with automatic deployments from the main branch. Netlify Dev helps me test everything locally before it goes live.

## 📝 Notes

- The `Loading` component in `src/app/components/Loading.tsx` is currently unused, but is kept for future use because I like the style. You can use it for client-side loading states or future interactive features.
