/**
 * 工具函数集合：包含 ID 生成、下载文件等实用方法。
 */

/**
 * 随机生成一个简短的 ID，用于标记画布元素。
 */
export function createId(prefix = "el") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * 深拷贝对象，避免引用导致的状态联动。
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 将当前画布数据转为 JSON 文件并下载。
 */
export function downloadJSON(data, filename = "template.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 限制数值范围，防止元素被拖动到画布之外。
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
