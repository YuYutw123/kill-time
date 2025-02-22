import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faHome,
    faGamepad,
    faBars,
    faTimes
} from "@fortawesome/free-solid-svg-icons";

const menuItems = [
    { icon: faGamepad, label: "2048", path: "/" },
    { icon: faGamepad, label: "踩地雷", path: "/minesweeper" },
    { icon: faGamepad, label: "五子棋", path: "/gomoku" },
    { icon: faGamepad, label: "井字遊戲", path: "/tictactoe" },
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <>
            {/* 漢堡選單按鈕 */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1b1e] rounded-lg text-gray-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FontAwesomeIcon 
                    icon={isOpen ? faTimes : faBars} 
                    className="w-6 h-6"
                />
            </button>

            {/* 背景遮罩 */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div 
                className={`
                    fixed md:static
                    inset-y-0 left-0
                    w-64 md:w-16 hover:w-64
                    bg-[#1a1b1e] text-gray-200
                    transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    transition-all duration-300
                    z-40 md:z-0
                    flex flex-col
                    h-screen
                    group
                `}
            >
                {/* Logo */}
                <div className="p-4">
                    <FontAwesomeIcon 
                        icon={faHome} 
                        className="text-blue-500 text-2xl"
                    />
                </div>

                {/* Menu Items */}
                <nav className="flex-1 py-2">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="flex items-center h-12 px-4 hover:bg-[#25262b] group"
                            onClick={() => isMobile && setIsOpen(false)}
                        >
                            <FontAwesomeIcon 
                                icon={item.icon}
                                className="text-gray-400 group-hover:text-gray-200"
                            />
                            <span className={`
                                ml-4 
                                whitespace-nowrap 
                                block
                                text-gray-200
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity duration-300
                                md:block
                            `}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
