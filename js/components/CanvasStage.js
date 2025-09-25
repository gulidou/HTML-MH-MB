import { clamp, createId, deepClone } from "../utils/helpers.js";

/**
 * CanvasStage 负责画布内的所有渲染与交互逻辑。
 */
export class CanvasStage {
  constructor({ container, onSelect, onChange }) {
    this.container = container;
    this.onSelect = onSelect;
    this.onChange = onChange;
    this.board = null;
    this.backgroundColor = "#ffffff";
    this.elements = [];
    this.activeElementId = null;
    this.dragContext = null;
    this.boardSize = { width: 420, height: 620 };
  }

  /**
   * 初始化画布，创建基础 DOM 结构。
   */
  init() {
    this.board = document.createElement("div");
    this.board.className = "canvas-board";
    this.container.appendChild(this.board);

    // 监听空白处点击以取消选中。
    this.board.addEventListener("pointerdown", (event) => {
      if (event.target === this.board) {
        this.setActiveElement(null);
      }
    });
  }

  /**
   * 加载模版数据并渲染。
   */
  loadTemplate(template) {
    this.backgroundColor = template.backgroundColor;
    this.elements = template.elements.map((element) => ({
      ...deepClone(element),
      id: element.id || createId(element.type),
    }));
    this.render();
    this.notifyChange();
  }

  /**
   * 渲染所有画布元素。
   */
  render() {
    this.board.innerHTML = "";
    this.board.style.backgroundColor = this.backgroundColor;

    this.elements.forEach((element, index) => {
      const el = this.createElementNode(element, index);
      this.board.appendChild(el);
    });
  }

  /**
   * 创建单个元素的 DOM 节点，并绑定事件。
   */
  createElementNode(element, index) {
    const node = document.createElement("div");
    node.className = "canvas-element";
    node.dataset.id = element.id;
    node.style.left = `${element.position.x}px`;
    node.style.top = `${element.position.y}px`;
    node.style.width = `${element.size.width}px`;
    node.style.height = `${element.size.height}px`;
    node.style.zIndex = 10 + index;

    if (element.style?.rotation) {
      node.style.transform = `rotate(${element.style.rotation}deg)`;
    }

    if (element.type === "text") {
      const text = document.createElement("p");
      text.className = "canvas-element__text";
      text.textContent = element.content;
      this.applyTextStyles(text, element.style);
      node.appendChild(text);
      this.bindEditableText(text, element.id);
    }

    if (element.type === "image") {
      const img = document.createElement("img");
      img.className = "canvas-element__image";
      img.src = element.src;
      img.alt = "模版图片";
      Object.assign(img.style, element.style ?? {});
      node.appendChild(img);
    }

    if (element.type === "shape") {
      const shape = document.createElement("div");
      shape.className = "canvas-element__shape";
      shape.style.backgroundColor = element.style?.backgroundColor ?? "#e5e7eb";
      if (element.style?.borderRadius) {
        shape.style.borderRadius = `${element.style.borderRadius}px`;
      }
      node.appendChild(shape);

      if (element.text) {
        const text = document.createElement("p");
        text.className = "canvas-element__text";
        text.textContent = element.text.content;
        this.applyTextStyles(text, element.text.style);
        shape.appendChild(text);
        this.bindEditableText(text, element.id, true);
      }
    }

    node.addEventListener("pointerdown", (event) => this.handlePointerDown(event, element.id));
    return node;
  }

  /**
   * 将文本样式映射到 DOM 节点。
   */
  applyTextStyles(node, style = {}) {
    node.style.fontFamily = style.fontFamily ?? "'Noto Sans SC', sans-serif";
    node.style.fontSize = `${style.fontSize ?? 24}px`;
    node.style.color = style.color ?? "#111827";
    node.style.fontWeight = style.fontWeight ?? 500;
    node.style.lineHeight = style.lineHeight ?? 1.4;
    node.style.letterSpacing = style.letterSpacing ? `${style.letterSpacing}px` : "0";
    node.style.textAlign = style.textAlign ?? "left";
    node.style.margin = "0";
    node.style.padding = "8px";
  }

  /**
   * 为文字绑定可编辑能力。
   */
  bindEditableText(node, elementId, isShapeText = false) {
    node.addEventListener("dblclick", () => {
      node.setAttribute("contenteditable", "true");
      node.focus();
    });

    node.addEventListener("blur", () => {
      node.removeAttribute("contenteditable");
      const element = this.getElementById(elementId);
      if (!element) return;
      if (isShapeText) {
        element.text.content = node.textContent;
      } else {
        element.content = node.textContent;
      }
      this.notifyChange();
    });
  }

  /**
   * 处理元素的拖拽移动。
   */
  handlePointerDown(event, elementId) {
    event.stopPropagation();
    const node = event.currentTarget;
    this.setActiveElement(elementId);

    const rect = this.board.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const element = this.getElementById(elementId);

    this.dragContext = {
      startX: event.clientX,
      startY: event.clientY,
      elementStartX: element.position.x,
      elementStartY: element.position.y,
      pointerOffsetX: offsetX - element.position.x,
      pointerOffsetY: offsetY - element.position.y,
    };

    const handleMove = (moveEvent) => {
      moveEvent.preventDefault();
      if (!this.dragContext) return;
      const { pointerOffsetX, pointerOffsetY } = this.dragContext;
      const rect = this.board.getBoundingClientRect();
      const x = clamp(moveEvent.clientX - rect.left - pointerOffsetX, 0, this.boardSize.width - element.size.width);
      const y = clamp(moveEvent.clientY - rect.top - pointerOffsetY, 0, this.boardSize.height - element.size.height);
      element.position.x = x;
      element.position.y = y;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      this.notifyChange(false);
    };

    const handleUp = () => {
      this.dragContext = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      this.notifyChange();
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp, { once: true });
  }

  /**
   * 设置当前选中元素。
   */
  setActiveElement(elementId) {
    this.activeElementId = elementId;
    this.highlightActiveNode();
    const element = this.getElementById(elementId);
    this.onSelect?.(element);
  }

  /**
   * 根据选中状态高亮节点。
   */
  highlightActiveNode() {
    this.board.querySelectorAll(".canvas-element").forEach((node) => {
      if (node.dataset.id === this.activeElementId) {
        node.classList.add("is-active");
      } else {
        node.classList.remove("is-active");
      }
    });
  }

  /**
   * 通过 ID 查找元素。
   */
  getElementById(id) {
    return this.elements.find((item) => item.id === id) ?? null;
  }

  /**
   * 新增一个元素到画布。
   */
  addElement(element) {
    const newElement = {
      id: createId(element.type),
      position: { x: 120, y: 160 },
      size: { width: 240, height: 120 },
      ...element,
    };
    this.elements.push(newElement);
    this.render();
    this.setActiveElement(newElement.id);
    this.notifyChange();
  }

  /**
   * 更新当前选中元素的样式。
   */
  updateActiveElementStyle(styleUpdates) {
    const element = this.getElementById(this.activeElementId);
    if (!element) return;

    if (element.type === "text") {
      element.style = { ...element.style, ...styleUpdates };
    }

    if (element.type === "shape") {
      if (styleUpdates.backgroundColor) {
        element.style = {
          ...element.style,
          backgroundColor: styleUpdates.backgroundColor,
        };
      }
      if (element.text) {
        element.text.style = { ...element.text.style, ...styleUpdates };
      }
    }

    this.render();
    this.setActiveElement(element.id);
    this.notifyChange();
  }

  /**
   * 应用于文本元素（含形状文本）的样式更新。
   */
  applyTextControl(controlKey, value) {
    const element = this.getElementById(this.activeElementId);
    if (!element) return;

    if (element.type === "text") {
      element.style = { ...element.style, [controlKey]: value };
    } else if (element.type === "shape" && element.text) {
      element.text.style = { ...element.text.style, [controlKey]: value };
    }

    this.render();
    this.setActiveElement(element.id);
    this.notifyChange();
  }

  /**
   * 删除当前选中元素。
   */
  deleteActiveElement() {
    if (!this.activeElementId) return;
    this.elements = this.elements.filter((item) => item.id !== this.activeElementId);
    this.render();
    this.setActiveElement(null);
    this.notifyChange();
  }

  /**
   * 更新画布背景色。
   */
  setBackgroundColor(color) {
    this.backgroundColor = color;
    this.render();
    this.notifyChange();
  }

  /**
   * 以 JSON 形式返回当前画布数据。
   */
  getSnapshot() {
    return {
      backgroundColor: this.backgroundColor,
      elements: deepClone(this.elements),
      size: this.boardSize,
    };
  }

  /**
   * 将画布元素顺序调整为最新的数组顺序。
   */
  reorderElements(newOrder) {
    this.elements = newOrder.map((id) => this.getElementById(id)).filter(Boolean);
    this.render();
    this.notifyChange();
  }

  /**
   * 通知外部状态发生改变。
   */
  notifyChange(finalized = true) {
    this.onChange?.(this.getSnapshot(), { finalized });
  }
}
