"use client";

import Header from "../components/Header";
import Swapper from "../components/Swapper";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-screen">
        <Header />
        <Swapper />
        <Footer />
      </div>
    </div>
  );
}
