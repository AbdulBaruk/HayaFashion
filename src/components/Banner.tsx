import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import banner1 from "../../src/assets/image/banner-1-haya.png"
import banner2 from "../../src/assets/image/banner-2-haya.jpeg"
import { Link } from 'react-router-dom';

const bannerImages = [
  {
    url: banner1,
    title: 'Elegance Woven in Modesty TEST',
    subtitle: 'Timeless Hijabs for the Modern You'
  },
  {
    url: banner2,
    title: 'Style with Purpose, Grace with Abya TEST',
    subtitle: 'Where Fashion Meets Faith'
  },
  {
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1920&h=600',
    title: 'Your Hijab. Your Style. Your Identity TEST',
    subtitle: 'Celebrate Modesty with Confidence'
  }
];

export function Banner() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => {
    setCurrentIndex((current) => (current + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((current) => (current - 1 + bannerImages.length) % bannerImages.length);
  };

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[400px] overflow-hidden">
      {bannerImages.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Link to='/shop'>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.url})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h2>
              <p className="text-xl md:text-2xl">{banner.subtitle}</p>
            </div>
          </Link>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
          />
        ))}
      </div>
    </div>
  );
}