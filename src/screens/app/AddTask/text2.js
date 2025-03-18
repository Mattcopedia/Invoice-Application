import EventEmitter from "events";

export class CliAnimator extends EventEmitter {
    constructor(options = {}) {
        super();
        this.fps = options.fps && options.fps > 0 ? Math.floor(options.fps) : 10;
        this.text = "";
        this.isAnimating = false;
        this.intervalId = null;
        this.style = "typewriter";
        this.color = null;
        this.bold = false;
        this.italic = false;
        this.validColors = ["red", "green", "blue", "yellow", "magenta", "cyan"];
        this.validStyles = ["typewriter", "colored", "wavy"];
        this.colorCodes = {
            red: "\x1b[31m", green: "\x1b[32m", blue: "\x1b[34m",
            yellow: "\x1b[33m", magenta: "\x1b[35m", cyan: "\x1b[36m"
        };
    }

    setText(text) {
        if (typeof text !== "string") {
            throw new Error("Invalid text input. Must be string");
        }
        this.text = text;
        return this;
    }

    setColor(color) {
        if (!this.validColors.includes(color)) {
            throw new Error(`Invalid color. Supported colors are: ${this.validColors.join(", ")}`);
        }
        this.color = color;
        return this;
    }

    setStyle(style) {
        if (!this.validStyles.includes(style)) {
            throw new Error(`Invalid animation style. Supported styles are: ${this.validStyles.join(", ")}`);
        }
        this.style = style;
        return this;
    }

    setBold(enable = true) {
        this.bold = enable;
        return this;
    }

    setItalic(enable = true) {
        this.italic = enable;
        return this;
    }

    _colorize(text, intensity = null) {
        let styles = [];
        if (this.bold) styles.push("\x1b[1m");
        if (this.italic) styles.push("\x1b[3m");
        if (this.color && intensity === null) styles.push(this.colorCodes[this.color]);
        if (this.color && intensity !== null) styles.push(`${this.colorCodes[this.color]}${intensity === 0 ? ";2" : ""}m`);
        return styles.length ? `${styles.join("")}${text}\x1b[0m` : text;
    }

    _generateTypewriterFrame(progress) {
        const chars = Math.floor(this.text.length * progress);
        return this._colorize(this.text.substring(0, chars).padEnd(this.text.length));
    }

    _generateColoredFrame(progress) {
        const intensity = progress < 0.5 ? 0 : 1; 
        return this._colorize(this.text, intensity);
    }

    _generateWavyFrame(progress) {
        const wavelength = Math.max(10, this.text.length);
        const phase = progress * 2 * Math.PI;
        let lines = ["", ""];
        for (let x = 0; x < this.text.length; x++) {
            const yPos = Math.round(Math.sin((x / wavelength) * 2 * Math.PI + phase));
            const char = this.text[x];
            lines[0] += yPos >= 0 ? char : " ";
            lines[1] += yPos < 0 ? char : " ";
        }
        return lines.map(line => this._colorize(line)).join("\n");
    }

    _generateProgressBar(progress) {
        const barWidth = 20;
        const filled = Math.floor(barWidth * progress);
        return `\n[${"=".repeat(filled)}>{" ".repeat(barWidth - filled)}] ${Math.floor(progress * 100)}%`;
    }

    async animate() {
        if (this.isAnimating || !this.text) return Promise.resolve();
        this.isAnimating = true;
        this.emit("start");

        const minDuration = 3000;
        const totalFrames = Math.max(this.fps * 3, this.text.length * 2);
        const frameTime = minDuration / totalFrames;

        return new Promise((resolve) => {
            let frameCount = 0;
            let lastProgress = -10;
            let lastProgressTime = Date.now();

            this.intervalId = setInterval(() => {
                frameCount++;
                const progress = Math.min(frameCount / totalFrames, 1);
                const frameProgress = progress === 1 ? 1 : frameCount / (totalFrames - 1);

                let frame;
                switch (this.style) {
                    case "typewriter": frame = this._generateTypewriterFrame(frameProgress); break;
                    case "colored": frame = this._generateColoredFrame(frameProgress); break;
                    case "wavy": frame = this._generateWavyFrame(frameProgress); break;
                }

                const currentTime = Date.now();
                const currentPercent = Math.floor(progress * 100);
                if (currentPercent >= lastProgress + 10 || currentTime - lastProgressTime >= 1000) {
                    lastProgress = Math.floor(currentPercent / 10) * 10;
                    this.emit("progress", { percent: lastProgress });
                    lastProgressTime = currentTime;
                }

                process.stdout.write("\r\x1b[K");
                process.stdout.write(frame + this._generateProgressBar(progress));
                const frameLines = frame.split('\n').length;
                process.stdout.write(`\x1b[${frameLines}A`);

                if (frameCount >= totalFrames) {
                    this.stop();
                    resolve();
                }
            }, frameTime);
        }).then(() => {
            process.stdout.write("\r\x1b[K" + this._colorize(this.text) + "\n");
            this.emit("complete");
        });
    }

    stop() {
        if (!this.isAnimating) return;
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isAnimating = false;
        process.stdout.write("\r\x1b[K");
        if (this.text) process.stdout.write(this._colorize(this.text) + "\n");
        this.emit("stop");
    }
}