/**
 * LayerPanel 负责展示画布内的元素列表，方便选择与排序。
 */
export class LayerPanel {
  constructor({ container, onSelect, onReorder }) {
    this.container = container;
    this.onSelect = onSelect;
    this.onReorder = onReorder;
    this.layers = [];
  }

  /**
   * 渲染最新的图层列表。
   */
  render(elements, activeId) {
    this.layers = elements;
    this.container.innerHTML = "";
    elements
      .slice()
      .reverse()
      .forEach((element, index) => {
        const item = document.createElement("li");
        item.className = "layer-item";
        if (element.id === activeId) {
          item.classList.add("is-active");
        }
        item.innerHTML = `
          <span>${this.getDisplayName(element)}</span>
          <span class="layer-item__type">${element.type.toUpperCase()}</span>
        `;
        item.addEventListener("click", () => this.onSelect?.(element.id));

        const controls = document.createElement("div");
        controls.className = "button-group";
        const moveUp = document.createElement("button");
        moveUp.className = "btn btn--ghost";
        moveUp.textContent = "上移";
        moveUp.addEventListener("click", (event) => {
          event.stopPropagation();
          this.moveLayer(element.id, 1);
        });

        const moveDown = document.createElement("button");
        moveDown.className = "btn btn--ghost";
        moveDown.textContent = "下移";
        moveDown.addEventListener("click", (event) => {
          event.stopPropagation();
          this.moveLayer(element.id, -1);
        });

        controls.appendChild(moveUp);
        controls.appendChild(moveDown);
        item.appendChild(controls);

        this.container.appendChild(item);
      });
  }

  /**
   * 根据元素类型生成可读名称。
   */
  getDisplayName(element) {
    if (element.type === "text") return element.content.slice(0, 8) || "文本";
    if (element.type === "image") return "图片";
    if (element.type === "shape") return element.text?.content ?? "装饰块";
    return "图层";
  }

  /**
   * 移动图层顺序。
   */
  moveLayer(id, direction) {
    const index = this.layers.findIndex((item) => item.id === id);
    if (index < 0) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.layers.length) return;
    const newOrder = this.layers.slice();
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    this.onReorder?.(newOrder.map((item) => item.id));
  }
}
