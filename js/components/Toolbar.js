/**
 * Toolbar 展示当前模版的配色与快捷操作。
 */
export class Toolbar {
  constructor({ container, onApplyColor }) {
    this.container = container;
    this.onApplyColor = onApplyColor;
    this.palette = [];
  }

  /**
   * 根据模版调色板刷新工具栏。
   */
  updatePalette(palette = []) {
    this.palette = palette;
    this.render();
  }

  render() {
    this.container.innerHTML = "";
    if (!this.palette.length) {
      this.container.textContent = "请选择模版以加载推荐配色";
      return;
    }

    const title = document.createElement("span");
    title.textContent = "推荐配色：";
    this.container.appendChild(title);

    this.palette.forEach((color) => {
      const swatch = document.createElement("button");
      swatch.className = "btn btn--ghost";
      swatch.style.background = color;
      swatch.style.color = "#fff";
      swatch.style.borderColor = "transparent";
      swatch.style.minWidth = "48px";
      swatch.addEventListener("click", () => this.onApplyColor?.(color));
      this.container.appendChild(swatch);
    });
  }
}
