import React from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Cards from "./components/Cards";
import Mockup from "./components/Mockup";
const Page = async () => {
  return (
    <main className="relative min-h-screen overflow-hidden max-w-screen flex flex-col  items-center gap-16 bg-gradient-to-r from-black via-neutral-950 to-black">
      <Navbar />

      <Hero />

     <Cards/>

      <Mockup/>

      <Footer />
    </main>
  );
};

export default Page;
