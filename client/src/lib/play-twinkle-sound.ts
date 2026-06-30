let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  audioContext ??= new AudioContext();
  return audioContext;
}

/** Short sparkly arpeggio — call after a user gesture (e.g. vote tap). */
export function playTwinkleSound() {
  const ctx = getAudioContext();
  if (!ctx) {
    return;
  }

  void ctx.resume().then(() => {
    const now = ctx.currentTime;
    const notes = [987.77, 1244.51, 1480, 1975.53];

    notes.forEach((frequency, index) => {
      const start = now + index * 0.055;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.09, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(start);
      oscillator.stop(start + 0.32);
    });
  });
}
