import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import "./assets/clock.scss";

export const ClockApp = () => {
  const wnapp = useSelector((state) => state.apps.alarm || state.apps.clock || { size: "cstm", hide: true, z: 0 });
  const [tab, setTab] = useState("stopwatch"); // stopwatch | timer | alarm | world
  const dispatch = useDispatch();

  // Stopwatch state
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const swTimerRef = useRef(null);

  useEffect(() => {
    if (swRunning) {
      swTimerRef.current = setInterval(() => {
        setSwTime((t) => t + 10);
      }, 10);
    } else {
      clearInterval(swTimerRef.current);
    }
    return () => clearInterval(swTimerRef.current);
  }, [swRunning]);

  const formatSwTime = (ms) => {
    var totalSec = Math.floor(ms / 1000);
    var hrs = Math.floor(totalSec / 3600);
    var mins = Math.floor((totalSec % 3600) / 60);
    var secs = totalSec % 60;
    var centis = Math.floor((ms % 1000) / 10);

    var pad = (n) => String(n).padStart(2, "0");
    if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${pad(centis)}`;
    return `${pad(mins)}:${pad(secs)}.${pad(centis)}`;
  };

  const handleSwLap = () => {
    setLaps([
      {
        id: laps.length + 1,
        time: swTime,
        split: laps.length === 0 ? swTime : swTime - laps[laps.length - 1].time,
      },
      ...laps,
    ]);
  };

  const handleSwReset = () => {
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
  };

  // Timer state
  const [timerInitial, setTimerInitial] = useState(300); // 5 mins in seconds
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerHours, setTimerHours] = useState(0);
  const [timerMins, setTimerMins] = useState(5);
  const [timerSecs, setTimerSecs] = useState(0);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerRunning, timerRemaining]);

  const handleSetTimer = (h, m, s) => {
    var total = h * 3600 + m * 60 + s;
    if (total > 0) {
      setTimerHours(h);
      setTimerMins(m);
      setTimerSecs(s);
      setTimerInitial(total);
      setTimerRemaining(total);
      setTimerRunning(false);
    }
  };

  const formatTimer = (sec) => {
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    var pad = (n) => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  // World Clock
  const worldCities = [
    { city: "Dhaka", timezone: "Asia/Dhaka", offset: "UTC+6" },
    { city: "New York", timezone: "America/New_York", offset: "UTC-4" },
    { city: "London", timezone: "Europe/London", offset: "UTC+1" },
    { city: "Tokyo", timezone: "Asia/Tokyo", offset: "UTC+9" },
    { city: "Paris", timezone: "Europe/Paris", offset: "UTC+2" },
    { city: "Dubai", timezone: "Asia/Dubai", offset: "UTC+4" },
  ];

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    var timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Alarms
  const [alarms, setAlarms] = useState([
    { id: 1, time: "07:00", label: "Morning Alarm", enabled: true, days: "Weekdays" },
    { id: 2, time: "08:30", label: "Work Briefing", enabled: false, days: "Mon, Wed, Fri" },
    { id: 3, time: "22:00", label: "Bedtime", enabled: true, days: "Every day" },
  ]);

  const toggleAlarm = (id) => {
    setAlarms(alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  if (!wnapp || wnapp.hide) return null;

  return (
    <div
      className="clockApp floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id="alarmApp"
    >
      <ToolBar
        app={wnapp.action || "CLOCK"}
        icon="alarm"
        size={wnapp.size}
        name="Clock"
      />
      <div className="windowScreen flex">
        {/* Navigation Sidebar */}
        <div className="clockNav flex flex-col p-3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 w-44">
          <div
            className={`navItem flex items-center p-2.5 rounded-lg my-1 handcr text-xs font-medium ${tab === "stopwatch" ? "active" : ""}`}
            onClick={() => setTab("stopwatch")}
          >
            <Icon fafa="faStopwatch" width={16} className="mr-3" />
            <span>Stopwatch</span>
          </div>
          <div
            className={`navItem flex items-center p-2.5 rounded-lg my-1 handcr text-xs font-medium ${tab === "timer" ? "active" : ""}`}
            onClick={() => setTab("timer")}
          >
            <Icon fafa="faHourglassHalf" width={16} className="mr-3" />
            <span>Timer</span>
          </div>
          <div
            className={`navItem flex items-center p-2.5 rounded-lg my-1 handcr text-xs font-medium ${tab === "alarm" ? "active" : ""}`}
            onClick={() => setTab("alarm")}
          >
            <Icon fafa="faBell" width={16} className="mr-3" />
            <span>Alarm</span>
          </div>
          <div
            className={`navItem flex items-center p-2.5 rounded-lg my-1 handcr text-xs font-medium ${tab === "world" ? "active" : ""}`}
            onClick={() => setTab("world")}
          >
            <Icon fafa="faGlobe" width={16} className="mr-3" />
            <span>World Clock</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="clockContent flex-grow p-6 overflow-y-auto bg-white dark:bg-gray-900">
          {/* Stopwatch View */}
          {tab === "stopwatch" && (
            <div className="stopwatchView flex flex-col items-center justify-center h-full">
              <div className="timeDisplay text-6xl font-light tracking-wider my-6 text-gray-800 dark:text-gray-100 font-mono">
                {formatSwTime(swTime)}
              </div>
              <div className="swControls flex items-center gap-4 my-4">
                <button
                  className={`px-8 py-3 rounded-full text-white font-medium shadow-md transition ${swRunning ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                  onClick={() => setSwRunning(!swRunning)}
                >
                  {swRunning ? "Pause" : "Start"}
                </button>
                {swRunning && (
                  <button
                    className="px-6 py-3 rounded-full border border-gray-400 dark:border-gray-600 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleSwLap}
                  >
                    Lap
                  </button>
                )}
                {!swRunning && swTime > 0 && (
                  <button
                    className="px-6 py-3 rounded-full border border-gray-400 dark:border-gray-600 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleSwReset}
                  >
                    Reset
                  </button>
                )}
              </div>

              {laps.length > 0 && (
                <div className="lapsTable w-full max-w-md mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 max-h-48 overflow-y-auto">
                  <div className="flex justify-between text-xs text-gray-500 font-semibold mb-2 px-3">
                    <span>Lap</span>
                    <span>Split Time</span>
                    <span>Total Time</span>
                  </div>
                  {laps.map((lap) => (
                    <div key={lap.id} className="flex justify-between text-xs py-2 px-3 border-b border-gray-100 dark:border-gray-800 font-mono">
                      <span>#{lap.id}</span>
                      <span className="text-blue-500">{formatSwTime(lap.split)}</span>
                      <span>{formatSwTime(lap.time)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timer View */}
          {tab === "timer" && (
            <div className="timerView flex flex-col items-center justify-center h-full">
              <div className="relative flex items-center justify-center my-6">
                <svg className="w-56 h-56 transform -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="98"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-200 dark:text-gray-700 fill-none"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r="98"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={615}
                    strokeDashoffset={615 * (1 - timerRemaining / (timerInitial || 1))}
                    className="text-blue-500 fill-none transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute text-4xl font-light font-mono text-gray-800 dark:text-gray-100">
                  {formatTimer(timerRemaining)}
                </div>
              </div>

              <div className="timerControls flex items-center gap-4 my-2">
                <button
                  className={`px-8 py-2.5 rounded-full text-white font-medium shadow-md ${timerRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"}`}
                  onClick={() => setTimerRunning(!timerRunning)}
                >
                  {timerRunning ? "Pause" : "Start"}
                </button>
                <button
                  className="px-6 py-2.5 rounded-full border border-gray-400 dark:border-gray-600 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerRemaining(timerInitial);
                  }}
                >
                  Reset
                </button>
              </div>

              {/* Quick Presets */}
              <div className="presets flex flex-wrap gap-2 mt-6">
                {[
                  { label: "1 min", h: 0, m: 1, s: 0 },
                  { label: "3 min", h: 0, m: 3, s: 0 },
                  { label: "5 min", h: 0, m: 5, s: 0 },
                  { label: "10 min", h: 0, m: 10, s: 0 },
                  { label: "15 min", h: 0, m: 15, s: 0 },
                  { label: "30 min", h: 0, m: 30, s: 0 },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 hover:border-blue-500"
                    onClick={() => handleSetTimer(p.h, p.m, p.s)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Alarm View */}
          {tab === "alarm" && (
            <div className="alarmView max-w-lg mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Alarms</h3>
              </div>
              <div className="alarmList flex flex-col gap-3">
                {alarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    className="alarmCard flex justify-between items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm"
                  >
                    <div>
                      <div className="text-3xl font-light font-mono">{alarm.time}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {alarm.label} • {alarm.days}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alarm.enabled}
                        onChange={() => toggleAlarm(alarm.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* World Clock View */}
          {tab === "world" && (
            <div className="worldClockView max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">World Clock</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {worldCities.map((c, i) => {
                  var cityTime = new Intl.DateTimeFormat("en-US", {
                    timeZone: c.timezone,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  }).format(currentTime);

                  var cityDate = new Intl.DateTimeFormat("en-US", {
                    timeZone: c.timezone,
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }).format(currentTime);

                  return (
                    <div
                      key={i}
                      className="cityCard p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-lg font-semibold">{c.city}</div>
                          <div className="text-xs text-gray-400">{c.offset}</div>
                        </div>
                        <div className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {cityDate}
                        </div>
                      </div>
                      <div className="text-2xl font-light font-mono mt-3 text-blue-600 dark:text-blue-400">
                        {cityTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
