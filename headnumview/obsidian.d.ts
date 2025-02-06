declare module "obsidian" {
  export class Plugin {
    constructor();
    addCommand(command: {
      id: string;
      name: string;
      callback: () => void;
    }): void;
    onload(): void;
    onunload(): void;
  }
}
