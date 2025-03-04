"use client"
import React from 'react'
import {motion} from 'framer-motion'
function Footer() {
  return (
    <motion.section
    whileInView={{
      scale:0.95,
      transition:{
        duration:0.5
      }
    }}
    className="footer  h-[20vh] mb-0 w-full">
        <div className="footer w-full h-full bg-gradient-to-r from-black via-neutral-950 to-black border-slate-700 border-[1px] flex flex-col justify-center  rounded-t-[20px]">
          <div className="flex px-10 w-full h-full  justify-between items-end mb-7">
            <h2 className=" text-3xl tracking-wider font-semibold text-transparent bg-clip-text bg-gradient-to-t from-white via-slate-200 to-slate-700">HeathEdify</h2>
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-t from-white via-slate-200 to-slate-700">All rights reserved.</h3>
          </div>
        </div>
      </motion.section>
  )
}

export default Footer