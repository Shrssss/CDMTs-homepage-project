import Provider from "@/app/QueryClientProvider";
import Client from "./ItemsClient";
import LoginRequiredHeader from "../LoginRequiredHeader";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Provider>
        <LoginRequiredHeader />
        <Suspense>
          <Client />
        </Suspense>
      </Provider>
    </div>
  );
};

export default Page;
