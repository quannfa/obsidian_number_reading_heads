import { Plugin, MarkdownView, App, PluginManifest } from 'obsidian';

// 内嵌 settings.ts 内容
export interface MyPluginSettings {
	numberingFormat: string;
	numberingSeparator: string;
	enableNumbering: boolean;
	titleLevels: number[];
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	numberingFormat: '1.1',
	numberingSeparator: '.',
	enableNumbering: true,
	titleLevels: [1, 2, 3]
};

// 内嵌 utils.ts 内容
export function getTitles(markdown: string): string[] {
	const titleRegex = /^(#+)\s+(.*)$/gm;
	const titles = [];
	let match;
	while ((match = titleRegex.exec(markdown)) !== null) {
		titles.push(match[2]);
	}
	return titles;
}

export function renderTitles(titles: string[]): string {
	return titles.map(title => `<h1>${title}</h1>`).join('\n');
}

// 插件主类
export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.settings = DEFAULT_SETTINGS;
	}

	async onload() {
		console.log('Loading MyPlugin');
		await this.loadSettings();

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
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
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
				(header as HTMLElement).innerText = numbering + ' ' + (header as HTMLElement).innerText;
			});
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload() {
		console.log('Unloading MyPlugin');
	}
}