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

	// Sync to localStorage and DOM when theme changes
	$effect(() => {
		if (browser) {
			localStorage.setItem('theme', current);
			document.documentElement.classList.toggle('dark', current === 'dark');
		}
	});

	return {
		get current() {
			return current;
		},
		set current(value: Theme) {
			current = value;
		},
		toggle() {
			current = current === 'dark' ? 'light' : 'dark';
		}
	};
}

export const theme = createThemeStore();
