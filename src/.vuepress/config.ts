import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  port: '8080', //端口号
  lang: "zh-CN",
  title: "T-Shell",
  description: "T-Shell是一体化的的服务器,网络管理软件,不仅是ssh客户端,还是功能强大的开发,运维工具,充分满足开发,运维需求.特色功能:云端同步,本地化命令输入框,支持自动补全,命令历史,自定义命令参数,文本高亮",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
