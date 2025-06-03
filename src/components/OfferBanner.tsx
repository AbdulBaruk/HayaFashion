import React from 'react';
import { Tag, X } from 'lucide-react';

interface OfferBannerProps {
  onClose: () => void;
}

export function OfferBanner({ onClose }: OfferBannerProps) {
  return (
    <div className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2 text-white">
            <Tag className="h-5 w-5" />
            <p className="text-sm font-medium">
              Special Offer: Get 20% off on all accessories! Use code{' '}
              <span className="font-bold">SUMMER20</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}