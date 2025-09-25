import { assets } from "./data/assets.js";
import { templates, templateCategories } from "./data/templates.js";
import { downloadJSON } from "./utils/helpers.js";
import { AssetPanel } from "./components/AssetPanel.js";
import { CanvasStage } from "./components/CanvasStage.js";
import { LayerPanel } from "./components/LayerPanel.js";
import { TemplateGallery } from "./components/TemplateGallery.js";
import { Toolbar } from "./components/Toolbar.js";
import { EventBus } from "./core/EventBus.js";

const bus = new EventBus();

const AppView = {
  bus,
  dom: {},
  onboardingStepIndex: 0,
  onboardingSteps: [],
  onboardingSeenKey: "ai-design-lab-onboarding",
  templateGallery: null,
  assetPanel: null,
  layerPanel: null,
  toolbar: null,

  init() {
    this.cacheDom();
    this.initComponents();
    this.bindDomEvents();
    this.registerBusListeners();
    this.autoShowOnboarding();
  },

  cacheDom() {
    this.dom = {
      templateList: document.getElementById("templateList"),
      templateFilter: document.getElementById("templateFilter"),
      assetList: document.getElementById("assetList"),
      canvasStage: document.getElementById("canvasStage"),
      layerList: document.getElementById("layerList"),
      canvasToolbar: document.getElementById("canvasToolbar"),
      backgroundColorInput: document.getElementById("backgroundColorInput"),
      fontFamilyInput: document.getElementById("fontFamilyInput"),
      fontSizeInput: document.getElementById("fontSizeInput"),
      fontColorInput: document.getElementById("fontColorInput"),
      fontWeightInput: document.getElementById("fontWeightInput"),
      lineHeightInput: document.getElementById("lineHeightInput"),
      letterSpacingInput: document.getElementById("letterSpacingInput"),
      deleteLayerBtn: document.getElementById("deleteLayerBtn"),
      textAlignGroup: document.getElementById("textAlignGroup"),
      toggleGridBtn: document.getElementById("toggleGridBtn"),
      toggleGuidesBtn: document.getElementById("toggleGuidesBtn"),
      exportJsonBtn: document.getElementById("exportJsonBtn"),
      addTextBtn: document.getElementById("addTextBtn"),
      addSubTextBtn: document.getElementById("addSubTextBtn"),
      addShapeBtn: document.getElementById("addShapeBtn"),
      addImageBtn: document.getElementById("addImageBtn"),
      canvasGrid: document.getElementById("canvasGrid"),
      canvasGuides: document.getElementById("canvasGuides"),
      onboardingBackdrop: document.getElementById("onboardingBackdrop"),
      onboardingPrevBtn: document.getElementById("onboardingPrevBtn"),
      onboardingNextBtn: document.getElementById("onboardingNextBtn"),
      onboardingSkipBtn: document.getElementById("onboardingSkipBtn"),
      openOnboardingBtn: document.getElementById("openOnboardingBtn"),
      closeOnboardingBtn: document.getElementById("closeOnboardingBtn"),
    };
    this.onboardingSteps = Array.from(
      document.querySelectorAll(".onboarding__step")
    );
  },

  initComponents() {
    this.templateGallery = new TemplateGallery({
      container: this.dom.templateList,
      filterSelect: this.dom.templateFilter,
      onSelect: (template) => this.bus.emit("template:selected", template),
    });
    this.templateGallery.init({ templates, categories: templateCategories });

    this.assetPanel = new AssetPanel({
      container: this.dom.assetList,
      onAdd: (asset) => this.bus.emit("asset:add", asset),
    });
    this.assetPanel.render(assets);

    this.layerPanel = new LayerPanel({
      container: this.dom.layerList,
      onSelect: (id) => this.bus.emit("element:set-active", id),
      onReorder: (order) => this.bus.emit("element:reorder", order),
    });

    this.toolbar = new Toolbar({
      container: this.dom.canvasToolbar,
      onApplyColor: (color) =>
        this.bus.emit("text:apply", { property: "color", value: color }),
    });
  },

  bindDomEvents() {
    const {
      backgroundColorInput,
      fontFamilyInput,
      fontSizeInput,
      fontColorInput,
      fontWeightInput,
      lineHeightInput,
      letterSpacingInput,
      deleteLayerBtn,
      textAlignGroup,
      addTextBtn,
      addSubTextBtn,
      addShapeBtn,
      addImageBtn,
      toggleGridBtn,
      toggleGuidesBtn,
      exportJsonBtn,
      onboardingPrevBtn,
      onboardingNextBtn,
      onboardingSkipBtn,
      openOnboardingBtn,
      closeOnboardingBtn,
    } = this.dom;

    backgroundColorInput.addEventListener("input", (event) => {
      this.bus.emit("canvas:background-change", event.target.value);
    });

    fontFamilyInput.addEventListener("change", (event) => {
      this.bus.emit("text:apply", {
        property: "fontFamily",
        value: event.target.value,
      });
    });

    fontSizeInput.addEventListener("input", (event) => {
      this.bus.emit("text:apply", {
        property: "fontSize",
        value: Number(event.target.value),
      });
    });

    fontColorInput.addEventListener("input", (event) => {
      this.bus.emit("text:apply", {
        property: "color",
        value: event.target.value,
      });
    });

    fontWeightInput.addEventListener("input", (event) => {
      this.bus.emit("text:apply", {
        property: "fontWeight",
        value: Number(event.target.value),
      });
    });

    lineHeightInput.addEventListener("input", (event) => {
      this.bus.emit("text:apply", {
        property: "lineHeight",
        value: Number(event.target.value),
      });
    });

    letterSpacingInput.addEventListener("input", (event) => {
      this.bus.emit("text:apply", {
        property: "letterSpacing",
        value: Number(event.target.value),
      });
    });

    Array.from(textAlignGroup.querySelectorAll("button")).forEach((button) => {
      button.addEventListener("click", () => {
        this.bus.emit("text:apply", {
          property: "textAlign",
          value: button.dataset.align,
        });
      });
    });

    deleteLayerBtn.addEventListener("click", () => {
      this.bus.emit("element:delete");
    });

    addTextBtn.addEventListener("click", () => {
      this.bus.emit("element:add", {
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
      this.bus.emit("element:add", {
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
      this.bus.emit("element:add", {
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
      this.bus.emit("element:add", {
        type: "image",
        size: { width: 260, height: 260 },
        src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=60",
        style: {
          borderRadius: 24,
        },
      });
    });

    toggleGridBtn.addEventListener("click", () => {
      this.bus.emit("view:toggle-grid");
    });

    toggleGuidesBtn.addEventListener("click", () => {
      this.bus.emit("view:toggle-guides");
    });

    exportJsonBtn.addEventListener("click", () => {
      this.bus.emit("export:json");
    });

    onboardingPrevBtn.addEventListener("click", () => {
      this.bus.emit("onboarding:prev");
    });

    onboardingNextBtn.addEventListener("click", () => {
      this.bus.emit("onboarding:next");
    });

    onboardingSkipBtn.addEventListener("click", () => {
      this.bus.emit("onboarding:close", { markAsSeen: true });
    });

    openOnboardingBtn.addEventListener("click", () => {
      this.bus.emit("onboarding:open");
    });

    closeOnboardingBtn.addEventListener("click", () => {
      this.bus.emit("onboarding:close", { markAsSeen: true });
    });
  },

  registerBusListeners() {
    this.bus.on("state:template-loaded", ({ template }) => {
      this.toolbar.updatePalette(template.palette);
      this.dom.backgroundColorInput.value = template.backgroundColor;
    });

    this.bus.on("canvas:changed", ({ elements, activeId }) => {
      this.layerPanel.render(elements, activeId);
    });

    this.bus.on("element:selected", (element) => {
      this.updatePropertyControls(element);
    });

    this.bus.on("view:toggle-grid", () => {
      this.toggleGrid();
    });

    this.bus.on("view:toggle-guides", () => {
      this.toggleGuides();
    });

    this.bus.on("onboarding:open", () => {
      this.showOnboarding(true);
    });

    this.bus.on("onboarding:close", ({ markAsSeen } = {}) => {
      this.hideOnboarding(markAsSeen);
    });

    this.bus.on("onboarding:next", () => {
      this.goOnboardingStep(1);
    });

    this.bus.on("onboarding:prev", () => {
      this.goOnboardingStep(-1);
    });
  },

  updatePropertyControls(element) {
    const controls = [
      this.dom.fontFamilyInput,
      this.dom.fontSizeInput,
      this.dom.fontColorInput,
      this.dom.fontWeightInput,
      this.dom.lineHeightInput,
      this.dom.letterSpacingInput,
      this.dom.deleteLayerBtn,
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

    controls.forEach((control) => {
      control.disabled = false;
    });

    const style =
      element.type === "shape" && element.text ? element.text.style : element.style;
    this.dom.fontFamilyInput.value = style?.fontFamily ?? "'Noto Sans SC', sans-serif";
    this.dom.fontSizeInput.value = style?.fontSize ?? 24;
    this.dom.fontColorInput.value = style?.color ?? "#111827";
    this.dom.fontWeightInput.value = style?.fontWeight ?? 400;
    this.dom.lineHeightInput.value = style?.lineHeight ?? 1.4;
    this.dom.letterSpacingInput.value = style?.letterSpacing ?? 0;
  },

  toggleGrid() {
    this.dom.canvasGrid.classList.toggle("is-active");
  },

  toggleGuides() {
    this.dom.canvasGuides.classList.toggle("is-active");
  },

  showOnboarding(resetIndex = false) {
    if (resetIndex) {
      this.onboardingStepIndex = 0;
    }
    this.dom.onboardingBackdrop.classList.add("is-visible");
    this.dom.onboardingBackdrop.setAttribute("aria-hidden", "false");
    this.updateOnboardingSteps();
  },

  hideOnboarding(markAsSeen = false) {
    this.dom.onboardingBackdrop.classList.remove("is-visible");
    this.dom.onboardingBackdrop.setAttribute("aria-hidden", "true");
    if (markAsSeen) {
      sessionStorage.setItem(this.onboardingSeenKey, "1");
    }
  },

  goOnboardingStep(direction) {
    const nextIndex = this.onboardingStepIndex + direction;
    if (nextIndex < 0) return;

    if (nextIndex >= this.onboardingSteps.length) {
      this.hideOnboarding(true);
      return;
    }

    this.onboardingStepIndex = nextIndex;
    this.updateOnboardingSteps();
  },

  updateOnboardingSteps() {
    this.onboardingSteps.forEach((step, index) => {
      step.classList.toggle("is-active", index === this.onboardingStepIndex);
    });

    this.dom.onboardingPrevBtn.disabled = this.onboardingStepIndex === 0;
    this.dom.onboardingNextBtn.textContent =
      this.onboardingStepIndex === this.onboardingSteps.length - 1 ? "完成" : "下一步";
  },

  autoShowOnboarding() {
    if (!sessionStorage.getItem(this.onboardingSeenKey)) {
      window.setTimeout(() => {
        this.bus.emit("onboarding:open");
      }, 400);
    }
  },
};

const AppState = {
  bus,
  stage: null,
  activeTemplate: null,
  snapshot: null,

  init({ canvasStageEl }) {
    this.stage = new CanvasStage({
      container: canvasStageEl,
      onSelect: (element) => this.bus.emit("element:selected", element),
      onChange: (snapshot) => {
        this.snapshot = snapshot;
        this.bus.emit("canvas:changed", {
          elements: snapshot.elements,
          activeId: this.stage.activeElementId,
        });
      },
    });
    this.stage.init();
    this.registerBusHandlers();
  },

  registerBusHandlers() {
    this.bus.on("template:selected", (template) => {
      this.loadTemplate(template);
    });

    this.bus.on("canvas:background-change", (color) => {
      this.stage.setBackgroundColor(color);
    });

    this.bus.on("text:apply", ({ property, value }) => {
      this.stage.applyTextControl(property, value);
    });

    this.bus.on("element:add", (elementConfig) => {
      this.stage.addElement(elementConfig);
    });

    this.bus.on("asset:add", (asset) => {
      this.addAssetToStage(asset);
    });

    this.bus.on("element:delete", () => {
      this.stage.deleteActiveElement();
    });

    this.bus.on("element:set-active", (id) => {
      this.stage.setActiveElement(id);
    });

    this.bus.on("element:reorder", (order) => {
      this.stage.reorderElements(order);
    });

    this.bus.on("export:json", () => {
      const data = this.stage.getSnapshot();
      downloadJSON(
        {
          project: "AI-Design-Kit",
          createdAt: new Date().toISOString(),
          ...data,
        },
        "design-template.json"
      );
    });
  },

  loadTemplate(template) {
    this.activeTemplate = template;
    this.stage.loadTemplate(template);
    const firstElementId = this.stage.elements?.[0]?.id ?? null;
    this.stage.setActiveElement(firstElementId);
    this.bus.emit("state:template-loaded", { template });
  },

  addAssetToStage(asset) {
    if (asset.type === "emoji") {
      this.stage.addElement({
        type: "text",
        content: asset.content,
        size: { width: 140, height: 140 },
        style: {
          fontSize: 72,
          textAlign: "center",
        },
      });
      return;
    }

    if (asset.type === "shape") {
      const shapeStyle =
        asset.shape === "pill"
          ? { backgroundColor: asset.color, borderRadius: 999 }
          : { backgroundColor: asset.color, borderRadius: 12 };

      this.stage.addElement({
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
  },
};

const AppController = {
  init() {
    AppView.init();
    AppState.init({ canvasStageEl: AppView.dom.canvasStage });
    this.bootstrap();
  },

  bootstrap() {
    if (templates.length) {
      this.bus.emit("template:selected", templates[0]);
    }
  },

  get bus() {
    return bus;
  },
};

AppController.init();
