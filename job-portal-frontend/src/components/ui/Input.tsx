export default function Input({ label, ...props }: any) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm mb-1">{label}</label>}
      <input
        {...props}
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
      />
    </div>
  );
}
