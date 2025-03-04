"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLearning } from "@/actions/actions";
import { generateQuiz } from "@/lib/gemini";
import { motion } from "framer-motion";
function Page() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState<any>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  let counter = 0;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const data = await getLearning(token);
      setMessages(data);
    };
    fetchData();
    console.log(messages);
  }, []);


  useEffect(() => {
    const arrayInput = Object.entries(input);
    // console.log(input.questions);
    setQuestions(input.questions);
    setLoading(false);
    // console.log(input.answerKeys);
    setAnswers(input.answerKeys);
  }, [input]);

  return (
    <section className="max-w-screen h-screen flex">
      {/* Sidebar for History */}
      <aside className="w-1/4 bg-neutral-950 text-white px-5 py-3 overflow-y-hidden overflow-x-hidden border-r-[0.5px] border-neutral-800">
        <motion.h2
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.1 }}
          className="text-xl font-semibold mt-2  text-transparent bg-clip-text bg-gradient-to-t from-white via-slate-300 to-slate-700 px-4 mb-4"
        >
          My Learnings :{" "}
        </motion.h2>
        <div className=" h-full overflow-y-scroll flex flex-col gap-4 px-2 w-full">
          {messages &&
            messages.length > 0 &&
            messages.map((msg, index) => {
              return (
                <div
                  key={index}
                  className=" p-3 bg-gradient-to-r from-black via-neutral-950 to-slate-black rounded-lg text-black border-[1px] border-neutral-700 flex flex-col items-start gap-2"
                >
                  <p className=" ml-1 text-transparent bg-clip-text bg-gradient-to-t from-white via-slate-200 to-slate-400 font-semibold tracking-wide capitalize">
                    {msg.subject}
                  </p>
                  {msg.quiz == true ? (
                    <></>
                  ) : (
                    <button
                      onClick={async () => {
                        const quizzes = await generateQuiz(msg.subject);
                        // console.log(JSON.parse(quizzes));
                        setInput(JSON.parse(quizzes));
                      }}
                      className="bg-gradient-to-t from-sky-300 via-sky-400 border-[1px] text-black border-slate-800 to-sky-600 px-3 py-1 text-md  rounded-md"
                    >
                      Take Quiz
                    </button>
                  )}
                </div>
              );
            })}
          <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 className="w-full h-full text-7xl text-center animate-pulse duration-100 transition-all ease-linear text-white">
              ...
            </h1>
          </div>
        </div>
      </aside>

      {/* Chat Interface */}
      <section className="w-3/4 flex flex-col bg-neutral-950 h-full">
        {/* Header */}
        <div className="nav w-full px-6 bg-neutral-950 border-b-[0.5px] border-neutral-800 h-[10vh] flex justify-between items-center">
          <button
            onClick={() => router.push("/home")}
            className="bg-gradient-to-t from-sky-400 via-sky-500 to-sky-700 border-[0.5px] border-green-950 px-6 py-2 text-black rounded-lg font-semibold hover:cursor-pointer"
          >
            Back
          </button>
        </div>

        {questions && questions.length > 0 ? (
          <div className="px-5 py-2 overflow-y-scroll text-white flex flex-col gap-5 w-full h-full">
            {questions &&
              questions.map((item, index) => {
                return (
                  <div
                    key={index}
                    className=" rounded-lg px-5 py-4 gap-4 flex flex-col justify-start items-start"
                  >
                    <h1>
                      {index + 1}) {item.question}
                    </h1>
                    {Object.keys(item.options).map((key, i) => (
                      <div key={i} className="flex items-center ml-4">
                        <input
                          type="radio"
                          id={`${index}-${key}`}
                          name={`question-${index}`}
                          value={key}
                          onChange={(e) => {
                            const updatedAnswers = [...selectedAnswers];
                            updatedAnswers[index] = e.target.value; // Store the selected option at the current question index
                            setSelectedAnswers(updatedAnswers);
                          }}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`${index}-${key}`}
                          className="text-slate-50 w-full text-wrap px-3 py-2 text-start"
                        >
                          {key} {item.options[key]}
                        </label>
                      </div>
                    ))}
                 
                  </div>
                );
              })
              
            }
            <button
              onClick={() => {
                // console.log(selectedAnswers);
                if (answers && answers.length > 0) {
                  const correctAnswers = answers
                    .filter((item) => item?.key) // Filters out undefined or missing keys
                    .map((item) => item.key.replace(")", ""))
                    .toLocaleString();

                  // console.log(correctAnswers);

                  const score = selectedAnswers
                    .filter((item) => item) // Filter out undefined items
                    .map((item) => item.replace(")", ""));

                  // console.log(score.toLocaleString());
                  const crt = score.toLocaleString();

                  const arr = correctAnswers.split(",");
                  const arr1 = crt.split(",");

                  // console.log(arr, arr1);
                  for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === arr1[i]) {
                      counter++;
                    }
                  }
                  const count = Math.floor(Math.random() * 5);
                  alert(`You got ${counter} correct answers`);
                  setQuestions([]);
                }
              }}
              className="bg-gradient-to-t from-sky-800 via-sky-600 to-sky-400  w-full px-3 py-2 rounded-lg text-white"
            >
              Submit Quiz
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center ">
            <div className=" w-full h-40 flex  justify-center items-center ">
              <span className="text-2xl text-slate-50 text-center  w-full  animate-pulse duration-100 transition-all ease-linear">
                Select a topic from your learnings to take quiz
              </span>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}

export default Page;
