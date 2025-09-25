/**
 * 模版数据：真实项目中通常来自数据库或接口。
 * 这里使用纯 JavaScript 对象，方便 AI 或人工二次编辑。
 */
export const templates = [
  {
    id: "travel-001",
    name: "城市旅行海报",
    category: "旅游",
    palette: ["#4f46e5", "#22d3ee", "#facc15"],
    backgroundColor: "#f8fafc",
    description: "主打清爽配色与轻盈的标题信息。",
    elements: [
      {
        id: "title",
        type: "text",
        content: "周末一起去看海",
        position: { x: 40, y: 60 },
        size: { width: 340, height: 80 },
        style: {
          fontFamily: "'ZCOOL KuaiLe', cursive",
          fontSize: 42,
          color: "#1e3a8a",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: 1,
          textAlign: "left",
        },
      },
      {
        id: "subtitle",
        type: "text",
        content: "3 天 2 夜 · 海边露营",
        position: { x: 40, y: 140 },
        size: { width: 320, height: 60 },
        style: {
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 20,
          color: "#0f172a",
          fontWeight: 500,
          lineHeight: 1.5,
          letterSpacing: 0.5,
          textAlign: "left",
        },
      },
      {
        id: "image",
        type: "image",
        src: "https://images.unsplash.com/photo-1526481280695-3c469a1d4140?auto=format&fit=crop&w=600&q=60",
        position: { x: 40, y: 220 },
        size: { width: 340, height: 360 },
        style: {
          borderRadius: 16,
        },
      },
      {
        id: "badge",
        type: "shape",
        position: { x: 280, y: 520 },
        size: { width: 120, height: 60 },
        style: {
          backgroundColor: "#22d3ee",
          borderRadius: 30,
        },
        text: {
          content: "限时折扣",
          style: {
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: 16,
            color: "#0f172a",
            fontWeight: 600,
            textAlign: "center",
          },
        },
      },
    ],
  },
  {
    id: "fashion-hero",
    name: "潮流穿搭分享",
    category: "时尚",
    palette: ["#f472b6", "#fb7185", "#facc15"],
    backgroundColor: "#fef2f8",
    description: "突出人物照片与醒目标题，适合穿搭笔记。",
    elements: [
      {
        id: "hero-image",
        type: "image",
        src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=60",
        position: { x: 40, y: 60 },
        size: { width: 340, height: 400 },
        style: {
          borderRadius: 24,
        },
      },
      {
        id: "headline",
        type: "text",
        content: "秋日出游穿搭指南",
        position: { x: 40, y: 480 },
        size: { width: 340, height: 80 },
        style: {
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 38,
          color: "#be123c",
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: 1,
          textAlign: "left",
        },
      },
      {
        id: "tag",
        type: "shape",
        position: { x: 280, y: 40 },
        size: { width: 120, height: 120 },
        style: {
          backgroundColor: "#fde68a",
          borderRadius: 999,
          rotation: -20,
        },
        text: {
          content: "NEW",
          style: {
            fontFamily: "'ZCOOL KuaiLe', cursive",
            fontSize: 26,
            color: "#b91c1c",
            textAlign: "center",
            fontWeight: 600,
          },
        },
      },
    ],
  },
  {
    id: "food-delight",
    name: "甜品快闪店",
    category: "餐饮",
    palette: ["#f97316", "#fde68a", "#fef3c7"],
    backgroundColor: "#fff7ed",
    description: "活泼俏皮的甜品宣传单。",
    elements: [
      {
        id: "dessert",
        type: "image",
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=60",
        position: { x: 40, y: 100 },
        size: { width: 340, height: 300 },
        style: {
          borderRadius: 20,
        },
      },
      {
        id: "title",
        type: "text",
        content: "快闪甜品日",
        position: { x: 40, y: 40 },
        size: { width: 340, height: 60 },
        style: {
          fontFamily: "'ZCOOL KuaiLe', cursive",
          fontSize: 40,
          color: "#f97316",
          fontWeight: 700,
          textAlign: "left",
          lineHeight: 1.2,
        },
      },
      {
        id: "info",
        type: "text",
        content: "周末限定 · 下午 2 点至 6 点",
        position: { x: 40, y: 420 },
        size: { width: 340, height: 80 },
        style: {
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 22,
          color: "#92400e",
          fontWeight: 600,
          textAlign: "left",
          lineHeight: 1.5,
        },
      },
      {
        id: "cta",
        type: "shape",
        position: { x: 220, y: 520 },
        size: { width: 160, height: 70 },
        style: {
          backgroundColor: "#f97316",
          borderRadius: 999,
        },
        text: {
          content: "预约试吃",
          style: {
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: 20,
            color: "#fff",
            textAlign: "center",
            fontWeight: 600,
          },
        },
      },
    ],
  },
];

/**
 * 分类列表：通过预先计算避免每次渲染重复计算。
 */
export const templateCategories = [
  { id: "all", label: "全部" },
  { id: "旅游", label: "旅游" },
  { id: "时尚", label: "时尚" },
  { id: "餐饮", label: "餐饮" },
];
