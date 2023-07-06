import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import { renderRichText } from 'gatsby-source-contentful/rich-text';

import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { GatsbyImage } from 'gatsby-plugin-image'
import readingTime from 'reading-time'

import Seo from '../components/seo'
import Layout from '../components/layout'
import Hero from '../components/hero'
import Tags from '../components/tags'
import * as styles from './blog-post.module.css'

import { BLOCKS, MARKS } from '@contentful/rich-text-types';



class BlogPostTemplate extends React.Component {
  render() {
    const data = get(this.props, 'data')
    const post = get(this.props, 'data.contentfulBlogPost')
    const previous = get(this.props, 'data.previous')
    const next = get(this.props, 'data.next')

    const plainTextBody = documentToPlainTextString(JSON.parse(post.body.raw))
    const {minutes: timeToRead} = readingTime(plainTextBody)


    const options = {
      renderNode: {
        renderMark: { 
          [MARKS.BOLD]: text => <b>{text}</b>, 
          [MARKS.ITALIC]: text => <i>{text}</i>, 
          [MARKS.UNDERLINE]: text => <u>{text}</u>, 
          [MARKS.CODE]: text => <code>{text}</code>, 
        },
        [BLOCKS.PARAGRAPH]: (node, children) => {
          const hasCodeMark = node?.content?.[0]?.marks?.some(mark => mark.type === MARKS.CODE);
      
          if (hasCodeMark) {
            return <pre><code>{children}</code></pre>;
          }
      
          return <p>{children}</p>;
        },
        // Show images
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
          const { target } = node.data;
          const assetNode = target?.sys?.id ? data.allContentfulAsset.nodes.find(asset => asset.contentful_id === target.sys.id) : null;

          if (assetNode) {
            const { gatsbyImageData, description } = assetNode;

            return (
                <GatsbyImage
                  image={gatsbyImageData}
                  alt={description}
                />
            );
          }

          return null;
        },
      },
    };

    return (
      <Layout location={this.props.location}>
        <Seo
          title={post.title}
        />
        <Hero
          image={post.heroImage?.gatsbyImage}
          title={post.title}
        />
        <div className={styles.container}>
          <span className={styles.meta}>
            {post.author?.name} &middot;{' '}
            <time dateTime={post.rawDate}>{post.publishDate}</time> –{' '}
            {timeToRead} minute read
          </span>
          <div className={styles.article}>
            <div className={styles.body}>
              {post.body?.raw && renderRichText(post.body, options)}
            </div>
            <Tags tags={post.tags} />
            {(previous || next) && (
              <nav>
                <ul className={styles.articleNavigation}>
                  {previous && (
                    <li>
                      <Link to={`/blog/${previous.slug}`} rel="prev">
                        ← {previous.title}
                      </Link>
                    </li>
                  )}
                  {next && (
                    <li>
                      <Link to={`/blog/${next.slug}`} rel="next">
                        {next.title} →
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $slug: String!
    $previousPostSlug: String
    $nextPostSlug: String
    ) {
      contentfulBlogPost(slug: { eq: $slug }) {
      slug
      title
      publishDate(formatString: "MMMM Do, YYYY")
      rawDate: publishDate
      body {
        raw
      }
      tags
    }
    allContentfulAsset {
      nodes {
        contentful_id
        gatsbyImageData(layout: FULL_WIDTH)
        description
      }
    }
    previous: contentfulBlogPost(slug: {eq: $previousPostSlug }) {
      slug
      title
    }
    next: contentfulBlogPost(slug: { eq: $nextPostSlug }) {
      slug
      title
    }
  }
 `
