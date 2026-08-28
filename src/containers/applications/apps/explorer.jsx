import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar } from "../../../utils/general";
import { dispatchAction, handleFileOpen } from "../../../actions";
import "./assets/fileexpo.scss";

const NavTitle = (props) => {
  var src = props.icon || "folder";

  return (
    <div
      className="navtitle flex prtclk"
      data-action={props.action}
      data-payload={props.payload}
      onClick={dispatchAction}
    >
      <Icon
        className="mr-1"
        src={"win/" + src + "-sm"}
        width={props.isize || 16}
      />
      <span>{props.title}</span>
    </div>
  );
};

const FolderDrop = ({ dir }) => {
  const files = useSelector((state) => state.files);
  const folder = files.data.getId(dir);

  return (
    <>
      {folder &&
        folder.data &&
        Array.isArray(folder.data) &&
        folder.data.map((item, i) => {
          if (item.type == "folder") {
            return (
              <Dropdown
                key={i}
                icon={item.info && item.info.icon}
                title={item.name}
                notoggle={!item.data || item.data.length == 0}
                dir={item.id}
              />
            );
          }
          return null;
        })}
    </>
  );
};

const Dropdown = (props) => {
  const [open, setOpen] = useState(props.isDropped != null);
  const special = useSelector((state) => state.files.data.special);
  const [fid, setFID] = useState(() => {
    if (props.spid) return special[props.spid] || props.spid;
    else return props.dir;
  });
  const toggle = () => setOpen(!open);

  return (
    <div className="dropdownmenu">
      <div className="droptitle">
        {!props.notoggle ? (
          <Icon
            className="arrUi"
            fafa={open ? "faChevronDown" : "faChevronRight"}
            width={10}
            onClick={toggle}
            pr
          />
        ) : (
          <Icon className="arrUi opacity-0" fafa="faCircle" width={10} />
        )}
        <NavTitle
          icon={props.icon}
          title={props.title}
          isize={props.isize}
          action={props.action !== "" ? props.action || "FILEDIR" : null}
          payload={props.spid || fid}
        />
        {props.pinned != null ? (
          <Icon className="pinUi" src="win/pinned" width={16} />
        ) : null}
      </div>
      {!props.notoggle ? (
        <div className="dropcontent">
          {open ? props.children : null}
          {open && fid != null && !fid.startsWith("%") ? (
            <FolderDrop dir={fid} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export const Explorer = () => {
  const wnapp = useSelector((state) => state.apps.explorer);
  const files = useSelector((state) => state.files);
  const fdata = files.data.getId(files.cdir) || files.data.getThisPC();
  const [cpath, setPath] = useState(files.cpath || "This PC");
  const [searchtxt, setShText] = useState("");
  const [selected, setSelect] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [newNameVal, setNewNameVal] = useState("");
  const [ctxMenu, setCtxMenu] = useState(null);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => setPath(e.target.value);
  const handleSearchChange = (e) => setShText(e.target.value);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      dispatch({ type: "FILEPATH", payload: cpath });
    }
  };

  useEffect(() => {
    setPath(files.cpath);
    setShText("");
    setSelect(null);
  }, [files.cdir, files.version]);

  const handleGlobalClick = () => {
    setCtxMenu(null);
    setNewMenuOpen(false);
  };

  const handleCreateFolder = () => {
    dispatch({ type: "FILENEW", payload: { type: "folder", dir: files.cdir } });
    setNewMenuOpen(false);
  };

  const handleCreateFile = () => {
    dispatch({ type: "FILENEW", payload: { type: "file", dir: files.cdir } });
    setNewMenuOpen(false);
  };

  const handleDelete = () => {
    if (selected) {
      dispatch({ type: "FILEDEL", payload: selected });
      setSelect(null);
    }
  };

  const handleCopy = () => {
    if (selected) {
      dispatch({ type: "FILECOPY", payload: selected });
    }
  };

  const handleCut = () => {
    if (selected) {
      dispatch({ type: "FILECUT", payload: selected });
    }
  };

  const handlePaste = () => {
    dispatch({ type: "FILEPASTE", payload: { dir: files.cdir } });
  };

  const handleStartRename = (item) => {
    var target = item || (selected ? files.data.getId(selected) : null);
    if (target) {
      setRenameTarget(target);
      setNewNameVal(target.name);
    }
  };

  const handleConfirmRename = () => {
    if (renameTarget && newNameVal.trim()) {
      dispatch({
        type: "FILERENAME",
        payload: { id: renameTarget.id, name: newNameVal.trim() },
      });
      setRenameTarget(null);
    }
  };

  const DirCont = () => {
    if (files.cdir === "%thispc%" || !fdata || fdata.type === "thispc") {
      return (
        <div className="dirfbox h-full flex">
          <div className="dirCont flex items-center">
            <Icon className="pr-1 pb-px" src="win/thispc-sm" width={16} />
            <div className="dncont" tabIndex="-1">
              This PC
            </div>
          </div>
        </div>
      );
    }

    var arr = [],
      curr = fdata,
      index = 0;

    while (curr) {
      arr.push(
        <div key={index++} className="dirCont flex items-center">
          <div
            className="dncont"
            onClick={dispatchAction}
            tabIndex="-1"
            data-action="FILEDIR"
            data-payload={curr.id}
          >
            {curr.name}
          </div>
          <Icon className="dirchev" fafa="faChevronRight" width={8} />
        </div>,
      );
      curr = curr.host;
    }

    arr.push(
      <div
        key={index++}
        className="dirCont flex items-center handcr"
        onClick={() => dispatch({ type: "FILEDIR", payload: "%thispc%" })}
      >
        <Icon className="pr-1 pb-px" src="win/thispc-sm" width={16} />
        <div className="dncont" tabIndex="-1">
          This PC
        </div>
        <Icon className="dirchev" fafa="faChevronRight" width={8} />
      </div>,
    );

    return (
      <div key={index++} className="dirfbox h-full flex">
        {arr.reverse()}
      </div>
    );
  };

  return (
    <div
      className="msfiles floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
      onClick={handleGlobalClick}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="File Explorer"
      />
      <div className="windowScreen flex flex-col">
        {/* Ribbon Bar */}
        <div className="msribbon flex">
          <div className="ribsec relative">
            <div
              className="drdwcont flex items-center handcr"
              onClick={(e) => {
                e.stopPropagation();
                setNewMenuOpen(!newMenuOpen);
              }}
            >
              <Icon src="new" ui width={18} margin="0 6px" />
              <span>New</span>
              <Icon fafa="faChevronDown" width={8} margin="0 4px" />
            </div>
            {newMenuOpen && (
              <div className="fileContextMenu" style={{ top: "34px", left: "6px" }}>
                <div className="ctxItem" onClick={handleCreateFolder}>
                  <Icon src="win/folder-sm" width={16} />
                  <span>Folder</span>
                </div>
                <div className="ctxItem" onClick={handleCreateFile}>
                  <Icon src="win/notepad-sm" width={16} />
                  <span>Text Document</span>
                </div>
              </div>
            )}
          </div>
          <div className="ribsec">
            <div
              className={`handcr flex items-center p-1 rounded ${selected ? "hover:bg-gray-200 dark:hover:bg-gray-700" : "opacity-40"}`}
              title="Cut"
              onClick={handleCut}
            >
              <Icon src="cut" ui width={16} margin="0 4px" />
            </div>
            <div
              className={`handcr flex items-center p-1 rounded ${selected ? "hover:bg-gray-200 dark:hover:bg-gray-700" : "opacity-40"}`}
              title="Copy"
              onClick={handleCopy}
            >
              <Icon src="copy" ui width={16} margin="0 4px" />
            </div>
            <div
              className={`handcr flex items-center p-1 rounded ${files.clipboard ? "hover:bg-gray-200 dark:hover:bg-gray-700" : "opacity-40"}`}
              title="Paste"
              onClick={handlePaste}
            >
              <Icon src="paste" ui width={16} margin="0 4px" />
            </div>
            <div
              className={`handcr flex items-center p-1 rounded ${selected ? "hover:bg-gray-200 dark:hover:bg-gray-700" : "opacity-40"}`}
              title="Rename"
              onClick={() => handleStartRename()}
            >
              <Icon src="rename" ui width={16} margin="0 4px" />
            </div>
            <div
              className={`handcr flex items-center p-1 rounded ${selected ? "hover:bg-red-200 text-red-600 dark:hover:bg-red-900" : "opacity-40"}`}
              title="Delete"
              onClick={handleDelete}
            >
              <Icon fafa="faTrash" width={14} margin="0 6px" />
            </div>
          </div>
          <div className="ribsec">
            <div
              className="drdwcont flex items-center handcr"
              onClick={() => dispatch({ type: "FILEVIEW", payload: files.view == 1 ? 5 : 1 })}
            >
              <Icon src="view" ui width={16} margin="0 6px" />
              <span>{files.view == 1 ? "Large icons" : "Details"}</span>
            </div>
          </div>
        </div>

        {/* Navigation & Address Bar */}
        <div className="restWindow flex-grow flex flex-col">
          <div className="sec1">
            <Icon
              className={"navIcon hvtheme" + (files.hid == 0 ? " disableIt" : "")}
              fafa="faArrowLeft"
              width={14}
              click="FILEPREV"
              pr
            />
            <Icon
              className={
                "navIcon hvtheme" +
                (files.hid + 1 == files.hist.length ? " disableIt" : "")
              }
              fafa="faArrowRight"
              width={14}
              click="FILENEXT"
              pr
            />
            <Icon
              className="navIcon hvtheme"
              fafa="faArrowUp"
              width={14}
              click="FILEBACK"
              pr
            />
            <div className="path-bar noscroll" tabIndex="-1">
              <input
                className="path-field"
                type="text"
                value={cpath}
                onChange={handleChange}
                onKeyDown={handleEnter}
              />
              <DirCont />
            </div>
            <div className="srchbar">
              <Icon className="searchIcon" src="search" width={12} />
              <input
                type="text"
                onChange={handleSearchChange}
                value={searchtxt}
                placeholder="Search"
              />
            </div>
          </div>

          <div className="sec2">
            <NavPane />
            <ContentArea
              searchtxt={searchtxt}
              selected={selected}
              setSelect={setSelect}
              setCtxMenu={setCtxMenu}
              handleStartRename={handleStartRename}
            />
          </div>

          <div className="sec3">
            <div className="item-count text-xs">
              {fdata && fdata.data ? fdata.data.length : 0} items
            </div>
            <div className="view-opts flex">
              <Icon
                className="viewicon hvtheme p-1"
                click="FILEVIEW"
                payload="5"
                open={files.view == 5}
                src="win/viewinfo"
                width={16}
              />
              <Icon
                className="viewicon hvtheme p-1"
                click="FILEVIEW"
                payload="1"
                open={files.view == 1}
                src="win/viewlarge"
                width={16}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {ctxMenu && (
        <div
          className="fileContextMenu"
          style={{ top: `${ctxMenu.y}px`, left: `${ctxMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          {ctxMenu.item ? (
            <>
              <div
                className="ctxItem"
                onClick={() => {
                  handleFileOpen(ctxMenu.item.id);
                  setCtxMenu(null);
                }}
              >
                <Icon fafa="faFolderOpen" width={14} />
                <span>Open</span>
              </div>
              <div
                className="ctxItem"
                onClick={() => {
                  dispatch({ type: "FILECUT", payload: ctxMenu.item.id });
                  setCtxMenu(null);
                }}
              >
                <Icon src="cut" ui width={14} />
                <span>Cut</span>
              </div>
              <div
                className="ctxItem"
                onClick={() => {
                  dispatch({ type: "FILECOPY", payload: ctxMenu.item.id });
                  setCtxMenu(null);
                }}
              >
                <Icon src="copy" ui width={14} />
                <span>Copy</span>
              </div>
              <div
                className="ctxItem"
                onClick={() => {
                  handleStartRename(ctxMenu.item);
                  setCtxMenu(null);
                }}
              >
                <Icon src="rename" ui width={14} />
                <span>Rename</span>
              </div>
              <div className="ctxDivider" />
              <div
                className="ctxItem text-red-500"
                onClick={() => {
                  dispatch({ type: "FILEDEL", payload: ctxMenu.item.id });
                  setCtxMenu(null);
                }}
              >
                <Icon fafa="faTrash" width={14} />
                <span>Delete</span>
              </div>
            </>
          ) : (
            <>
              <div className="ctxItem" onClick={handleCreateFolder}>
                <Icon src="win/folder-sm" width={14} />
                <span>New folder</span>
              </div>
              <div className="ctxItem" onClick={handleCreateFile}>
                <Icon src="win/notepad-sm" width={14} />
                <span>New text document</span>
              </div>
              {files.clipboard && (
                <div className="ctxItem" onClick={handlePaste}>
                  <Icon src="paste" ui width={14} />
                  <span>Paste</span>
                </div>
              )}
              <div className="ctxDivider" />
              <div
                className="ctxItem"
                onClick={() => {
                  dispatch({ type: "FILEVIEW", payload: files.view == 1 ? 5 : 1 });
                  setCtxMenu(null);
                }}
              >
                <Icon src="view" ui width={14} />
                <span>Toggle View</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Rename Dialog */}
      {renameTarget && (
        <div className="renameDialog" onClick={(e) => e.stopPropagation()}>
          <h4>Rename</h4>
          <input
            type="text"
            value={newNameVal}
            onChange={(e) => setNewNameVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmRename();
              else if (e.key === "Escape") setRenameTarget(null);
            }}
            autoFocus
          />
          <div className="dialogBtns">
            <button className="primary" onClick={handleConfirmRename}>
              OK
            </button>
            <button className="secondary" onClick={() => setRenameTarget(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ContentArea = ({
  searchtxt,
  selected,
  setSelect,
  setCtxMenu,
  handleStartRename,
}) => {
  const files = useSelector((state) => state.files);
  const fdata = files.data.getId(files.cdir) || files.data.getThisPC();
  const dispatch = useDispatch();

  const handleClick = (e, item) => {
    e.stopPropagation();
    setSelect(item.id);
  };

  const handleDouble = (e, item) => {
    e.stopPropagation();
    handleFileOpen(item.id);
  };

  const handleContextMenu = (e, item = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (item) setSelect(item.id);
    setCtxMenu({ x: e.clientX, y: e.clientY, item: item });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Delete" && selected) {
      dispatch({ type: "FILEDEL", payload: selected });
      setSelect(null);
    } else if (e.key === "F2" && selected) {
      handleStartRename();
    } else if (e.key === "Enter" && selected) {
      handleFileOpen(selected);
    } else if (e.key === "Backspace") {
      dispatch({ type: "FILEBACK" });
    }
  };

  // Render "This PC" View
  if (files.cdir === "%thispc%" || !fdata || fdata.type === "thispc") {
    var thisPC = files.data.getThisPC();
    return (
      <div
        className="contentarea"
        onClick={() => setSelect(null)}
        onContextMenu={(e) => handleContextMenu(e, null)}
        onKeyDown={handleKeyDown}
        tabIndex="0"
      >
        <div className="contentwrap win11Scroll">
          <div className="thispcCont">
            {/* Folders Section */}
            <div className="thispcTitle">Folders ({thisPC.folders.length})</div>
            <div className="thispcGrid">
              {thisPC.folders.map((folder, i) => (
                <div
                  key={i}
                  className="thispcFolderCard"
                  onClick={(e) => handleClick(e, folder)}
                  onDoubleClick={(e) => handleDouble(e, folder)}
                  onContextMenu={(e) => handleContextMenu(e, folder)}
                  data-focus={selected === folder.id}
                >
                  <Icon src={`win/${folder.info?.icon || "folder"}`} width={32} />
                  <div className="folderName">{folder.name}</div>
                </div>
              ))}
            </div>

            {/* Drives Section */}
            <div className="thispcTitle">Devices and drives ({thisPC.drives.length})</div>
            <div className="thispcDrivesGrid">
              {thisPC.drives.map((drive, i) => {
                var isC = drive.name && drive.name.startsWith("C");
                var used = isC ? 72 : 35;
                var spaceTxt = isC ? "28.5 GB free of 104 GB" : "320 GB free of 496 GB";

                return (
                  <div
                    key={i}
                    className="driveCard"
                    onClick={(e) => handleClick(e, drive)}
                    onDoubleClick={(e) => handleDouble(e, drive)}
                    onContextMenu={(e) => handleContextMenu(e, drive)}
                    data-focus={selected === drive.id}
                  >
                    <Icon src="win/disc" width={38} />
                    <div className="driveInfo">
                      <div className="driveName">{isC ? "Local Disk (C:)" : "Data (D:)"}</div>
                      <div className="driveBar">
                        <div className="driveFill" style={{ width: `${used}%` }} />
                      </div>
                      <div className="driveSpace">{spaceTxt}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  var items = Array.isArray(fdata.data) ? fdata.data : [];

  return (
    <div
      className="contentarea"
      onClick={() => setSelect(null)}
      onContextMenu={(e) => handleContextMenu(e, null)}
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <div className="contentwrap win11Scroll">
        <div className="gridshow" data-size={files.view == 1 ? "lg" : "sm"}>
          {items.map((item, i) => {
            if (!item || (searchtxt && !item.name.toLowerCase().includes(searchtxt.toLowerCase()))) {
              return null;
            }

            var iconSrc = item.info?.icon || (item.type === "folder" ? "folder" : "file");

            return (
              <div
                key={item.id || i}
                className="conticon hvtheme flex flex-col items-center prtclk"
                data-id={item.id}
                data-focus={selected === item.id}
                onClick={(e) => handleClick(e, item)}
                onDoubleClick={(e) => handleDouble(e, item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                <Image src={`icon/win/${iconSrc}`} width={files.view == 1 ? 48 : 32} />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
        {items.length === 0 ? (
          <span className="text-xs mx-auto mt-12 opacity-60">This folder is empty.</span>
        ) : null}
      </div>
    </div>
  );
};

const NavPane = () => {
  return (
    <div className="navpane win11Scroll">
      <div className="extcont">
        <Dropdown icon="star" title="Quick access" action="" isDropped>
          <Dropdown
            icon="desk"
            title="Desktop"
            spid="%desktop%"
            notoggle
            pinned
          />
          <Dropdown
            icon="down"
            title="Downloads"
            spid="%downloads%"
            notoggle
            pinned
          />
          <Dropdown
            icon="docs"
            title="Documents"
            spid="%documents%"
            notoggle
            pinned
          />
          <Dropdown
            icon="pics"
            title="Pictures"
            spid="%pictures%"
            notoggle
            pinned
          />
          <Dropdown
            icon="user"
            title="Arafath"
            spid="%user%"
            notoggle
            pinned
          />
        </Dropdown>
        <Dropdown
          icon="thispc"
          title="This PC"
          spid="%thispc%"
          action="FILEDIR"
          isDropped
        >
          <Dropdown icon="desk" title="Desktop" spid="%desktop%" />
          <Dropdown icon="docs" title="Documents" spid="%documents%" />
          <Dropdown icon="down" title="Downloads" spid="%downloads%" />
          <Dropdown icon="music" title="Music" spid="%music%" />
          <Dropdown icon="pics" title="Pictures" spid="%pictures%" />
          <Dropdown icon="vid" title="Videos" spid="%videos%" />
          <Dropdown icon="disc" title="OS (C:)" spid="%cdrive%" />
          <Dropdown icon="disk" title="Data (D:)" spid="%ddrive%" />
        </Dropdown>
      </div>
    </div>
  );
};

