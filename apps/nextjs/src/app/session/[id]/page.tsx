/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { buttonVariants } from "@acme/ui/button";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const videos = [
  "/peaceful1.mp4",
  "/peaceful2.mp4",
  "/peaceful3.mp4",
  "/peaceful4.mp4",
  "/peaceful5.mp4",
  "/peaceful6.mp4",
  "/peaceful7.mp4",
  "/peaceful8.mp4",
  "/peaceful9.mp4",
  "/peaceful10.mp4",
  "/peaceful11.mp4",
  "/peaceful12.mp4",
  "/peaceful13.mp4",
  "/peaceful14.mp4",
  "/peaceful16.mp4",
  "/peaceful17.mp4",
  "/peaceful18.mp4",
  "/peaceful19.mp4",
  "/peaceful20.mp4",
  "/peaceful21.mp4",
  "/peaceful22.mp4",
  "/peaceful23.mp4",
  "/peaceful24.mp4",
  "/peaceful25.mp4",
  "/peaceful26.mp4",
];

export default function Post({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, status } = api.post.byId.useQuery({ id });
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentLine, setCurrentLine] = useState("");
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioFileRef = useRef<HTMLAudioElement | null>(null);
  const audioFilesRef = useRef<HTMLAudioElement[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  async function startPlaying() {
    setCompleted(false);
    setIsPlaying(true);

    // Start playing the audio
    // lower volume of audio
    // if (audioRef.current) {
    //   audioRef.current && (audioRef.current.volume = 0.3);
    //   audioRef.current &&
    //     audioRef.current.addEventListener("loadeddata", () => {
    //       void audioRef.current?.load();
    //       void audioRef.current?.play();
    //     });
    // }
    // play audio without audioRef
    const backgroundAudio = new Audio(`/tranquil_music.mp3`);
    backgroundAudioRef.current = backgroundAudio;
    backgroundAudio.addEventListener("canplaythrough", () => {
      // lower volume of audio
      backgroundAudio.volume = 0.3;
      void backgroundAudio.play();
    });

    // 4 seconds of silence before starting the speech
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const lines = data?.content.split("\n") ?? [];
    const paths = data?.audioPaths.split("\n") ?? [];

    const results = paths.map((path, i) => {
      return {
        path: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio-files/${path}`,
        line: lines[i],
      };
    });

    // Preload audio files
    let loaded = 0;

    function preloadAudio(url: string) {
      console.log(`Preloading audio file: ${url}`);
      const audio = new Audio(url);
      audio.addEventListener("canplaythrough", () => {
        loaded++;
        console.log(`Audio file loaded: ${url}. Total loaded: ${loaded}`);
        if (loaded === results.length) {
          console.log("All audio files have been loaded. Starting playback.");
          // All files have loaded
          playAudioFiles();
        }
      });
      // load
      audio.load();
      audioFilesRef.current.push(audio);
    }

    function playAudioFiles() {
      let i = 0;

      function playAudio() {
        const r = results[i] ?? {
          path: "",
          line: "",
        };
        setCurrentLine(r.line ?? "");
        console.log(`Playing audio file: ${r.path}`);

        // Play video
        if (videoRef.current) {
          let randomVideo;
          do {
            randomVideo =
              videos[Math.floor(Math.random() * videos.length)] ??
              "/peaceful1.mp4";
          } while (randomVideo === videoRef.current.src);
          console.log(`Playing video file: ${randomVideo}`);
          // set volume of video to 0
          videoRef.current.volume = 0;
          videoRef.current.src = randomVideo;
          void videoRef.current.play();
        }
        const currentAudioFile = audioFilesRef.current[i];
        if (currentAudioFile) {
          currentAudioFileRef.current = currentAudioFile;
          console.log(`Playing audio file: ${currentAudioFile.src}`);
          void currentAudioFile.load();
          void currentAudioFile.play();
          currentAudioFile.onended = () => {
            i++;
            if (i < audioFilesRef.current.length) {
              console.log(
                `Audio file ended. Waiting for 3 seconds before playing the next audio.`,
              );
              setTimeout(playAudio, 3000); // Wait for 3 seconds before playing the next audio
            } else {
              // 5 seconds after the last speech buffer, end playing
              console.log(
                `All audio files have been played. Ending session in 5 seconds.`,
              );
              setTimeout(() => {
                setIsPlaying(false);
                setCompleted(true);
                // audioRef.current && audioRef.current.pause();
                backgroundAudio.pause();
                if (videoRef.current) videoRef.current.src = "";
                setCurrentLine("");
              }, 10000);
            }
          };
        }
      }

      playAudio();
    }

    // Start preloading all the audio files
    for (const r of results) {
      preloadAudio(r.path);
    }
  }

  useEffect(() => {
    return () => {
      // Stop the audio when the component unmounts
      if (backgroundAudioRef.current) {
        console.log("Stopping background audio");
        // set the src to an empty string to stop the audio
        backgroundAudioRef.current.src = "";
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.currentTime = 0;
      }
      if (currentAudioFileRef.current) {
        console.log("Stopping current audio file");
        currentAudioFileRef.current.src = "";
        currentAudioFileRef.current.pause();
        currentAudioFileRef.current.currentTime = 0;
      }
      // Stop all audio files
      if (audioFilesRef.current.length) {
        audioFilesRef.current.forEach((audioFile) => {
          console.log("Stopping audio file");
          audioFile.src = "";
          audioFile.pause();
          audioFile.currentTime = 0;
        });
      }
    };
  }, []);

  if (!data && status === "pending") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen flex-col items-center justify-center bg-background text-foreground">
      {completed ? (
        <div className="z-10 flex h-full flex-col items-center justify-center gap-4 p-4">
          <p className="text-lg">
            You have completed the session. You can now close the window.
          </p>
          <Button
            size="lg"
            onClick={() => {
              void startPlaying();
            }}
          >
            Restart
          </Button>
        </div>
      ) : !isPlaying ? (
        <div className="z-10 flex h-full flex-col items-center justify-center gap-12 p-4">
          <div className="text-2xl font-bold">{data?.title}</div>
          <Button
            size="lg"
            onClick={() => {
              void startPlaying();
            }}
          >
            Begin session
          </Button>
        </div>
      ) : (
        <>
          <div className="fixed left-2 top-4 z-10">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
              ← Exit
            </Link>
          </div>
          <div className="mx-auto max-w-full text-4xl">
            <video
              ref={videoRef}
              playsInline
              className="fixed left-0 top-0 z-0 h-full w-full bg-black object-cover"
            />
            <div className="fixed bottom-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4 text-center text-white">
              {currentLine}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
