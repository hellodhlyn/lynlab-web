import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { fetchQuery, Variables } from 'react-relay';
import ImageWithLoader from '../../components/image-with-loader';
import { initEnvironment } from '../../lib/relay';
import query from '../../queries/blog/indexPage';
import { indexPage_indexQueryResponse as queryResponse } from '../../queries/blog/__generated__/indexPage_indexQuery.graphql';

const BlogIndex = ({ posts }: queryResponse): JSX.Element => {
  const postNodes = posts.edges.map((edge) => edge.node);
  const firstPage = !posts.pageInfo.hasPreviousPage;

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:px-8">
      <Head>
        <title>LYnLab Blog</title>
      </Head>

      <p className="py-8 text-4xl text-gray-900 dark:text-gray-000 font-bold">블로그</p>
      {
        firstPage ? <div>
          <p className="py-4 tracking-wider font-bold">FEATURED</p>
          <Link href={`/blog/${postNodes[0].postId}`}>
            <div className="mb-8 md:mb-16 md:flex cursor-pointer group">
              <div className="h-56 md:h-80 w-full md:w-3/5">
                <ImageWithLoader src={postNodes[0].thumbnailUrl || '/images/header.jpg'} />
              </div>
              <div className="md:w-2/5 py-2 md:p-4">
                <div className="pb-4 flex gap-x-1">
                  {postNodes[0].tags.map((tag) => (
                    <div key={tag.name} className="px-2 bg-gray-900 dark:bg-gray-000 text-gray-000 dark:text-gray-900 text-sm"><span>{tag.name}</span></div>
                  ))}
                </div>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-000">{postNodes[0].title}</p>
                <p className="md:text-lg">{postNodes[0].description}</p>
                <p className="pt-4 group-hover:underline">계속 읽기 &gt;</p>
              </div>
            </div>
          </Link>

          <p className="py-4 tracking-wider font-bold">RECENT</p>
          <div className="grid md:grid-cols-2 gap-6">
            {postNodes.slice(1, 3).map((post) => (
              <div key={post.id} className="mb-8 md:mb-24 cursor-pointer group">
                <Link href={`/blog/${post.postId}`}>
                  <div>
                    <div className="h-56 md:h-64 w-full">
                      <ImageWithLoader src={post.thumbnailUrl || '/images/header.jpg'} />
                    </div>
                    <div className="py-2 flex gap-x-1">
                      {post.tags.map((tag) => (
                        <div key={tag.name} className="px-2 bg-gray-900 dark:bg-gray-000 text-gray-000 dark:text-gray-900 text-sm"><span>{tag.name}</span></div>
                      ))}
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-000 group-hover:underline">{post.title}</p>
                    <p className="md:text-lg">{post.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div> : null
      }

      <div className="grid md:grid-cols-3 gap-6">
        {postNodes.slice(firstPage ? 3 : 0).map((post) => (
          <div key={post.id} className="mb-8 md:mb-16 cursor-pointer group">
            <Link href={`/blog/${post.postId}`}>
              <div>
                <div className="h-56 md:h-48 w-full">
                  <ImageWithLoader src={post.thumbnailUrl || '/images/header.jpg'} />
                </div>
                <div className="py-2 flex gap-x-1">
                  {post.tags.map((tag) => (
                    <div key={tag.name} className="px-2 bg-gray-900 dark:bg-gray-000 text-gray-000 dark:text-gray-900 text-sm"><span>{tag.name}</span></div>
                  ))}
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-000 group-hover:underline">{post.title}</p>
                <p>{post.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="my-16 text-center">
        {posts.pageInfo.hasPreviousPage
          ? <Link href={`?before=${posts.pageInfo.startCursor}`}>
              <span className="p-2 mr-2 border-2 border-gray-900 dark:border-gray-300 hover:bg-gray-900 dark:hover:bg-gray-300
              hover:text-gray-300 dark:hover:text-gray-900 font-bold cursor-pointer transition-colors">&lt; 이전 페이지</span>
            </Link> : null}
        {posts.pageInfo.hasNextPage
          ? <Link href={`?after=${posts.pageInfo.endCursor}`}>
              <span className="p-2 border-2 border-gray-900 dark:border-gray-300 hover:bg-gray-900 dark:hover:bg-gray-300
              hover:text-gray-300 dark:hover:text-gray-900 font-bold cursor-pointer transition-colors">다음 페이지 &gt;</span>
            </Link> : null}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const perPage = 15;
  const { before, after } = context.query;
  let variables: Variables = { first: perPage };
  if (before) {
    variables = { before, last: perPage };
  } else if (after) {
    variables = { after, first: perPage };
  }

  const environment = initEnvironment();
  const queryProps = await fetchQuery(environment, query, variables) as queryResponse;
  const initialRecords = environment.getStore().getSource().toJSON();
  return {
    props: { ...queryProps, initialRecords },
  };
};

export default BlogIndex;
