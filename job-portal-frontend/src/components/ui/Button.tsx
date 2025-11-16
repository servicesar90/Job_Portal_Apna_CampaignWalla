export default function Button({ children, ...props }: any) {
  return (
    <button
      {...props}
      
      className={`
        w-50
        flex 
        items-center 
        justify-center 
        p-2
        text-white 
        font-medium 
        rounded-lg 
        bg-[#4F46E5] 
        hover:bg-[#3B30A3] 
        transition-colors 
        duration-300 
        shadow-md
        ${props.className || ''} 
      `}
    >
      {children}
    </button>
  );
}