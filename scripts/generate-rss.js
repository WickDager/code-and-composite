#!/usr/bin/env node
/* ============================================
   GENERATE RSS FEED
   Reads /src/data/blog-posts.json and writes
   /public/feed.xml
   Run: node scripts/generate-rss.js
   ============================================ */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://codeandcomposite.com';
const BLOG_URL = SITE_URL + '/blog/';

const dataPath = path.resolve(__dirname, '..', 'src', 'data', 'blog-posts.json');
const outputPath = path.resolve(__dirname, '..', 'public', 'feed.xml');

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(dateStr) {
  // Convert YYYY-MM-DD to RFC 822
  var d = new Date(dateStr);
  return d.toUTCString();
}

try {
  var raw = fs.readFileSync(dataPath, 'utf-8');
  var posts = JSON.parse(raw);

  // Sort by date descending
  posts.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  var now = new Date().toUTCString();

  var items = posts.map(function (post) {
    var link = BLOG_URL + post.slug + '/';
    return (
      '<item>\n' +
      '  <title>' + escapeXml(post.title) + '</title>\n' +
      '  <link>' + escapeXml(link) + '</link>\n' +
      '  <description>' + escapeXml(post.description) + '</description>\n' +
      '  <pubDate>' + formatDate(post.date) + '</pubDate>\n' +
      '  <guid>' + escapeXml(link) + '</guid>\n' +
      '  <category>' + (post.tags || []).map(escapeXml).join('</category><category>') + '</category>\n' +
      '</item>'
    );
  }).join('\n');

  var feed = (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '  <channel>\n' +
    '    <title>Code &amp; Composite — Blog</title>\n' +
    '    <link>' + BLOG_URL + '</link>\n' +
    '    <description>Case studies, TIL posts, and technical thinking from a front-end developer and graphic designer.</description>\n' +
    '    <language>en-gb</language>\n' +
    '    <lastBuildDate>' + now + '</lastBuildDate>\n' +
    '    <atom:link href="' + SITE_URL + '/public/feed.xml" rel="self" type="application/rss+xml" />\n' +
    items + '\n' +
    '  </channel>\n' +
    '</rss>'
  );

  fs.writeFileSync(outputPath, feed, 'utf-8');
  console.log('RSS feed generated: ' + outputPath);
} catch (err) {
  console.error('Failed to generate RSS feed:', err.message);
  process.exit(1);
}
