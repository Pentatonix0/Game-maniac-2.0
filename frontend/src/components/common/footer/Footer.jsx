import React from 'react';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = ({ companyName = 'Good price' }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="bg-[#18181A] py-8 border-t border-gray-600 mt-auto"
            aria-label="Site footer"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center text-gray-600 space-y-4">
                    <p className="text-sm font-medium">
                        © {currentYear} {companyName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);
