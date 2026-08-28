import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import "./assets/weather.scss";

export const WeatherApp = () => {
  const wnapp = useSelector((state) => state.apps.weather || { size: "cstm", hide: true, z: 0 });
  const [selectedCity, setSelectedCity] = useState("Dhaka");
  const [unit, setUnit] = useState("C"); // C | F
  const [searchVal, setSearchVal] = useState("");

  const weatherData = {
    Dhaka: {
      tempC: 31,
      condition: "Partly Cloudy",
      highC: 34,
      lowC: 27,
      feelsLikeC: 36,
      humidity: "78%",
      wind: "12 km/h SSE",
      uv: "7 (High)",
      visibility: "8.5 km",
      pressure: "1008 hPa",
      aqi: "112 (Moderate)",
      hourly: [
        { time: "Now", temp: 31, icon: "faCloudSun" },
        { time: "1 PM", temp: 33, icon: "faSun" },
        { time: "3 PM", temp: 34, icon: "faSun" },
        { time: "5 PM", temp: 32, icon: "faCloudSun" },
        { time: "7 PM", temp: 29, icon: "faCloudMoon" },
        { time: "9 PM", temp: 28, icon: "faMoon" },
        { time: "11 PM", temp: 27, icon: "faMoon" },
      ],
      daily: [
        { day: "Today", cond: "Partly Cloudy", icon: "faCloudSun", high: 34, low: 27 },
        { day: "Sat", cond: "Thunderstorm", icon: "faBolt", high: 31, low: 26 },
        { day: "Sun", cond: "Scattered Showers", icon: "faCloudShowersHeavy", high: 30, low: 25 },
        { day: "Mon", cond: "Rain", icon: "faCloudRain", high: 29, low: 25 },
        { day: "Tue", cond: "Sunny", icon: "faSun", high: 33, low: 26 },
        { day: "Wed", cond: "Mostly Sunny", icon: "faCloudSun", high: 34, low: 27 },
        { day: "Thu", cond: "Partly Cloudy", icon: "faCloudSun", high: 33, low: 26 },
      ],
    },
    "New York": {
      tempC: 22,
      condition: "Sunny",
      highC: 25,
      lowC: 17,
      feelsLikeC: 22,
      humidity: "55%",
      wind: "15 km/h NW",
      uv: "5 (Moderate)",
      visibility: "10 km",
      pressure: "1016 hPa",
      aqi: "35 (Good)",
      hourly: [
        { time: "Now", temp: 22, icon: "faSun" },
        { time: "1 PM", temp: 24, icon: "faSun" },
        { time: "3 PM", temp: 25, icon: "faSun" },
        { time: "5 PM", temp: 23, icon: "faCloudSun" },
        { time: "7 PM", temp: 20, icon: "faCloudMoon" },
        { time: "9 PM", temp: 18, icon: "faMoon" },
        { time: "11 PM", temp: 17, icon: "faMoon" },
      ],
      daily: [
        { day: "Today", cond: "Sunny", icon: "faSun", high: 25, low: 17 },
        { day: "Sat", cond: "Mostly Sunny", icon: "faCloudSun", high: 26, low: 18 },
        { day: "Sun", cond: "Partly Cloudy", icon: "faCloudSun", high: 24, low: 16 },
        { day: "Mon", cond: "Showers", icon: "faCloudRain", high: 21, low: 15 },
        { day: "Tue", cond: "Clear", icon: "faSun", high: 23, low: 16 },
        { day: "Wed", cond: "Sunny", icon: "faSun", high: 25, low: 17 },
        { day: "Thu", cond: "Sunny", icon: "faSun", high: 27, low: 19 },
      ],
    },
    London: {
      tempC: 18,
      condition: "Light Rain",
      highC: 20,
      lowC: 13,
      feelsLikeC: 18,
      humidity: "82%",
      wind: "19 km/h SW",
      uv: "3 (Low)",
      visibility: "7 km",
      pressure: "1011 hPa",
      aqi: "28 (Good)",
      hourly: [
        { time: "Now", temp: 18, icon: "faCloudRain" },
        { time: "1 PM", temp: 19, icon: "faCloudRain" },
        { time: "3 PM", temp: 20, icon: "faCloudShowersHeavy" },
        { time: "5 PM", temp: 18, icon: "faCloud" },
        { time: "7 PM", temp: 16, icon: "faCloudMoon" },
        { time: "9 PM", temp: 14, icon: "faMoon" },
        { time: "11 PM", temp: 13, icon: "faMoon" },
      ],
      daily: [
        { day: "Today", cond: "Light Rain", icon: "faCloudRain", high: 20, low: 13 },
        { day: "Sat", cond: "Cloudy", icon: "faCloud", high: 19, low: 12 },
        { day: "Sun", cond: "Partly Cloudy", icon: "faCloudSun", high: 21, low: 14 },
        { day: "Mon", cond: "Sunny", icon: "faSun", high: 22, low: 14 },
        { day: "Tue", cond: "Mostly Sunny", icon: "faCloudSun", high: 23, low: 15 },
        { day: "Wed", cond: "Showers", icon: "faCloudRain", high: 19, low: 13 },
        { day: "Thu", cond: "Rain", icon: "faCloudRain", high: 18, low: 12 },
      ],
    },
    Tokyo: {
      tempC: 26,
      condition: "Clear",
      highC: 28,
      lowC: 21,
      feelsLikeC: 27,
      humidity: "65%",
      wind: "10 km/h NE",
      uv: "6 (Moderate)",
      visibility: "10 km",
      pressure: "1014 hPa",
      aqi: "22 (Good)",
      hourly: [
        { time: "Now", temp: 26, icon: "faSun" },
        { time: "1 PM", temp: 28, icon: "faSun" },
        { time: "3 PM", temp: 28, icon: "faSun" },
        { time: "5 PM", temp: 25, icon: "faCloudSun" },
        { time: "7 PM", temp: 23, icon: "faMoon" },
        { time: "9 PM", temp: 22, icon: "faMoon" },
        { time: "11 PM", temp: 21, icon: "faMoon" },
      ],
      daily: [
        { day: "Today", cond: "Clear", icon: "faSun", high: 28, low: 21 },
        { day: "Sat", cond: "Sunny", icon: "faSun", high: 29, low: 22 },
        { day: "Sun", cond: "Partly Cloudy", icon: "faCloudSun", high: 27, low: 20 },
        { day: "Mon", cond: "Rain", icon: "faCloudRain", high: 24, low: 19 },
        { day: "Tue", cond: "Thunderstorm", icon: "faBolt", high: 25, low: 20 },
        { day: "Wed", cond: "Clear", icon: "faSun", high: 28, low: 21 },
        { day: "Thu", cond: "Sunny", icon: "faSun", high: 29, low: 22 },
      ],
    },
  };

  const currentData = weatherData[selectedCity] || weatherData["Dhaka"];

  const toF = (c) => Math.round((c * 9) / 5 + 32);
  const displayTemp = (c) => (unit === "C" ? `${c}°C` : `${toF(c)}°F`);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchVal.trim()) {
      const match = Object.keys(weatherData).find(
        (c) => c.toLowerCase() === searchVal.trim().toLowerCase(),
      );
      if (match) {
        setSelectedCity(match);
      } else {
        setSelectedCity(searchVal.trim());
      }
      setSearchVal("");
    }
  };

  if (!wnapp || wnapp.hide) return null;

  return (
    <div
      className="weatherApp floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id="weatherApp"
    >
      <ToolBar
        app={wnapp.action || "WEATHER"}
        icon="weather"
        size={wnapp.size}
        name="Weather"
      />
      <div className="windowScreen flex flex-col overflow-y-auto win11Scroll p-6 bg-gradient-to-b from-blue-600 via-blue-500 to-indigo-700 text-white">
        {/* Top Header & Search Bar */}
        <div className="weatherHeader flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {Object.keys(weatherData).map((city) => (
              <button
                key={city}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${selectedCity === city ? "bg-white text-blue-700 shadow-md font-semibold" : "bg-white/20 hover:bg-white/30 text-white"}`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="searchWrap relative flex items-center">
              <Icon fafa="faSearch" width={12} className="absolute left-3 text-white/70" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearch}
                className="pl-8 pr-3 py-1 text-xs rounded-full bg-white/20 border border-white/30 text-white placeholder-white/60 outline-none focus:bg-white/30 w-40"
              />
            </div>
            <div className="unitToggle flex bg-white/20 rounded-full p-0.5 border border-white/30 text-xs">
              <button
                className={`px-2 py-0.5 rounded-full ${unit === "C" ? "bg-white text-blue-700 font-bold" : "text-white"}`}
                onClick={() => setUnit("C")}
              >
                °C
              </button>
              <button
                className={`px-2 py-0.5 rounded-full ${unit === "F" ? "bg-white text-blue-700 font-bold" : "text-white"}`}
                onClick={() => setUnit("F")}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* Current Weather Overview Card */}
        <div className="overviewCard p-6 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">{selectedCity}</h2>
            <div className="text-sm opacity-80 mt-0.5">{currentData.condition}</div>
            <div className="text-6xl font-light mt-3 tracking-tight">
              {displayTemp(currentData.tempC)}
            </div>
            <div className="text-xs opacity-80 mt-2">
              High: {displayTemp(currentData.highC)} • Low: {displayTemp(currentData.lowC)} • Feels like: {displayTemp(currentData.feelsLikeC)}
            </div>
          </div>
          <div className="weatherIcon text-7xl opacity-90 pr-4">
            <Icon
              fafa={
                currentData.condition.includes("Rain")
                  ? "faCloudRain"
                  : currentData.condition.includes("Thunder")
                  ? "faBolt"
                  : currentData.condition.includes("Sun")
                  ? "faSun"
                  : "faCloudSun"
              }
              width={72}
            />
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="hourlyCard p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-3 px-2">Hourly Forecast</div>
          <div className="flex justify-between items-center overflow-x-auto gap-4 px-2">
            {currentData.hourly.map((h, i) => (
              <div key={i} className="flex flex-col items-center min-w-[50px] py-1">
                <span className="text-xs opacity-80">{h.time}</span>
                <Icon fafa={h.icon} width={20} className="my-2 text-yellow-300" />
                <span className="text-xs font-semibold">{displayTemp(h.temp)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Forecast & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 7-Day Forecast */}
          <div className="dailyCard p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-3 px-2">7-Day Forecast</div>
            <div className="flex flex-col gap-2">
              {currentData.daily.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-1 px-2 border-b border-white/10 text-xs">
                  <span className="w-16 font-medium">{d.day}</span>
                  <div className="flex items-center gap-2 flex-grow justify-center">
                    <Icon fafa={d.icon} width={14} className="text-yellow-300" />
                    <span className="opacity-80 text-[11px] truncate max-w-[100px]">{d.cond}</span>
                  </div>
                  <div className="flex items-center gap-2 w-20 justify-end font-mono">
                    <span className="opacity-70">{displayTemp(d.low)}</span>
                    <span className="font-semibold">{displayTemp(d.high)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Weather Metrics */}
          <div className="metricsGrid grid grid-cols-2 gap-3">
            <div className="metricCard p-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs opacity-75">
                <Icon fafa="faTint" width={12} />
                <span>Humidity</span>
              </div>
              <div className="text-xl font-bold mt-2">{currentData.humidity}</div>
            </div>
            <div className="metricCard p-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs opacity-75">
                <Icon fafa="faWind" width={12} />
                <span>Wind</span>
              </div>
              <div className="text-base font-bold mt-2">{currentData.wind}</div>
            </div>
            <div className="metricCard p-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs opacity-75">
                <Icon fafa="faSun" width={12} />
                <span>UV Index</span>
              </div>
              <div className="text-lg font-bold mt-2">{currentData.uv}</div>
            </div>
            <div className="metricCard p-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs opacity-75">
                <Icon fafa="faEye" width={12} />
                <span>Visibility</span>
              </div>
              <div className="text-xl font-bold mt-2">{currentData.visibility}</div>
            </div>
            <div className="metricCard p-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs opacity-75">
                <Icon fafa="faCompass" width={12} />
                <span>Pressure</span>
              </div>
              <div className="text-lg font-bold mt-2">{currentData.pressure}</div>
            </div>
            <div className="metricCard p-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs opacity-75">
                <Icon fafa="faLeaf" width={12} />
                <span>Air Quality</span>
              </div>
              <div className="text-base font-bold mt-2">{currentData.aqi}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
