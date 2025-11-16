export default function Footer() {
    const FOOTER_BG = "bg-[#1C164D]"; 
    const TEXT_COLOR = "text-gray-300";
    const LINK_HOVER = "hover:text-[#4F46E5] hover:underline transition duration-200";

    const sections = [
        {
            title: "Find Jobs",
            links: [
                { name: "Browse All Jobs", to: "/jobs/all" },
                { name: "Remote Jobs", to: "/jobs/remote" },
                { name: "Entry Level", to: "/jobs/entry" },
                { name: "Senior Roles", to: "/jobs/senior" },
                { name: "Salary Search", to: "/salary" },
            ],
        },
        {
            title: "Support",
            links: [
                { name: "Help Center", to: "/support/help" },
                { name: "Contact Us", to: "/support/contact" },
                { name: "Live Chat", to: "/support/chat" },
                { name: "Career Advice", to: "/support/advice" },
                { name: "Success Stories", to: "/support/stories" },
            ],
        },
        {
            title: "Company",
            links: [
                { name: "About Us", to: "/about" },
                { name: "Careers", to: "/careers" },
                { name: "Press", to: "/press" },
                { name: "Partners", to: "/partners" },
            ],
        },
    ];

    return (
        <footer className={`${FOOTER_BG} text-white `}>
            <div className="w-full mx-auto py-12 px-4 lg:px-6 grid grid-cols-1 md:grid-cols-5 gap-10 border-b border-gray-700 ">
                
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-4xl">✨</span> 
                        <span className="text-2xl font-extrabold tracking-tight">HireFlow</span>
                    </div>
                    
                    <p className={`${TEXT_COLOR} text-sm max-w-sm leading-relaxed`}> 
                        The world's leading AI-powered job platform, connecting exceptional talent with dream opportunities effortlessly.
                    </p>

                    <div className="mt-6 space-y-4"> 
                        <p className={`flex items-center ${TEXT_COLOR} text-sm`}>
                            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            info@hireflow.com
                        </p>
                        <p className={`flex items-center ${TEXT_COLOR} text-sm`}>
                            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.128a11.056 11.056 0 005.424 5.424l1.128-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            +91 98765 43210
                        </p>
                        <p className={`flex items-center ${TEXT_COLOR} text-sm`}>
                            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Sector 18, Gurugram, India
                        </p>
                    </div>
                </div>

                {sections.map((section) => (
                    <div key={section.title} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                        <ul className="space-y-4"> 
                            {section.links.map((link) => (
                                <li key={link.name}>
                                    <h2  className={`text-sm ${TEXT_COLOR} ${LINK_HOVER}`}>
                                        {link.name}
                                    </h2>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="max-w-6xl mx-auto py-6 px-4 lg:px-6 flex flex-col md:flex-row justify-between items-center">
                
                <p className={`${TEXT_COLOR} text-sm mb-4 md:mb-0`}>
                    © {new Date().getFullYear()} HireFlow Talent. All rights reserved.
                </p>

                <div className="flex space-x-3">
                    {['twitter', 'linkedin', 'facebook', 'instagram'].map((platform) => (
                        <a 
                            key={platform}
                            href={`#`} 
                            aria-label={platform} 
                            className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-[#4F46E5] transition duration-200"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z"/>
                            </svg>
                        </a>
                    ))}
                </div>
            </div>

            <a 
                href="tel:+919876543210" 
                className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center bg-[#4F46E5] text-white rounded-full shadow-lg hover:bg-[#3B30A3] transition duration-300 z-50"
                aria-label="Call Us"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.12.35.03.75-.25 1.02l-2.2 2.2z"></path></svg>
            </a>
        </footer>
    );
}