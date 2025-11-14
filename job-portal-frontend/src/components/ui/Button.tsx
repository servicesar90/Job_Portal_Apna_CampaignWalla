export default function Button({ children, ...props }: any) {
  return (
    <button
      {...props}
      className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${props.className}`}
    >
      {children}
    </button>
  );
}
