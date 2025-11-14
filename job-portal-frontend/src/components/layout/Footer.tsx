export default function Footer() {
  return (
    <footer className="mt-10 py-6 bg-gray-100 dark:bg-gray-900 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </p>
    </footer>
  );
}
