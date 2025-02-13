import { DefaultErrorMessage } from "@/components/message/default-error-message.tsx";
import { ErrorTypeMessage } from "@/components/message/error-type-message.tsx";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "fimidara",
  description: "Something went wrong",
};

export default function AuthErrorPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="block max-w-sm bg-white p-6 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
        <h5 className="mb-2 flex flex-row items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Something went wrong
        </h5>
        <Suspense fallback={<DefaultErrorMessage />}>
          <ErrorTypeMessage />
        </Suspense>
      </div>
    </div>
  );
}
