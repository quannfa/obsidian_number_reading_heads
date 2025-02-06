"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTitles = exports.getTitles = exports.DEFAULT_SETTINGS = void 0;
const obsidian_1 = require("obsidian");
exports.DEFAULT_SETTINGS = {
    numberingFormat: '1.1',
    numberingSeparator: '.',
    enableNumbering: true,
    titleLevels: [1, 2, 3]
};
// 内嵌 utils.ts 内容
function getTitles(markdown) {
    const titleRegex = /^(#+)\s+(.*)$/gm;
    const titles = [];
    let match;
    while ((match = titleRegex.exec(markdown)) !== null) {
        titles.push(match[2]);
    }
    return titles;
}
exports.getTitles = getTitles;
function renderTitles(titles) {
    return titles.map(title => `<h1>${title}</h1>`).join('\n');
}
exports.renderTitles = renderTitles;
// 插件主类
class MyPlugin extends obsidian_1.Plugin {
    constructor(app, manifest) {
        super(app, manifest);
        this.settings = exports.DEFAULT_SETTINGS;
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading MyPlugin');
            yield this.loadSettings();
            this.addCommand({
                id: 'my-command',
                name: 'My Command',
                callback: () => {
                    console.log('My Command executed');
                }
            });
            // 根据标题层级更新后处理器，使用计数器分别处理 h1-h6
            let counters = [0, 0, 0, 0, 0, 0];
            // 监测窗口切换
            this.app.workspace.on("active-leaf-change", () => {
                const view = this.app.workspace.getActiveViewOfType(obsidian_1.MarkdownView);
                if (view) {
                    counters = [0, 0, 0, 0, 0, 0];
                }
            });
            // 注册后处理器
            this.registerMarkdownPostProcessor((element, context) => {
                const headers = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
                headers.forEach(header => {
                    const level = parseInt(header.tagName.substring(1));
                    // 移除对 this.settings.titleLevels 的判断，让所有级别都编号
                    counters[level - 1]++;
                    for (let i = level; i < counters.length; i++) {
                        counters[i] = 0;
                    }
                    const numbering = counters.slice(0, level).join(this.settings.numberingSeparator);
                    header.innerText = numbering + ' ' + header.innerText;
                });
            });
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, exports.DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    onunload() {
        console.log('Unloading MyPlugin');
    }
}
exports.default = MyPlugin;
