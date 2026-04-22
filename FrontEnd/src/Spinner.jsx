import React from 'react';

const OverlaySpinner = ({ message = "Processing Request..." }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Frosted Glass Backdrop */}
      <div className="absolute inset-0 bg-[#F4F1EA]/60 backdrop-blur-[2px]" />

      {/* Spinner Container */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* The Loader */}
        <div className="relative w-16 h-16">
          {/* Inner ring */}
          <div className="absolute inset-0 border-4 border-[#332D26] opacity-10 rounded-full"></div>
          {/* Animated segment */}
          <div className="absolute inset-0 border-4 border-t-[#332D26] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>

        {/* Technical Text */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#332D26]">
            {message}
          </span>
          <div className="mt-2 h-[1px] w-12 bg-[#332D26] opacity-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default OverlaySpinner;