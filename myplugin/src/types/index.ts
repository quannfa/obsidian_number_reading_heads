export interface PluginSettings {
    enableFeatureX: boolean;
    featureYThreshold: number;
}

export interface Command {
    id: string;
    name: string;
    callback: () => void;
}

export interface PluginData {
    settings: PluginSettings;
    commands: Command[];
}