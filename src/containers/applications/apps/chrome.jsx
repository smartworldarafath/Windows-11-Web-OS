import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar, LazyComponent, Image } from "../../../utils/general";
import "./assets/chrome.scss";

export const ChromeApp = () => {
  const wnapp = useSelector((state) => state.apps.chrome || { size: "full", hide: true, z: 0 });
  const [tabs, setTabs] = useState([
    { id: 1, title: "New Tab", url: "https://www.google.com/webhp?igu=1" }
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [urlInput, setUrlInput] = useState("https://www.google.com/webhp?igu=1");
  const [history, setHistory] = useState(["https://www.google.com/webhp?igu=1"]);
  const [histIndex, setHistIndex] = useState(0);
  const dispatch = useDispatch();

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const bookmarks = [
    { name: "Google", url: "https://www.google.com/webhp?igu=1", icon: "google" },
    { name: "YouTube", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", icon: "youtube" },
    { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "wikipedia" },
    { name: "DevDocs", url: "https://devdocs.io", icon: "code" },
    { name: "GitHub", url: "https://github.com/smartworldarafath/Windows-11-Web-OS", icon: "github" },
  ];

  const isValidURL = (str) => {
    return /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi.test(str);
  };

  const navigateTo = (targetUrl) => {
    var finalUrl = targetUrl;
    if (!isValidURL(targetUrl)) {
      finalUrl = "https://www.google.com/search?q=" + encodeURIComponent(targetUrl) + "&igu=1";
    } else if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      finalUrl = "https://" + targetUrl;
    }

    setUrlInput(finalUrl);
    setTabs(tabs.map((t) => (t.id === activeTab ? { ...t, url: finalUrl, title: targetUrl } : t)));
    setHistory([...history.slice(0, histIndex + 1), finalUrl]);
    setHistIndex(histIndex + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigateTo(urlInput);
    }
  };

  const handleNewTab = () => {
    var newId = Date.now();
    var newTab = { id: newId, title: "New Tab", url: "https://www.google.com/webhp?igu=1" };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
    setUrlInput("https://www.google.com/webhp?igu=1");
  };

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      dispatch({ type: wnapp.action || "CHROME", payload: "close" });
      return;
    }
    var remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);
    if (activeTab === tabId) {
      setActiveTab(remaining[remaining.length - 1].id);
      setUrlInput(remaining[remaining.length - 1].url);
    }
  };

  const handleBack = () => {
    if (histIndex > 0) {
      var prev = history[histIndex - 1];
      setHistIndex(histIndex - 1);
      setUrlInput(prev);
      setTabs(tabs.map((t) => (t.id === activeTab ? { ...t, url: prev } : t)));
    }
  };

  const handleForward = () => {
    if (histIndex < history.length - 1) {
      var next = history[histIndex + 1];
      setHistIndex(histIndex + 1);
      setUrlInput(next);
      setTabs(tabs.map((t) => (t.id === activeTab ? { ...t, url: next } : t)));
    }
  };

  const handleReload = () => {
    var iframe = document.getElementById(`chrome-frame-${activeTab}`);
    if (iframe) iframe.src = iframe.src;
  };

  if (!wnapp || wnapp.hide) return null;

  return (
    <div
      className="chromeBrowser floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id="chromeApp"
    >
      <ToolBar
        app={wnapp.action || "CHROME"}
        icon="chrome"
        size={wnapp.size}
        name="Google Chrome"
        float
      />
      <div className="windowScreen flex flex-col">
        {/* Chrome Tab Strip */}
        <div className="chromeTabStrip flex items-center">
          <div className="tabList flex items-center flex-grow">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`chromeTab flex items-center ${tab.id === activeTab ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setUrlInput(tab.url);
                }}
              >
                <img src="img/icon/chrome.png" width={14} height={14} alt="" className="mr-2" />
                <span className="tabTitle text-xs truncate max-w-[120px]">{tab.title}</span>
                <div
                  className="tabCloseBtn ml-2 p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full"
                  onClick={(e) => handleCloseTab(e, tab.id)}
                >
                  <Icon fafa="faTimes" width={9} />
                </div>
              </div>
            ))}
            <div
              className="newTabBtn p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full handcr ml-1"
              onClick={handleNewTab}
              title="New Tab"
            >
              <Icon fafa="faPlus" width={11} />
            </div>
          </div>
        </div>

        {/* Chrome Address Bar Navigation */}
        <div className="chromeNavWrap flex flex-col flex-grow">
          <div className="chromeOmniboxBar flex items-center px-2 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${histIndex === 0 ? "opacity-30" : "opacity-80"}`}
              onClick={handleBack}
              disabled={histIndex === 0}
            >
              <Icon fafa="faArrowLeft" width={13} />
            </button>
            <button
              className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-1 ${histIndex >= history.length - 1 ? "opacity-30" : "opacity-80"}`}
              onClick={handleForward}
              disabled={histIndex >= history.length - 1}
            >
              <Icon fafa="faArrowRight" width={13} />
            </button>
            <button
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-1 opacity-80"
              onClick={handleReload}
              title="Reload"
            >
              <Icon fafa="faRedo" width={12} />
            </button>
            <button
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-1 opacity-80"
              onClick={() => navigateTo("https://www.google.com/webhp?igu=1")}
              title="Home"
            >
              <Icon fafa="faHome" width={14} />
            </button>

            {/* Omnibox Input */}
            <div className="omniboxCont flex items-center flex-grow mx-3 px-3 py-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full shadow-inner">
              <Icon fafa="faLock" width={11} className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-xs text-gray-800 dark:text-gray-100"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search Google or type a URL"
              />
              <button onClick={() => navigateTo(urlInput)} className="text-blue-500 text-xs ml-1 font-semibold">
                Go
              </button>
            </div>
          </div>

          {/* Bookmarks Bar */}
          <div className="chromeBookmarksBar flex items-center px-3 py-1 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-xs">
            {bookmarks.map((bm, i) => (
              <div
                key={i}
                className="bookmarkItem flex items-center px-2 py-1 mr-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 handcr"
                onClick={() => navigateTo(bm.url)}
              >
                <img
                  src={bm.name === "GitHub" ? "img/icon/github.png" : "img/icon/chrome.png"}
                  width={13}
                  height={13}
                  alt=""
                  className="mr-1.5"
                />
                <span>{bm.name}</span>
              </div>
            ))}
          </div>

          {/* Web View IFrame */}
          <div className="chromeFrameCont flex-grow relative overflow-hidden bg-white">
            <iframe
              id={`chrome-frame-${currentTab ? currentTab.id : 0}`}
              src={currentTab ? currentTab.url : "https://www.google.com/webhp?igu=1"}
              className="w-full h-full border-none"
              title="Chrome Web View"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
