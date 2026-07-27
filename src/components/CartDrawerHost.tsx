'use client';

import { useEffect, useState } from 'react';
import CartDrawer from '@/components/CartDrawer';

export default function CartDrawerHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openCart = () => setOpen(true);
    const closeCart = () => setOpen(false);
    window.addEventListener('yaxsel:open-cart', openCart);
    window.addEventListener('yaxsel:close-cart', closeCart);
    return () => {
      window.removeEventListener('yaxsel:open-cart', openCart);
      window.removeEventListener('yaxsel:close-cart', closeCart);
    };
  }, []);

  return <CartDrawer open={open} onClose={() => setOpen(false)} />;
}
