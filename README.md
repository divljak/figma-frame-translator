# Figma Frame Translator

A Figma plugin that allows you to translate text content within frames between English and German using the MyMemory Translation API.

![Frame Translator Plugin](./assets/preview.png)

## Features

- Translate text content in selected frames
- Support for English and German languages
- Clean, modern UI with intuitive controls
- Real-time translation using MyMemory Translation API
- Preserves text styling and formatting
- Easy language switching with a single click

## Installation

1. Clone this repository
```bash
git clone https://github.com/divljak/figma-frame-translator.git
cd figma-frame-translator
```

2. Install dependencies
```bash
npm install
```

3. Build the plugin
```bash
npm run build
```

4. In Figma desktop app:
   - Go to Plugins
   - Click "Development"
   - Click "Import plugin from manifest..."
   - Select the `manifest.json` file from this project

## Development

- `npm run build` - Build the plugin
- `npm run watch` - Watch for changes and rebuild automatically

## Usage

1. Select a frame containing text in Figma
2. Open the Frame Translator plugin
3. Choose your source and target languages
4. Click "Translate Frame"
5. Wait for the translation to complete

## Tech Stack

- TypeScript
- Figma Plugin API
- MyMemory Translation API
- Webpack

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 