import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Character Set */}
          <meta charSet="utf-8" />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          
          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
          

          <link rel="preload" href="/dark-mode-fix.html" as="document" />
          <script dangerouslySetInnerHTML={{ __html: `
          fetch('/dark-mode-fix.html')
          .then(response => response.text())
          .then(html => {
          const div = document.createElement('div');
          div.innerHTML = html;
          document.head.appendChild(div.querySelector('style'));
          eval(div.querySelector('script').textContent);
          });
        `}} />


          {/* Meta Tags */}
          <meta name="author" content="Syahril Arfian Almazril" />
        </Head>
        <body className="bg-white dark:bg-true-black text-secondary-900 dark:text-white transition-colors duration-300">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;