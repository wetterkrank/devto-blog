import { GetStaticProps, GetStaticPaths } from 'next';

import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import Date from '../../components/date';

import utilStyles from '../../styles/utils.module.css';
import { IPostData } from '../../interfaces/post';

// Runs only on the server-side
export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) return { props: {} };

  const postData = await getPostData(params.slug as string);
  return {
    props: {
      postData,
    },
  };
};

// Runs only on the server-side
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export default function Post({ postData }: { postData: IPostData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        <hr />
        <a href={postData.originalUrl} target="_blank">
          View original post and comments at dev.to →
        </a>
      </article>
    </Layout>
  );
}
