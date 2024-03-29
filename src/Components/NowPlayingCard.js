import React, { useEffect, useRef } from "react";
import { FaMusic } from "react-icons/fa";
import { FaBackward, FaForward } from "react-icons/fa";

const NowPlayingCard = ({ currentFile, goToNextTrack, goToPreviousTrack }) => {
  const audioRef = useRef(null);

  const playAudio = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      const savedTime = parseFloat(
        localStorage.getItem("audioPlaybackTime") || 0
      );
      audioRef.current.currentTime = savedTime;
      if (savedTime > 0) {
        playAudio();
      }

      const updatePlaybackTime = () => {
        localStorage.setItem(
          "audioPlaybackTime",
          audioRef.current.currentTime.toString()
        );
      };

      audioRef.current.addEventListener("timeupdate", updatePlaybackTime);

      audioRef.current.addEventListener("ended", goToNextTrack);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener(
            "timeupdate",
            updatePlaybackTime
          );
          audioRef.current.removeEventListener("ended", goToNextTrack);
        }
      };
    }
  }, [goToNextTrack]);
  
  return (
    <div className="bg-cyan-700 items-center flex flex-col py-6 rounded-lg hover:border-teal-900 border w-[100%] px-14">
      <FaMusic size={100} />
      {currentFile ? (
        <div>
          <p className="font-bold p-4 text-center">{currentFile.name}</p>
          <div className=" flex flex-row justify-center items-center">
            <button
              onClick={goToPreviousTrack}
              className="hover:bg-opacity-50 hover:rounded-full p-2 hover:bg-cyan-600"
            >
              <FaBackward size={25} />
            </button>
            <audio
              controls
              ref={audioRef}
              autoPlay
              src={URL.createObjectURL(new Blob([currentFile.file]))}
              onEnded={goToNextTrack}
              className="mx-2"
            >
              Your browser does not support the audio element.
            </audio>
            <button
              onClick={goToNextTrack}
              className="hover:bg-opacity-50 hover:rounded-full p-2 hover:bg-cyan-600"
            >
              <FaForward size={25} />
            </button>
          </div>
        </div>
      ) : (
        <p className="font-bold p-4">No song currently playing</p>
      )}
    </div>
  );
};

export default NowPlayingCard;
