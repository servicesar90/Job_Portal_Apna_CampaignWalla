export default function Card({ children }: any) {
  return (
    <div className="p-4 shadow-sm rounded-md bg-white dark:bg-gray-900">
      {children}
    </div>
  );
}
