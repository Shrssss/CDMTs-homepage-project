"use client"

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Suspense } from "react";
import NewsDetailClient from "./NewsDetailClient";
import Provider from "../QueryClientProvider";

const Page=()=>{
  return (
    <div className="text-gray-900 bg-brand-beige">
      <Header/>
        <Suspense>
          <Provider>
            <NewsDetailClient/>
          </Provider>
        </Suspense>
      <Footer/>
    </div>
  )
}

export default Page