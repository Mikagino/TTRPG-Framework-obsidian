var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => NotionBasesPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian9 = require("obsidian");

// src/constants.ts
var NOTION_TABLE_VIEW = "bases";
var NOTION_LIST_VIEW = "notion-list";
var NOTION_BOARD_VIEW = "notion-board";
var LOG_PREFIX = "[extended-base]";

// src/view-options.ts
function buildViewOptions(_config) {
  return [
    {
      type: "toggle",
      key: "wrapCells",
      displayName: "Wrap all content",
      default: true
    },
    {
      type: "toggle",
      key: "verticalLines",
      displayName: "Show vertical lines",
      default: true
    },
    {
      type: "dropdown",
      key: "openMode",
      displayName: "Open notes in",
      default: "tab",
      options: {
        tab: "New tab",
        panel: "Page panel"
      }
    },
    {
      type: "multitext",
      key: "pillProperties",
      displayName: "Properties to show as colored pills"
    },
    {
      type: "multitext",
      key: "pinnedColors",
      displayName: "Pinned pill colors (value=color: gray, brown, orange, yellow, green, blue, purple, pink, red)"
    }
  ];
}
function buildListViewOptions(_config) {
  return [
    {
      type: "text",
      key: "rowCount",
      displayName: "Row count limit (e.g. 10, 25, 50, 100 or custom. 0 for all)",
      default: "10"
    },
    {
      type: "dropdown",
      key: "openMode",
      displayName: "Open notes in",
      default: "tab",
      options: {
        tab: "New tab",
        panel: "Page panel"
      }
    },
    {
      type: "multitext",
      key: "pillProperties",
      displayName: "Properties to show as colored pills"
    },
    {
      type: "multitext",
      key: "pinnedColors",
      displayName: "Pinned pill colors"
    }
  ];
}
function buildBoardViewOptions(_config) {
  return [
    {
      type: "property",
      key: "groupBy",
      displayName: "Group by property"
    },
    {
      type: "dropdown",
      key: "boardColumnWidth",
      displayName: "Column width",
      default: "medium",
      options: {
        small: "Small",
        medium: "Medium",
        large: "Large"
      }
    },
    {
      type: "dropdown",
      key: "groupColorDisplay",
      displayName: "Show group color as",
      default: "off",
      options: {
        off: "Off",
        label: "Label only",
        background: "Background only",
        both: "Both"
      }
    },
    {
      type: "dropdown",
      key: "openMode",
      displayName: "Open notes in",
      default: "tab",
      options: {
        tab: "New tab",
        panel: "Page panel"
      }
    },
    {
      type: "multitext",
      key: "pillProperties",
      displayName: "Properties to show as colored pills"
    },
    {
      type: "multitext",
      key: "pinnedColors",
      displayName: "Pinned pill colors"
    },
    {
      type: "multitext",
      key: "hiddenGroups",
      displayName: "Hidden groups"
    }
  ];
}

// src/view/notion-table-view.ts
var import_obsidian6 = require("obsidian");

// src/lib/colors.ts
var NOTION_COLORS = [
  { name: "gray", lightBg: "#F1F1EF", lightFg: "#787774", darkBg: "#3C4144", darkFg: "#9FA4A8" },
  { name: "brown", lightBg: "#F4EEEE", lightFg: "#9E6B53", darkBg: "#4C3E35", darkFg: "#D49675" },
  { name: "orange", lightBg: "#FBEDE7", lightFg: "#C86F21", darkBg: "#553B29", darkFg: "#E98D36" },
  { name: "yellow", lightBg: "#F4F1E5", lightFg: "#B57E33", darkBg: "#4A3E2C", darkFg: "#C99D46" },
  { name: "green", lightBg: "#EDF3EB", lightFg: "#458262", darkBg: "#2F443A", darkFg: "#72B183" },
  { name: "blue", lightBg: "#E7F3F8", lightFg: "#347EA9", darkBg: "#2D4156", darkFg: "#66AADA" },
  { name: "purple", lightBg: "#F4F0F7", lightFg: "#9165B0", darkBg: "#453A5B", darkFg: "#B098D8" },
  { name: "pink", lightBg: "#F9EEF3", lightFg: "#C14C8A", darkBg: "#51384D", darkFg: "#DE84D1" },
  { name: "red", lightBg: "#FDEBEC", lightFg: "#D34C47", darkBg: "#5E3436", darkFg: "#EA878C" }
];
function colorFor(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = h * 31 + text.charCodeAt(i) >>> 0;
  }
  return NOTION_COLORS[h % NOTION_COLORS.length];
}
function colorByName(name) {
  return NOTION_COLORS.find((c) => c.name === name);
}
function colorKey(text) {
  return text.replace(/^#/, "").toLowerCase();
}
function resolvePillColor(text, pinned, useDefaultColor = true) {
  const p = pinned.get(colorKey(text));
  if (p) return p;
  if (useDefaultColor) return colorFor(text);
  return { name: "default", lightBg: "transparent", lightFg: "inherit", darkBg: "transparent", darkFg: "inherit" };
}
function applyColorVars(el, c) {
  el.setCssProps({
    "--ntn-pill-bg-light": c.lightBg,
    "--ntn-pill-fg-light": c.lightFg,
    "--ntn-pill-bg-dark": c.darkBg,
    "--ntn-pill-fg-dark": c.darkFg
  });
}
function applyPillColor(pill, text, pinned, useDefaultColor = true) {
  applyColorVars(pill, resolvePillColor(text, pinned, useDefaultColor));
}

// src/lib/pills.ts
var import_obsidian = require("obsidian");
function bareName(prop) {
  return prop.split(".").slice(1).join(".");
}
function computePillProps(props, entries, config, app) {
  const pillProps = /* @__PURE__ */ new Set();
  const listProps = /* @__PURE__ */ new Set();
  const userListed = config.get("pillProperties");
  const userSet = new Set(
    Array.isArray(userListed) ? userListed.map((s) => String(s).toLowerCase().trim()) : []
  );
  const mtm = app.metadataTypeManager;
  for (const prop of props) {
    const bare = bareName(prop).toLowerCase();
    const display = config.getDisplayName(prop).toLowerCase();
    const info = mtm?.getPropertyInfo?.(bare);
    const metaType = typeof info === "string" ? info : info?.widget ?? info?.type;
    let isList = metaType === "multitext" || metaType === "tags" || metaType === "aliases";
    if (!isList) {
      for (const entry of entries) {
        if (entry.getValue(prop) instanceof import_obsidian.ListValue) {
          isList = true;
          break;
        }
      }
    }
    if (isList) listProps.add(prop);
    if (isList || bare === "tags" || userSet.has(bare) || userSet.has(display)) {
      pillProps.add(prop);
    }
  }
  return { pillProps, listProps };
}
function stripPath(str) {
  if (!str || typeof str !== "string") return str;
  if (str.match(/^https?:\/\//)) return str;
  if (str.match(/\[\[.*?\]\]/)) return str;
  if (str.includes(",")) {
    return str.split(",").map((s) => {
      const trimmed = s.trim();
      return trimmed.split("/").pop() || trimmed;
    }).join(", ");
  }
  return str.split("/").pop() || str;
}
function parsePinnedColors(raw) {
  const pinned = /* @__PURE__ */ new Map();
  if (!Array.isArray(raw)) return pinned;
  for (const item of raw) {
    const m = String(item).match(/^(.+?)\s*[=:]\s*(.+)$/);
    if (!m) continue;
    const value = m[1].trim().replace(/^#/, "").toLowerCase();
    const colorName = m[2].trim().toLowerCase();
    const color = colorByName(colorName);
    if (value && color) pinned.set(value, color);
  }
  return pinned;
}

// src/lib/groups.ts
var import_obsidian2 = require("obsidian");
function buildGroupTree(groups) {
  const roots = /* @__PURE__ */ new Map();
  for (const group of groups) {
    if (!group.hasKey() || !group.key) {
      roots.set("", { key: "", fullKey: "", entries: [...group.entries], children: /* @__PURE__ */ new Map() });
      continue;
    }
    const rawKey = group.key.toString();
    const parts = rawKey.split("/");
    let currentMap = roots;
    let currentFullKey = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentFullKey = currentFullKey ? `${currentFullKey}/${part}` : part;
      if (!currentMap.has(part)) {
        currentMap.set(part, {
          key: part,
          fullKey: currentFullKey,
          entries: [],
          children: /* @__PURE__ */ new Map()
        });
      }
      const node = currentMap.get(part);
      if (i === parts.length - 1) {
        node.entries.push(...group.entries);
      }
      currentMap = node.children;
    }
  }
  return roots;
}
function buildFolderGroups(groups) {
  const roots = /* @__PURE__ */ new Map();
  const nodesByPath = /* @__PURE__ */ new Map();
  const ensureNode = (path) => {
    const existing = nodesByPath.get(path);
    if (existing) return existing;
    const lastSlash = path.lastIndexOf("/");
    const node = {
      key: lastSlash === -1 ? path : path.slice(lastSlash + 1),
      fullKey: path,
      entries: [],
      children: /* @__PURE__ */ new Map()
    };
    nodesByPath.set(path, node);
    if (lastSlash === -1) {
      roots.set(path, node);
    } else {
      ensureNode(path.slice(0, lastSlash)).children.set(path, node);
    }
    return node;
  };
  for (const group of groups) {
    if (!group.hasKey() || !group.key) {
      roots.set("", { key: "", fullKey: "", entries: [...group.entries], children: /* @__PURE__ */ new Map() });
      continue;
    }
    ensureNode(group.key.toString()).entries.push(...group.entries);
  }
  return roots;
}
function isGroupedByFolder(app, groups) {
  let sawKeyedGroup = false;
  for (const group of groups) {
    if (!group.hasKey() || !group.key) continue;
    sawKeyedGroup = true;
    const path = group.key.toString();
    if (!(app.vault.getAbstractFileByPath(path) instanceof import_obsidian2.TFolder)) return false;
  }
  return sawKeyedGroup;
}
function hideSoleTopLevelFolder(roots) {
  let current = roots;
  for (; ; ) {
    const realRoots = [...current.entries()].filter(([key]) => key !== "");
    if (realRoots.length !== 1) return current;
    const [, top] = realRoots[0];
    const result = /* @__PURE__ */ new Map();
    const ungrouped = current.get("");
    if (top.entries.length || ungrouped) {
      result.set("", {
        key: "",
        fullKey: "",
        entries: [...ungrouped?.entries ?? [], ...top.entries],
        children: /* @__PURE__ */ new Map()
      });
    }
    for (const [childKey, childNode] of top.children) {
      result.set(childKey, childNode);
    }
    current = result;
  }
}
function countEntries(node) {
  let count = node.entries.length;
  for (const child of node.children.values()) {
    count += countEntries(child);
  }
  return count;
}

// src/lib/property-types.ts
function bareName2(prop) {
  return prop.split(".").slice(1).join(".").toLowerCase();
}
function getPropertyMetaType(app, prop) {
  const mtm = app.metadataTypeManager;
  const info = mtm?.getPropertyInfo?.(bareName2(prop));
  if (typeof info === "string") return info;
  return info?.widget ?? info?.type;
}
function getPropertyIcon(app, prop) {
  if (prop.startsWith("file.") && bareName2(prop) === "name") return "file-text";
  switch (getPropertyMetaType(app, prop)) {
    case "number":
      return "hash";
    case "checkbox":
      return "check-square";
    case "date":
    case "datetime":
      return "calendar";
    case "multitext":
    case "tags":
    case "aliases":
      return "tags";
    default:
      return "type";
  }
}

// src/lib/values.ts
var import_obsidian3 = require("obsidian");
function valueToStrings(value) {
  if (value === null) return [];
  if (value instanceof import_obsidian3.ListValue) {
    const out = [];
    for (let i = 0; i < value.length(); i++) {
      const s2 = value.get(i).toString();
      if (s2) out.push(s2);
    }
    return out;
  }
  const s = value.toString();
  return s ? [s] : [];
}

// src/view/note-modal.ts
var import_obsidian4 = require("obsidian");

// src/lib/frontmatter.ts
function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n(?:[\s\S]*?\r?\n)?---(?:\r?\n|$)/);
  if (!match) return { frontmatter: "", body: raw };
  return { frontmatter: match[0], body: raw.slice(match[0].length) };
}

// src/view/note-modal.ts
var NotePageModal = class extends import_obsidian4.Modal {
  constructor(app, file, deps) {
    super(app);
    /** Lifetime owner for MarkdownRenderer children; replaced per render. */
    this.renderComp = null;
    this.saveTimer = null;
    /** True while the textarea holds keystrokes not yet written to disk. */
    this.dirty = false;
    this.file = file;
    this.deps = deps;
  }
  onOpen() {
    void this.buildPanel();
  }
  async buildPanel() {
    const { contentEl, modalEl } = this;
    modalEl.addClass("ntn-page-modal");
    contentEl.addClass("ntn-page-content");
    const openTabBtn = modalEl.createDiv({
      cls: "ntn-page-open-tab",
      attr: { "aria-label": "Open in new tab", tabindex: "0" }
    });
    (0, import_obsidian4.setIcon)(openTabBtn, "maximize-2");
    const openInTab = () => {
      this.close();
      void this.app.workspace.getLeaf(true).openFile(this.file);
    };
    openTabBtn.addEventListener("click", openInTab);
    openTabBtn.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter" || evt.key === " ") {
        evt.preventDefault();
        openInTab();
      }
    });
    this.pageTitleEl = contentEl.createEl("h1", {
      cls: "ntn-page-title",
      // plaintext-only keeps pasted rich text from injecting HTML
      // (supported in Electron/Chromium, which is all Obsidian runs on).
      attr: { contenteditable: "plaintext-only", "data-placeholder": "Untitled" }
    });
    this.pageTitleEl.setText(this.file.basename);
    this.pageTitleEl.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        this.editBody();
      }
    });
    this.pageTitleEl.addEventListener("blur", () => void this.commitTitle());
    const { frontmatter, body } = splitFrontmatter(await this.app.vault.read(this.file));
    this.propsEl = contentEl.createDiv({ cls: "ntn-page-props" });
    this.renderPropertyRows(this.parseProperties(frontmatter));
    this.previewEl = contentEl.createDiv({
      cls: "ntn-page-preview markdown-rendered"
    });
    this.previewEl.addEventListener("click", (evt) => {
      const link = evt.target.closest("a");
      if (link?.hasClass("internal-link")) {
        evt.preventDefault();
        const target = link.getAttribute("data-href") ?? link.getAttribute("href") ?? "";
        this.close();
        void this.app.workspace.openLinkText(target, this.file.path, import_obsidian4.Keymap.isModEvent(evt));
        return;
      }
      if (link) return;
      this.editBody();
    });
    this.bodyArea = contentEl.createEl("textarea", {
      cls: "ntn-page-body ntn-hidden",
      attr: { placeholder: "Write something\u2026" }
    });
    this.bodyArea.value = body;
    this.bodyArea.addEventListener("input", () => {
      this.autoSizeBody();
      this.scheduleSave();
    });
    this.bodyArea.addEventListener("blur", () => {
      if (this.dirty) void this.saveBody();
      void this.showPreview();
    });
    await this.renderPreview();
    this.pageTitleEl.focus();
    contentEl.win.getSelection()?.selectAllChildren(this.pageTitleEl);
  }
  // ---------------- Body: preview <-> edit ----------------
  /** Swap the rendered body for the markdown textarea and focus it. */
  editBody() {
    this.previewEl.addClass("ntn-hidden");
    this.bodyArea.removeClass("ntn-hidden");
    this.autoSizeBody();
    this.bodyArea.focus();
  }
  /**
   * Grow the textarea to fit its content so the whole body stays readable
   * while editing — the panel scrolls, the textarea never does. Without
   * this, a long properties list plus the title can crush a flex-sized
   * textarea to nothing (many-properties bug, July 2026).
   */
  autoSizeBody() {
    this.bodyArea.setCssStyles({ height: "auto" });
    this.bodyArea.setCssStyles({ height: `${this.bodyArea.scrollHeight + 2}px` });
  }
  /** Swap the textarea back for the freshly rendered markdown. */
  async showPreview() {
    this.bodyArea.addClass("ntn-hidden");
    this.previewEl.removeClass("ntn-hidden");
    await this.renderPreview();
  }
  async renderPreview() {
    this.renderComp?.unload();
    this.renderComp = new import_obsidian4.Component();
    this.renderComp.load();
    this.previewEl.empty();
    const markdown = this.bodyArea.value;
    if (!markdown.trim()) {
      this.previewEl.createDiv({
        cls: "ntn-page-preview-empty",
        text: "Write something\u2026"
      });
      return;
    }
    await import_obsidian4.MarkdownRenderer.render(
      this.app,
      markdown,
      this.previewEl,
      this.file.path,
      this.renderComp
    );
  }
  // ---------------- Properties ----------------
  /** Re-read the file and rebuild the property rows from what's on disk. */
  async refreshProperties() {
    const { frontmatter } = splitFrontmatter(await this.app.vault.read(this.file));
    this.renderPropertyRows(this.parseProperties(frontmatter));
  }
  renderPropertyRows(props) {
    this.propsEl.empty();
    for (const [key, value] of Object.entries(props)) {
      this.renderPropertyRow(key, value);
    }
  }
  renderPropertyRow(key, value) {
    const row = this.propsEl.createDiv({ cls: "ntn-page-prop" });
    row.createDiv({ cls: "ntn-page-prop-name", text: key });
    const valueEl = row.createDiv({ cls: "ntn-page-prop-value" });
    const isPill = this.deps.isPillProp(key) || Array.isArray(value);
    const editable = key !== "tags";
    if (isPill) {
      const items = Array.isArray(value) ? value.map((v) => this.formatScalar(v)) : this.isEmpty(value) ? [] : [this.formatScalar(value)];
      for (const item of items) {
        const pill = valueEl.createSpan({ cls: "ntn-pill" });
        this.deps.applyColor(pill, item);
        pill.setText(item.replace(/^#/, "").split("/").pop() || "");
      }
      if (!items.length) this.renderEmpty(valueEl);
      if (editable) {
        valueEl.addClass("ntn-page-prop-editable");
        valueEl.addEventListener("click", () => {
          this.deps.openSelect({
            anchor: valueEl,
            file: this.file,
            propName: key,
            current: items,
            isList: this.deps.isListProp(key) || Array.isArray(value),
            onWrite: () => void this.refreshProperties()
          });
        });
        this.deps.reanchorSelect(valueEl, this.file.path, key);
      }
      return;
    }
    if (typeof value === "boolean") {
      const cb = valueEl.createEl("input", { type: "checkbox", cls: "ntn-checkbox" });
      cb.checked = value;
      cb.addEventListener("change", () => void this.writeAndRefresh(key, cb.checked));
      return;
    }
    if (this.isEmpty(value)) this.renderEmpty(valueEl);
    else valueEl.createSpan({ text: this.formatScalar(value) });
    if (editable) {
      valueEl.addClass("ntn-page-prop-editable");
      valueEl.addEventListener("click", () => this.editScalar(valueEl, key, value));
    }
  }
  /** Swap a property row's value for an input; Enter/blur commits, Esc cancels. */
  editScalar(valueEl, key, value) {
    if (valueEl.querySelector(".ntn-input")) return;
    const kind = typeof value === "number" ? "number" : "text";
    const current = this.isEmpty(value) ? "" : this.formatScalar(value);
    valueEl.empty();
    const input = valueEl.createEl("input", {
      type: "text",
      cls: "ntn-input ntn-page-prop-input"
    });
    input.value = current;
    input.focus();
    input.select();
    let committed = false;
    const commit = () => {
      if (committed) return;
      committed = true;
      const raw = input.value.trim();
      if (raw === current) {
        void this.refreshProperties();
        return;
      }
      let out = raw;
      if (kind === "number") {
        const n = Number(raw);
        out = raw === "" ? null : Number.isNaN(n) ? raw : n;
      } else if (raw === "") {
        out = null;
      }
      void this.writeAndRefresh(key, out);
    };
    input.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        commit();
      } else if (evt.key === "Escape") {
        committed = true;
        evt.preventDefault();
        evt.stopPropagation();
        void this.refreshProperties();
      }
    });
    input.addEventListener("blur", commit);
  }
  async writeAndRefresh(propName, value) {
    await this.deps.write(this.file, propName, value);
    await this.refreshProperties();
  }
  parseProperties(frontmatter) {
    if (!frontmatter) return {};
    const yaml = frontmatter.replace(/^---\r?\n/, "").replace(/---\r?\n?$/, "");
    try {
      const parsed = (0, import_obsidian4.parseYaml)(yaml);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.error(`${LOG_PREFIX} failed to parse note frontmatter`, e);
    }
    return {};
  }
  isEmpty(value) {
    return value === null || value === void 0 || value === "";
  }
  renderEmpty(valueEl) {
    valueEl.createSpan({ cls: "ntn-page-prop-empty", text: "Empty" });
  }
  /** YAML scalars as Notion would show them (dates as yyyy-mm-dd). */
  formatScalar(value) {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return String(value);
  }
  // ---------------- Body ----------------
  /** Debounced autosave: write 400ms after the last keystroke. */
  scheduleSave() {
    this.dirty = true;
    const win = this.contentEl.win;
    if (this.saveTimer !== null) win.clearTimeout(this.saveTimer);
    this.saveTimer = win.setTimeout(() => void this.saveBody(), 400);
  }
  async saveBody() {
    this.dirty = false;
    try {
      await this.app.vault.process(
        this.file,
        (data) => splitFrontmatter(data).frontmatter + this.bodyArea.value
      );
    } catch (e) {
      console.error(`${LOG_PREFIX} failed to save note body`, e);
      new import_obsidian4.Notice("Couldn't save the note.");
    }
  }
  // ---------------- Title ----------------
  /** Rename the file to match the title; revert the h1 if that fails. */
  async commitTitle() {
    const title = (this.pageTitleEl.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!title || title === this.file.basename) return;
    const folder = this.file.parent?.path ?? "";
    const newPath = folder && folder !== "/" ? `${folder}/${title}.md` : `${title}.md`;
    try {
      await this.app.fileManager.renameFile(this.file, newPath);
    } catch (e) {
      console.error(`${LOG_PREFIX} failed to rename note`, e);
      new import_obsidian4.Notice(`Couldn't rename the note to "${title}".`);
      this.pageTitleEl.setText(this.file.basename);
    }
  }
  onClose() {
    this.deps.closeSelect();
    this.renderComp?.unload();
    this.renderComp = null;
    if (this.saveTimer !== null) this.contentEl.win.clearTimeout(this.saveTimer);
    void this.flushPendingEdits();
    this.contentEl.empty();
  }
  async flushPendingEdits() {
    if (this.dirty) await this.saveBody();
    await this.commitTitle();
  }
};

// src/view/select-editor.ts
var import_obsidian5 = require("obsidian");
var SelectEditor = class {
  constructor(deps) {
    this.deps = deps;
    /** Open color-picker flyout, if any (a sibling popover on the body). */
    this.colorMenu = null;
    this.closed = false;
    /** Distinct known values for this property: lowercase key → display text. */
    this.known = /* @__PURE__ */ new Map();
    const { entries, current, prop } = deps;
    for (const e of entries) {
      for (const s of valueToStrings(e.getValue(prop))) {
        const display = s.replace(/^#/, "");
        if (display && !this.known.has(display.toLowerCase())) {
          this.known.set(display.toLowerCase(), display);
        }
      }
    }
    this.selected = current.map((s) => s.replace(/^#/, ""));
    this.orderKeys = this.buildInitialOrder();
    this.menu = this.build();
    this.position();
  }
  /** The saved order, plus any known value it doesn't mention yet, appended at the end. */
  buildInitialOrder() {
    const stored = this.deps.getOrder().filter((k) => this.known.has(k));
    const seen = new Set(stored);
    const ordered = [...stored];
    for (const key of this.known.keys()) if (!seen.has(key)) ordered.push(key);
    return ordered;
  }
  /** Whether the given node lives inside the menu or its color flyout. */
  contains(node) {
    if (!node) return false;
    return this.menu.contains(node) || (this.colorMenu?.contains(node) ?? false);
  }
  /** The cell element this menu is anchored to (drives click-to-toggle). */
  get anchorEl() {
    return this.deps.anchor;
  }
  /**
   * Re-point the menu at a freshly rendered cell for the same file +
   * property. `onDataUpdated` replaces every `td`, so without this the
   * anchor would dangle on a detached node and click-to-toggle (which
   * compares against the live cell) would miss. Returns whether it matched.
   */
  reanchorIfMatches(td, filePath, prop) {
    if (this.closed) return false;
    if (this.deps.prop !== prop || this.deps.file.path !== filePath) return false;
    this.deps.anchor = td;
    return true;
  }
  /** Tear the menu down. Idempotent; notifies the owner via `onClose`. */
  close() {
    if (this.closed) return;
    this.closed = true;
    this.closeColorMenu();
    this.menu.remove();
    this.deps.onClose();
  }
  closeColorMenu() {
    this.colorMenu?.remove();
    this.colorMenu = null;
  }
  build() {
    const { doc, isList } = this.deps;
    const menu = doc.body.createDiv({ cls: "ntn-root ntn-select-menu" });
    const currentEl = menu.createDiv({ cls: "ntn-select-current" });
    this.pillsWrap = currentEl.createDiv({ cls: "ntn-select-pills" });
    this.input = currentEl.createEl("input", {
      type: "text",
      cls: "ntn-select-input",
      attr: { placeholder: "Search or create\u2026", spellcheck: "false" }
    });
    menu.createDiv({
      cls: "ntn-select-hint",
      text: isList ? "Select options or create one" : "Select an option or create one"
    });
    this.optionsEl = menu.createDiv({ cls: "ntn-select-options" });
    this.input.addEventListener("input", () => this.renderOptions());
    this.input.addEventListener("keydown", (evt) => this.onKeydown(evt));
    this.renderPills();
    this.renderOptions();
    this.input.focus();
    return menu;
  }
  /** Empty selection deletes the property (`write` treats `null` as delete). */
  write() {
    const out = this.deps.isList ? this.selected.length ? this.selected : null : this.selected[0] ?? null;
    this.deps.write(out);
  }
  renderPills() {
    this.pillsWrap.empty();
    for (const v of this.selected) {
      const pill = this.pillsWrap.createSpan({ cls: "ntn-pill" });
      this.deps.applyColor(pill, v);
      pill.createSpan({ text: v.split("/").pop() || "" });
      const x = pill.createSpan({ cls: "ntn-pill-remove", text: "\u2715" });
      x.addEventListener("click", (evt) => {
        evt.stopPropagation();
        this.selected = this.selected.filter((s) => s !== v);
        this.write();
        this.renderPills();
        this.renderOptions();
      });
    }
  }
  pick(v) {
    if (this.deps.isList) {
      const has = this.selected.some((s) => s.toLowerCase() === v.toLowerCase());
      this.selected = has ? this.selected.filter((s) => s.toLowerCase() !== v.toLowerCase()) : [...this.selected, v];
      if (!this.known.has(v.toLowerCase())) {
        this.known.set(v.toLowerCase(), v);
        this.orderKeys.push(v.toLowerCase());
      }
      this.write();
      this.input.value = "";
      this.renderPills();
      this.renderOptions();
      this.input.focus();
    } else {
      this.selected = [v];
      this.write();
      this.close();
    }
  }
  /** Move `key` next to `targetKey` (before/after) and persist the new order. */
  reorderOption(key, targetKey, after) {
    this.orderKeys = this.orderKeys.filter((k) => k !== key);
    let idx = this.orderKeys.indexOf(targetKey);
    if (idx === -1) idx = this.orderKeys.length;
    if (after) idx += 1;
    this.orderKeys.splice(idx, 0, key);
    this.deps.setOrder(this.orderKeys);
    this.renderOptions();
  }
  /** Press-and-drag on a row's grip handle to reorder the option list. */
  startOptionDrag(startEvt, key) {
    const doc = this.deps.doc;
    const startX = startEvt.clientX;
    const startY = startEvt.clientY;
    let dragging = false;
    let dropRow = null;
    let insertAfter = false;
    const clearIndicator = () => {
      dropRow?.removeClass("ntn-select-drop-before");
      dropRow?.removeClass("ntn-select-drop-after");
      dropRow = null;
    };
    const onMove = (ev) => {
      if (!dragging) {
        if (Math.abs(ev.clientX - startX) < 4 && Math.abs(ev.clientY - startY) < 4) return;
        dragging = true;
      }
      const el = doc.elementFromPoint(ev.clientX, ev.clientY);
      const row = el?.closest(".ntn-select-option");
      clearIndicator();
      const targetKey = row?.getAttr("data-ntn-key");
      if (row && targetKey && targetKey !== key) {
        const rect = row.getBoundingClientRect();
        insertAfter = ev.clientY > rect.top + rect.height / 2;
        row.addClass(insertAfter ? "ntn-select-drop-after" : "ntn-select-drop-before");
        dropRow = row;
      }
    };
    const onUp = () => {
      doc.removeEventListener("pointermove", onMove);
      doc.removeEventListener("pointerup", onUp);
      const targetKey = dropRow?.getAttr("data-ntn-key");
      clearIndicator();
      if (dragging && targetKey && targetKey !== key) {
        this.reorderOption(key, targetKey, insertAfter);
      }
    };
    doc.addEventListener("pointermove", onMove);
    doc.addEventListener("pointerup", onUp);
  }
  renderOptions() {
    this.closeColorMenu();
    this.optionsEl.empty();
    const q = this.input.value.trim();
    const ql = q.toLowerCase();
    const visible = this.orderKeys.filter((key) => this.known.has(key)).map((key) => [key, this.known.get(key)]).filter(([, o]) => !ql || o.toLowerCase().includes(ql));
    for (const [key, o] of visible) {
      const row = this.optionsEl.createDiv({ cls: "ntn-select-option", attr: { "data-ntn-key": key } });
      const grip = row.createSpan({ cls: "ntn-select-grip", attr: { "aria-label": "Drag to reorder" } });
      (0, import_obsidian5.setIcon)(grip, "grip-vertical");
      grip.addEventListener("pointerdown", (evt) => {
        evt.stopPropagation();
        this.startOptionDrag(evt, key);
      });
      grip.addEventListener("click", (evt) => evt.stopPropagation());
      const isSelected = this.selected.some((s) => s.toLowerCase() === o.toLowerCase());
      row.createSpan({ cls: "ntn-select-check", text: isSelected ? "\u2713" : "" });
      const pill = row.createSpan({ cls: "ntn-pill" });
      this.deps.applyColor(pill, o);
      pill.setText(o.split("/").pop() || "");
      const colorBtn = row.createSpan({
        cls: "ntn-select-color-btn",
        attr: { "aria-label": "Change color" }
      });
      this.deps.applyColor(colorBtn, o);
      colorBtn.addEventListener("click", (evt) => {
        evt.stopPropagation();
        this.openColorMenu(colorBtn, o);
      });
      row.addEventListener("click", () => this.pick(o));
    }
    if (q && !this.known.has(ql)) {
      const row = this.optionsEl.createDiv({ cls: "ntn-select-option" });
      row.createSpan({ cls: "ntn-select-grip" });
      row.createSpan({ cls: "ntn-select-create", text: "+" });
      const pill = row.createSpan({ cls: "ntn-pill" });
      this.deps.applyColor(pill, q);
      pill.setText(q.split("/").pop() || "");
      row.addEventListener("click", () => this.pick(q));
    }
    if (!visible.length && !q) {
      this.optionsEl.createDiv({
        cls: "ntn-select-empty",
        text: "No options yet \u2014 type to create one"
      });
    }
  }
  onKeydown(evt) {
    if (evt.key === "Escape") {
      evt.preventDefault();
      evt.stopPropagation();
      this.close();
    } else if (evt.key === "Enter") {
      const q = this.input.value.trim();
      if (q) this.pick(this.known.get(q.toLowerCase()) ?? q);
      else this.close();
    } else if (evt.key === "Backspace" && this.input.value === "" && this.deps.isList && this.selected.length) {
      this.selected = this.selected.slice(0, -1);
      this.write();
      this.renderPills();
      this.renderOptions();
    }
  }
  /** Open the color picker for a value, anchored to its row button. */
  openColorMenu(anchorEl, value) {
    this.closeColorMenu();
    const menu = this.deps.doc.body.createDiv({ cls: "ntn-root ntn-color-menu" });
    this.colorMenu = menu;
    const options = [{ name: "default" }, ...NOTION_COLORS];
    for (const c of options) {
      const item = menu.createDiv({ cls: "ntn-color-option" });
      const swatch = item.createSpan({ cls: "ntn-color-swatch" });
      if (c.name !== "default") {
        applyColorVars(swatch, c);
      }
      item.createSpan({ cls: "ntn-color-name", text: c.name.charAt(0).toUpperCase() + c.name.slice(1) });
      item.addEventListener("click", (evt) => {
        evt.stopPropagation();
        this.deps.setColor(value, c.name);
        this.renderPills();
        this.renderOptions();
      });
    }
    this.clampToWindow(menu, anchorEl.getBoundingClientRect());
  }
  /** Anchor the main menu below the cell, then clamp into the window. */
  position() {
    const rect = this.deps.anchor.getBoundingClientRect();
    this.menu.setCssStyles({ minWidth: `${Math.max(rect.width, 220)}px` });
    this.clampToWindow(this.menu, rect);
  }
  /** Place a popover just below `anchorRect`, nudged to stay on screen. */
  clampToWindow(el, anchorRect) {
    const { win } = this.deps;
    el.setCssStyles({
      left: `${anchorRect.left}px`,
      top: `${anchorRect.bottom + 4}px`
    });
    const rect = el.getBoundingClientRect();
    if (rect.bottom > win.innerHeight - 8) {
      el.setCssStyles({ top: `${Math.max(8, anchorRect.top - rect.height - 4)}px` });
    }
    if (rect.right > win.innerWidth - 8) {
      el.setCssStyles({ left: `${Math.max(8, win.innerWidth - rect.width - 8)}px` });
    }
  }
};

// src/view/notion-table-view.ts
var NotionTableView = class extends import_obsidian6.BasesView {
  constructor(controller, parentEl) {
    super(controller);
    this.type = NOTION_TABLE_VIEW;
    /** True while the toolbar's New button is rerouted to the page panel. */
    this.newButtonPatched = false;
    /** Pill / list classification, recomputed each update. */
    this.pills = { pillProps: /* @__PURE__ */ new Set(), listProps: /* @__PURE__ */ new Set() };
    /** User-pinned value → color overrides from the `pinnedColors` view option. */
    this.pinnedColors = /* @__PURE__ */ new Map();
    /** Set of group full keys that are currently collapsed. */
    this.collapsedGroups = /* @__PURE__ */ new Set();
    /** The open select editor, if any (also drives outside-click detection). */
    this.selectEditor = null;
    /** Pending single-click sort toggle; a second click within the window cancels it (see {@link setupHeaderInteraction}). */
    this.sortClickTimer = null;
    this.queryCtrl = controller;
    this.rootEl = parentEl.createDiv({ cls: "ntn-root" });
    this.register(() => this.closeSelectMenu());
    this.registerDomEvent(this.rootEl.doc, "pointerdown", (evt) => {
      if (!this.selectEditor) return;
      const target = evt.target;
      if (this.selectEditor.contains(target)) return;
      if (this.selectEditor.anchorEl.contains(target)) return;
      this.closeSelectMenu();
    }, { capture: true });
    this.patchToolbarNew();
  }
  onDataUpdated() {
    this.patchToolbarNew();
    const root = this.rootEl;
    root.empty();
    root.toggleClass("ntn-wrap", this.config.get("wrapCells") !== false);
    root.toggleClass("ntn-vlines", this.config.get("verticalLines") !== false);
    const props = this.applyColumnOrder(this.config.getOrder());
    this.pills = computePillProps(props, this.data.data, this.config, this.app);
    this.pinnedColors = parsePinnedColors(this.config.get("pinnedColors"));
    const sortState = this.getSortState();
    const table = root.createEl("table", { cls: "ntn-table" });
    const thead = table.createEl("thead");
    const headRow = thead.createEl("tr");
    const customNames = this.config.get("columnNames") || {};
    const wrapColumns = this.config.get("wrapColumns") || [];
    headRow.createEl("th", { cls: "ntn-th ntn-col-title ntn-col-dummy" });
    const columnIcons = this.config.get("columnIcons") || {};
    for (const prop of props) {
      const th = headRow.createEl("th", { cls: "ntn-th", attr: { "data-ntn-prop": prop } });
      const titleWrap = th.createDiv({ cls: "ntn-th-title" });
      const icon = columnIcons[prop] || getPropertyIcon(this.app, prop);
      const iconSpan = titleWrap.createSpan({ cls: "ntn-th-icon" });
      (0, import_obsidian6.setIcon)(iconSpan, icon);
      const titleText = customNames[prop] || this.config.getDisplayName(prop);
      const titleSpan = titleWrap.createSpan({ text: titleText, cls: "ntn-th-title-text" });
      if (sortState?.prop === prop) {
        const sortIcon = titleWrap.createSpan({ cls: "ntn-th-sort-icon" });
        (0, import_obsidian6.setIcon)(sortIcon, sortState.direction === "asc" ? "arrow-up" : "arrow-down");
      }
      titleSpan.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        this.startRename(titleSpan, prop, titleText);
      });
      this.setupHeaderInteraction(th, titleWrap, prop, props);
      th.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const menu = new import_obsidian6.Menu();
        menu.addItem((item) => {
          item.setTitle("Change icon").setIcon("smile").onClick(() => this.openIconPicker(iconSpan, prop));
        });
        menu.addItem((item) => {
          item.setTitle("Change property name").setIcon("pencil").onClick(() => this.startRename(titleSpan, prop, titleText));
        });
        menu.addSeparator();
        const isWrapped = wrapColumns.includes(prop);
        menu.addItem((item) => {
          item.setTitle(isWrapped ? "Disable Wrap" : "Enable Wrap").setIcon("lines-of-text").onClick(() => {
            const newWrap = isWrapped ? wrapColumns.filter((c) => c !== prop) : [...wrapColumns, prop];
            this.config.set("wrapColumns", newWrap);
          });
        });
        if (this.pills.pillProps.has(prop)) {
          const disableColorColumns = this.config.get("disableColorColumns") || [];
          const isColorDisabled = disableColorColumns.includes(prop);
          menu.addItem((item) => {
            item.setTitle(isColorDisabled ? "Enable Default Colors" : "Disable Default Colors").setIcon("palette").onClick(() => {
              const newDisable = isColorDisabled ? disableColorColumns.filter((c) => c !== prop) : [...disableColorColumns, prop];
              this.config.set("disableColorColumns", newDisable);
            });
          });
        }
        menu.showAtMouseEvent(e);
      });
      this.applyColumnWidth(th, prop);
    }
    const tbody = table.createEl("tbody");
    const colCount = props.length + 1;
    let renderedCount = 0;
    let limitRaw = this.config.get("rowLimit");
    if (limitRaw === void 0) limitRaw = 50;
    const limit = limitRaw === "all" ? "all" : parseInt(String(limitRaw), 10) || 50;
    const folderGrouped = isGroupedByFolder(this.app, this.data.groupedData);
    const roots = folderGrouped ? hideSoleTopLevelFolder(buildFolderGroups(this.data.groupedData)) : buildGroupTree(this.data.groupedData);
    if (sortState) {
      for (const rootNode of roots.values()) this.applySortToTree(rootNode, sortState);
    }
    const renderNode = (node, depth) => {
      if (limit !== "all" && renderedCount >= limit) return;
      let isCollapsed = false;
      if (node.key) {
        isCollapsed = this.collapsedGroups.has(node.fullKey);
        const gRow = tbody.createEl("tr", { cls: "ntn-group-row" });
        const gCell = gRow.createEl("td", { attr: { colspan: String(colCount) } });
        const headerIndent = folderGrouped ? depth > 0 ? 30 : 10 : depth * 20 + 10;
        gCell.setCssProps({ "--ntn-indent": `${headerIndent}px` });
        const toggleIcon = gCell.createSpan({ cls: "ntn-group-toggle" });
        toggleIcon.setText(isCollapsed ? "\u25B6" : "\u25BC");
        toggleIcon.addEventListener("click", () => {
          if (isCollapsed) {
            this.collapsedGroups.delete(node.fullKey);
          } else {
            this.collapsedGroups.add(node.fullKey);
          }
          this.onDataUpdated();
        });
        if (folderGrouped) {
          gCell.createSpan({ cls: "ntn-group-folder-label", text: node.key });
        } else {
          const pill = gCell.createSpan({ cls: "ntn-pill" });
          this.applyPillColor(pill, node.fullKey);
          pill.setText(node.key);
        }
        gCell.createSpan({ cls: "ntn-group-count", text: String(countEntries(node)) });
      }
      if (isCollapsed) return;
      for (const entry of node.entries) {
        if (limit !== "all" && renderedCount >= limit) break;
        const tr = this.renderRow(tbody, entry, props);
        if (node.key) {
          const firstVisibleCell = Array.from(tr.cells).find(
            (c) => !c.hasClass("ntn-col-dummy")
          );
          const entryIndent = folderGrouped ? depth > 0 ? 50 : 30 : depth * 20 + 30;
          firstVisibleCell?.setCssProps({ "--ntn-indent": `${entryIndent}px` });
        }
        renderedCount++;
      }
      for (const child of node.children.values()) {
        renderNode(child, node.key ? depth + 1 : depth);
      }
    };
    for (const rootNode of roots.values()) {
      renderNode(rootNode, 0);
    }
    const footerWrap = root.createDiv({ cls: "ntn-footer-wrap" });
    const newRow = footerWrap.createDiv({ cls: "ntn-new-row" });
    newRow.createSpan({ cls: "ntn-new-plus", text: "+" });
    newRow.createSpan({ text: "New" });
    newRow.addEventListener("click", () => void this.createAndOpenPage());
    const limitSelect = footerWrap.createDiv({ cls: "ntn-limit-subtle", text: `Rows: ${limit} \u25BE` });
    limitSelect.addEventListener("click", (e) => {
      const menu = new import_obsidian6.Menu();
      const limits = [10, 20, 50, "all"];
      limits.forEach((val) => {
        menu.addItem((item) => {
          item.setTitle(val === "all" ? "All" : String(val)).setChecked(String(val) === String(limit)).onClick(() => {
            this.config.set("rowLimit", val);
          });
        });
      });
      menu.showAtMouseEvent(e);
    });
  }
  applyColumnWidth(th, propId) {
    const widths = this.config.get("columnWidths") || {};
    const setWidth = (px) => th.setCssProps({ "--ntn-col-width": `${px}px` });
    let width = widths[propId] ?? 0;
    if (width) setWidth(width);
    const resizer = th.createDiv({ cls: "ntn-resizer" });
    let startX = 0;
    let startW = 0;
    let isResizing = false;
    const moveHandler = (ev) => {
      if (!isResizing) return;
      const dx = ev.clientX - startX;
      width = Math.max(20, startW + dx);
      setWidth(width);
    };
    const upHandler = () => {
      if (!isResizing) return;
      isResizing = false;
      resizer.removeClass("is-resizing");
      document.removeEventListener("pointermove", moveHandler);
      document.removeEventListener("pointerup", upHandler);
      const cur = this.config.get("columnWidths") || {};
      this.config.set("columnWidths", { ...cur, [propId]: width });
    };
    resizer.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing = true;
      startX = e.clientX;
      startW = th.getBoundingClientRect().width;
      resizer.addClass("is-resizing");
      document.addEventListener("pointermove", moveHandler);
      document.addEventListener("pointerup", upHandler);
    });
  }
  /** Apply the user's saved column order on top of Bases' own property order. */
  applyColumnOrder(props) {
    const stored = this.config.get("columnOrder");
    if (!Array.isArray(stored) || !stored.length) return props;
    const propSet = new Set(props);
    const ordered = stored.filter((p) => propSet.has(p));
    const seen = new Set(ordered);
    for (const p of props) if (!seen.has(p)) ordered.push(p);
    return ordered;
  }
  /** Move `fromProp` next to `toProp` (before/after) and persist the new order. */
  reorderColumn(props, fromProp, toProp, after) {
    const without = props.filter((p) => p !== fromProp);
    let toIndex = without.indexOf(toProp);
    if (toIndex === -1) return;
    if (after) toIndex += 1;
    without.splice(toIndex, 0, fromProp);
    this.config.set("columnOrder", without);
  }
  /** The current header-click sort, if any. */
  getSortState() {
    const raw = this.config.get("ntnSort");
    if (!raw || !raw.prop) return null;
    return { prop: raw.prop, direction: raw.direction === "desc" ? "desc" : "asc" };
  }
  /** Cycle a column's sort: none -> ascending -> descending -> none. Single-column, like Notion. */
  toggleSort(prop) {
    const current = this.getSortState();
    let next;
    if (!current || current.prop !== prop) {
      next = { prop, direction: "asc" };
    } else if (current.direction === "asc") {
      next = { prop, direction: "desc" };
    } else {
      next = null;
    }
    this.config.set("ntnSort", next);
  }
  /**
   * A plain click sorts; a click that turns into a drag reorders. Both
   * gestures start the same way, so tell them apart by movement past a
   * small threshold, then commit to one interpretation for the gesture.
   * The second click of a double-click (renaming) is swallowed by the
   * pending-timer dance in {@link scheduleSortToggle} so it never sorts.
   */
  setupHeaderInteraction(th, titleWrap, prop, props) {
    const THRESHOLD = 6;
    const doc = th.doc;
    titleWrap.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      if (e.target.closest(".ntn-rename-input")) return;
      const startX = e.clientX;
      const startY = e.clientY;
      let dragging = false;
      let dropTarget = null;
      let insertAfter = false;
      const clearIndicator = () => {
        dropTarget?.removeClass("ntn-col-drop-before");
        dropTarget?.removeClass("ntn-col-drop-after");
        dropTarget = null;
      };
      const onMove = (ev) => {
        if (!dragging) {
          if (Math.abs(ev.clientX - startX) < THRESHOLD && Math.abs(ev.clientY - startY) < THRESHOLD) return;
          dragging = true;
          th.addClass("ntn-th-dragging");
        }
        const el = doc.elementFromPoint(ev.clientX, ev.clientY);
        const targetTh = el?.closest("th.ntn-th");
        clearIndicator();
        if (targetTh && targetTh !== th && !targetTh.hasClass("ntn-col-dummy")) {
          const rect = targetTh.getBoundingClientRect();
          insertAfter = ev.clientX > rect.left + rect.width / 2;
          targetTh.addClass(insertAfter ? "ntn-col-drop-after" : "ntn-col-drop-before");
          dropTarget = targetTh;
        }
      };
      const onUp = () => {
        doc.removeEventListener("pointermove", onMove);
        doc.removeEventListener("pointerup", onUp);
        th.removeClass("ntn-th-dragging");
        const targetProp = dropTarget?.getAttr("data-ntn-prop");
        clearIndicator();
        if (dragging && targetProp && targetProp !== prop) {
          this.reorderColumn(props, prop, targetProp, insertAfter);
        } else if (!dragging) {
          this.scheduleSortToggle(prop);
        }
      };
      doc.addEventListener("pointermove", onMove);
      doc.addEventListener("pointerup", onUp);
    });
  }
  scheduleSortToggle(prop) {
    if (this.sortClickTimer !== null) {
      window.clearTimeout(this.sortClickTimer);
      this.sortClickTimer = null;
      return;
    }
    this.sortClickTimer = window.setTimeout(() => {
      this.sortClickTimer = null;
      this.toggleSort(prop);
    }, 250);
  }
  /** Sort every group's entries by `sortState`, recursing into nested groups. */
  applySortToTree(node, sortState) {
    const dir = sortState.direction === "asc" ? 1 : -1;
    node.entries.sort((a, b) => dir * this.compareEntries(a, b, sortState.prop));
    for (const child of node.children.values()) this.applySortToTree(child, sortState);
  }
  /**
   * Compare two entries by one property. Pill/select columns with a
   * user-defined option order (see the select editor's drag handles)
   * sort by that order instead of alphabetically; numbers and booleans
   * compare numerically; everything else falls back to a locale/numeric
   * string compare (which also sorts ISO dates correctly).
   */
  compareEntries(a, b, prop) {
    const va = a.getValue(prop);
    const vb = b.getValue(prop);
    if (va == null && vb == null) return 0;
    if (va == null) return -1;
    if (vb == null) return 1;
    if (this.pills.pillProps.has(prop)) {
      const order = this.getSelectOrder(prop);
      if (order) {
        const sa = (valueToStrings(va)[0] ?? "").toLowerCase();
        const sb = (valueToStrings(vb)[0] ?? "").toLowerCase();
        const ia = order.indexOf(sa);
        const ib = order.indexOf(sb);
        if (ia === -1 && ib === -1) return sa.localeCompare(sb);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      }
    }
    if (va instanceof import_obsidian6.NumberValue && vb instanceof import_obsidian6.NumberValue) {
      return Number(va.toString()) - Number(vb.toString());
    }
    if (va instanceof import_obsidian6.BooleanValue && vb instanceof import_obsidian6.BooleanValue) {
      return Number(va.isTruthy()) - Number(vb.isTruthy());
    }
    return va.toString().localeCompare(vb.toString(), void 0, { sensitivity: "base", numeric: true });
  }
  /** The user's saved option order for a select/pill property, or null if none is set. */
  getSelectOrder(prop) {
    const bare = prop.split(".").slice(1).join(".");
    const order = this.getSelectOptionOrder(bare);
    return order.length ? order : null;
  }
  /** Swap a header title for an inline rename input; Enter/blur commits, Esc cancels. */
  startRename(titleSpan, prop, titleText) {
    if (titleSpan.querySelector(".ntn-rename-input")) return;
    titleSpan.empty();
    const input = titleSpan.createEl("input", { type: "text", value: titleText, cls: "ntn-rename-input" });
    input.focus();
    input.select();
    const save = () => {
      const newName = input.value.trim();
      const current = this.config.get("columnNames") || {};
      if (newName && newName !== this.config.getDisplayName(prop)) {
        this.config.set("columnNames", { ...current, [prop]: newName });
      } else {
        const next = { ...current };
        delete next[prop];
        this.config.set("columnNames", next);
      }
    };
    input.addEventListener("blur", save);
    input.addEventListener("keydown", (ke) => {
      if (ke.key === "Enter") save();
      if (ke.key === "Escape") this.config.set("columnNames", this.config.get("columnNames"));
    });
  }
  /** A searchable Lucide icon grid, floated just below `anchor` (the column's icon glyph). */
  openIconPicker(anchor, prop) {
    const doc = anchor.doc;
    doc.querySelector(".ntn-icon-menu")?.remove();
    const menu = doc.body.createDiv({ cls: "ntn-root ntn-icon-menu" });
    const searchEl = menu.createEl("input", {
      type: "text",
      cls: "ntn-select-input ntn-icon-search",
      attr: { placeholder: "Search icons\u2026", spellcheck: "false" }
    });
    const gridEl = menu.createDiv({ cls: "ntn-icon-grid" });
    const allIcons = (0, import_obsidian6.getIconIds)();
    const renderGrid = (query) => {
      gridEl.empty();
      const q = query.trim().toLowerCase();
      const matches = (q ? allIcons.filter((id) => id.includes(q)) : allIcons).slice(0, 200);
      for (const iconId of matches) {
        const btn = gridEl.createDiv({ cls: "ntn-icon-option", attr: { "aria-label": iconId } });
        (0, import_obsidian6.setIcon)(btn, iconId);
        btn.addEventListener("click", () => {
          const current = this.config.get("columnIcons") || {};
          this.config.set("columnIcons", { ...current, [prop]: iconId });
          close();
        });
      }
    };
    renderGrid("");
    searchEl.addEventListener("input", () => renderGrid(searchEl.value));
    searchEl.focus();
    const rect = anchor.getBoundingClientRect();
    const win = anchor.win;
    const menuWidth = 260;
    const left = Math.min(rect.left, win.innerWidth - menuWidth - 8);
    menu.setCssStyles({ left: `${Math.max(8, left)}px`, top: `${rect.bottom + 4}px` });
    const onOutside = (e) => {
      if (!menu.contains(e.target)) close();
    };
    const close = () => {
      menu.remove();
      doc.removeEventListener("pointerdown", onOutside, true);
    };
    doc.addEventListener("pointerdown", onOutside, true);
    this.register(close);
  }
  renderRow(tbody, entry, props) {
    const tr = tbody.createEl("tr", { cls: "ntn-row" });
    tr.createEl("td", { cls: "ntn-td ntn-col-title ntn-col-dummy" });
    const widths = this.config.get("columnWidths") || {};
    for (const prop of props) {
      const td = tr.createEl("td", { cls: "ntn-td" });
      const width = widths[prop];
      if (width) td.setCssProps({ "--ntn-col-width": `${width}px` });
      if ((this.config.get("wrapColumns") || [])?.includes(prop)) {
        td.addClass("ntn-wrap-cell");
      }
      this.renderCell(td, entry, prop);
    }
    return tr;
  }
  renderCell(td, entry, prop) {
    if (prop === "file.name") {
      td.addClass("ntn-col-title");
      const titleWrap = td.createDiv({ cls: "ntn-title-wrap" });
      const link = titleWrap.createSpan({ text: entry.file.basename, cls: "ntn-title-text" });
      link.addEventListener("click", (evt) => {
        const modified = evt.ctrlKey || evt.metaKey;
        if (!modified && this.config.get("openMode") === "panel") {
          this.openPagePanel(entry.file);
          return;
        }
        void this.app.workspace.openLinkText(entry.file.path, "", modified);
      });
      return;
    }
    const value = entry.getValue(prop);
    const editable = prop.startsWith("note.");
    const propName = prop.split(".").slice(1).join(".");
    if (this.pills.pillProps.has(prop)) {
      const disableColorColumns = this.config.get("disableColorColumns") || [];
      const useDefaultColor = !disableColorColumns.includes(prop);
      const wrap = td.createDiv({ cls: "ntn-pills" });
      const items = valueToStrings(value);
      for (const item of items) {
        const pill = wrap.createSpan({ cls: "ntn-pill" });
        this.applyPillColor(pill, item, useDefaultColor);
        pill.setText(item.replace(/^#/, "").split("/").pop() || "");
      }
      if (editable) {
        td.addClass("ntn-editable");
        td.addEventListener(
          "click",
          () => this.openSelectEditor(td, entry, prop, propName, useDefaultColor)
        );
        this.selectEditor?.reanchorIfMatches(td, entry.file.path, prop);
      }
      return;
    }
    if (value instanceof import_obsidian6.BooleanValue) {
      const cb = td.createEl("input", { type: "checkbox", cls: "ntn-checkbox" });
      cb.checked = value.isTruthy();
      if (editable) {
        cb.addEventListener("change", () => {
          void this.writeProperty(entry.file, propName, cb.checked);
        });
      } else {
        cb.disabled = true;
      }
      return;
    }
    const cellEl = td.createDiv({ cls: "ntn-cell" });
    if (value != null) {
      const raw = value.toString();
      const strVal = value instanceof import_obsidian6.LinkValue || value instanceof import_obsidian6.FileValue ? stripPath(raw) : raw;
      const metaType = getPropertyMetaType(this.app, prop);
      if (strVal && (!metaType || metaType === "text" || metaType === "multitext")) {
        void import_obsidian6.MarkdownRenderer.render(this.app, strVal, cellEl, entry.file.path, this);
      } else {
        value.renderTo(cellEl, this.app.renderContext);
      }
    }
    if (editable) {
      td.addClass("ntn-editable");
      const kind = value instanceof import_obsidian6.NumberValue ? "number" : "text";
      td.addEventListener("click", (evt) => {
        if (evt.target.closest("a")) return;
        this.editCell(td, entry, propName, value ? value.toString() : "", kind);
      });
    }
  }
  /** Swap a cell's content for an input; commit on Enter/blur, cancel on Esc. */
  editCell(td, entry, propName, current, kind) {
    if (td.querySelector(".ntn-input")) return;
    const rect = td.getBoundingClientRect();
    const multiline = kind === "text" && rect.height > 40;
    td.empty();
    const input = multiline ? td.createEl("textarea", { cls: "ntn-input ntn-textarea" }) : td.createEl("input", { type: "text", cls: "ntn-input" });
    input.setCssStyles({ width: `${rect.width}px`, height: `${rect.height}px` });
    input.value = current;
    input.focus();
    input.select();
    let committed = false;
    const commit = () => {
      if (committed) return;
      committed = true;
      const raw = input.value.trim();
      if (raw === current) {
        this.onDataUpdated();
        return;
      }
      let out = raw;
      if (kind === "number") {
        const n = Number(raw);
        out = raw === "" ? null : Number.isNaN(n) ? raw : n;
      } else if (raw === "") {
        out = null;
      }
      void this.writeProperty(entry.file, propName, out);
    };
    input.addEventListener("keydown", (ev) => {
      const evt = ev;
      if (evt.key === "Enter" && !evt.shiftKey) {
        evt.preventDefault();
        commit();
      } else if (evt.key === "Escape") {
        committed = true;
        this.onDataUpdated();
      }
    });
    input.addEventListener("blur", commit);
  }
  async writeProperty(file, propName, value) {
    try {
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        if (value === null) {
          delete fm[propName];
        } else {
          fm[propName] = value;
        }
      });
    } catch (e) {
      console.error(`${LOG_PREFIX} failed to write property`, propName, e);
      new import_obsidian6.Notice(`Couldn't update "${propName}".`);
      this.onDataUpdated();
    }
  }
  /**
   * Reroute the core toolbar's New button to the page panel while this
   * view is active. The button lives on the query controller, outside this
   * view's DOM, so its menu's `open` is shadowed on the instance and
   * restored on unload. `newItemMenu` is internal API — if it ever moves,
   * the guard below simply leaves the core behavior untouched (and the
   * footer "+ New" falls back to its own capture flow).
   */
  patchToolbarNew() {
    if (this.newButtonPatched) return;
    const menu = this.queryCtrl.newItemMenu;
    if (!menu || typeof menu.open !== "function" || typeof menu.close !== "function") {
      return;
    }
    const orig = menu.open.bind(menu);
    const patched = async (name, fmProc) => {
      if (import_obsidian6.Platform.isPhone) return orig(name, fmProc);
      let created;
      const ref = this.app.vault.on("create", (file) => {
        if (file instanceof import_obsidian6.TFile) created = file;
      });
      const body = this.rootEl.doc.body;
      body.addClass("ntn-hide-new-popover");
      try {
        await orig(name, fmProc);
      } finally {
        this.app.vault.offref(ref);
        menu.close();
        body.removeClass("ntn-hide-new-popover");
      }
      if (created) this.openPagePanel(created);
    };
    menu.open = patched;
    this.newButtonPatched = true;
    this.register(() => {
      menu.open = orig;
      this.newButtonPatched = false;
    });
  }
  /**
   * "+ New" flow: create the note through the core Bases flow — so it lands
   * in the configured folder and gets the frontmatter implied by the view's
   * filters — then edit it in the centered Notion-style page panel instead
   * of the small popover Obsidian anchors to the toolbar's New button.
   */
  async createAndOpenPage() {
    if (import_obsidian6.Platform.isPhone || this.newButtonPatched) {
      await this.createFileForView();
      return;
    }
    let created;
    const ref = this.app.vault.on("create", (file) => {
      if (file instanceof import_obsidian6.TFile) created = file;
    });
    try {
      await this.createFileForView();
    } finally {
      this.app.vault.offref(ref);
    }
    if (!created) return;
    const doc = this.rootEl.doc;
    if (doc.querySelector(".bases-new-item-popover")) doc.body.click();
    this.openPagePanel(created);
  }
  /** Open a note centered in the Notion-style page panel. */
  openPagePanel(file) {
    new NotePageModal(this.app, file, {
      applyColor: (pill, text) => this.applyPillColor(pill, text),
      write: (f, propName, value) => this.writeProperty(f, propName, value),
      isPillProp: (name) => this.pills.pillProps.has(`note.${name}`),
      isListProp: (name) => this.pills.listProps.has(`note.${name}`),
      openSelect: (opts) => this.openSelectAt(opts),
      reanchorSelect: (anchor, filePath, propName) => void this.selectEditor?.reanchorIfMatches(
        anchor,
        filePath,
        `note.${propName}`
      ),
      closeSelect: () => this.closeSelectMenu()
    }).open();
  }
  /** Color a pill element using this view's pinned-color overrides. */
  applyPillColor(pill, text, useDefaultColor = true) {
    applyPillColor(pill, text, this.pinnedColors, useDefaultColor);
  }
  /** Open the Notion-style select editor for a pill cell of the table. */
  openSelectEditor(td, entry, prop, propName, useDefaultColor = true) {
    this.openSelectAt({
      anchor: td,
      file: entry.file,
      propName,
      current: valueToStrings(entry.getValue(prop)),
      isList: this.pills.listProps.has(prop),
      useDefaultColor
    });
  }
  /**
   * Open the select editor anchored anywhere — a table cell or a property
   * row of the page panel. Known values always come from the live query
   * result; lifetime stays with the view (outside-click / Esc / unload).
   */
  openSelectAt(opts) {
    if (this.selectEditor?.anchorEl === opts.anchor) {
      this.closeSelectMenu();
      return;
    }
    this.closeSelectMenu();
    const prop = `note.${opts.propName}`;
    this.selectEditor = new SelectEditor({
      doc: this.rootEl.doc,
      win: this.rootEl.win,
      anchor: opts.anchor,
      entries: this.data.data,
      file: opts.file,
      current: opts.current,
      prop,
      isList: opts.isList,
      applyColor: (pill, text) => this.applyPillColor(pill, text, opts.useDefaultColor ?? true),
      write: (value) => void this.writeProperty(opts.file, opts.propName, value).then(() => opts.onWrite?.()),
      setColor: (value, colorName) => this.setPinnedColor(value, colorName),
      getOrder: () => this.getSelectOptionOrder(opts.propName),
      setOrder: (order) => this.setSelectOptionOrder(opts.propName, order),
      onClose: () => {
        this.selectEditor = null;
      }
    });
  }
  /** Saved option order for a select/pill property (lowercased value keys). */
  getSelectOptionOrder(propName) {
    const map = this.config.get("selectOrders");
    const order = map?.[propName];
    return Array.isArray(order) ? order.map((s) => String(s).toLowerCase()) : [];
  }
  /** Persist a select/pill property's option order, keyed by its bare name. */
  setSelectOptionOrder(propName, order) {
    const current = this.config.get("selectOrders") || {};
    this.config.set("selectOrders", { ...current, [propName]: order });
  }
  /**
   * Pin a value to a specific Notion color. Updates the live map for instant
   * feedback in the open editor, then persists into the `pinnedColors` view
   * option (replacing any prior entry for the same value) so it survives
   * reloads and is editable from the view settings too.
   */
  setPinnedColor(value, colorName) {
    const bare = value.replace(/^#/, "");
    const key = bare.toLowerCase();
    if (colorName === "default") {
      this.pinnedColors.delete(key);
    } else {
      const color = colorByName(colorName);
      if (!color) return;
      this.pinnedColors.set(key, color);
    }
    const raw = this.config.get("pinnedColors");
    const list = Array.isArray(raw) ? raw.map((s) => String(s)) : [];
    const kept = list.filter((item) => {
      const m = item.match(/^(.+?)\s*[=:]\s*(.+)$/);
      return m ? m[1].trim().replace(/^#/, "").toLowerCase() !== key : true;
    });
    if (colorName !== "default") {
      kept.push(`${bare}=${colorName}`);
    }
    this.config.set("pinnedColors", kept);
  }
  closeSelectMenu() {
    this.selectEditor?.close();
    this.selectEditor = null;
  }
};

// src/view/notion-list-view.ts
var import_obsidian7 = require("obsidian");
var NotionListView = class extends import_obsidian7.BasesView {
  constructor(controller, parentEl) {
    super(controller);
    this.type = NOTION_LIST_VIEW;
    /** True while the toolbar's New button is rerouted to the page panel. */
    this.newButtonPatched = false;
    /** Pill / list classification, recomputed each update. */
    this.pills = { pillProps: /* @__PURE__ */ new Set(), listProps: /* @__PURE__ */ new Set() };
    /** User-pinned value → color overrides from the `pinnedColors` view option. */
    this.pinnedColors = /* @__PURE__ */ new Map();
    /** Set of group full keys that are currently collapsed. */
    this.collapsedGroups = /* @__PURE__ */ new Set();
    /** The open select editor, if any (also drives outside-click detection). */
    this.selectEditor = null;
    this.queryCtrl = controller;
    this.rootEl = parentEl.createDiv({ cls: "ntn-root ntn-list-view" });
    this.register(() => this.closeSelectMenu());
    this.registerDomEvent(this.rootEl.doc, "pointerdown", (evt) => {
      if (!this.selectEditor) return;
      const target = evt.target;
      if (this.selectEditor.contains(target)) return;
      if (this.selectEditor.anchorEl.contains(target)) return;
      this.closeSelectMenu();
    }, { capture: true });
    this.patchToolbarNew();
  }
  onDataUpdated() {
    this.patchToolbarNew();
    const root = this.rootEl;
    root.empty();
    root.toggleClass("ntn-wrap", this.config.get("wrapCells") !== false);
    root.toggleClass("ntn-vlines", this.config.get("verticalLines") !== false);
    const props = this.config.getOrder();
    this.pills = computePillProps(props, this.data.data, this.config, this.app);
    this.pinnedColors = parsePinnedColors(this.config.get("pinnedColors"));
    const listContainer = root.createDiv({ cls: "ntn-list-container" });
    let renderedCount = 0;
    let limitRaw = this.config.get("rowCount");
    if (limitRaw === void 0) limitRaw = "10";
    const limitStr = String(limitRaw).trim();
    const limit = limitStr === "all" || limitStr === "0" ? "all" : parseInt(limitStr, 10) || 10;
    const folderGrouped = isGroupedByFolder(this.app, this.data.groupedData);
    const roots = folderGrouped ? hideSoleTopLevelFolder(buildFolderGroups(this.data.groupedData)) : buildGroupTree(this.data.groupedData);
    const renderNode = (node, depth) => {
      if (limit !== "all" && renderedCount >= limit) return;
      let isCollapsed = false;
      if (node.key) {
        isCollapsed = this.collapsedGroups.has(node.fullKey);
        const gRow = listContainer.createDiv({ cls: "ntn-group-row" });
        const headerIndent = folderGrouped ? depth > 0 ? 32 : 12 : depth * 20 + 12;
        gRow.setCssStyles({ paddingLeft: `${headerIndent}px` });
        const toggleIcon = gRow.createSpan({ cls: "ntn-group-toggle" });
        toggleIcon.setText(isCollapsed ? "\u25B6" : "\u25BC");
        toggleIcon.addEventListener("click", () => {
          if (isCollapsed) {
            this.collapsedGroups.delete(node.fullKey);
          } else {
            this.collapsedGroups.add(node.fullKey);
          }
          this.onDataUpdated();
        });
        if (folderGrouped) {
          gRow.createSpan({ cls: "ntn-group-folder-label", text: node.key });
        } else {
          const pill = gRow.createSpan({ cls: "ntn-pill" });
          this.applyPillColor(pill, node.fullKey);
          pill.setText(node.key);
        }
        gRow.createSpan({ cls: "ntn-group-count", text: String(countEntries(node)) });
      }
      if (isCollapsed) return;
      for (const entry of node.entries) {
        if (limit !== "all" && renderedCount >= limit) break;
        const rowEl = this.renderRow(listContainer, entry, props);
        if (node.key) {
          const leftEl = rowEl.querySelector(".ntn-list-left");
          const entryIndent = folderGrouped ? depth > 0 ? 52 : 32 : depth * 20 + 30;
          leftEl?.setCssStyles({ paddingLeft: `${entryIndent}px` });
        }
        renderedCount++;
      }
      for (const child of node.children.values()) {
        renderNode(child, node.key ? depth + 1 : depth);
      }
    };
    for (const rootNode of roots.values()) {
      renderNode(rootNode, 0);
    }
    const footerWrap = root.createDiv({ cls: "ntn-footer-wrap" });
    const newRow = footerWrap.createDiv({ cls: "ntn-new-row" });
    newRow.createSpan({ cls: "ntn-new-plus", text: "+" });
    newRow.createSpan({ text: "New" });
    newRow.addEventListener("click", () => void this.createAndOpenPage());
  }
  renderRow(container, entry, props) {
    const rowEl = container.createDiv({ cls: "ntn-list-row" });
    const leftEl = rowEl.createDiv({ cls: "ntn-list-left" });
    const rightEl = rowEl.createDiv({ cls: "ntn-list-right" });
    this.renderCell(leftEl, entry, "file.name");
    for (const prop of props) {
      if (prop === "file.name") continue;
      const cellWrap = rightEl.createDiv({ cls: "ntn-list-cell" });
      this.renderCell(cellWrap, entry, prop);
    }
    return rowEl;
  }
  renderCell(td, entry, prop) {
    if (prop === "file.name") {
      td.addClass("ntn-col-title");
      const titleWrap = td.createDiv({ cls: "ntn-title-wrap" });
      const link = titleWrap.createSpan({ text: entry.file.basename, cls: "ntn-title-text" });
      link.addEventListener("click", (evt) => {
        const modified = evt.ctrlKey || evt.metaKey;
        if (!modified && this.config.get("openMode") === "panel") {
          this.openPagePanel(entry.file);
          return;
        }
        void this.app.workspace.openLinkText(entry.file.path, "", modified);
      });
      return;
    }
    const value = entry.getValue(prop);
    const editable = prop.startsWith("note.");
    const propName = prop.split(".").slice(1).join(".");
    if (this.pills.pillProps.has(prop)) {
      const disableColorColumns = this.config.get("disableColorColumns") || [];
      const useDefaultColor = !disableColorColumns.includes(prop);
      const wrap = td.createDiv({ cls: "ntn-pills" });
      const items = valueToStrings(value);
      for (const item of items) {
        const pill = wrap.createSpan({ cls: "ntn-pill" });
        this.applyPillColor(pill, item, useDefaultColor);
        pill.setText(item.replace(/^#/, "").split("/").pop() || "");
      }
      if (editable) {
        td.addClass("ntn-editable");
        td.addEventListener(
          "click",
          () => this.openSelectEditor(td, entry, prop, propName, useDefaultColor)
        );
        this.selectEditor?.reanchorIfMatches(td, entry.file.path, prop);
      }
      return;
    }
    if (value instanceof import_obsidian7.BooleanValue) {
      const cb = td.createEl("input", { type: "checkbox", cls: "ntn-checkbox" });
      cb.checked = value.isTruthy();
      if (editable) {
        cb.addEventListener("change", () => {
          void this.writeProperty(entry.file, propName, cb.checked);
        });
      } else {
        cb.disabled = true;
      }
      return;
    }
    const cellEl = td.createDiv({ cls: "ntn-cell" });
    if (value != null) {
      const raw = value.toString();
      const strVal = value instanceof import_obsidian7.LinkValue || value instanceof import_obsidian7.FileValue ? stripPath(raw) : raw;
      const metaType = getPropertyMetaType(this.app, prop);
      if (strVal && (!metaType || metaType === "text" || metaType === "multitext")) {
        void import_obsidian7.MarkdownRenderer.render(this.app, strVal, cellEl, entry.file.path, this);
      } else {
        value.renderTo(cellEl, this.app.renderContext);
      }
    }
    if (editable) {
      td.addClass("ntn-editable");
      const kind = value instanceof import_obsidian7.NumberValue ? "number" : "text";
      td.addEventListener("click", (evt) => {
        if (evt.target.closest("a")) return;
        this.editCell(td, entry, propName, value ? value.toString() : "", kind);
      });
    }
  }
  /** Swap a cell's content for an input; commit on Enter/blur, cancel on Esc. */
  editCell(td, entry, propName, current, kind) {
    if (td.querySelector(".ntn-input")) return;
    const rect = td.getBoundingClientRect();
    const multiline = kind === "text" && rect.height > 40;
    td.empty();
    const input = multiline ? td.createEl("textarea", { cls: "ntn-input ntn-textarea" }) : td.createEl("input", { type: "text", cls: "ntn-input" });
    input.setCssStyles({ width: `${rect.width}px`, height: `${rect.height}px` });
    input.value = current;
    input.focus();
    input.select();
    let committed = false;
    const commit = () => {
      if (committed) return;
      committed = true;
      const raw = input.value.trim();
      if (raw === current) {
        this.onDataUpdated();
        return;
      }
      let out = raw;
      if (kind === "number") {
        const n = Number(raw);
        out = raw === "" ? null : Number.isNaN(n) ? raw : n;
      } else if (raw === "") {
        out = null;
      }
      void this.writeProperty(entry.file, propName, out);
    };
    input.addEventListener("keydown", (ev) => {
      const evt = ev;
      if (evt.key === "Enter" && !evt.shiftKey) {
        evt.preventDefault();
        commit();
      } else if (evt.key === "Escape") {
        committed = true;
        this.onDataUpdated();
      }
    });
    input.addEventListener("blur", commit);
  }
  async writeProperty(file, propName, value) {
    try {
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        if (value === null) {
          delete fm[propName];
        } else {
          fm[propName] = value;
        }
      });
    } catch (e) {
      console.error(`${LOG_PREFIX} failed to write property`, propName, e);
      new import_obsidian7.Notice(`Couldn't update "${propName}".`);
      this.onDataUpdated();
    }
  }
  /**
   * Reroute the core toolbar's New button to the page panel while this
   * view is active. The button lives on the query controller, outside this
   * view's DOM, so its menu's `open` is shadowed on the instance and
   * restored on unload. `newItemMenu` is internal API — if it ever moves,
   * the guard below simply leaves the core behavior untouched (and the
   * footer "+ New" falls back to its own capture flow).
   */
  patchToolbarNew() {
    if (this.newButtonPatched) return;
    const menu = this.queryCtrl.newItemMenu;
    if (!menu || typeof menu.open !== "function" || typeof menu.close !== "function") {
      return;
    }
    const orig = menu.open.bind(menu);
    const patched = async (name, fmProc) => {
      if (import_obsidian7.Platform.isPhone) return orig(name, fmProc);
      let created;
      const ref = this.app.vault.on("create", (file) => {
        if (file instanceof import_obsidian7.TFile) created = file;
      });
      const body = this.rootEl.doc.body;
      body.addClass("ntn-hide-new-popover");
      try {
        await orig(name, fmProc);
      } finally {
        this.app.vault.offref(ref);
        menu.close();
        body.removeClass("ntn-hide-new-popover");
      }
      if (created) this.openPagePanel(created);
    };
    menu.open = patched;
    this.newButtonPatched = true;
    this.register(() => {
      menu.open = orig;
      this.newButtonPatched = false;
    });
  }
  /**
   * "+ New" flow: create the note through the core Bases flow — so it lands
   * in the configured folder and gets the frontmatter implied by the view's
   * filters — then edit it in the centered Notion-style page panel instead
   * of the small popover Obsidian anchors to the toolbar's New button.
   */
  async createAndOpenPage() {
    if (import_obsidian7.Platform.isPhone || this.newButtonPatched) {
      await this.createFileForView();
      return;
    }
    let created;
    const ref = this.app.vault.on("create", (file) => {
      if (file instanceof import_obsidian7.TFile) created = file;
    });
    try {
      await this.createFileForView();
    } finally {
      this.app.vault.offref(ref);
    }
    if (!created) return;
    const doc = this.rootEl.doc;
    if (doc.querySelector(".bases-new-item-popover")) doc.body.click();
    this.openPagePanel(created);
  }
  /** Open a note centered in the Notion-style page panel. */
  openPagePanel(file) {
    new NotePageModal(this.app, file, {
      applyColor: (pill, text) => this.applyPillColor(pill, text),
      write: (f, propName, value) => this.writeProperty(f, propName, value),
      isPillProp: (name) => this.pills.pillProps.has(`note.${name}`),
      isListProp: (name) => this.pills.listProps.has(`note.${name}`),
      openSelect: (opts) => this.openSelectAt(opts),
      reanchorSelect: (anchor, filePath, propName) => void this.selectEditor?.reanchorIfMatches(
        anchor,
        filePath,
        `note.${propName}`
      ),
      closeSelect: () => this.closeSelectMenu()
    }).open();
  }
  /** Color a pill element using this view's pinned-color overrides. */
  applyPillColor(pill, text, useDefaultColor = true) {
    applyPillColor(pill, text, this.pinnedColors, useDefaultColor);
  }
  /** Open the Notion-style select editor for a pill cell of the table. */
  openSelectEditor(td, entry, prop, propName, useDefaultColor = true) {
    this.openSelectAt({
      anchor: td,
      file: entry.file,
      propName,
      current: valueToStrings(entry.getValue(prop)),
      isList: this.pills.listProps.has(prop),
      useDefaultColor
    });
  }
  /**
   * Open the select editor anchored anywhere — a table cell or a property
   * row of the page panel. Known values always come from the live query
   * result; lifetime stays with the view (outside-click / Esc / unload).
   */
  openSelectAt(opts) {
    if (this.selectEditor?.anchorEl === opts.anchor) {
      this.closeSelectMenu();
      return;
    }
    this.closeSelectMenu();
    const prop = `note.${opts.propName}`;
    this.selectEditor = new SelectEditor({
      doc: this.rootEl.doc,
      win: this.rootEl.win,
      anchor: opts.anchor,
      entries: this.data.data,
      file: opts.file,
      current: opts.current,
      prop,
      isList: opts.isList,
      applyColor: (pill, text) => this.applyPillColor(pill, text, opts.useDefaultColor ?? true),
      write: (value) => void this.writeProperty(opts.file, opts.propName, value).then(() => opts.onWrite?.()),
      setColor: (value, colorName) => this.setPinnedColor(value, colorName),
      getOrder: () => this.getSelectOptionOrder(opts.propName),
      setOrder: (order) => this.setSelectOptionOrder(opts.propName, order),
      onClose: () => {
        this.selectEditor = null;
      }
    });
  }
  /** Saved option order for a select/pill property (lowercased value keys). */
  getSelectOptionOrder(propName) {
    const map = this.config.get("selectOrders");
    const order = map?.[propName];
    return Array.isArray(order) ? order.map((s) => String(s).toLowerCase()) : [];
  }
  /** Persist a select/pill property's option order, keyed by its bare name. */
  setSelectOptionOrder(propName, order) {
    const current = this.config.get("selectOrders") || {};
    this.config.set("selectOrders", { ...current, [propName]: order });
  }
  /**
   * Pin a value to a specific Notion color. Updates the live map for instant
   * feedback in the open editor, then persists into the `pinnedColors` view
   * option (replacing any prior entry for the same value) so it survives
   * reloads and is editable from the view settings too.
   */
  setPinnedColor(value, colorName) {
    const bare = value.replace(/^#/, "");
    const key = bare.toLowerCase();
    if (colorName === "default") {
      this.pinnedColors.delete(key);
    } else {
      const color = colorByName(colorName);
      if (!color) return;
      this.pinnedColors.set(key, color);
    }
    const raw = this.config.get("pinnedColors");
    const list = Array.isArray(raw) ? raw.map((s) => String(s)) : [];
    const kept = list.filter((item) => {
      const m = item.match(/^(.+?)\s*[=:]\s*(.+)$/);
      return m ? m[1].trim().replace(/^#/, "").toLowerCase() !== key : true;
    });
    if (colorName !== "default") {
      kept.push(`${bare}=${colorName}`);
    }
    this.config.set("pinnedColors", kept);
  }
  closeSelectMenu() {
    this.selectEditor?.close();
    this.selectEditor = null;
  }
};

// src/view/notion-board-view.ts
var import_obsidian8 = require("obsidian");
var NotionBoardView = class extends import_obsidian8.BasesView {
  constructor(controller, parentEl) {
    super(controller);
    this.type = NOTION_BOARD_VIEW;
    /** True while the toolbar's New button is rerouted to the page panel. */
    this.newButtonPatched = false;
    /** Pill / list classification, recomputed each update. */
    this.pills = { pillProps: /* @__PURE__ */ new Set(), listProps: /* @__PURE__ */ new Set() };
    /** User-pinned value → color overrides from the `pinnedColors` view option. */
    this.pinnedColors = /* @__PURE__ */ new Map();
    /** The open select editor, if any (also drives outside-click detection). */
    this.selectEditor = null;
    /** Set of subgroup full keys (nested folders within a column) that are currently collapsed. */
    this.collapsedSubgroups = /* @__PURE__ */ new Set();
    /** The open column-color picker flyout, if any (also drives outside-click detection). */
    this.colorMenuEl = null;
    this.queryCtrl = controller;
    this.rootEl = parentEl.createDiv({ cls: "ntn-root ntn-board-view" });
    this.register(() => this.closeSelectMenu());
    this.register(() => this.closeColorMenu());
    this.registerDomEvent(this.rootEl.doc, "pointerdown", (evt) => {
      if (!this.selectEditor) return;
      const target = evt.target;
      if (this.selectEditor.contains(target)) return;
      if (this.selectEditor.anchorEl.contains(target)) return;
      this.closeSelectMenu();
    }, { capture: true });
    this.registerDomEvent(this.rootEl.doc, "pointerdown", (evt) => {
      if (!this.colorMenuEl) return;
      if (this.colorMenuEl.contains(evt.target)) return;
      this.closeColorMenu();
    }, { capture: true });
    this.patchToolbarNew();
  }
  closeColorMenu() {
    this.colorMenuEl?.remove();
    this.colorMenuEl = null;
  }
  /**
   * Open a Notion-palette color-swatch flyout anchored under `anchorEl`,
   * mirroring the select editor's own color picker (same markup/CSS
   * classes) so a board column header gets the identical picker. Picking
   * a color pins it for `fullKey` via the same pinnedColors mechanism the
   * pill select editor writes to.
   */
  openColumnColorMenu(anchorEl, fullKey) {
    this.closeColorMenu();
    this.closeSelectMenu();
    const menu = this.rootEl.doc.body.createDiv({ cls: "ntn-root ntn-color-menu" });
    this.colorMenuEl = menu;
    const options = [{ name: "default" }, ...NOTION_COLORS];
    for (const c of options) {
      const item = menu.createDiv({ cls: "ntn-color-option" });
      const swatch = item.createSpan({ cls: "ntn-color-swatch" });
      if (c.name !== "default") {
        applyColorVars(swatch, c);
      }
      item.createSpan({ cls: "ntn-color-name", text: c.name.charAt(0).toUpperCase() + c.name.slice(1) });
      item.addEventListener("click", (evt) => {
        evt.stopPropagation();
        this.setPinnedColor(fullKey, c.name);
        this.closeColorMenu();
        this.onDataUpdated();
      });
    }
    const anchorRect = anchorEl.getBoundingClientRect();
    menu.setCssStyles({ left: `${anchorRect.left}px`, top: `${anchorRect.bottom + 4}px` });
    const win = this.rootEl.win;
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.bottom > win.innerHeight - 8) {
      menu.setCssStyles({ top: `${Math.max(8, anchorRect.top - menuRect.height - 4)}px` });
    }
    if (menuRect.right > win.innerWidth - 8) {
      menu.setCssStyles({ left: `${Math.max(8, win.innerWidth - menuRect.width - 8)}px` });
    }
  }
  onDataUpdated() {
    this.patchToolbarNew();
    const root = this.rootEl;
    root.empty();
    root.toggleClass("ntn-wrap", this.config.get("wrapCells") !== false);
    root.toggleClass("ntn-vlines", this.config.get("verticalLines") !== false);
    const props = this.config.getOrder();
    this.pills = computePillProps(props, this.data.data, this.config, this.app);
    this.pinnedColors = parsePinnedColors(this.config.get("pinnedColors"));
    const boardContainer = root.createDiv({ cls: "ntn-board-container" });
    const widthPx = { small: 200, medium: 240, large: 320 }[this.config.get("boardColumnWidth")] ?? 240;
    boardContainer.setCssProps({ "--ntn-board-col-width": `${widthPx}px` });
    let hiddenGroups = this.config.get("hiddenGroups");
    if (!Array.isArray(hiddenGroups)) hiddenGroups = [];
    const folderGrouped = isGroupedByFolder(this.app, this.data.groupedData);
    const colorDisplay = this.config.get("groupColorDisplay") || "off";
    const showLabelColor = colorDisplay === "label" || colorDisplay === "both";
    const showBgTint = colorDisplay === "background" || colorDisplay === "both";
    const columns = [];
    if (folderGrouped) {
      const roots = hideSoleTopLevelFolder(buildFolderGroups(this.data.groupedData));
      const flattenDescendants = (node) => {
        const result = [];
        for (const child of node.children.values()) {
          result.push({ key: child.key, fullKey: child.fullKey, entries: child.entries });
          result.push(...flattenDescendants(child));
        }
        return result;
      };
      for (const node of roots.values()) {
        if (node.key) {
          columns.push({
            key: node.key,
            fullKey: node.fullKey,
            entries: node.entries,
            subgroups: flattenDescendants(node)
          });
        } else if (node.entries.length) {
          columns.push({ key: "No Status", fullKey: "No Status", entries: node.entries, subgroups: [] });
        }
      }
    } else {
      for (const group of this.data.groupedData) {
        const rawGroupKey = group.hasKey() && group.key ? group.key.toString() : "No Status";
        columns.push({ key: rawGroupKey, fullKey: rawGroupKey, entries: group.entries, subgroups: [] });
      }
    }
    for (const col of columns) {
      if (hiddenGroups.includes(col.fullKey)) continue;
      const colWrap = boardContainer.createDiv({ cls: "ntn-board-column" });
      if (showBgTint) {
        colWrap.addClass("ntn-board-column-tinted");
        const c = resolvePillColor(col.fullKey, this.pinnedColors);
        colWrap.setCssProps({
          "--ntn-board-tint-light": c.lightBg,
          "--ntn-board-tint-dark": c.darkBg
        });
      }
      const colHeader = colWrap.createDiv({ cls: "ntn-board-column-header" });
      const headerTitles = colHeader.createDiv({ cls: "ntn-board-column-titles" });
      colHeader.addEventListener("contextmenu", (evt) => {
        evt.preventDefault();
        const menu = new import_obsidian8.Menu();
        menu.addItem((item) => {
          item.setTitle("Set color").setIcon("palette").onClick(() => this.openColumnColorMenu(headerTitles, col.fullKey));
        });
        menu.addItem((item) => {
          item.setTitle("Hide group").setIcon("eye-off").onClick(() => {
            const newHidden = [...hiddenGroups, col.fullKey];
            this.config.set("hiddenGroups", newHidden);
          });
        });
        menu.showAtMouseEvent(evt);
      });
      if (folderGrouped) {
        if (showLabelColor) {
          const pill = headerTitles.createSpan({ cls: "ntn-pill ntn-group-folder-pill" });
          this.applyPillColor(pill, col.fullKey);
          pill.setText(col.key);
        } else {
          headerTitles.createSpan({ cls: "ntn-group-folder-label", text: col.key });
        }
      } else {
        const parts = col.fullKey === "No Status" ? ["No Status"] : col.fullKey.split("/");
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          const pill = headerTitles.createSpan({ cls: "ntn-pill" });
          const currentFullKey = parts.slice(0, i + 1).join("/");
          this.applyPillColor(pill, currentFullKey);
          pill.setText(part);
          if (i > 0) {
            pill.addClass("ntn-board-header-pill-nested");
            pill.setCssProps({ "--ntn-indent": `${i * 12}px` });
          }
        }
      }
      const totalCount = col.entries.length + col.subgroups.reduce((sum, sg) => sum + sg.entries.length, 0);
      colHeader.createSpan({ cls: "ntn-group-count", text: String(totalCount) });
      const cardsWrap = colWrap.createDiv({ cls: "ntn-board-cards" });
      for (const entry of col.entries) {
        this.renderCard(cardsWrap, entry, props);
      }
      for (const sub of col.subgroups) {
        const isCollapsed = this.collapsedSubgroups.has(sub.fullKey);
        const subLabel = cardsWrap.createDiv({ cls: "ntn-board-subgroup-label" });
        const toggleIcon = subLabel.createSpan({ cls: "ntn-group-toggle" });
        toggleIcon.setText(isCollapsed ? "\u25B6" : "\u25BC");
        subLabel.createSpan({ text: sub.key });
        subLabel.createSpan({ cls: "ntn-group-count", text: String(sub.entries.length) });
        subLabel.addEventListener("click", () => {
          if (isCollapsed) {
            this.collapsedSubgroups.delete(sub.fullKey);
          } else {
            this.collapsedSubgroups.add(sub.fullKey);
          }
          this.onDataUpdated();
        });
        if (isCollapsed) continue;
        for (const entry of sub.entries) {
          this.renderCard(cardsWrap, entry, props);
        }
      }
      const colNew = colWrap.createDiv({ cls: "ntn-board-column-new" });
      colNew.createSpan({ cls: "ntn-new-plus", text: "+" });
      colNew.createSpan({ text: "New" });
      colNew.addEventListener("click", () => void this.createAndOpenPage());
    }
    const hiddenCols = columns.filter((col) => hiddenGroups.includes(col.fullKey));
    if (hiddenCols.length) {
      const rail = boardContainer.createDiv({ cls: "ntn-board-hidden-rail" });
      for (const col of hiddenCols) {
        const collapsed = rail.createDiv({
          cls: "ntn-board-column-collapsed ntn-pill",
          attr: { "aria-label": `Show "${col.key}"` }
        });
        this.applyPillColor(collapsed, col.fullKey);
        collapsed.createSpan({ cls: "ntn-board-collapsed-label", text: col.key });
        collapsed.createSpan({ cls: "ntn-group-count", text: String(col.entries.length) });
        collapsed.addEventListener("click", () => {
          this.config.set("hiddenGroups", hiddenGroups.filter((k) => k !== col.fullKey));
        });
      }
    }
    const footerWrap = root.createDiv({ cls: "ntn-footer-wrap" });
    const newRow = footerWrap.createDiv({ cls: "ntn-new-row" });
    newRow.createSpan({ cls: "ntn-new-plus", text: "+" });
    newRow.createSpan({ text: "New" });
    newRow.addEventListener("click", () => void this.createAndOpenPage());
  }
  renderCard(container, entry, props) {
    const cardEl = container.createDiv({ cls: "ntn-board-card" });
    const titleWrap = cardEl.createDiv({ cls: "ntn-board-card-title" });
    this.renderCell(titleWrap, entry, "file.name");
    const propsWrap = cardEl.createDiv({ cls: "ntn-board-card-props" });
    for (const prop of props) {
      if (prop === "file.name") continue;
      const cellWrap = propsWrap.createDiv({ cls: "ntn-board-cell" });
      this.renderCell(cellWrap, entry, prop);
    }
  }
  renderCell(td, entry, prop) {
    if (prop === "file.name") {
      td.addClass("ntn-col-title");
      const titleWrap = td.createDiv({ cls: "ntn-title-wrap" });
      const link = titleWrap.createSpan({ text: entry.file.basename, cls: "ntn-title-text" });
      link.addEventListener("click", (evt) => {
        const modified = evt.ctrlKey || evt.metaKey;
        if (!modified && this.config.get("openMode") === "panel") {
          this.openPagePanel(entry.file);
          return;
        }
        void this.app.workspace.openLinkText(entry.file.path, "", modified);
      });
      return;
    }
    const value = entry.getValue(prop);
    const editable = prop.startsWith("note.");
    const propName = prop.split(".").slice(1).join(".");
    if (this.pills.pillProps.has(prop)) {
      const disableColorColumns = this.config.get("disableColorColumns") || [];
      const useDefaultColor = !disableColorColumns.includes(prop);
      const wrap = td.createDiv({ cls: "ntn-pills" });
      const items = valueToStrings(value);
      for (const item of items) {
        const pill = wrap.createSpan({ cls: "ntn-pill" });
        this.applyPillColor(pill, item, useDefaultColor);
        pill.setText(item.replace(/^#/, "").split("/").pop() || "");
      }
      if (editable) {
        td.addClass("ntn-editable");
        td.addEventListener(
          "click",
          () => this.openSelectEditor(td, entry, prop, propName, useDefaultColor)
        );
        this.selectEditor?.reanchorIfMatches(td, entry.file.path, prop);
      }
      return;
    }
    if (value instanceof import_obsidian8.BooleanValue) {
      const cb = td.createEl("input", { type: "checkbox", cls: "ntn-checkbox" });
      cb.checked = value.isTruthy();
      if (editable) {
        cb.addEventListener("change", () => {
          void this.writeProperty(entry.file, propName, cb.checked);
        });
      } else {
        cb.disabled = true;
      }
      return;
    }
    const cellEl = td.createDiv({ cls: "ntn-cell" });
    if (value != null) {
      const raw = value.toString();
      const strVal = value instanceof import_obsidian8.LinkValue || value instanceof import_obsidian8.FileValue ? stripPath(raw) : raw;
      const metaType = getPropertyMetaType(this.app, prop);
      if (strVal && (!metaType || metaType === "text" || metaType === "multitext")) {
        void import_obsidian8.MarkdownRenderer.render(this.app, strVal, cellEl, entry.file.path, this);
      } else {
        value.renderTo(cellEl, this.app.renderContext);
      }
    }
    if (editable) {
      td.addClass("ntn-editable");
      const kind = value instanceof import_obsidian8.NumberValue ? "number" : "text";
      td.addEventListener("click", (evt) => {
        if (evt.target.closest("a")) return;
        this.editCell(td, entry, propName, value ? value.toString() : "", kind);
      });
    }
  }
  /** Swap a cell's content for an input; commit on Enter/blur, cancel on Esc. */
  editCell(td, entry, propName, current, kind) {
    if (td.querySelector(".ntn-input")) return;
    const rect = td.getBoundingClientRect();
    const multiline = kind === "text" && rect.height > 40;
    td.empty();
    const input = multiline ? td.createEl("textarea", { cls: "ntn-input ntn-textarea" }) : td.createEl("input", { type: "text", cls: "ntn-input" });
    input.setCssStyles({ width: `${rect.width}px`, height: `${rect.height}px` });
    input.value = current;
    input.focus();
    input.select();
    let committed = false;
    const commit = () => {
      if (committed) return;
      committed = true;
      const raw = input.value.trim();
      if (raw === current) {
        this.onDataUpdated();
        return;
      }
      let out = raw;
      if (kind === "number") {
        const n = Number(raw);
        out = raw === "" ? null : Number.isNaN(n) ? raw : n;
      } else if (raw === "") {
        out = null;
      }
      void this.writeProperty(entry.file, propName, out);
    };
    input.addEventListener("keydown", (ev) => {
      const evt = ev;
      if (evt.key === "Enter" && !evt.shiftKey) {
        evt.preventDefault();
        commit();
      } else if (evt.key === "Escape") {
        committed = true;
        this.onDataUpdated();
      }
    });
    input.addEventListener("blur", commit);
  }
  async writeProperty(file, propName, value) {
    try {
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        if (value === null) {
          delete fm[propName];
        } else {
          fm[propName] = value;
        }
      });
    } catch (e) {
      console.error(`${LOG_PREFIX} failed to write property`, propName, e);
      new import_obsidian8.Notice(`Couldn't update "${propName}".`);
      this.onDataUpdated();
    }
  }
  /**
   * Reroute the core toolbar's New button to the page panel while this
   * view is active. The button lives on the query controller, outside this
   * view's DOM, so its menu's `open` is shadowed on the instance and
   * restored on unload. `newItemMenu` is internal API — if it ever moves,
   * the guard below simply leaves the core behavior untouched (and the
   * footer "+ New" falls back to its own capture flow).
   */
  patchToolbarNew() {
    if (this.newButtonPatched) return;
    const menu = this.queryCtrl.newItemMenu;
    if (!menu || typeof menu.open !== "function" || typeof menu.close !== "function") {
      return;
    }
    const orig = menu.open.bind(menu);
    const patched = async (name, fmProc) => {
      if (import_obsidian8.Platform.isPhone) return orig(name, fmProc);
      let created;
      const ref = this.app.vault.on("create", (file) => {
        if (file instanceof import_obsidian8.TFile) created = file;
      });
      const body = this.rootEl.doc.body;
      body.addClass("ntn-hide-new-popover");
      try {
        await orig(name, fmProc);
      } finally {
        this.app.vault.offref(ref);
        menu.close();
        body.removeClass("ntn-hide-new-popover");
      }
      if (created) this.openPagePanel(created);
    };
    menu.open = patched;
    this.newButtonPatched = true;
    this.register(() => {
      menu.open = orig;
      this.newButtonPatched = false;
    });
  }
  /**
   * "+ New" flow: create the note through the core Bases flow — so it lands
   * in the configured folder and gets the frontmatter implied by the view's
   * filters — then edit it in the centered Notion-style page panel instead
   * of the small popover Obsidian anchors to the toolbar's New button.
   */
  async createAndOpenPage() {
    if (import_obsidian8.Platform.isPhone || this.newButtonPatched) {
      await this.createFileForView();
      return;
    }
    let created;
    const ref = this.app.vault.on("create", (file) => {
      if (file instanceof import_obsidian8.TFile) created = file;
    });
    try {
      await this.createFileForView();
    } finally {
      this.app.vault.offref(ref);
    }
    if (!created) return;
    const doc = this.rootEl.doc;
    if (doc.querySelector(".bases-new-item-popover")) doc.body.click();
    this.openPagePanel(created);
  }
  /** Open a note centered in the Notion-style page panel. */
  openPagePanel(file) {
    new NotePageModal(this.app, file, {
      applyColor: (pill, text) => this.applyPillColor(pill, text),
      write: (f, propName, value) => this.writeProperty(f, propName, value),
      isPillProp: (name) => this.pills.pillProps.has(`note.${name}`),
      isListProp: (name) => this.pills.listProps.has(`note.${name}`),
      openSelect: (opts) => this.openSelectAt(opts),
      reanchorSelect: (anchor, filePath, propName) => void this.selectEditor?.reanchorIfMatches(
        anchor,
        filePath,
        `note.${propName}`
      ),
      closeSelect: () => this.closeSelectMenu()
    }).open();
  }
  /** Color a pill element using this view's pinned-color overrides. */
  applyPillColor(pill, text, useDefaultColor = true) {
    applyPillColor(pill, text, this.pinnedColors, useDefaultColor);
  }
  /** Open the Notion-style select editor for a pill cell of the table. */
  openSelectEditor(td, entry, prop, propName, useDefaultColor = true) {
    this.openSelectAt({
      anchor: td,
      file: entry.file,
      propName,
      current: valueToStrings(entry.getValue(prop)),
      isList: this.pills.listProps.has(prop),
      useDefaultColor
    });
  }
  /**
   * Open the select editor anchored anywhere — a table cell or a property
   * row of the page panel. Known values always come from the live query
   * result; lifetime stays with the view (outside-click / Esc / unload).
   */
  openSelectAt(opts) {
    if (this.selectEditor?.anchorEl === opts.anchor) {
      this.closeSelectMenu();
      return;
    }
    this.closeSelectMenu();
    const prop = `note.${opts.propName}`;
    this.selectEditor = new SelectEditor({
      doc: this.rootEl.doc,
      win: this.rootEl.win,
      anchor: opts.anchor,
      entries: this.data.data,
      file: opts.file,
      current: opts.current,
      prop,
      isList: opts.isList,
      applyColor: (pill, text) => this.applyPillColor(pill, text, opts.useDefaultColor ?? true),
      write: (value) => void this.writeProperty(opts.file, opts.propName, value).then(() => opts.onWrite?.()),
      setColor: (value, colorName) => this.setPinnedColor(value, colorName),
      getOrder: () => this.getSelectOptionOrder(opts.propName),
      setOrder: (order) => this.setSelectOptionOrder(opts.propName, order),
      onClose: () => {
        this.selectEditor = null;
      }
    });
  }
  /** Saved option order for a select/pill property (lowercased value keys). */
  getSelectOptionOrder(propName) {
    const map = this.config.get("selectOrders");
    const order = map?.[propName];
    return Array.isArray(order) ? order.map((s) => String(s).toLowerCase()) : [];
  }
  /** Persist a select/pill property's option order, keyed by its bare name. */
  setSelectOptionOrder(propName, order) {
    const current = this.config.get("selectOrders") || {};
    this.config.set("selectOrders", { ...current, [propName]: order });
  }
  /**
   * Pin a value to a specific Notion color. Updates the live map for instant
   * feedback in the open editor, then persists into the `pinnedColors` view
   * option (replacing any prior entry for the same value) so it survives
   * reloads and is editable from the view settings too.
   */
  setPinnedColor(value, colorName) {
    const bare = value.replace(/^#/, "");
    const key = bare.toLowerCase();
    if (colorName === "default") {
      this.pinnedColors.delete(key);
    } else {
      const color = colorByName(colorName);
      if (!color) return;
      this.pinnedColors.set(key, color);
    }
    const raw = this.config.get("pinnedColors");
    const list = Array.isArray(raw) ? raw.map((s) => String(s)) : [];
    const kept = list.filter((item) => {
      const m = item.match(/^(.+?)\s*[=:]\s*(.+)$/);
      return m ? m[1].trim().replace(/^#/, "").toLowerCase() !== key : true;
    });
    if (colorName !== "default") {
      kept.push(`${bare}=${colorName}`);
    }
    this.config.set("pinnedColors", kept);
  }
  closeSelectMenu() {
    this.selectEditor?.close();
    this.selectEditor = null;
  }
};

// src/main.ts
var NotionBasesPlugin = class extends import_obsidian9.Plugin {
  async onload() {
    if (typeof this.registerBasesView !== "function") {
      new import_obsidian9.Notice("Extended Base: requires Obsidian 1.10.0+ (registerBasesView API missing).", 8e3);
      return;
    }
    const okTable = this.registerBasesView(NOTION_TABLE_VIEW, {
      name: "Notion Table",
      icon: "table-2",
      factory: (controller, containerEl) => new NotionTableView(controller, containerEl),
      options: buildViewOptions
    });
    const okList = this.registerBasesView(NOTION_LIST_VIEW, {
      name: "Notion List",
      icon: "list",
      factory: (controller, containerEl) => new NotionListView(controller, containerEl),
      options: buildListViewOptions
    });
    const okBoard = this.registerBasesView(NOTION_BOARD_VIEW, {
      name: "Notion Board",
      icon: "columns",
      factory: (controller, containerEl) => new NotionBoardView(controller, containerEl),
      options: buildBoardViewOptions
    });
    if (!okTable || !okList || !okBoard) {
      new import_obsidian9.Notice(
        `Extended Base: view registration failed (table=${okTable}, list=${okList}, board=${okBoard}). Is the Bases core plugin enabled?`,
        8e3
      );
    }
  }
};

/* nosourcemap */