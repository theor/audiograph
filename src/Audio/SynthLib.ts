export class Synth {
    whiteNoise: AudioBufferSourceNode;
    private ctx: AudioContext;
    constructor() {
        this.ctx = new AudioContext();

        var bufferSize = 2 * this.ctx.sampleRate,
        noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate),
        output = noiseBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        this.whiteNoise = this.ctx.createBufferSource();
        this.whiteNoise.buffer = noiseBuffer;
        this.whiteNoise.loop = true;
        this.whiteNoise.start(0);

    }

    start() {
        this.whiteNoise.connect(this.ctx.destination);
    }

    stop() {
        this.whiteNoise.disconnect(this.ctx.destination);
    }
}