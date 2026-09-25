import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../../../actions";
import { Image, ToolBar } from "../../../utils/general";
import LangSwitch from "./assets/Langswitch";
import "./assets/settings.scss";
import data from "./assets/settingsData.json";

export const Settings = () => {
  const wnapp = useSelector((state) => state.apps.settings);
  const theme = useSelector((state) => state.setting.person.theme);
  const dispatch = useDispatch();

  const wall = useSelector((state) => state.wallpaper);

  const [page, setPage] = useState("System"); // default System
  const [subPage, setSubPage] = useState(null);
  const [nav, setNav] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState(false);
  const [upmodalOpen, setUpmodalOpen] = useState(false);

  // Interactive controls state
  const [brightness, setBrightness] = useState(85);
  const [nightLight, setNightLight] = useState(false);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [notifMaster, setNotifMaster] = useState(true);
  const [dndMaster, setDndMaster] = useState(false);
  const [batterySaver, setBatterySaver] = useState(false);
  const [powerMode, setPowerMode] = useState("Balanced");
  const [storageSense, setStorageSense] = useState(true);
  const [snapWindows, setSnapWindows] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [wifiOn, setWifiOn] = useState(true);
  const [gameModeOn, setGameModeOn] = useState(true);
  const [transparencyOn, setTransparencyOn] = useState(true);
  const [textSize, setTextSize] = useState(100);
  const [selectedColor, setSelectedColor] = useState("#0078d7");
  const [appSearch, setAppSearch] = useState("");
  const [timeAuto, setTimeAuto] = useState(true);
  const [timeZone, setTimeZone] = useState("UTC+06:00 Dhaka");
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());

  const [appNotifs, setAppNotifs] = useState({
    Chrome: true,
    Store: true,
    Explorer: true,
    Weather: true,
    Clock: true,
    Settings: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const themechecker = {
    default: "light",
    dark: "dark",
    ThemeA: "dark",
    ThemeB: "dark",
    ThemeD: "light",
    ThemeC: "light",
  };

  const handleWallAndTheme = (e) => {
    var payload = e.target.dataset.payload;
    var theme_nxt = themechecker[payload.split("/")[0]],
      src = payload;

    if (theme_nxt != theme) {
      changeTheme();
    }

    dispatch({
      type: "WALLSET",
      payload: src,
    });
  };

  const userName = useSelector((state) => state.setting.person.name);

  const colorsList = [
    "#0078d7",
    "#008272",
    "#107c10",
    "#744da9",
    "#e3008c",
    "#d13438",
    "#ff8c00",
    "#ffb900",
    "#038387",
    "#498205",
    "#595959",
    "#1b2735",
  ];

  const installedAppsList = [
    { name: "Google Chrome", version: "127.0.6533.120", size: "142 MB", icon: "img/icon/chrome.png" },
    { name: "Microsoft Edge", version: "126.0.2592.113", size: "118 MB", icon: "img/icon/edge.png" },
    { name: "Microsoft Store", version: "22405.1401.3.0", size: "64 MB", icon: "img/icon/store.png" },
    { name: "File Explorer", version: "11.0.22631.3880", size: "52 MB", icon: "img/icon/explorer.png" },
    { name: "Clock & Alarms", version: "11.2401.12.0", size: "38 MB", icon: "img/icon/alarm.png" },
    { name: "Paint", version: "11.2311.30.0", size: "45 MB", icon: "img/icon/paint.png" },
    { name: "Voice Recorder", version: "10.2103.28.0", size: "28 MB", icon: "img/icon/voice.png" },
    { name: "Weather", version: "5.0.2402.1", size: "32 MB", icon: "img/icon/weather.png" },
    { name: "Terminal & PowerShell", version: "1.19.10573.0", size: "76 MB", icon: "img/icon/terminal.png" },
    { name: "Calculator", version: "11.2210.0.0", size: "24 MB", icon: "img/icon/calculator.png" },
    { name: "Camera", version: "2024.2401.6.0", size: "18 MB", icon: "img/icon/camera.png" },
    { name: "Spotify", version: "1.2.39.460", size: "185 MB", icon: "img/icon/spotify.png" },
    { name: "Minecraft Classic", version: "0.0.23a Web", size: "42 MB", icon: "img/icon/minecraft.png" },
  ];

  const renderSubPageContent = (item) => {
    const name = (item.name || "").toLowerCase();

    // 1. DISPLAY
    if (name === "display") {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Brightness</div>
                  <div className="desc">Adjust the brightness of your built-in display</div>
                </div>
              </div>
              <div className="headerRight">
                <div className="win11Slider">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(e.target.value)}
                  />
                  <span className="sliderVal">{brightness}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Night light</div>
                  <div className="desc">Use warmer colors to help you sleep</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={nightLight}
                    onChange={() => setNightLight(!nightLight)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Scale & layout</div>
                  <div className="desc">Change the size of text, apps, and other items</div>
                </div>
              </div>
              <div className="headerRight">
                <select className="win11Select" defaultValue="100%">
                  <option value="100%">100% (Recommended)</option>
                  <option value="125%">125%</option>
                  <option value="150%">150%</option>
                  <option value="175%">175%</option>
                </select>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Display resolution</div>
                  <div className="desc">Adjust resolution for clarity and screen size</div>
                </div>
              </div>
              <div className="headerRight">
                <select className="win11Select" defaultValue="1920 x 1080">
                  <option value="1920 x 1080">1920 x 1080 (Recommended)</option>
                  <option value="2560 x 1440">2560 x 1440 (2K)</option>
                  <option value="3840 x 2160">3840 x 2160 (4K)</option>
                  <option value="1366 x 768">1366 x 768</option>
                </select>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Display orientation</div>
                  <div className="desc">Choose how the screen is oriented</div>
                </div>
              </div>
              <div className="headerRight">
                <select className="win11Select" defaultValue="Landscape">
                  <option value="Landscape">Landscape</option>
                  <option value="Portrait">Portrait</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. SOUND
    if (name === "sound") {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Output device</div>
                  <div className="desc">Choose where to play sound</div>
                </div>
              </div>
              <div className="headerRight">
                <select className="win11Select" defaultValue="speakers">
                  <option value="speakers">Speakers (Realtek(R) Audio)</option>
                  <option value="headphones">Headphones (High Definition Audio)</option>
                  <option value="bluetooth">Bluetooth Wireless Audio</option>
                </select>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Master Volume</div>
                  <div className="desc">{muted ? "Muted" : `${volume}%`}</div>
                </div>
              </div>
              <div className="headerRight">
                <button
                  className="win11Btn mr-2"
                  onClick={() => setMuted(!muted)}
                >
                  {muted ? "Unmute" : "Mute"}
                </button>
                <div className="win11Slider">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={muted ? 0 : volume}
                    disabled={muted}
                    onChange={(e) => setVolume(e.target.value)}
                  />
                  <span className="sliderVal">{muted ? "0%" : `${volume}%`}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Input device (Microphone)</div>
                  <div className="desc">Choose a device for speaking or recording</div>
                </div>
              </div>
              <div className="headerRight">
                <select className="win11Select" defaultValue="mic">
                  <option value="mic">Microphone Array (Realtek Audio)</option>
                  <option value="headset">Headset Microphone</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. NOTIFICATIONS
    if (name === "notifications") {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Notifications</div>
                  <div className="desc">Get notifications from apps and other senders</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={notifMaster}
                    onChange={() => setNotifMaster(!notifMaster)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Do not disturb</div>
                  <div className="desc">Send notifications directly to notification center</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={dndMaster}
                    onChange={() => setDndMaster(!dndMaster)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-base mt-6 mb-3">Notifications from apps</h3>
          {Object.keys(appNotifs).map((app) => (
            <div key={app} className="subPageCard">
              <div className="cardHeader">
                <div className="headerLeft">
                  <div className="title">{app}</div>
                  <div className="desc">Banners, Sounds</div>
                </div>
                <div className="headerRight">
                  <label className="win11Switch">
                    <input
                      type="checkbox"
                      checked={appNotifs[app] && notifMaster}
                      disabled={!notifMaster}
                      onChange={() =>
                        setAppNotifs({ ...appNotifs, [app]: !appNotifs[app] })
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 4. POWER & BATTERY
    if (name.includes("power") || name.includes("battery")) {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon text-green-500"></span>
                <div>
                  <div className="title text-lg font-semibold">98% — Fully Charged</div>
                  <div className="desc">Battery health: Good • Connected to AC Power</div>
                </div>
              </div>
              <div className="headerRight">
                <span className="bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold">
                  Plugged In
                </span>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Screen and sleep</div>
                  <div className="desc">Manage screen turn-off times to save power</div>
                </div>
              </div>
              <div className="headerRight">
                <select className="win11Select" defaultValue="10">
                  <option value="5">Turn off screen after 5 minutes</option>
                  <option value="10">Turn off screen after 10 minutes</option>
                  <option value="15">Turn off screen after 15 minutes</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Power mode</div>
                  <div className="desc">Optimize your device for performance or battery life</div>
                </div>
              </div>
              <div className="headerRight">
                <select
                  className="win11Select"
                  value={powerMode}
                  onChange={(e) => setPowerMode(e.target.value)}
                >
                  <option value="Best efficiency">Best power efficiency</option>
                  <option value="Balanced">Balanced (Recommended)</option>
                  <option value="Best performance">Best performance</option>
                </select>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Battery saver</div>
                  <div className="desc">Lower background activity and display brightness</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={batterySaver}
                    onChange={() => setBatterySaver(!batterySaver)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 5. STORAGE
    if (name === "storage") {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title text-base font-semibold">Local Disk (C:)</div>
                  <div className="desc">184 GB used • 328 GB free • 512 GB total capacity</div>
                </div>
              </div>
            </div>
            <div className="storageProgressBar">
              <div className="barUsed" style={{ width: "36%" }}></div>
              <div className="barTemp" style={{ width: "4%" }}></div>
              <div className="barOther" style={{ width: "10%" }}></div>
            </div>
          </div>

          <h3 className="font-semibold text-base mt-6 mb-3">Storage breakdown</h3>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Installed apps</div>
                  <div className="desc">Apps, games, and system tools</div>
                </div>
              </div>
              <div className="headerRight font-medium">72.4 GB</div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Documents & Media</div>
                  <div className="desc">Pictures, Videos, Music, Downloads</div>
                </div>
              </div>
              <div className="headerRight font-medium">28.8 GB</div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Temporary files</div>
                  <div className="desc">Cache, crash dumps, and update files</div>
                </div>
              </div>
              <div className="headerRight font-medium">14.2 GB</div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Storage Sense</div>
                  <div className="desc">Automatically free up space by deleting temporary files</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={storageSense}
                    onChange={() => setStorageSense(!storageSense)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 6. MULTI-TASKING
    if (name.includes("multi-tasking") || name.includes("multitask")) {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Snap windows</div>
                  <div className="desc">Automatically resize and arrange windows on your screen</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={snapWindows}
                    onChange={() => setSnapWindows(!snapWindows)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Alt + Tab window switcher</div>
                  <div className="desc">Show open windows and recent tabs when pressing Alt + Tab</div>
                </div>
              </div>
              <div className="headerRight">
                <select className="win11Select" defaultValue="5">
                  <option value="5">Open windows and 5 most recent tabs</option>
                  <option value="3">Open windows and 3 most recent tabs</option>
                  <option value="windows">Open windows only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Title bar window shake</div>
                  <div className="desc">When you grab a window's title bar and shake it, minimize all others</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 7. ABOUT
    if (name === "about") {
      return (
        <div>
          <div className="subPageCard">
            <h3 className="font-semibold text-base mb-2">Device specifications</h3>
            <div className="specGrid">
              <span className="specLabel">Device name</span>
              <span className="specValue">ARAFATH-PC</span>
              <span className="specLabel">Processor</span>
              <span className="specValue">13th Gen Intel(R) Core(TM) i7-13700H @ 2.40 GHz</span>
              <span className="specLabel">Installed RAM</span>
              <span className="specValue">16.0 GB (15.8 GB usable)</span>
              <span className="specLabel">Device ID</span>
              <span className="specValue">8E3F291A-B4C8-4221-93F1-6E941BD78A12</span>
              <span className="specLabel">Product ID</span>
              <span className="specValue">00330-80000-00000-AAOEM</span>
              <span className="specLabel">System type</span>
              <span className="specValue">64-bit operating system, x64-based processor</span>
              <span className="specLabel">Pen and touch</span>
              <span className="specValue">Touch support with 10 touch points</span>
            </div>
            <button className="win11Btn mt-2">Rename this PC</button>
          </div>

          <div className="subPageCard mt-4">
            <h3 className="font-semibold text-base mb-2">Windows specifications</h3>
            <div className="specGrid">
              <span className="specLabel">Edition</span>
              <span className="specValue">Windows 11 Web OS Pro</span>
              <span className="specLabel">Version</span>
              <span className="specValue">24H2</span>
              <span className="specLabel">Installed on</span>
              <span className="specValue">8/28/2026</span>
              <span className="specLabel">OS build</span>
              <span className="specValue">22631.3880</span>
              <span className="specLabel">Experience</span>
              <span className="specValue">Windows Feature Experience Pack 1000.22631.1000.0</span>
              <span className="specLabel">Developer</span>
              <span className="specValue font-semibold text-blue-500">Arafath Rahman</span>
              <span className="specLabel">GitHub Repository</span>
              <span className="specValue">
                <a
                  href="https://github.com/smartworldarafath/Windows-11-Web-OS"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  smartworldarafath/Windows-11-Web-OS
                </a>
              </span>
            </div>
          </div>
        </div>
      );
    }

    // 8. BLUETOOTH & DEVICES
    if (page === "Bluetooth & devices" || name.includes("bluetooth") || name.includes("device")) {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Bluetooth</div>
                  <div className="desc">Discoverable as "ARAFATH-PC"</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={bluetoothOn}
                    onChange={() => setBluetoothOn(!bluetoothOn)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <button className="win11Btn primary mb-4 mt-2 flex items-center gap-2">
            <span>+</span> Add device
          </button>

          <h3 className="font-semibold text-base mb-3">Connected Devices</h3>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Logitech MX Master 3S</div>
                  <div className="desc">Connected • Battery 85%</div>
                </div>
              </div>
              <div className="headerRight">
                <button className="win11Btn">Disconnect</button>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Keychron K2 Mechanical Keyboard</div>
                  <div className="desc">Connected • Battery 92%</div>
                </div>
              </div>
              <div className="headerRight">
                <button className="win11Btn">Disconnect</button>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">AirPods Pro (Arafath)</div>
                  <div className="desc">Paired for Voice, Music</div>
                </div>
              </div>
              <div className="headerRight">
                <button className="win11Btn">Connect</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 9. NETWORK & INTERNET
    if (page === "Network & internet" || name.includes("wi-fi") || name.includes("network")) {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <img src="img/settings/wifi.png" alt="" width={32} height={32} />
                <div>
                  <div className="title font-semibold text-base">Wi-Fi</div>
                  <div className="desc">Connect, disconnect, manage known networks</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={wifiOn}
                    onChange={() => setWifiOn(!wifiOn)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          {wifiOn && (
            <>
              <h3 className="font-semibold text-base mt-4 mb-3">Connected Network</h3>
              <div className="subPageCard">
                <div className="cardHeader">
                  <div className="headerLeft">
                    <span className="icon text-green-500"></span>
                    <div>
                      <div className="title font-semibold">Arafath-5G</div>
                      <div className="desc">Connected, secured • 5 GHz • 866 Mbps</div>
                    </div>
                  </div>
                  <div className="headerRight">
                    <button className="win11Btn">Disconnect</button>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-base mt-4 mb-3">Available Networks</h3>
              <div className="subPageCard interactive">
                <div className="cardHeader">
                  <div className="headerLeft">
                    <span className="icon"></span>
                    <div>
                      <div className="title">Home-Fiber-HighSpeed</div>
                      <div className="desc">Secured (WPA3-Personal)</div>
                    </div>
                  </div>
                  <button className="win11Btn">Connect</button>
                </div>
              </div>

              <div className="subPageCard interactive">
                <div className="cardHeader">
                  <div className="headerLeft">
                    <span className="icon"></span>
                    <div>
                      <div className="title">Guest-Free-WiFi</div>
                      <div className="desc">Open</div>
                    </div>
                  </div>
                  <button className="win11Btn">Connect</button>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    // 10. PERSONALISATION / COLORS
    if (name.includes("color") || name.includes("theme")) {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Choose your mode</div>
                  <div className="desc">Select Light or Dark system theme</div>
                </div>
              </div>
              <div className="headerRight">
                <select
                  className="win11Select"
                  value={theme}
                  onChange={(e) => {
                    if (e.target.value !== theme) changeTheme();
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Transparency effects</div>
                  <div className="desc">Windows and surfaces appear translucent</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={transparencyOn}
                    onChange={() => setTransparencyOn(!transparencyOn)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="title font-medium mb-1">Accent color</div>
            <div className="desc text-xs opacity-75 mb-3">Choose a custom color for buttons, highlights, and borders</div>
            <div className="colorPickerGrid">
              {colorsList.map((c) => (
                <div
                  key={c}
                  className={`colorTile ${selectedColor === c ? "active" : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setSelectedColor(c)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 11. APPS / INSTALLED APPS
    if (name.includes("app") || page === "Apps") {
      const filtered = installedAppsList.filter((a) =>
        a.name.toLowerCase().includes(appSearch.toLowerCase()),
      );
      return (
        <div>
          <div className="mb-4">
            <input
              type="text"
              className="search w-full max-w-md p-2 rounded border bg-transparent"
              placeholder="Search apps..."
              value={appSearch}
              onChange={(e) => setAppSearch(e.target.value)}
              style={{
                border: "1px solid rgb(var(--txt_clr-rgb) / 15%)",
                background: "rgb(var(--txt_clr-rgb) / 3.5%)",
                padding: "8px 14px",
                color: "inherit",
              }}
            />
          </div>
          <div className="appsListContainer">
            {filtered.map((app) => (
              <div key={app.name} className="appItemCard">
                <div className="appItemLeft">
                  <img src={app.icon} alt="" />
                  <div>
                    <div className="appItemName">{app.name}</div>
                    <div className="appItemMeta">Version {app.version}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="appItemSize">{app.size}</span>
                  <button className="win11Btn text-xs">Modify</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 12. ACCOUNTS / YOUR INFO
    if (name.includes("account") || name.includes("info") || page === "Accounts") {
      return (
        <div>
          <div className="subPageCard flex items-center gap-6">
            <img
              src="img/asset/arafath.png"
              alt="Arafath Rahman"
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.3)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}
            />
            <div>
              <h2 className="text-xl font-bold">{userName}</h2>
              <p className="text-sm opacity-80">smartworld.bd.710@gmail.com</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-xs bg-blue-500 text-white font-medium">
                  Administrator
                </span>
                <span className="text-xs opacity-75">Local Account</span>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-base mt-6 mb-3">Account Settings</h3>
          <div className="subPageCard interactive">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Sign-in options</div>
                  <div className="desc">Windows Hello, PIN, Password, Security key</div>
                </div>
              </div>
              <span>›</span>
            </div>
          </div>

          <div className="subPageCard interactive">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Windows backup</div>
                  <div className="desc">Back up your apps, preferences, and credentials</div>
                </div>
              </div>
              <span>›</span>
            </div>
          </div>
        </div>
      );
    }

    // 13. TIME & LANGUAGE / DATE & TIME
    if (name.includes("time") || name.includes("date") || page === "Time & language") {
      return (
        <div>
          <div className="subPageCard text-center py-6">
            <div className="text-4xl font-light tracking-wide mb-1">{timeStr}</div>
            <div className="text-sm opacity-75">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Set time automatically</div>
                  <div className="desc">Synchronize clock with time.windows.com</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={timeAuto}
                    onChange={() => setTimeAuto(!timeAuto)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Time zone</div>
                  <div className="desc">Current region and UTC offset</div>
                </div>
              </div>
              <div className="headerRight">
                <select
                  className="win11Select"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                >
                  <option value="UTC+06:00 Dhaka">(UTC+06:00) Dhaka</option>
                  <option value="UTC-05:00 Eastern Time">(UTC-05:00) Eastern Time (US & Canada)</option>
                  <option value="UTC+00:00 London">(UTC+00:00) Dublin, Edinburgh, Lisbon, London</option>
                  <option value="UTC+09:00 Tokyo">(UTC+09:00) Osaka, Sapporo, Tokyo</option>
                  <option value="UTC+04:00 Dubai">(UTC+04:00) Abu Dhabi, Muscat, Dubai</option>
                </select>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Sync your clock</div>
                  <div className="desc">Last successful time synchronization: Just now</div>
                </div>
              </div>
              <div className="headerRight">
                <button className="win11Btn primary">Sync now</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 14. GAMING
    if (page === "Gaming" || name.includes("game")) {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Game Mode</div>
                  <div className="desc">Optimize your PC for play by turning background apps off</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input
                    type="checkbox"
                    checked={gameModeOn}
                    onChange={() => setGameModeOn(!gameModeOn)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Xbox Game Bar</div>
                  <div className="desc">Record game clips, chat with friends, receive party invites</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="subPageCard interactive">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Captures</div>
                  <div className="desc">Screenshots and game recording locations</div>
                </div>
              </div>
              <span>›</span>
            </div>
          </div>
        </div>
      );
    }

    // 15. ACCESSIBILITY
    if (page === "Accessibility" || name.includes("text") || name.includes("visual")) {
      return (
        <div>
          <div className="subPageCard">
            <div className="title font-semibold mb-2">Text size</div>
            <div className="desc text-xs opacity-75 mb-4">
              Drag the slider to adjust text size across the operating system
            </div>
            <div
              className="p-4 rounded border mb-4"
              style={{
                fontSize: `${(textSize / 100) * 14}px`,
                background: "rgb(var(--txt_clr-rgb) / 3%)",
                border: "1px solid rgb(var(--txt_clr-rgb) / 10%)",
              }}
            >
              Make text bigger. This is a live preview of the text size in Windows 11 Web OS.
            </div>
            <div className="win11Slider w-full max-w-lg">
              <span className="text-xs">A</span>
              <input
                type="range"
                min="100"
                max="200"
                step="5"
                value={textSize}
                onChange={(e) => setTextSize(e.target.value)}
              />
              <span className="text-lg">A</span>
              <span className="sliderVal">{textSize}%</span>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Animation effects</div>
                  <div className="desc">Show animations in Windows</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 16. PRIVACY & SECURITY
    if (page === "Privacy & security" || name.includes("security") || name.includes("privacy")) {
      return (
        <div>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon text-green-500"></span>
                <div>
                  <div className="title font-semibold">Security at a glance</div>
                  <div className="desc text-green-500">No actions needed. All systems protected.</div>
                </div>
              </div>
              <button className="win11Btn">Open Windows Security</button>
            </div>
          </div>

          <h3 className="font-semibold text-base mt-6 mb-3">App permissions</h3>
          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Microphone access</div>
                  <div className="desc">Allow apps to access your microphone</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Camera access</div>
                  <div className="desc">Allow apps to access your camera</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="subPageCard">
            <div className="cardHeader">
              <div className="headerLeft">
                <span className="icon"></span>
                <div>
                  <div className="title">Location access</div>
                  <div className="desc">Allow apps to access your location</div>
                </div>
              </div>
              <div className="headerRight">
                <label className="win11Switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 17. UNIVERSAL FALLBACK FOR ANY OTHER SUBPAGE
    return (
      <div>
        <div className="subPageCard">
          <div className="cardHeader">
            <div className="headerLeft">
              <span className="icon">{item.icon || ""}</span>
              <div>
                <div className="title text-base font-semibold">{item.name}</div>
                <div className="desc">{item.desc || "Configure system settings and preferences"}</div>
              </div>
            </div>
            <div className="headerRight">
              <label className="win11Switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="subPageCard">
          <div className="cardHeader">
            <div className="headerLeft">
              <span className="icon"></span>
              <div>
                <div className="title">Automatically manage settings</div>
                <div className="desc">Let Windows configure optimal preferences</div>
              </div>
            </div>
            <div className="headerRight">
              <label className="win11Switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="subPageCard">
          <div className="cardHeader">
            <div className="headerLeft">
              <span className="icon"></span>
              <div>
                <div className="title">Advanced options</div>
                <div className="desc">More details and custom configuration</div>
              </div>
            </div>
            <div className="headerRight">
              <button className="win11Btn">Configure</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="settingsApp floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Settings"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <nav className={nav}>
            <div className="nav_top">
              <div
                className="account"
                onClick={() => {
                  setPage("Accounts");
                  setSubPage(null);
                }}
              >
                <img
                  src="img/asset/arafath.png"
                  alt="Arafath Rahman"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
                <div>
                  <p>{userName}</p>
                  <p>Local Account</p>
                </div>
              </div>
              <input
                type="text"
                className="search"
                placeholder="Find a setting"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="nav_bottom win11Scroll">
              {Object.keys(data).map((e) => {
                return (
                  <div
                    key={e}
                    className={`navLink ${e === page ? "selected" : ""}`}
                    onClick={() => {
                      setPage(e);
                      setSubPage(null);
                      setNav("");
                    }}
                  >
                    <img
                      src={`img/settings/${e}.webp`}
                      alt=""
                      height={16}
                      width={16}
                    />
                    {e}
                  </div>
                );
              })}
              <div className="marker"></div>
            </div>
          </nav>

          {subPage ? (
            <main>
              <div className="subPageContainer win11Scroll" style={{ width: "100%", height: "100%", overflowY: "auto", padding: "24px 32px" }}>
                <div className="subPageHeader">
                  <button className="subPageBackBtn" onClick={() => setSubPage(null)} title="Back">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <div className="subPageBreadcrumbs">
                    <span className="crumbSection" onClick={() => setSubPage(null)}>{page}</span>
                    <span className="crumbSeparator">›</span>
                    <span className="crumbCurrent">{subPage.name}</span>
                  </div>
                </div>
                <div className="subPageTitleBox">
                  <span className="subPageIcon">{subPage.icon || ""}</span>
                  <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 4px 0" }}>{subPage.name}</h1>
                    <p style={{ fontSize: "13px", opacity: "0.75", margin: 0 }}>{subPage.desc}</p>
                  </div>
                </div>
                {renderSubPageContent(subPage)}
              </div>
            </main>
          ) : (
            Object.keys(data).map((e) => {
              return (
                page === e && (
                  <main key={e}>
                    <h1>{e}</h1>
                    <div className="tilesCont win11Scroll">
                      {data[e].map((item, i) => {
                        switch (item.type) {
                          case "sysTop":
                            return (
                              <div key={i} className={item.type}>
                                <div className="left">
                                  <img
                                    src={`img/wallpaper/${wall.src}`}
                                    alt=""
                                    className="device_img"
                                  />
                                  <div className="column_device">
                                    <p className="device_name">ARAFATH-PC</p>
                                    <p className="device_model">Windows 11 Web OS</p>
                                    <p className="device_rename">Rename</p>
                                  </div>
                                </div>
                                <div className="right">
                                  <div className="column">
                                    <img
                                      src="https://upload.wikimedia.org/wikipedia/commons/2/25/Microsoft_icon.svg"
                                      height={20}
                                      alt=""
                                    />
                                    <p>
                                      Microsoft 365
                                      <br />
                                      <span className="column_lower">
                                        View benefits
                                      </span>
                                    </p>
                                  </div>
                                  <div
                                    className="column"
                                    onClick={() => setPage("Windows Update")}
                                  >
                                    <img
                                      src="img/settings/Windows Update.webp"
                                      alt=""
                                      height={20}
                                    />
                                    <p>
                                      Windows Update
                                      <br />
                                      <span className="column_lower">
                                        You're up to date
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          case "netTop":
                            return (
                              <div key={i} className="netTop">
                                <div>
                                  <img
                                    src="img/settings/wifi.png"
                                    alt=""
                                    height={100}
                                  />
                                  <div>
                                    <h2 className="font-medium text-lg">WiFi</h2>
                                    <p>Connected, secured</p>
                                  </div>
                                </div>
                                <div className="box">
                                  <span className="settingsIcon"></span>
                                  <div>
                                    <h3>Properties</h3>
                                    <p>Public network 5 Ghz</p>
                                  </div>
                                </div>
                                <div className="box">
                                  <span className="settingsIcon"></span>
                                  <div>
                                    <h3>Data Usage</h3>
                                    <p>
                                      {Math.round(Math.random() * 100)}GB, last 30
                                      days
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          case "personaliseTop":
                            return (
                              <div key={i} className="personaliseTop">
                                <img
                                  className="mainImg"
                                  src={`img/wallpaper/${wall.src}`}
                                  alt=""
                                />
                                <div>
                                  <h3>Select a theme to apply</h3>
                                  <div className="bgBox">
                                    {wall.themes.map((themeName, idx) => {
                                      return (
                                        <Image
                                          key={idx}
                                          className={
                                            wall.src.includes(themeName) ? "selected" : ""
                                          }
                                          src={`img/wallpaper/${themeName}/img0.jpg`}
                                          ext
                                          onClick={handleWallAndTheme}
                                          click="WALLSET"
                                          payload={`${themeName}/img0.jpg`}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          case "accountsTop":
                            return (
                              <div key={i} className="accountsTop ">
                                <img
                                  src="img/settings/defAccount.webp"
                                  alt=""
                                  width={90}
                                />
                                <div>
                                  <p>{userName.toUpperCase()}</p>
                                  <p>Local Account</p>
                                  <p>Administrator</p>
                                </div>
                              </div>
                            );
                          case "timeTop":
                            return (
                              <div className="timeTop" key={i}>
                                <h1>
                                  {new Date().toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                                </h1>
                              </div>
                            );
                          case "langSwitcher":
                            return (
                              <div key={i} className="tile langSwitcherTile">
                                <span className="settingsIcon"></span>
                                <div className="tile_content">
                                  <p>Windows display language</p>
                                  <p className="tile_desc">
                                    Windows features like Settings and File
                                    Explorer will appear in this language
                                  </p>
                                </div>
                                <LangSwitch />
                              </div>
                            );
                          case "updateTop":
                            return (
                              <div key={i} className="updateTop">
                                <div className="left">
                                  <img
                                    src="img/settings/update.png"
                                    width={90}
                                    alt=""
                                  />
                                  <div>
                                    <h2>You're up to date</h2>
                                    <p>Last checked: Today</p>
                                  </div>
                                </div>
                                <div className="right">
                                  <div
                                    className="btn"
                                    onClick={() => {
                                      setUpdating(true);
                                      setTimeout(() => {
                                        setUpdating(false);
                                        setUpmodalOpen(true);
                                      }, Math.random() * 2000);
                                    }}
                                  >
                                    {updating
                                      ? "Checking for updates..."
                                      : "Check for updates"}
                                  </div>
                                </div>
                              </div>
                            );

                          case "subHeading":
                          case "spacer":
                            return (
                              <div key={i} className={item.type}>
                                {item.name}
                              </div>
                            );
                          case "tile":
                          case "tile square":
                          case "tile thin-blue":
                            return (
                              <div
                                key={item.name}
                                className={item.type}
                                onClick={() => setSubPage({ section: page, ...item })}
                                style={{ cursor: "pointer" }}
                              >
                                <span className="settingsIcon">{item.icon}</span>
                                <div>
                                  <p>{item.name}</p>
                                  <p className="tile_desc">{item.desc}</p>
                                </div>
                              </div>
                            );
                          default:
                            return console.log(
                              `error - type ${item.type} not found`,
                            );
                        }
                      })}
                    </div>
                  </main>
                )
              );
            })
          )}

          {upmodalOpen && (
            <>
              <div className="absolute z-30 bg-black bg-opacity-60 h-full w-full top-0 left-0"></div>

              <div
                className="absolute top-[50%] left-[50%] z-50 rounded"
                style={{
                  transform: `translateX(-50%) translateY(-50%)`,
                  background: `var(--wintheme)`,
                  padding: `1.5rem`,
                }}
              >
                <h1
                  style={{
                    marginBottom: `10px`,
                  }}
                  className="text-2xl font-semibold"
                >
                  Restart required
                </h1>
                <p>
                  Some changes will not take effect until you restart your
                  device.
                </p>

                <div
                  className="flex"
                  style={{
                    marginTop: `14px`,
                  }}
                >
                  <button
                    style={{
                      padding: "10px",
                      backgroundColor: "var(--clrPrm)",
                      color: "var(--alt-txt)",
                      marginRight: "10px",
                    }}
                    onClick={() => {
                      // Clear the cache and reload the page
                      window.location =
                        window.location.href + `?clearCache=${Math.random()}`;
                    }}
                    className="flex-1 rounded border-none hover:opacity-95"
                  >
                    Restart now
                  </button>
                  <button
                    style={{
                      padding: "10px",
                      color: "var(--sat-txt)",
                    }}
                    className="flex-1 rounded border"
                    onClick={() => {
                      setUpmodalOpen(false);
                    }}
                  >
                    Restart later
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="navMenuBtn" onClick={() => setNav(nav ? "" : "open")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 48 48"
              width={24}
              height={24}
            >
              <path d="M5.5 9a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37zm0 13.5a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37zm0 13.5a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
