'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <div className="w-full py-8">
      <div className="container">
        {/* <div className="flex justify-between items-center">
          <p className="text-sm text-white">
            © 3inches, {new Date().getFullYear()}
          </p>
          <div className="w-auto">
            <a
              href="https://github.com/findtoni/3inches"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                alt="GitHub stars"
                src="https://img.shields.io/github/stars/findtoni/3inches?style=social"
                width={125}
                height={100}
              />
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
