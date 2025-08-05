# Image Color Changer

A modern web application that allows users to upload images and apply various color filters, adjustments, and effects in real-time.

## Features

### 🎨 Basic Adjustments
- **Brightness**: Adjust image brightness from 0% to 200%
- **Contrast**: Modify image contrast from 0% to 200%
- **Saturation**: Control color saturation from 0% to 200%
- **Hue Rotation**: Rotate colors through the entire color spectrum (0° to 360°)

### 🌈 Color Filters
- **Normal**: Original image without filters
- **Grayscale**: Convert to black and white
- **Sepia**: Apply vintage sepia tone
- **Invert**: Invert all colors
- **Blur**: Apply subtle blur effect
- **Vintage**: Warm vintage color palette
- **Cool**: Cool blue-tinted filter
- **Warm**: Warm orange-tinted filter

### 🎭 Color Overlays
- **Overlay Color**: Choose any color to overlay on the image
- **Opacity Control**: Adjust overlay intensity from 0% to 100%
- **Blend Modes**: Multiple blend modes including:
  - Multiply
  - Screen
  - Overlay
  - Soft Light
  - Hard Light
  - Color
  - Hue
  - Saturation
  - Luminosity

### ✨ Special Effects
- **Vignette**: Add dark corners for dramatic effect
- **Noise**: Add film grain noise effect
- **Pixelate**: Create pixelated effect

### 🔄 Actions
- **Reset**: Reset all adjustments to default values
- **Random**: Apply random combinations of filters and effects
- **Download**: Save the edited image as PNG

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd image-color-changer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Usage

1. **Upload an Image**: Click the upload area or drag and drop an image file
2. **Apply Adjustments**: Use the sliders to adjust brightness, contrast, saturation, and hue
3. **Choose Filters**: Click on filter buttons to apply different color effects
4. **Add Overlays**: Select a color and adjust opacity to overlay on the image
5. **Apply Effects**: Toggle special effects like vignette, noise, or pixelation
6. **Download**: Click the download button to save your edited image

## Technical Details

- **Frontend**: Vanilla JavaScript with HTML5 Canvas API
- **Build Tool**: Vite for fast development and optimized builds
- **Image Processing**: Real-time pixel manipulation using Canvas 2D Context
- **File Handling**: Drag and drop support with file validation
- **Responsive Design**: Works on desktop and mobile devices

## Browser Support

This application works in all modern browsers that support:
- HTML5 Canvas API
- File API
- Drag and Drop API
- ES6+ JavaScript features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 