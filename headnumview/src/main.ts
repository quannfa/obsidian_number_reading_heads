import { Plugin } from 'obsidian';

export default class HeadNumViewPlugin extends Plugin {
    onload() {
        console.log('HeadNumView Plugin loaded');
        // 使用滚动事件更新标题编号
        window.addEventListener('scroll', this.updateHeadings.bind(this));
        // 初次加载时更新编号
        this.updateHeadings();
    }

    onunload() {
        console.log('HeadNumView Plugin unloaded');
        window.removeEventListener('scroll', this.updateHeadings.bind(this));
    }

    updateHeadings() {
        const headings: NodeListOf<HTMLElement> = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        this.addNumbering(headings);
    }

    addNumbering(headings: NodeListOf<HTMLElement>) {
        let counts = [0, 0, 0, 0, 0, 0];
        headings.forEach((heading) => {
            const level = parseInt(heading.tagName.substring(1)) - 1;
            // 重置当前标题层级以下的计数器
            for (let i = level + 1; i < counts.length; i++) {
                counts[i] = 0;
            }
            counts[level] += 1;
            // 生成编号字符串，如 1.2.3
            const numbering = counts.slice(0, level + 1).join(".");
            // 如果标题尚未编号，则添加编号
            if (!heading.innerText.trim().match(/^(\d+\.)+/)) {
                heading.innerText = `${numbering}. ${heading.innerText}`;
            }
        });
    }
}
