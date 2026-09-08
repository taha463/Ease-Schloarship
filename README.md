<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/406a799b-b45b-4532-b9fc-dcbe7c36f7e7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` and `TAVILY_API_KEY` in [.env.local](.env.local). Gemini writes the synthesis; Tavily supplies current web sources.
3. Run the app:
   `npm run dev`
