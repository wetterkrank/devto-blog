# An excercise in Next.js
Following the [Next.js tutorial](https://nextjs.org/learn/basics/create-nextjs-app) to implement a mirror of the dev.to blog.

## A couple of tricky moments
- I'm using the `article_updated` webhook (https://docs.forem.com/api/#operation/createWebhook) to trigger the blog rebuild at Vercel. It had to be created separately.
- I want to see dev.to post slugs instead of numeric ids in URLs. However, the current Next.js implementation of `getStaticPaths` doesn't support storing extra information (so either ids or slugs), and these ids are required for fetching the individual posts from the API.   
So, I have to save the slug-id mapping to a file in `getStaticPaths`, and then retrieve the id in `getStaticProps`. Not the most elegant solution, but it's better than nothing! Credits for this idea: [James Wallis](https://wallis.dev/blog/adding-a-devto-powered-blog-to-a-nextjs-website).
