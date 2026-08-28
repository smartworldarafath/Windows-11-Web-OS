import { Bin } from "../utils/bin";
import fdata from "./dir.json";

const defState = {
  cdir: "%user%",
  hist: ["%user%"],
  hid: 0,
  view: 1,
  clipboard: null, // { op: 'copy'|'cut', id: string }
  version: 0,
};

defState.data = new Bin();
defState.data.parse(fdata);
defState.cpath = defState.data.getPath(defState.cdir);

const fileReducer = (state = defState, action) => {
  var tmp = { ...state };
  var navHist = false;

  if (action.type === "FILEDIR") {
    tmp.cdir = action.payload || "%user%";
  } else if (action.type === "FILEPATH") {
    var pathid = tmp.data.parsePath(action.payload);
    if (pathid) tmp.cdir = pathid;
  } else if (action.type === "FILEBACK") {
    var item = tmp.data.getId(tmp.cdir);
    if (item && item.host) {
      tmp.cdir = item.host.id;
    } else if (tmp.cdir !== "%thispc%") {
      tmp.cdir = "%thispc%";
    }
  } else if (action.type === "FILEVIEW") {
    tmp.view = action.payload;
  } else if (action.type === "FILEPREV") {
    tmp.hid--;
    if (tmp.hid < 0) tmp.hid = 0;
    navHist = true;
  } else if (action.type === "FILENEXT") {
    tmp.hid++;
    if (tmp.hid > tmp.hist.length - 1) tmp.hid = tmp.hist.length - 1;
    navHist = true;
  } else if (action.type === "FILENEW") {
    var targetFolderId = action.payload && action.payload.dir ? action.payload.dir : tmp.cdir;
    var newType = action.payload && action.payload.type ? action.payload.type : "folder";
    var customName = action.payload && action.payload.name ? action.payload.name : undefined;
    tmp.data.addItem(targetFolderId, { type: newType, name: customName });
    tmp.version = (tmp.version || 0) + 1;
  } else if (action.type === "FILEDEL") {
    if (action.payload) {
      tmp.data.deleteItem(action.payload);
      tmp.version = (tmp.version || 0) + 1;
    }
  } else if (action.type === "FILERENAME") {
    if (action.payload && action.payload.id && action.payload.name) {
      tmp.data.renameItem(action.payload.id, action.payload.name);
      tmp.version = (tmp.version || 0) + 1;
    }
  } else if (action.type === "FILECOPY") {
    tmp.clipboard = { op: "copy", id: action.payload };
  } else if (action.type === "FILECUT") {
    tmp.clipboard = { op: "cut", id: action.payload };
  } else if (action.type === "FILEPASTE") {
    if (tmp.clipboard && tmp.clipboard.id) {
      var dest = (action.payload && action.payload.dir) || tmp.cdir;
      if (tmp.clipboard.op === "copy") {
        tmp.data.copyItem(tmp.clipboard.id, dest);
      } else if (tmp.clipboard.op === "cut") {
        tmp.data.moveItem(tmp.clipboard.id, dest);
        tmp.clipboard = null;
      }
      tmp.version = (tmp.version || 0) + 1;
    }
  }

  if (!navHist && tmp.cdir != tmp.hist[tmp.hid]) {
    tmp.hist.splice(tmp.hid + 1);
    tmp.hist.push(tmp.cdir);
    tmp.hid = tmp.hist.length - 1;
  }

  tmp.cdir = tmp.hist[tmp.hid] || "%user%";
  if (tmp.cdir.includes("%") && tmp.cdir !== "%thispc%") {
    if (tmp.data.special[tmp.cdir] != null) {
      tmp.cdir = tmp.data.special[tmp.cdir];
      tmp.hist[tmp.hid] = tmp.cdir;
    }
  }

  tmp.cpath = tmp.data.getPath(tmp.cdir);
  return tmp;
};

export default fileReducer;

