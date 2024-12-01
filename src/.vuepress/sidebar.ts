import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "主要功能",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    }
  ],
});
