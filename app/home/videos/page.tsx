"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as blazeface from "@tensorflow-models/blazeface";
import { useRouter } from "next/navigation";
const videoData = [
  {
    id: "1",
    platform: "cloudinary",
    title: "Emotional Well-being and Mental Health",
    description:
      "Learn how emotional well-being plays a crucial role in your mental health.",
    url: "https://res.cloudinary.com/ansh-jamwal/video/upload/v1741032470/Emotional_well_being_and_mental_health_Hindi_pwltsn.mp4",
  },
  {
    id: "2",
    platform: "cloudinary",
    title: "Health Insights - A Deeper Look",
    description:
      "An insightful video offering perspectives on maintaining health and overall well-being.",
    url: "https://res.cloudinary.com/ansh-jamwal/video/upload/v1741032457/videoplayback_lmpiqu.mp4",
  },
  {
    id: "3",
    platform: "cloudinary",
    title: "Health and Wellness Tips",
    description:
      "Watch this video to get some practical health tips to maintain your physical and mental wellness.",
    url: "https://res.cloudinary.com/ansh-jamwal/video/upload/v1741032433/yt_animated_videos_ikpgax.mp4",
  },
  {
    id: "4",
    platform: "cloudinary",
    title: "Mental Health Impact on Physical Health",
    description:
      "Explore the important relationship between mental and physical health in this informative video.",
    url: "https://res.cloudinary.com/ansh-jamwal/video/upload/v1741011389/How_mental_health_can_impact_physical_health_1080p_qgmlc1.mp4",
  },
  {
    id: "5",
    platform: "cloudinary",
    title: "Health Insights",
    description:
      "Watch this informative video on maintaining health and well-being.",
    url: "https://res.cloudinary.com/ansh-jamwal/video/upload/v1741011360/health1_wckiu5.mp4",
  },
  {
    id: "6",
    platform: "cloudinary",
    title: "Health and Wellness Tips",
    description: "Get helpful tips on maintaining physical and mental health.",
    url: "https://res.cloudinary.com/ansh-jamwal/video/upload/v1741011381/health_1_v3ki1z.mp4",
  },
];

const BREAK_INTERVAL = 30; // Break reminder after 30 seconds
const EXPRESSION_CHECK_INTERVAL = 1000; // Check every 1 second
const ALERT_THRESHOLD = 3; // Show alert after 3 consecutive negative expressions
const PHYSICAL_HEALTH_THRESHOLD = 50; // Threshold for physical health alert
const PHYSICAL_HEALTH_FREQUENCY = 5; // Number of times to exceed threshold

interface AlertState {
  isVisible: boolean;
  message: string;
  severity: "warning" | "danger";
  type: "mental" | "physical"; // Added type to distinguish between mental and physical alerts
}

export default function Home() {

const router = useRouter()
  const [showVideos, setShowVideos] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [lastBreakTime, setLastBreakTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    isVisible: false,
    message: "",
    severity: "warning",
    type: "mental",
  });
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [negativeExpressionCount, setNegativeExpressionCount] = useState(0);
  const [lastExpression, setLastExpression] = useState<string>("neutral");

  // New state for tracking physical health alerts
  const [physicalHealthAlertCount, setPhysicalHealthAlertCount] = useState(0);
  const [totalWatchDuration, setTotalWatchDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<blazeface.BlazeFaceModel | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (showVideos) {
      timerRef.current = setInterval(() => {
        setWatchTime((prev) => {
          const newTime = prev + 1;
          setTotalWatchDuration((currentTotal) => currentTotal + 1);
          if (newTime > 0 && newTime % BREAK_INTERVAL === 0) {
            setIsBreakTime(true);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [showVideos]);

  // Initialize TensorFlow and load model
  useEffect(() => {
    const setupModel = async () => {
      await tf.setBackend("webgl");
      modelRef.current = await blazeface.load();
      setIsModelLoaded(true);
      console.log("Model loaded successfully");
    };
    setupModel();
  }, []);

  useEffect(() => {
    // Monitor negative expression count for physical health alerts
    if (negativeExpressionCount > PHYSICAL_HEALTH_THRESHOLD) {
      setPhysicalHealthAlertCount((prevCount) => prevCount + 1);
      // Reset negative count after recording an occurrence
      setNegativeExpressionCount(0);
    }
  }, [negativeExpressionCount]);

  useEffect(() => {
    // Check if physical health alert threshold is reached
    if (physicalHealthAlertCount >= PHYSICAL_HEALTH_FREQUENCY) {
      // Pause the video
      if (videoPlayerRef.current) {
        videoPlayerRef.current.pause();
      }

      // Show physical health alert popup
      setAlertState({
        isVisible: true,
        message: generatePhysicalHealthMessage(totalWatchDuration),
        severity: "danger",
        type: "physical",
      });

      // Reset the counter
      setPhysicalHealthAlertCount(0);
    }
  }, [physicalHealthAlertCount, totalWatchDuration]);

  const generatePhysicalHealthMessage = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    return `You've been watching videos for ${
      hours > 0 ? `${hours} hours and ` : ""
    }${minutes} minutes and we've detected signs of physical strain. Your facial expressions suggest you might need to take a break and attend to your physical wellbeing.`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          startExpressionDetection();
        };
      }
      console.log("Camera started successfully");
    } catch (error) {
      console.error("Error accessing camera:", error);
      setAlertState({
        isVisible: true,
        message: "Please enable camera access for wellness monitoring",
        severity: "warning",
        type: "mental",
      });
    }
  };

  const analyzeExpression = (landmarks: number[][]) => {
    // Extract facial features
    const rightEye = landmarks[0];
    const leftEye = landmarks[1];
    const nose = landmarks[2];
    const mouth = landmarks[3];
    const rightEyebrow = landmarks[4];
    const leftEyebrow = landmarks[5];
    // Calculate key measurements
    const eyeDistance = Math.abs(rightEye[1] - leftEye[1]);
    const mouthWidth = Math.abs(mouth[0] - nose[0]);
    const eyebrowHeight =
      (Math.abs(rightEyebrow[1] - rightEye[1]) +
        Math.abs(leftEyebrow[1] - leftEye[1])) /
      2;
    // Detect expressions
    let expression = "neutral";
    let severity: "warning" | "danger" = "warning";
    if (eyebrowHeight < eyeDistance * 0.2) {
      expression = "sad";
      severity = "warning";
    }
    if (mouthWidth > eyeDistance * 1.2) {
      expression = "distressed";
      severity = "danger";
    }
    return { expression, severity };
  };

  const startExpressionDetection = () => {
    if (!videoRef.current || !modelRef.current || !canvasRef.current) return;
    const detectFrame = async () => {
      if (!videoRef.current || !modelRef.current) return;
      try {
        const predictions = await modelRef.current.estimateFaces(
          videoRef.current,
          false
        );
        if (predictions.length > 0) {
          const prediction = predictions[0];
          const { expression, severity } = analyzeExpression(
            prediction.landmarks
          );
          console.log("Detected expression:", expression); // Debug log

          if (expression !== "neutral") {
            setNegativeExpressionCount((prev) => prev + 1);

            if (
              negativeExpressionCount >= ALERT_THRESHOLD &&
              negativeExpressionCount < PHYSICAL_HEALTH_THRESHOLD
            ) {
              setAlertState({
                isVisible: true,
                message: ` We notice you appear ${expression}. Let's take a moment to check in`,
                severity: severity,
                type: "mental",
              });
              if (videoPlayerRef.current) {
                videoPlayerRef.current.pause();
              }
            }
          } else {
            setNegativeExpressionCount(0);
          }
          setLastExpression(expression);
        }
      } catch (error) {
        console.error("Error in expression detection:", error);
      }
      requestAnimationFrame(detectFrame);
    };
    detectFrame();
  };

  // Start camera when videos are shown
  useEffect(() => {
    if (showVideos && isModelLoaded) {
      startCamera();
      console.log("Starting camera detection");
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showVideos, isModelLoaded]);

  const handleVideoPlay = () => {
    setIsPlaying(true);
    // Show a toast notification when video starts playing
    showToast(
      `Now playing: ${videoData.find((v) => v.id === selectedVideo)?.title}`
    );
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleVideoDisplay = () => {
    setShowVideos(true);
    setWatchTime(0);
    setLastBreakTime(0);
    setIsPlaying(true);
  };

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const handleBack = () => {
    if (selectedVideo) {
      setSelectedVideo(null);
    } else {
      setShowVideos(false);
      setWatchTime(0);
      setIsBreakTime(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleClosePopUp = () => {
    setIsBreakTime(false);
    setLastBreakTime(watchTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    const timeSinceLastBreak = watchTime - lastBreakTime;
    const progress = (timeSinceLastBreak / BREAK_INTERVAL) * 100;
    return Math.min(progress, 100); // Ensure progress doesn't exceed 100%
  };

  // Add a new toast notification system
  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("animate-fade-out-down");
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  // Debug display component
  const DebugDisplay = () => (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 p-2 rounded text-white text-sm">
      <p>Model Loaded: {isModelLoaded ? "Yes" : "No"}</p>
      <p>Last Expression: {lastExpression}</p>
      <p>Negative Count: {negativeExpressionCount}</p>
      <p>
        Physical Health Alerts: {physicalHealthAlertCount} /{" "}
        {PHYSICAL_HEALTH_FREQUENCY}
      </p>
      <p>Total Watch Time: {formatTime(totalWatchDuration)}</p>
    </div>
  );

  // Physical Health Alert Component
  const PhysicalHealthAlert = ({
    message,
    onClose,
  }: {
    message: string;
    onClose: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900 p-8 rounded-xl shadow-2xl z-50 max-w-md w-full"
    >
      <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
        Physical Health Alert
      </h2>
      <div className="space-y-4">
        <p className="text-gray-300">{message}</p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Stand up and stretch for 5 minutes</li>
          <li>Do some light exercises to improve circulation</li>
          <li>Look at an object at least 20 feet away for 20 seconds</li>
          <li>Drink water to stay hydrated</li>
          <li>Consider using blue light filters on your devices</li>
        </ul>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-3 px-6 rounded-lg text-white font-semibold transition-all duration-300"
        >
          I'll Take a Break
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-white">
      {/* Camera feed for debugging */}
      <div className="fixed top-4 right-4 mt-20 w-64 h-64 overflow-hidden rounded-lg border-2 border-purple-500">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {/* Debug display */}
      <DebugDisplay />
      {/* Alert Popup */}
      <AnimatePresence>
        {alertState.isVisible &&
          (alertState.type === "mental" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`fixed mt-32 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                ${
                  alertState.severity === "danger"
                    ? "bg-red-900"
                    : "bg-gray-900"
                } 
                p-8 rounded-xl shadow-2xl z-50 max-w-md w-full`}
            >
              <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                Wellness Check
              </h2>
              <div className="space-y-4">
                <p className="text-gray-300">{alertState.message}</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Take deep breaths</li>
                  <li>Step away from the screen</li>
                  <li>Consider talking to someone</li>
                  <li>Practice mindfulness</li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setAlertState((prev) => ({ ...prev, isVisible: false }));
                    setNegativeExpressionCount(0);
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 py-3 px-6 rounded-lg text-white font-semibold transition-all duration-300"
                >
                  I Understand
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <PhysicalHealthAlert
              message={alertState.message}
              onClose={() => {
                setAlertState((prev) => ({ ...prev, isVisible: false }));
                setNegativeExpressionCount(0);
                setPhysicalHealthAlertCount(0);
              }}
            />
          ))}
      </AnimatePresence>

      {/* Timer and Progress Bar - Show whenever videos section is active */}
      {showVideos && (
        <div className="fixed top-0 left-0 right-0 bg-black bg-opacity-75 backdrop-blur-sm p-4 z-50">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="text-lg font-semibold">
              Total Screen Time: {formatTime(watchTime)}
            </div>
            <div className="w-1/2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 relative"
                style={{
                  width: ` ${
                    (watchTime % BREAK_INTERVAL) * (100 / BREAK_INTERVAL)
                  }% `,
                }} // Corrected style syntax
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-white opacity-20 animate-shimmer"></div>
              </div>
            </div>
            <div className="text-sm">
              Next Alert:{" "}
              {formatTime(BREAK_INTERVAL - (watchTime % BREAK_INTERVAL))}
            </div>
          </div>
        </div>
      )}

      {/* Add keyframe animations to your CSS */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        @keyframes fade-out-down {
          0% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-out-down {
          animation: fade-out-down 0.5s ease-out forwards;
        }
      `}</style>
      {/* <div className={container mx-auto px-4 py-8 ${selectedVideo ? "video-fullscreen" : ""}}> */}
      <div
        className={`container mx-auto px-4 py-8 ${
          selectedVideo ? "video-fullscreen" : ""
        }`}
      >
        {/* Break Time Pop-up */}
        <AnimatePresence>
          {isBreakTime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-8 rounded-xl shadow-2xl z-50 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                Screen Time Alert!
              </h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  You've been watching for {formatTime(watchTime)}. Take care of
                  your eyes!
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Look away from the screen</li>
                  <li>Blink your eyes several times</li>
                  <li>Take a few deep breaths</li>
                  <li>Consider a short break</li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClosePopUp}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 py-3 px-6 rounded-lg text-white font-semibold transition-all duration-300"
                >
                  Continue Watching
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!showVideos ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <button onClick={()=>{
                router.push('/home')
            }} className="bg-green-400 absolute top-10 left-10 w-[10%] p-2 rounded-lg bg-gradient-to-t from-sky-700 via-sky-400 to-sky-300 font-semibold ">Back</button>
            <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Welcome to HealthEdify Videos
            </h1>
            <p className="text-gray-300 mb-8 text-xl">
              Discover inspiring and educational health content
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVideoDisplay}
              className="video-btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 rounded-lg text-xl"
            >
              Explore Videos
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
            {!selectedVideo ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-16"
              >
                <div className="flex justify-between items-center mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    className="back-btn"
                  >
                    ← Back
                  </motion.button>
                  <h2 className="text-3xl font-semibold">Featured Videos</h2>
                  <div className="w-20"></div>
                </div>
                <div className="video-container flex flex-col justify-center items-center gap-5">
                  {videoData.map((video) => (
                    <motion.div
                      key={video.id}
                      className="video-item w-[50%]"
                    
                      onClick={() => handleVideoClick(video.id)}
                    >
                      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                        <video
                          width="100%"
                          height="215"
                          controls
                          onPlay={handleVideoPlay}
                          onPause={handleVideoPause}
                        >
                          <source src={video.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-2">
                            {video.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fullscreen-video mt-16"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="back-btn"
                >
                  ← Back to Videos
                </motion.button>
                <video
                  ref={videoPlayerRef}
                  width="100%"
                  height="100%"
                  controls
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                >
                  <source
                    src={
                      videoData.find((video) => video.id === selectedVideo)?.url
                    }
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
