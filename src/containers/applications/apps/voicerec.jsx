import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import "./assets/voicerec.scss";

export const VoiceRecorderApp = () => {
  const wnapp = useSelector((state) => state.apps.voice || { size: "cstm", hide: true, z: 0 });
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [recordings, setRecordings] = useState([
    { id: 1, name: "Voice Note 1", duration: 14, date: "Today 10:30 AM", url: null },
    { id: 2, name: "Meeting Memo", duration: 42, date: "Yesterday 4:15 PM", url: null },
  ]);
  const [activePlayId, setActivePlayId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  const timerRef = useRef(null);
  const playTimerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordTime((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordTime(0);
    } else {
      setIsRecording(false);
      if (recordTime > 0) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const newRec = {
          id: Date.now(),
          name: `Recording ${recordings.length + 1}`,
          duration: recordTime,
          date: `Today ${timeStr}`,
          url: null,
        };
        setRecordings([newRec, ...recordings]);
      }
      setRecordTime(0);
    }
  };

  const handlePlayToggle = (rec) => {
    if (activePlayId === rec.id && isPlaying) {
      setIsPlaying(false);
      clearInterval(playTimerRef.current);
    } else {
      setActivePlayId(rec.id);
      setIsPlaying(true);
      setPlayProgress(0);

      clearInterval(playTimerRef.current);
      playTimerRef.current = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= rec.duration) {
            setIsPlaying(false);
            clearInterval(playTimerRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleDelete = (id) => {
    if (activePlayId === id) {
      setIsPlaying(false);
      setActivePlayId(null);
    }
    setRecordings(recordings.filter((r) => r.id !== id));
  };

  const formatSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (!wnapp || wnapp.hide) return null;

  return (
    <div
      className="voiceRecApp floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id="voiceApp"
    >
      <ToolBar
        app={wnapp.action || "VOICE"}
        icon="voice"
        size={wnapp.size}
        name="Voice Recorder"
      />
      <div className="windowScreen flex">
        {/* Left Recordings List */}
        <div className="recordingsList w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 flex flex-col overflow-y-auto">
          <h4 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Recordings ({recordings.length})</h4>
          {recordings.map((rec) => (
            <div
              key={rec.id}
              className={`recItem p-3 rounded-lg my-1 flex justify-between items-center handcr transition ${activePlayId === rec.id ? "bg-blue-100 dark:bg-blue-900 border border-blue-400" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              onClick={() => handlePlayToggle(rec)}
            >
              <div>
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-100">{rec.name}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{rec.date} • {formatSec(rec.duration)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayToggle(rec);
                  }}
                >
                  <Icon fafa={activePlayId === rec.id && isPlaying ? "faPause" : "faPlay"} width={10} />
                </button>
                <button
                  className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(rec.id);
                  }}
                >
                  <Icon fafa="faTrash" width={10} />
                </button>
              </div>
            </div>
          ))}
          {recordings.length === 0 && (
            <div className="text-xs text-gray-400 text-center mt-12">No recordings yet.</div>
          )}
        </div>

        {/* Right Main Studio / Player */}
        <div className="recMain flex-grow flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900">
          {/* Animated Waveform Visualizer */}
          <div className="waveformCont flex items-center justify-center gap-1.5 h-32 w-full max-w-md my-6">
            {[20, 45, 75, 30, 90, 60, 35, 80, 50, 100, 70, 40, 85, 25, 65, 45].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
                style={{
                  height: isRecording
                    ? `${Math.max(12, Math.floor(Math.random() * 90) + 10)}%`
                    : isPlaying
                    ? `${Math.max(12, h * (Math.sin(playProgress + i) * 0.5 + 0.5))}%`
                    : "8%",
                  opacity: isRecording || isPlaying ? 1 : 0.25,
                }}
              />
            ))}
          </div>

          {/* Time Counter */}
          <div className="text-4xl font-light font-mono text-gray-800 dark:text-gray-100 my-2">
            {formatSec(isRecording ? recordTime : playProgress)}
          </div>

          {/* Big Record Button */}
          <div className="recordBtnWrap mt-6">
            <button
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isRecording ? "bg-red-500 hover:bg-red-600 scale-110 animate-pulse ring-4 ring-red-300" : "bg-blue-500 hover:bg-blue-600 hover:scale-105"}`}
              onClick={handleToggleRecord}
              title={isRecording ? "Stop Recording" : "Start Recording"}
            >
              <Icon fafa={isRecording ? "faSquare" : "faMicrophone"} width={28} className="text-white" />
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            {isRecording ? "Recording in progress... Click to stop." : "Click microphone to record audio"}
          </div>
        </div>
      </div>
    </div>
  );
};
