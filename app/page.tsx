import { htmlCharacterCodes } from "@/components/utils/utils";
import { WebLayout } from "@/components/utils/WebLayout.tsx";
import Docs from "../components/web/Docs";
import Features from "../components/web/Features";

const Home = async () => {
  return (
    <WebLayout isDocs={false} shouldRedirectToWorkspace={true}>
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
