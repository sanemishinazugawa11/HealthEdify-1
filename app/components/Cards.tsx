"use client"
import React from "react";
import {motion} from 'framer-motion'
function Cards() {
  return (
    <motion.section
  whileInView={{
    scale:0.92,
    transition:{
      duration:0.5
    }

  }}
    className="card flex justify-evenly mt-24 items-center w-full h-[15vh]">
      <div className="bg-gradient-to-br from-violet-950/50 via-neutral-950/80 to-violet-950/30  text-violet-200 font-semibold text-xl tracking-wide  w-[30%] flex justify-center items-center rounded-lg border h-full">
        <span>Learn</span>
      </div>
      <div className="bg-gradient-to-br from-violet-950/50 via-neutral-950/80 to-violet-950/30  text-violet-200 font-semibold text-xl tracking-wide  w-[30%] flex justify-center items-center rounded-lg border h-full">
        <span>Understand</span>
      </div>
      <div className="bg-gradient-to-br from-violet-950/50 via-neutral-950/80 to-violet-950/30  text-violet-200 font-semibold text-xl tracking-wide  w-[30%] flex justify-center items-center rounded-lg border h-full">
        <span>Thrive</span>
      </div>
    </motion.section>
  );
}

export default Cards;
