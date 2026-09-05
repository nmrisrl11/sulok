export const WHISPER_PHRASES = {
	positive: [
		"Yay!",
		"Got it!",
		"Awesome!",
		"Nice one!",
		"Saved!",
		"Woohoo!",
		"Looks good!",
		"Perfect!",
		"Done!",
	],
	negative: [
		"Uh oh...",
		"Yikes!",
		"Oops!",
		"Oh no!",
		"Hmm...",
		"Something's wrong.",
		"That didn't work.",
	],
	warning: ["Wait, what?", "Careful...", "Hold on.", "Are you sure?", "Just a heads up!"],
	info: ["Did you know?", "Here's a tip!", "Just so you know.", "Interesting..."],
} as const;

export const getRandomWhisper = (type: keyof typeof WHISPER_PHRASES) => {
	const phrases = WHISPER_PHRASES[type];
	return phrases[Math.floor(Math.random() * phrases.length)];
};
