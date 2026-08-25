import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoginForm from "./LoginForm";
import Provider from "../QueryClientProvider";

const Page = () => {
  return (
    <div className="max-w-6xl px-6 mx-auto">
      <Header />
      <Provider>
        <LoginForm />
      </Provider>
      <Footer />
    </div>
  );
};
export default Page;
