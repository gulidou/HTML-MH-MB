import { assets } from "./data/assets.js";
import { templates, templateCategories } from "./data/templates.js";
import { downloadJSON } from "./utils/helpers.js";
import { AssetPanel } from "./components/AssetPanel.js";
import { CanvasStage } from "./components/CanvasStage.js";
import { LayerPanel } from "./components/LayerPanel.js";
import { TemplateGallery } from "./components/TemplateGallery.js";
import { Toolbar } from "./components/Toolbar.js";

// 获取页面中的关键 DOM 节点。
const templateList = document.getElementById("templateList");
const templateFilter = document.getElementById("templateFilter");
const assetList = document.getElementById("assetList");
const canvasStageEl = document.getElementById("canvasStage");
const layerList = document.getElementById("layerList");
const canvasToolbarEl = document.getElementById("canvasToolbar");

const backgroundColorInput = document.getElementById("backgroundColorInput");
const fontFamilyInput = document.getElementById("fontFamilyInput");
const fontSizeInput = document.getElementById("fontSizeInput");
const fontColorInput = document.getElementById("fontColorInput");
const fontWeightInput = document.getElementById("fontWeightInput");
const lineHeightInput = document.getElementById("lineHeightInput");
const letterSpacingInput = document.getElementById("letterSpacingInput");
const deleteLayerBtn = document.getElementById("deleteLayerBtn");
const textAlignGroup = document.getElementById("textAlignGroup");

const toggleGridBtn = document.getElementById("toggleGridBtn");
const toggleGuidesBtn = document.getElementById("toggleGuidesBtn");
const exportJsonBtn = document.getElementById("exportJsonBtn");

const addTextBtn = document.getElementById("addTextBtn");
const addSubTextBtn = document.getElementById("addSubTextBtn");
const addShapeBtn = document.getElementById("addShapeBtn");
const addImageBtn = document.getElementById("addImageBtn");

const canvasGrid = document.getElementById("canvasGrid");
const canvasGuides = document.getElementById("canvasGuides");

// 初始化核心组件。
const canvasStage = new CanvasStage({
  container: canvasStageEl,
  onSelect: handleElementSelect,
  onChange: handleCanvasChange,
});
canvasStage.init();

const templateGallery = new TemplateGallery({
  container: templateList,
  filterSelect: templateFilter,
  onSelect: handleTemplateSelect,
});
templateGallery.init({ templates, categories: templateCategories });

const assetPanel = new AssetPanel({
  container: assetList,
  onAdd: handleAddAsset,
});
assetPanel.render(assets);

const layerPanel = new LayerPanel({
  container: layerList,
  onSelect: (id) => canvasStage.setActiveElement(id),
  onReorder: (order) => canvasStage.reorderElements(order),
});

const toolbar = new Toolbar({
  container: canvasToolbarEl,
  onApplyColor: (color) => canvasStage.applyTextControl("color", color),
});

// 默认加载第一个模版以提升体验。
handleTemplateSelect(templates[0]);

/**
 * 当用户选择模版时，加载对应数据。
 */
function handleTemplateSelect(template) {
  canvasStage.loadTemplate(template);
  toolbar.updatePalette(template.palette);
  backgroundColorInput.value = template.backgroundColor;
  const firstElement = canvasStage.elements?.[0];
  if (firstElement) {
    canvasStage.setActiveElement(firstElement.id);
  } else {
    canvasStage.setActiveElement(null);
  }
}

/**
 * 画布内容变更时，刷新图层面板与导出数据。
 */
function handleCanvasChange(snapshot) {
  layerPanel.render(snapshot.elements, canvasStage.activeElementId);
}

/**
 * 选中元素变化时，同步右侧属性面板。
 */
function handleElementSelect(element) {
  const controls = [
    fontFamilyInput,
    fontSizeInput,
    fontColorInput,
    fontWeightInput,
    lineHeightInput,
    letterSpacingInput,
    deleteLayerBtn,
  ];

  if (!element) {
    controls.forEach((control) => {
      control.disabled = true;
      if (control.tagName === "INPUT" || control.tagName === "SELECT") {
        control.value = "";
      }
    });
    return;
  }

  if (element.type === "image") {
    controls.forEach((control) => {
      control.disabled = true;
    });
    return;
  }

  controls.forEach((control) => (control.disabled = false));

  const style = element.type === "shape" && element.text ? element.text.style : element.style;
  fontFamilyInput.value = style?.fontFamily ?? "'Noto Sans SC', sans-serif";
  fontSizeInput.value = style?.fontSize ?? 24;
  fontColorInput.value = style?.color ?? "#111827";
  fontWeightInput.value = style?.fontWeight ?? 400;
  lineHeightInput.value = style?.lineHeight ?? 1.4;
  letterSpacingInput.value = style?.letterSpacing ?? 0;
}

/**
 * 各类按钮与输入事件。
 */
backgroundColorInput.addEventListener("input", (event) => {
  canvasStage.setBackgroundColor(event.target.value);
});

fontFamilyInput.addEventListener("change", (event) => {
  canvasStage.applyTextControl("fontFamily", event.target.value);
});

fontSizeInput.addEventListener("input", (event) => {
  canvasStage.applyTextControl("fontSize", Number(event.target.value));
});

fontColorInput.addEventListener("input", (event) => {
  canvasStage.applyTextControl("color", event.target.value);
});

fontWeightInput.addEventListener("input", (event) => {
  canvasStage.applyTextControl("fontWeight", Number(event.target.value));
});

lineHeightInput.addEventListener("input", (event) => {
  canvasStage.applyTextControl("lineHeight", Number(event.target.value));
});

letterSpacingInput.addEventListener("input", (event) => {
  canvasStage.applyTextControl("letterSpacing", Number(event.target.value));
});

Array.from(textAlignGroup.querySelectorAll("button")).forEach((button) => {
  button.addEventListener("click", () => {
    canvasStage.applyTextControl("textAlign", button.dataset.align);
  });
});

deleteLayerBtn.addEventListener("click", () => canvasStage.deleteActiveElement());

addTextBtn.addEventListener("click", () => {
  canvasStage.addElement({
    type: "text",
    content: "这里是标题",
    style: {
      fontFamily: "'Noto Sans SC', sans-serif",
      fontSize: 40,
      color: "#1f2937",
      fontWeight: 700,
      lineHeight: 1.2,
      textAlign: "left",
    },
  });
});

addSubTextBtn.addEventListener("click", () => {
  canvasStage.addElement({
    type: "text",
    content: "在这里描述你的活动亮点或产品卖点。",
    size: { width: 260, height: 140 },
    style: {
      fontFamily: "'Noto Sans SC', sans-serif",
      fontSize: 20,
      color: "#4b5563",
      fontWeight: 400,
      lineHeight: 1.6,
      textAlign: "left",
    },
  });
});

addShapeBtn.addEventListener("click", () => {
  canvasStage.addElement({
    type: "shape",
    size: { width: 180, height: 120 },
    style: {
      backgroundColor: "#c7d2fe",
      borderRadius: 24,
    },
    text: {
      content: "可填写标签",
      style: {
        fontFamily: "'Noto Sans SC', sans-serif",
        fontSize: 18,
        color: "#1f2937",
        fontWeight: 600,
        textAlign: "center",
      },
    },
  });
});

addImageBtn.addEventListener("click", () => {
  canvasStage.addElement({
    type: "image",
    size: { width: 260, height: 260 },
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=60",
    style: {
      borderRadius: 24,
    },
  });
});

function handleAddAsset(asset) {
  if (asset.type === "emoji") {
    canvasStage.addElement({
      type: "text",
      content: asset.content,
      size: { width: 140, height: 140 },
      style: {
        fontSize: 72,
        textAlign: "center",
      },
    });
  }

  if (asset.type === "shape") {
    const shapeStyle =
      asset.shape === "pill"
        ? { backgroundColor: asset.color, borderRadius: 999 }
        : { backgroundColor: asset.color, borderRadius: 12 };
    canvasStage.addElement({
      type: "shape",
      size: { width: 180, height: 80 },
      style: shapeStyle,
      text: {
        content: asset.label,
        style: {
          fontSize: 18,
          color: "#0f172a",
          textAlign: "center",
          fontWeight: 600,
        },
      },
    });
  }
}

// 导出 JSON，包含基础元数据，方便 AI 训练或自动化处理。
exportJsonBtn.addEventListener("click", () => {
  const data = canvasStage.getSnapshot();
  downloadJSON(
    {
      project: "AI-Design-Kit",
      createdAt: new Date().toISOString(),
      ...data,
    },
    "design-template.json"
  );
});

// 切换网格与辅助线。
toggleGridBtn.addEventListener("click", () => {
  canvasGrid.classList.toggle("is-active");
});

toggleGuidesBtn.addEventListener("click", () => {
  canvasGuides.classList.toggle("is-active");
});
