import { Plugin } from 'obsidian';

export default class HeadNumViewPlugin extends Plugin {
  async onload() {
    console.log("加载 HeadNumView 插件");
    // 初始化渲染
    this.renderTitles();
    // 监听滚动事件，文档更新时重新渲染标题编号
    this.registerDomEvent(window, 'scroll', this.renderTitles.bind(this));
  }

  onunload() {
    console.log("卸载 HeadNumView 插件");
  }

  registerDomEvent(target: EventTarget, type: string, callback: EventListener): void {
    target.addEventListener(type, callback);
    this.registerEvent({
      destroy: () => target.removeEventListener(type, callback)
    });
  }

  /**
   * 从页面中获取所有标题元素（h1 ~ h6）。
   */
  getTitles(): HTMLElement[] {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLElement[];
    return headings;
  }

  /**
   * 为标题添加编号。
   * 避免重复编号：使用 data-originalText 保存原始标题内容。
   */
  addNumbering(headings: HTMLElement[]): void {
    // 初始化各级标题计数器
    const counters = [0, 0, 0, 0, 0, 0];
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      if (!heading.dataset.originalText) {
        heading.dataset.originalText = heading.textContent || "";
      }
      // 递增当前级别计数器
      counters[level - 1]++;
      // 重置所有低级计数器
      for (let i = level; i < counters.length; i++) {
        counters[i] = 0;
      }
      const numbering = counters.slice(0, level).join('.') + '. ';
      heading.textContent = numbering + heading.dataset.originalText;
    });
  }

  /**
   * 获取标题并添加编号，完成后渲染到页面中。
   */
  renderTitles() {
    const headings = this.getTitles();
    this.addNumbering(headings);
  }
}
