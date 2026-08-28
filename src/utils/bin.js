export class Item {
  constructor({ type, name, info, data, host }) {
    this.type = type || "folder";
    this.name = name;
    this.info = info || {};
    if (!this.info.icon) {
      if (this.type === "folder") {
        this.info.icon = "folder";
      } else {
        var ext = name && name.includes(".") ? name.split(".").pop().toLowerCase() : "";
        if (["txt", "md", "log", "cfg"].includes(ext)) this.info.icon = "notepad";
        else if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) this.info.icon = "photos";
        else if (["js", "jsx", "ts", "tsx", "json", "html", "css", "py"].includes(ext)) this.info.icon = "code";
        else this.info.icon = "file";
      }
    }
    this.data = data;
    this.host = host;
    this.id = this.gene();
    this.mtime = new Date().toLocaleDateString();
  }

  gene() {
    return Math.random().toString(36).substring(2, 10).toLowerCase();
  }

  getId() {
    return this.id;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }
}

export class Bin {
  constructor() {
    this.tree = [];
    this.lookup = {};
    this.special = {};
  }

  setSpecial(spid, id) {
    this.special[spid] = id;
  }

  setId(id, item) {
    this.lookup[id] = item;
  }

  getId(id) {
    if (id === "%thispc%" || id === "thispc") {
      return this.getThisPC();
    }
    if (typeof id === "string" && id.startsWith("%") && this.special[id]) {
      return this.lookup[this.special[id]];
    }
    return this.lookup[id] || null;
  }

  getThisPC() {
    var folders = [];
    var quickIds = ["%desktop%", "%documents%", "%downloads%", "%pictures%", "%music%", "%videos%"];
    for (var sp of quickIds) {
      var realId = this.special[sp];
      if (realId && this.lookup[realId]) {
        folders.push(this.lookup[realId]);
      }
    }

    var drives = [];
    var driveIds = ["%cdrive%", "%ddrive%"];
    for (var sp of driveIds) {
      var realId = this.special[sp];
      if (realId && this.lookup[realId]) {
        drives.push(this.lookup[realId]);
      }
    }
    if (drives.length === 0) {
      drives = this.tree;
    }

    return {
      id: "%thispc%",
      name: "This PC",
      type: "thispc",
      info: { icon: "thispc" },
      data: [...folders, ...drives],
      folders: folders,
      drives: drives,
      host: null,
    };
  }

  getPath(id) {
    if (id === "%thispc%" || id === "thispc") return "This PC";
    var cpath = "";
    var curr = this.getId(id);

    while (curr) {
      cpath = curr.name + "\\" + cpath;
      curr = curr.host;
    }

    return cpath.count("\\") > 1 ? cpath.strip("\\") : cpath;
  }

  parsePath(cpath) {
    if (!cpath) return null;
    if (cpath.trim().toLowerCase() === "this pc" || cpath.trim() === "%thispc%") {
      return "%thispc%";
    }
    if (cpath.includes("%")) {
      return this.special[cpath.trim()];
    }

    cpath = cpath
      .split("\\")
      .filter((x) => x !== "")
      .map((x) => x.trim().toLowerCase());
    if (cpath.length === 0) return null;

    var pid = null,
      curr = null;
    for (var i = 0; i < this.tree.length; i++) {
      if (this.tree[i].name.toLowerCase() === cpath[0]) {
        curr = this.tree[i];
        break;
      }
    }

    if (curr) {
      var i = 1,
        l = cpath.length;
      while (curr.type === "folder" && i < l) {
        var res = true;
        for (var j = 0; j < curr.data.length; j++) {
          if (curr.data[j].name.toLowerCase() === cpath[i]) {
            i += 1;
            if (curr.data[j].type === "folder") {
              res = false;
              curr = curr.data[j];
            }
            break;
          }
        }
        if (res) break;
      }
      if (i === l) pid = curr.id;
    }

    return pid;
  }

  addItem(hostId, { type = "folder", name, info = {}, data = "" }) {
    var host = this.getId(hostId);
    if (!host || host.type === "thispc") {
      hostId = this.special["%desktop%"] || (this.tree[0] && this.tree[0].id);
      host = this.getId(hostId);
    }
    if (!host || !Array.isArray(host.data)) return null;

    // generate safe unique name
    var baseName = name || (type === "folder" ? "New folder" : "New Text Document.txt");
    var finalName = baseName;
    var counter = 1;
    var extIndex = baseName.lastIndexOf(".");
    var namePart = extIndex !== -1 ? baseName.substring(0, extIndex) : baseName;
    var extPart = extIndex !== -1 ? baseName.substring(extIndex) : "";

    while (host.data.some((item) => item.name.toLowerCase() === finalName.toLowerCase())) {
      counter++;
      finalName = `${namePart} (${counter})${extPart}`;
    }

    var newItem = new Item({
      type: type,
      name: finalName,
      info: info,
      data: type === "folder" ? [] : data,
      host: host,
    });

    this.setId(newItem.id, newItem);
    host.data.push(newItem);
    return newItem;
  }

  deleteItem(id) {
    if (!id || id === "%thispc%") return false;
    var item = this.lookup[id];
    if (!item || !item.host || !Array.isArray(item.host.data)) return false;

    item.host.data = item.host.data.filter((x) => x.id !== id);
    this.removeLookup(item);
    return true;
  }

  removeLookup(item) {
    delete this.lookup[item.id];
    if (Array.isArray(item.data)) {
      for (var child of item.data) {
        this.removeLookup(child);
      }
    }
  }

  renameItem(id, newName) {
    if (!id || !newName || !newName.trim()) return false;
    var item = this.lookup[id];
    if (!item) return false;

    item.name = newName.trim();
    if (item.type !== "folder") {
      var ext = item.name.includes(".") ? item.name.split(".").pop().toLowerCase() : "";
      if (["txt", "md", "log", "cfg"].includes(ext)) item.info.icon = "notepad";
      else if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) item.info.icon = "photos";
      else if (["js", "jsx", "ts", "tsx", "json", "html", "css", "py"].includes(ext)) item.info.icon = "code";
    }
    return true;
  }

  copyItem(id, targetHostId) {
    var item = this.lookup[id];
    var targetHost = this.getId(targetHostId);
    if (!item || !targetHost || !Array.isArray(targetHost.data)) return null;

    var cloneData = (source, host) => {
      var cloned = new Item({
        type: source.type,
        name: source.name,
        info: { ...source.info },
        host: host,
      });
      this.setId(cloned.id, cloned);

      if (source.type === "folder" && Array.isArray(source.data)) {
        cloned.data = source.data.map((c) => cloneData(c, cloned));
      } else {
        cloned.data = source.data;
      }
      return cloned;
    };

    // check duplicate name
    var baseName = item.name;
    var finalName = baseName;
    var counter = 1;
    var extIndex = baseName.lastIndexOf(".");
    var namePart = extIndex !== -1 ? baseName.substring(0, extIndex) : baseName;
    var extPart = extIndex !== -1 ? baseName.substring(extIndex) : "";

    while (targetHost.data.some((x) => x.name.toLowerCase() === finalName.toLowerCase())) {
      finalName = `${namePart} - Copy${counter > 1 ? ` (${counter})` : ""}${extPart}`;
      counter++;
    }

    var newItem = cloneData(item, targetHost);
    newItem.name = finalName;
    targetHost.data.push(newItem);
    return newItem;
  }

  moveItem(id, targetHostId) {
    var item = this.lookup[id];
    var targetHost = this.getId(targetHostId);
    if (!item || !targetHost || !item.host || !Array.isArray(targetHost.data)) return false;
    if (item.host.id === targetHost.id) return true;

    item.host.data = item.host.data.filter((x) => x.id !== id);
    item.host = targetHost;
    targetHost.data.push(item);
    return true;
  }

  parseFolder(data, name, host = null) {
    var item = new Item({
      type: data.type,
      name: data.name || name,
      info: data.info,
      host: host,
    });

    this.setId(item.id, item);

    if (data.info && data.info.spid) {
      this.setSpecial(data.info.spid, item.id);
    }

    if (item.type !== "folder") {
      item.setData(data.data || data.content || "");
    } else {
      var fdata = [];
      if (data.data) {
        for (const key of Object.keys(data.data)) {
          fdata.push(this.parseFolder(data.data[key], key, item));
        }
      }
      item.setData(fdata);
    }

    return item;
  }

  parse(data) {
    var drives = Object.keys(data);
    var tree = [];
    for (var i = 0; i < drives.length; i++) {
      tree.push(this.parseFolder(data[drives[i]]));
    }

    this.tree = tree;
    this.setSpecial("%thispc%", "%thispc%");
  }
}

