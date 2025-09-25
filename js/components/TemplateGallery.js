/**
 * TemplateGallery 负责渲染左侧模版库，并提供筛选、预览、加载功能。
 */
export class TemplateGallery {
  constructor({ container, filterSelect, onSelect }) {
    this.container = container;
    this.filterSelect = filterSelect;
    this.onSelect = onSelect;
    this.templates = [];
    this.currentFilter = "all";
  }

  /**
   * 初始化模版库：设置数据并绑定筛选事件。
   */
  init({ templates, categories }) {
    this.templates = templates;
    this.renderFilter(categories);
    this.render();
    this.filterSelect.addEventListener("change", (event) => {
      this.currentFilter = event.target.value;
      this.render();
    });
  }

  /**
   * 渲染分类下拉选项。
   */
  renderFilter(categories) {
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.label;
      this.filterSelect.appendChild(option);
    });
  }

  /**
   * 根据当前筛选条件渲染模版卡片。
   */
  render() {
    this.container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    const filtered =
      this.currentFilter === "all"
        ? this.templates
        : this.templates.filter((item) => item.category === this.currentFilter);

    filtered.forEach((template) => {
      const card = document.createElement("article");
      card.className = "template-card";
      card.innerHTML = `
        <div class="template-card__preview" data-template="${template.id}">
          ${this.createPreviewMarkup(template)}
        </div>
        <h3 class="template-card__title">${template.name}</h3>
        <p class="template-card__category">${template.category}</p>
      `;
      card.addEventListener("click", () => {
        this.onSelect?.(template);
      });
      fragment.appendChild(card);
    });

    this.container.appendChild(fragment);
  }

  /**
   * 为模版生成一个抽象预览，利用调色板和文字片段。
   */
  createPreviewMarkup(template) {
    const [main, secondary, accent] = template.palette;
    return `
      <div style="
        position:absolute;
        inset:12px;
        border-radius:12px;
        background:${template.backgroundColor};
        overflow:hidden;
      ">
        <span style="
          position:absolute;
          left:16px;
          top:16px;
          padding:4px 8px;
          border-radius:999px;
          background:${secondary};
          font-size:12px;
          font-weight:600;
          color:#0f172a;
        ">${template.category}</span>
        <div style="
          position:absolute;
          left:16px;
          top:56px;
          width:80px;
          height:80px;
          border-radius:14px;
          background:${main};
        "></div>
        <div style="
          position:absolute;
          right:16px;
          bottom:24px;
          width:70px;
          height:70px;
          border-radius:20px;
          background:${accent};
        "></div>
        <p style="
          position:absolute;
          left:16px;
          right:16px;
          bottom:16px;
          font-size:12px;
          line-height:1.4;
          color:#111827;
          margin:0;
          font-weight:600;
        ">${template.description}</p>
      </div>
    `;
  }
}
