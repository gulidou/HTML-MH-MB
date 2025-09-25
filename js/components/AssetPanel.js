/**
 * AssetPanel 展示贴纸与基础形状，点击即可加入画布。
 */
export class AssetPanel {
  constructor({ container, onAdd }) {
    this.container = container;
    this.onAdd = onAdd;
  }

  render(assets) {
    this.container.innerHTML = "";
    assets.forEach((asset) => {
      const item = document.createElement("button");
      item.className = "asset-item";
      item.title = asset.label;
      if (asset.type === "emoji") {
        item.textContent = asset.content;
      } else if (asset.type === "shape") {
        item.innerHTML = `<span style="width:32px;height:32px;display:block;background:${asset.color};border-radius:${
          asset.shape === "pill" ? "16px" : "8px"
        }"></span>`;
      }
      item.addEventListener("click", () => this.onAdd?.(asset));
      this.container.appendChild(item);
    });
  }
}
