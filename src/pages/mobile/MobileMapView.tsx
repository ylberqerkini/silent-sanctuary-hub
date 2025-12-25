import React from 'react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import MosqueMap from '@/components/mobile/MosqueMap';

const MobileMapView = () => {
  return (
    <MobileLayout>
      <div className="h-[calc(100vh-60px)] -mx-4 -mt-4">
        <MosqueMap />
      </div>
    </MobileLayout>
  );
};

export default MobileMapView;
