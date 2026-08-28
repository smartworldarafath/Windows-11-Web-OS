import icons from "./apps";

var { taskbar, desktop, pinned, recent } = {
  taskbar: (localStorage.getItem("taskbar") &&
    JSON.parse(localStorage.getItem("taskbar"))) || [
    "Settings",
    "File Explorer",
    "Browser",
    "Google Chrome",
    "Store",
    "Spotify",
  ],
  desktop: (localStorage.getItem("desktop") &&
    JSON.parse(localStorage.getItem("desktop"))) || [
    "Arafath",
    "Recycle Bin",
    "File Explorer",
    "Store",
    "Browser",
    "Google Chrome",
    "Github",
    "Calculator",
    "Camera",
    "Paint",
    "Clock",
    "Weather",
    "Voice Recorder",
    "Notepad",
    "Spotify",
    "Terminal",
    "Settings",
  ],
  pinned: (localStorage.getItem("pinned") &&
    JSON.parse(localStorage.getItem("pinned"))) || [
    "Browser",
    "Google Chrome",
    "Get Started",
    "Task Manager",
    "Settings",
    "Store",
    "Notepad",
    "Paint",
    "Calculator",
    "Camera",
    "Clock",
    "Weather",
    "Voice Recorder",
    "Spotify",
    "File Explorer",
    "Terminal",
    "Github",
    "Discord",
  ],
  recent: (localStorage.getItem("recent") &&
    JSON.parse(localStorage.getItem("recent"))) || [
    "Google Chrome",
    "File Explorer",
    "Terminal",
    "Github",
    "Spotify",
    "Browser",
  ],
};

export const taskApps = icons.filter((x) => taskbar.includes(x.name));

export const desktopApps = icons
  .filter((x) => desktop.includes(x.name))
  .sort((a, b) => {
    return desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1;
  });

export const pinnedApps = icons
  .filter((x) => pinned.includes(x.name))
  .sort((a, b) => {
    return pinned.indexOf(a.name) > pinned.indexOf(b.name) ? 1 : -1;
  });

export const recentApps = icons
  .filter((x) => recent.includes(x.name))
  .sort((a, b) => {
    return recent.indexOf(a.name) > recent.indexOf(b.name) ? 1 : -1;
  });

export const allApps = icons.filter((app) => {
  return app.type === "app";
});

export const dfApps = {
  taskbar,
  desktop,
  pinned,
  recent,
};

