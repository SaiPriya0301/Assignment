import "./App.css";
import { saveAudioFile, getAllAudioFiles } from "./indexedDBUtil";
import NowPlayingCard from "./Components/NowPlayingCard";
import { useEffect, useState } from "react";
import { AddButton } from "./Components/AddButton";
import { FaPlay } from "react-icons/fa";

function App() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      const files = await getAllAudioFiles();
      setAudioFiles(files);
      const lastAudioKey = localStorage.getItem("lastAudioKey");
      if (lastAudioKey) {
        const index = files.findIndex(
          (file) => file.id === parseInt(lastAudioKey, 10)
        );
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
    };
    fetchAudioFiles();
  }, []);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    for (let file of files) {
      const fileData = await file.arrayBuffer();
      await saveAudioFile(fileData, file.name);
    }
    const updatedFiles = await getAllAudioFiles();
    setAudioFiles(updatedFiles);
  };

  const handleSelectAudio = (index) => {
    setCurrentIndex(index);
    const file = audioFiles[index];
    localStorage.setItem("lastAudioKey", file.id.toString());
  };

  const goToNextTrack = () => {
    localStorage.setItem("audioPlaybackTime", 0);

    const nextIndex = (currentIndex + 1) % audioFiles.length;
    handleSelectAudio(nextIndex);
  };

  const goToPreviousTrack = () => {
    localStorage.setItem("audioPlaybackTime", 0);
    const prevIndex =
      (currentIndex - 1 + audioFiles.length) % audioFiles.length;
    handleSelectAudio(prevIndex);
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex flex-col items-center w-[100%] md:flex-row">
        <AddButton handleFileUpload={handleFileUpload}></AddButton>
        <div className="items-center">
          <NowPlayingCard
            currentFile={audioFiles[currentIndex]}
            goToNextTrack={goToNextTrack}
            goToPreviousTrack={goToPreviousTrack}
          />
        </div>
      </div>
      <div className="overflow-scroll hide-scrollbar h-[500px] mt-2">
        {audioFiles.map((file, index) => (
          <div
            className="bg-teal-500 my-4 p-2 rounded flex flex-row items-center justify-evenly hover:border-cyan-900 border border-slate-300 cursor-pointer"
            key={file.id}
            onClick={() => handleSelectAudio(index)}
          >
            <p className="w-[70%] items-center font-medium">{file.name}</p>
            <FaPlay className="[30%] items-center" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
