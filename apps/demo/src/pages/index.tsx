import type { NextPage } from "next";
import Head from "next/head";
import { TextButton } from "../components";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>soupware demo</title>
        <meta name="description" content="Soupware project demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen min-w-full flex-col items-center justify-center space-y-[5rem] bg-gray-1000 p-6">
        <h6 className="text-center text-5xl font-extrabold leading-normal text-brand-0 md:text-[5rem]">
          Soupdemo 👋
        </h6>
        <TextButton title="Create New Room" />
      </main>
    </>
  );
};

export default Home;
