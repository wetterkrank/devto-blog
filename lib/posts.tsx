import remark from 'remark'
import html from 'remark-html'

export async function getSortedPostsData() {
  type PostData = {
    id: number
    created_at: string
    title: string
  }

  const url = 'https://dev.to/api/articles?username=wetterkrank'
  const res = await fetch(url)
  const data = await res.json()
  
  const allPostsData = Object.values(data).map((item: PostData) => {
    const id = item.id
    const date = item.created_at
    const title = item.title
    return {
      id, date, title
    }
  })

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export async function getAllPostIds() {
  const allPostsData = await getSortedPostsData()

  return allPostsData.map(item => {
    return {
      params: {
        id: item.id.toString()
      }
    }
  })
}

export async function getPostData(id) {
  const url = `https://dev.to/api/articles/${id}`
  const res = await fetch(url)
  const article = await res.json()

  const processedContent = await remark()
    .use(html)
    .process(article.body_markdown)
  const contentHtml = processedContent.toString()

  return {
    id: article.id,
    date: article.created_at,
    title: article.title,
    contentHtml: contentHtml
  }
}
