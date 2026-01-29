/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563EB',
                success: '#10B981',
                danger: '#EF4444',
                warning: '#F59E0B',
            },
        },
    },
    plugins: [],
}
