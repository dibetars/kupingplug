'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './glitch.css';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="relative h-screen w-full flex items-end justify-center pb-10">
      {/* Glitch Background */}
      <div className="glitch-wrapper">
        <div className="glitch">
          <div className="glitch-img">
            <Image
              src="/welcome-bg.jpg"
              alt="Welcome Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="glitch-img">
            <Image
              src="/welcome-bg.jpg"
              alt="Welcome Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="glitch-img">
            <Image
              src="/welcome-bg.jpg"
              alt="Welcome Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <button
          onClick={() => router.push('/about')}
          className="bg-white/80 backdrop-blur-sm text-black px-12 py-5 rounded-full text-xl font-semibold 
                     hover:bg-black hover:text-white transition-all duration-300
                     border-2 border-white"
        >
          Enter Site
        </button>
      </div>
    </div>
  );
} 