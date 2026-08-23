export type AppStatus = 'native' | 'web' | 'bridge' | 'blocked';
export type Category = 'All' | 'Development' | 'Design' | 'Communication' | 'Productivity' | 'Media';

export type WorkApp = {
  id: string;
  name: string;
  monogram: string;
  color: string;
  category: Exclude<Category, 'All'>;
  status: AppStatus;
  note: string;
  plan: string;
  source: string;
};

export const APPS: WorkApp[] = [
  { id: 'photoshop', name: 'Photoshop', monogram: 'Ps', color: '#2163e8', category: 'Design', status: 'blocked', note: 'No supported Linux desktop build', plan: 'Keep a Windows or macOS lane for production work. The built-in Windows VM has no GPU passthrough, so dual boot or a second machine is the honest route.', source: 'https://helpx.adobe.com/photoshop/desktop/get-started/technical-requirements-installation/adobe-photoshop-on-desktop-technical-requirements.html' },
  { id: 'illustrator', name: 'Illustrator', monogram: 'Ai', color: '#e98112', category: 'Design', status: 'blocked', note: 'No supported Linux desktop build', plan: 'Use a separate Windows/macOS environment for production Illustrator work. Inkscape is worth testing, but file fidelity must be validated against your real deliverables.', source: 'https://helpx.adobe.com/illustrator/system-requirements.html' },
  { id: 'figma', name: 'Figma', monogram: 'Fi', color: '#f24e1e', category: 'Design', status: 'web', note: 'Primary workflow is browser-based', plan: 'Install Figma as an Omarchy web app. Test fonts, local font access, and any organization-specific plugins before wiping another OS.', source: 'https://help.figma.com/hc/en-us/articles/5601429983767-Guide-to-the-Figma-desktop-app' },
  { id: 'canva', name: 'Canva', monogram: 'Ca', color: '#00a6a6', category: 'Design', status: 'web', note: 'Works through the browser', plan: 'Use Canva as a Chromium web app. Keep a browser profile dedicated to creative work if you use multiple accounts.', source: 'https://www.canva.com/download/' },
  { id: 'vscode', name: 'VS Code', monogram: '</>', color: '#1782d0', category: 'Development', status: 'native', note: 'Native Linux build', plan: 'Install from Omarchy’s editor menu, then sync settings. Validate remote containers and any proprietary extension before migrating.', source: 'https://code.visualstudio.com/docs/setup/linux' },
  { id: 'cursor', name: 'Cursor', monogram: 'Cu', color: '#242424', category: 'Development', status: 'native', note: 'Available from Omarchy’s editor menu', plan: 'Install from Omarchy’s editor menu. Export any local rules, snippets, and MCP configuration separately from account sync.', source: 'https://omarchy.org/manual/development-tools/' },
  { id: 'jetbrains', name: 'JetBrains IDEs', monogram: 'JB', color: '#d3298f', category: 'Development', status: 'native', note: 'Linux builds are available', plan: 'Install Toolbox or the IDE package you use. Re-test file watchers, Docker integration, and global shortcuts under Wayland.', source: 'https://www.jetbrains.com/toolbox-app/' },
  { id: 'docker', name: 'Docker', monogram: 'Do', color: '#1479e8', category: 'Development', status: 'native', note: 'Included in the Omarchy workflow', plan: 'Use Omarchy’s Docker setup and move projects through Git, not by copying active volumes. Recreate databases from dumps or migrations.', source: 'https://omarchy.org/manual/development-tools/' },
  { id: 'android-studio', name: 'Android Studio', monogram: 'An', color: '#40a76b', category: 'Development', status: 'native', note: 'Official Linux support', plan: 'Install the Linux build and restore SDKs selectively. Confirm hardware acceleration and USB debugging on your actual device.', source: 'https://developer.android.com/studio/install' },
  { id: 'xcode', name: 'Xcode / iOS', monogram: 'X', color: '#168af2', category: 'Development', status: 'bridge', note: 'CI can build; local Simulator still needs macOS', plan: 'Code on Omarchy, build and test in a macOS runner or Xcode Cloud, and keep access to a Mac for Simulator, signing diagnostics, and device debugging.', source: 'https://developer.apple.com/documentation/Xcode/Xcode-Cloud' },
  { id: 'windows-builds', name: 'Windows builds', monogram: 'Win', color: '#1675d1', category: 'Development', status: 'bridge', note: 'Build on a hosted Windows runner', plan: 'Send tagged builds to a Windows GitHub Actions runner and upload signed output as an artifact. Keep a Windows test lane for runtime and installer QA.', source: 'https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job' },
  { id: 'slack', name: 'Slack', monogram: '#', color: '#7c3aed', category: 'Communication', status: 'native', note: 'Linux app and web workflow', plan: 'Use the Linux app or install the web version. Verify screen sharing, audio routing, and notification behavior before committing.', source: 'https://slack.com/downloads/linux' },
  { id: 'discord', name: 'Discord', monogram: 'Di', color: '#5865f2', category: 'Communication', status: 'native', note: 'Linux desktop build', plan: 'Install the Linux app and verify screen sharing under Wayland for your exact use case.', source: 'https://discord.com/download' },
  { id: 'zoom', name: 'Zoom', monogram: 'Zm', color: '#2d8cff', category: 'Communication', status: 'native', note: 'Official Linux client', plan: 'Install the Linux client, then run a test call covering camera, microphone, screen sharing, and virtual backgrounds.', source: 'https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0063458' },
  { id: 'notion', name: 'Notion', monogram: 'N', color: '#171717', category: 'Productivity', status: 'web', note: 'Browser workflow is the safe route', plan: 'Install Notion as a web app. Check offline expectations first—the browser route is strongest when you stay connected.', source: 'https://www.notion.com/help/notion-for-web' },
  { id: 'microsoft-365', name: 'Microsoft 365', monogram: 'M', color: '#e05a26', category: 'Productivity', status: 'bridge', note: 'Web apps or the built-in Windows VM', plan: 'Start with Microsoft 365 on the web. For advanced desktop-only features, use Omarchy’s Windows VM; it is explicitly suited to Office-class apps.', source: 'https://omarchy.org/manual/windows-vm/' },
  { id: 'obsidian', name: 'Obsidian', monogram: 'Ob', color: '#7c4dff', category: 'Productivity', status: 'native', note: 'Included in the Omarchy experience', plan: 'Move the vault through your existing sync method, then review community plugins before enabling all of them on the new system.', source: 'https://omarchy.org/manual/guis/' },
  { id: 'spotify', name: 'Spotify', monogram: 'Sp', color: '#1db954', category: 'Media', status: 'native', note: 'Easy install in Omarchy', plan: 'Install through Omarchy’s service menu. Offline playback is supported by the Linux app.', source: 'https://omarchy.org/manual/commercial-apps-services/' },
  { id: 'obs', name: 'OBS Studio', monogram: 'OBS', color: '#3d3d45', category: 'Media', status: 'native', note: 'Included in Omarchy', plan: 'Import a copy of your scenes, then reselect PipeWire audio sources and verify hardware encoding before a real stream.', source: 'https://omarchy.org/manual/' },
  { id: 'premiere', name: 'Premiere Pro', monogram: 'Pr', color: '#6f49d8', category: 'Media', status: 'blocked', note: 'No supported Linux desktop build', plan: 'Keep Windows/macOS for Premiere projects. Omarchy’s Windows VM has no GPU passthrough and is not intended for video editing.', source: 'https://helpx.adobe.com/premiere-pro/system-requirements.html' },
  { id: 'davinci', name: 'DaVinci Resolve', monogram: 'DR', color: '#cf533d', category: 'Media', status: 'bridge', note: 'Linux exists, but workflow compatibility varies', plan: 'Test a real project before switching. Codecs, GPU drivers, plugins, and Arch packaging can turn an apparently native app into a migration project.', source: 'https://www.blackmagicdesign.com/support/family/davinci-resolve-and-fusion' },
];

export const CATEGORIES: Category[] = ['All', 'Development', 'Design', 'Communication', 'Productivity', 'Media'];

export const STATUS_META: Record<AppStatus, { label: string; shortLabel: string; action: string; weight: number }> = {
  native: { label: 'Native path', shortLabel: 'Native', action: 'MOVE', weight: 100 },
  web: { label: 'Web-ready', shortLabel: 'Web', action: 'WRAP', weight: 85 },
  bridge: { label: 'Needs a bridge', shortLabel: 'Bridge', action: 'BRIDGE', weight: 55 },
  blocked: { label: 'Hard blocker', shortLabel: 'Blocked', action: 'KEEP', weight: 0 },
};
