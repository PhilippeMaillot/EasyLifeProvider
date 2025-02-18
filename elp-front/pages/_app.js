import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
      <link
          href="https://fonts.googleapis.com/css2?family=Handjet:wght@400;700&display=swap"
          rel="stylesheet"
        />
      <link rel="icon" href="./api.ico" type="image/x-icon"/>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
