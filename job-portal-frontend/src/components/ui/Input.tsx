import clsx from "clsx";

export default function Input({ label, className, ...props }: any) {
  return (
    <div className="w-full">
      {label && (
        <label className=" ">
          {label}
        </label>
      )}

      <input
        {...props}
        className={clsx(
          "w-full p-2 border border-gray-500 rounded-sm text-gray-900 placeholder:text-gray-400",
          "focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]",
          "transition-all duration-300 dark:bg-white dark:border-gray-600",
          "dark:text-gray-900 dark:focus:border-[#4F46E5] dark:focus:ring-[#4F46E5]",
          
        )}
      />
    </div>
  );
}
