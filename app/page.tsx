import { htmlCharacterCodes } from "@/components/utils/utils";
import { WebLayout } from "@/components/utils/WebLayout.tsx";
import type { Metadata, NextPage, ResolvingMetadata } from "next";
import Docs from "../components/web/Docs";
import Features from "../components/web/Features";

type Props = {};

export async function generateMetadata(
  {}: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title: "fimidara",
    description: "File storage service for developers",
    // openGraph: {
    //   images: ["/some-specific-page-image.jpg", ...previousImages],
    // },
  };
}

const Home: NextPage = () => {
  return (
    <WebLayout>
      <div className="space-y-32">
        <div className="mt-32 space-y-4">
          <h1 className="text-2xl underline decoration-red-500/70">fimidara</h1>
          <p className="text-4xl">
            <span className="underline decoration-red-500/70">Storage </span>
            for
            <br />
            <span className="underline decoration-red-500/70">
              Software Engineers{" "}
            </span>
          </p>
        </div>
        <Features />
        <Docs />
        <p>
          &copy; {htmlCharacterCodes.doubleDash} Softkave{" "}
          {htmlCharacterCodes.doubleDash} {new Date().getFullYear()}
        </p>
      </div>
    </WebLayout>
  );
};

export default Home;
