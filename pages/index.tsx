import { GetStaticProps } from 'next';

import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import Link from 'next/link';
import Date from '../components/date';
import { getSortedPostsData } from '../lib/posts';

import utilStyles from '../styles/utils.module.css';
import { IPostMeta } from '../interfaces/post';

export const getStaticProps: GetStaticProps = async (context) => {
  const allPostsList = await getSortedPostsData();
  return {
    props: {
      allPostsList,
    },
  };
};

export default function Home({ allPostsList }: { allPostsList: IPostMeta[] }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hi! My name is Alex Antsiferov. I'm a web developer living in Berlin, Germany.</p>
        <p>
          This is a mirror of my <a href="https://dev.to/wetterkrank">dev.to blog</a>.
        </p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Posts</h2>
        <ul className={utilStyles.list}>
          {allPostsList.map(({ slug, date, title }) => (
            <li className={utilStyles.listItem} key={slug}>
              <Link href={`/posts/${slug}`}>
                {title}
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
