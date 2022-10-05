import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/app.css" />
      </Head>
      <div class="container mx-auto h-full">
        <Component />
      </div>
    </>
  );
}
