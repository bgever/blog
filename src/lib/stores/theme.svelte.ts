import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
	// Get initial theme from localStorage or system preference
	const getInitialTheme = (): Theme => {
		if (!browser) return 'light';

		const stored = localStorage.getItem('theme') as Theme | null;
		if (stored === 'light' || stored === 'dark') return stored;

		// Check system preference
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}

		return 'light';
	};

	let current = $state<Theme>(getInitialTheme());

	function applyTheme(value: Theme) {
		if (browser) {
			localStorage.setItem('theme', value);
			document.documentElement.classList.toggle('dark', value === 'dark');
		}
	}

	// Apply initial theme on load
	if (browser) {
		applyTheme(current);
	}

	return {
		get current() {
			return current;
		},
		set current(value: Theme) {
			current = value;
			applyTheme(value);
		},
		toggle() {
			const newTheme = current === 'dark' ? 'light' : 'dark';
			current = newTheme;
			applyTheme(newTheme);
		}
	};
}

export const theme = createThemeStore();
