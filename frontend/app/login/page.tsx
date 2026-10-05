import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoginForm from "./LoginForm";
import Provider from "../QueryClientProvider";

const Page = () => {
  return (
    <div className="bg-brand-beige text-brand-black">
      <Header />
      <Provider>
        <LoginForm />
      </Provider>
      <Footer />
    </div>
  );
};
export default Page;
