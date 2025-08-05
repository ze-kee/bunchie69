class ImageColorChanger {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.originalImage = null;
        this.currentImage = null;
        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hue: 0
        };
        this.currentFilter = 'none';
        this.overlay = {
            color: '#ff0000',
            opacity: 0,
            blendMode: 'multiply'
        };
        this.effects = {
            vignette: false,
            noise: false,
            pixelate: false
        };
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.loadDefaultImage();
    }

    setupCanvas() {
        this.canvas = document.getElementById('imageCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = 600;
        this.canvas.height = 400;
        
        // Clear canvas with placeholder
        this.drawPlaceholder();
    }

    drawPlaceholder() {
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#dee2e6';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Upload an image to get started', this.canvas.width / 2, this.canvas.height / 2);
    }

    setupEventListeners() {
        // File upload
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        
        uploadArea.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', (e) => this.handleImageUpload(e));

        // Basic adjustments
        document.getElementById('brightness').addEventListener('input', (e) => {
            this.filters.brightness = e.target.value;
            document.getElementById('brightnessValue').textContent = e.target.value + '%';
            this.applyFilters();
        });

        document.getElementById('contrast').addEventListener('input', (e) => {
            this.filters.contrast = e.target.value;
            document.getElementById('contrastValue').textContent = e.target.value + '%';
            this.applyFilters();
        });

        document.getElementById('saturation').addEventListener('input', (e) => {
            this.filters.saturation = e.target.value;
            document.getElementById('saturationValue').textContent = e.target.value + '%';
            this.applyFilters();
        });

        document.getElementById('hue').addEventListener('input', (e) => {
            this.filters.hue = e.target.value;
            document.getElementById('hueValue').textContent = e.target.value + '°';
            this.applyFilters();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.applyFilters();
            });
        });

        // Overlay controls
        document.getElementById('overlayColor').addEventListener('change', (e) => {
            this.overlay.color = e.target.value;
            this.applyFilters();
        });

        document.getElementById('overlayOpacity').addEventListener('input', (e) => {
            this.overlay.opacity = e.target.value;
            document.getElementById('overlayOpacityValue').textContent = e.target.value + '%';
            this.applyFilters();
        });

        document.getElementById('blendMode').addEventListener('change', (e) => {
            this.overlay.blendMode = e.target.value;
            this.applyFilters();
        });

        // Effects
        document.getElementById('vignette').addEventListener('change', (e) => {
            this.effects.vignette = e.target.checked;
            this.applyFilters();
        });

        document.getElementById('noise').addEventListener('change', (e) => {
            this.effects.noise = e.target.checked;
            this.applyFilters();
        });

        document.getElementById('pixelate').addEventListener('change', (e) => {
            this.effects.pixelate = e.target.checked;
            this.applyFilters();
        });

        // Action buttons
        document.getElementById('resetBtn').addEventListener('click', () => this.resetFilters());
        document.getElementById('randomBtn').addEventListener('click', () => this.randomizeFilters());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadImage());
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'rgba(102, 126, 234, 0.1)';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'rgba(255,255,255,0.9)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'rgba(255,255,255,0.9)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.loadImage(files[0]);
            }
        });
    }

    loadDefaultImage() {
        const img = new Image();
        img.onload = () => {
            this.originalImage = img;
            this.currentImage = img;
            this.displayImage();
            this.showDownloadButton();
        };
        img.src = '/bunchie22.png';
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.loadImage(file);
        }
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.currentImage = img;
                this.displayImage();
                this.showDownloadButton();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    displayImage() {
        if (!this.currentImage) return;

        // Calculate dimensions to fit canvas while maintaining aspect ratio
        const canvasAspect = this.canvas.width / this.canvas.height;
        const imageAspect = this.currentImage.width / this.currentImage.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imageAspect > canvasAspect) {
            drawWidth = this.canvas.width;
            drawHeight = this.canvas.width / imageAspect;
            offsetX = 0;
            offsetY = (this.canvas.height - drawHeight) / 2;
        } else {
            drawHeight = this.canvas.height;
            drawWidth = this.canvas.height * imageAspect;
            offsetX = (this.canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw image
        this.ctx.drawImage(this.currentImage, offsetX, offsetY, drawWidth, drawHeight);
    }

    applyFilters() {
        if (!this.originalImage) return;

        // Create a temporary canvas for processing
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        
        // Draw original image
        this.displayImage();
        
        // Get image data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Apply basic adjustments
        this.applyBasicAdjustments(data);
        
        // Apply filter effects
        this.applyFilterEffects(data);
        
        // Put processed data back
        this.ctx.putImageData(imageData, 0, 0);
        
        // Apply overlay
        if (this.overlay.opacity > 0) {
            this.applyOverlay();
        }
        
        // Apply effects
        if (this.effects.vignette) this.applyVignette();
        if (this.effects.noise) this.applyNoise();
        if (this.effects.pixelate) this.applyPixelate();
    }

    applyBasicAdjustments(data) {
        const brightness = this.filters.brightness / 100;
        const contrast = this.filters.contrast / 100;
        const saturation = this.filters.saturation / 100;
        const hue = this.filters.hue;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Brightness
            r *= brightness;
            g *= brightness;
            b *= brightness;

            // Contrast
            const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
            r = factor * (r - 128) + 128;
            g = factor * (g - 128) + 128;
            b = factor * (b - 128) + 128;

            // Saturation
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            r = gray + saturation * (r - gray);
            g = gray + saturation * (g - gray);
            b = gray + saturation * (b - gray);

            // Hue rotation
            if (hue !== 0) {
                const hsl = this.rgbToHsl(r, g, b);
                hsl[0] = (hsl[0] + hue) % 360;
                const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
                r = rgb[0];
                g = rgb[1];
                b = rgb[2];
            }

            data[i] = Math.max(0, Math.min(255, r));
            data[i + 1] = Math.max(0, Math.min(255, g));
            data[i + 2] = Math.max(0, Math.min(255, b));
        }
    }

    applyFilterEffects(data) {
        switch (this.currentFilter) {
            case 'grayscale':
                for (let i = 0; i < data.length; i += 4) {
                    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    data[i] = gray;
                    data[i + 1] = gray;
                    data[i + 2] = gray;
                }
                break;
            case 'sepia':
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
                }
                break;
            case 'invert':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
                break;
            case 'blur':
                // Simple blur effect
                const tempData = new Uint8ClampedArray(data);
                for (let y = 1; y < this.canvas.height - 1; y++) {
                    for (let x = 1; x < this.canvas.width - 1; x++) {
                        const idx = (y * this.canvas.width + x) * 4;
                        let r = 0, g = 0, b = 0;
                        
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const nIdx = ((y + dy) * this.canvas.width + (x + dx)) * 4;
                                r += tempData[nIdx];
                                g += tempData[nIdx + 1];
                                b += tempData[nIdx + 2];
                            }
                        }
                        
                        data[idx] = r / 9;
                        data[idx + 1] = g / 9;
                        data[idx + 2] = b / 9;
                    }
                }
                break;
            case 'vintage':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.2);
                    data[i + 1] = Math.min(255, data[i + 1] * 0.9);
                    data[i + 2] = Math.min(255, data[i + 2] * 0.8);
                }
                break;
            case 'cool':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 0.8);
                    data[i + 1] = Math.min(255, data[i + 1] * 0.9);
                    data[i + 2] = Math.min(255, data[i + 2] * 1.2);
                }
                break;
            case 'warm':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.2);
                    data[i + 1] = Math.min(255, data[i + 1] * 1.1);
                    data[i + 2] = Math.min(255, data[i + 2] * 0.8);
                }
                break;
        }
    }

    applyOverlay() {
        const overlayColor = this.hexToRgb(this.overlay.color);
        const opacity = this.overlay.opacity / 100;
        
        this.ctx.globalCompositeOperation = this.overlay.blendMode;
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = `rgb(${overlayColor.r}, ${overlayColor.g}, ${overlayColor.b})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 1;
    }

    applyVignette() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
        
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'source-over';
    }

    applyNoise() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 30;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    applyPixelate() {
        const size = 8;
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let y = 0; y < this.canvas.height; y += size) {
            for (let x = 0; x < this.canvas.width; x += size) {
                const idx = (y * this.canvas.width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                for (let dy = 0; dy < size && y + dy < this.canvas.height; dy++) {
                    for (let dx = 0; dx < size && x + dx < this.canvas.width; dx++) {
                        const nIdx = ((y + dy) * this.canvas.width + (x + dx)) * 4;
                        data[nIdx] = r;
                        data[nIdx + 1] = g;
                        data[nIdx + 2] = b;
                    }
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    resetFilters() {
        this.filters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hue: 0
        };
        this.currentFilter = 'none';
        this.overlay.opacity = 0;
        this.effects = {
            vignette: false,
            noise: false,
            pixelate: false
        };
        
        // Reset UI
        document.getElementById('brightness').value = 100;
        document.getElementById('contrast').value = 100;
        document.getElementById('saturation').value = 100;
        document.getElementById('hue').value = 0;
        document.getElementById('overlayOpacity').value = 0;
        document.getElementById('vignette').checked = false;
        document.getElementById('noise').checked = false;
        document.getElementById('pixelate').checked = false;
        
        document.getElementById('brightnessValue').textContent = '100%';
        document.getElementById('contrastValue').textContent = '100%';
        document.getElementById('saturationValue').textContent = '100%';
        document.getElementById('hueValue').textContent = '0°';
        document.getElementById('overlayOpacityValue').textContent = '0%';
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="none"]').classList.add('active');
        
        this.applyFilters();
    }

    randomizeFilters() {
        this.filters.brightness = Math.random() * 100 + 50;
        this.filters.contrast = Math.random() * 100 + 50;
        this.filters.saturation = Math.random() * 150 + 25;
        this.filters.hue = Math.random() * 360;
        
        const filters = ['none', 'grayscale', 'sepia', 'invert', 'vintage', 'cool', 'warm'];
        this.currentFilter = filters[Math.floor(Math.random() * filters.length)];
        
        this.overlay.opacity = Math.random() * 50;
        this.effects.vignette = Math.random() > 0.7;
        this.effects.noise = Math.random() > 0.8;
        this.effects.pixelate = Math.random() > 0.9;
        
        // Update UI
        document.getElementById('brightness').value = this.filters.brightness;
        document.getElementById('contrast').value = this.filters.contrast;
        document.getElementById('saturation').value = this.filters.saturation;
        document.getElementById('hue').value = this.filters.hue;
        document.getElementById('overlayOpacity').value = this.overlay.opacity;
        document.getElementById('vignette').checked = this.effects.vignette;
        document.getElementById('noise').checked = this.effects.noise;
        document.getElementById('pixelate').checked = this.effects.pixelate;
        
        document.getElementById('brightnessValue').textContent = Math.round(this.filters.brightness) + '%';
        document.getElementById('contrastValue').textContent = Math.round(this.filters.contrast) + '%';
        document.getElementById('saturationValue').textContent = Math.round(this.filters.saturation) + '%';
        document.getElementById('hueValue').textContent = Math.round(this.filters.hue) + '°';
        document.getElementById('overlayOpacityValue').textContent = Math.round(this.overlay.opacity) + '%';
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${this.currentFilter}"]`).classList.add('active');
        
        this.applyFilters();
    }

    showDownloadButton() {
        document.getElementById('downloadBtn').style.display = 'block';
        document.getElementById('uploadArea').style.display = 'none';
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    // Utility functions
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return [h * 360, s * 100, l * 100];
    }

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [r * 255, g * 255, b * 255];
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ImageColorChanger();
}); 