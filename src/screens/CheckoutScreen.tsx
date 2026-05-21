import { ChevronRight, Lock } from 'lucide-react';
import type { ScreenType } from '../types';

export function CheckoutScreen({
  onNavigate,
}: {
  onNavigate: (screen: ScreenType) => void;
}) {
  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-12">
      {/* Breadcrumb */}
      <div className="mb-12 flex items-center text-sm font-medium text-on-surface-variant">
        <button className="text-on-surface hover:underline" onClick={() => onNavigate('details')}>Details</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-on-surface">Payment</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="opacity-50">Confirm</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Checkout Details */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h1 className="text-3xl md:text-[32px] font-bold mb-8 tracking-tight">Confirm and pay</h1>
            
            <div className="space-y-8">
              {/* Guest Info */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Guest Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">First Name</label>
                    <input 
                      type="text" 
                      defaultValue="Julian"
                      className="w-full px-4 py-4 bg-white border border-outline rounded-xl font-medium focus:border-on-surface outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue="Vandervalt"
                      className="w-full px-4 py-4 bg-white border border-outline rounded-xl font-medium focus:border-on-surface outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant ml-1">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="j.vandervalt@modernluxury.com"
                      className="w-full px-4 py-4 bg-white border border-outline rounded-xl font-medium focus:border-on-surface outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-outline-variant"></div>

              {/* Payment Details */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Pay with</h2>
                  <div className="flex gap-2">
                    <img alt="Visa" className="h-4 opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsIDJjADE9dqZ6xfkC8NI3-zVn23w3inTrwtCJTRMWTo1gtOzzdQYDXc_eslVgCeqORq-_keMfF4QiSSc3UtThdsmF-YcN36J_BryEsTj9ONqyDkHt7hKjiv0u1DxLj9VkMvb9gApRnrDtiJVvwSpUrZnS0ywOzwXQih4KbcwZElrU_gccTANZyXd_bbL0AKwySYAnbgFCu2TJEmGz4GeVB_DZiNu1hUWPIDKpwK_yVc3zB-uXzT4Kj-ZFAe1MFkWIBTbJFRBtebS8"/>
                    <img alt="MasterCard" className="h-6 opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoI16wujD8rz8LKrHZgSOXvgUojXFvsqgYJ5EhH88rOFv5bQCbMaNOnD-A7CeLX2bQMbVMT07d9VR2It-hja_7s6c_grgr6muaCY6fDHMBqvySVycYZUi4uJs69e6xt7fKhgoiEpmlNBwuJKdqLqj1KD0yvjVbgyfzORT3EjC08fKsazD_ed5BKo4dzc7ePMyT8ixzqOFCeiFxq4zwXKESEf1k1t4BfgTUgxcTc0ookX_3Urs7K2RRU0kZQVgXu57TJlCu1zaod2eT"/>
                  </div>
                </div>

                <div className="border border-outline rounded-xl overflow-hidden bg-white">
                  <div className="p-4 border-b border-outline">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant block mb-1">Cardholder Name</label>
                    <input type="text" placeholder="Name as it appears on card" className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium outline-none text-on-surface" />
                  </div>
                  <div className="p-4 border-b border-outline">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant block mb-1">Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium outline-none text-on-surface" />
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="p-4 border-r border-outline">
                      <label className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant block mb-1">Expiration</label>
                      <input type="text" placeholder="MM / YY" className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium outline-none text-on-surface" />
                    </div>
                    <div className="p-4">
                      <label className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant block mb-1">CVV</label>
                      <input type="password" placeholder="123" className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium outline-none text-on-surface" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
              <Lock className="w-5 h-5 text-on-surface-variant flex-shrink-0" />
              <p className="text-sm text-on-surface-variant">
                Your payment is encrypted and secure. We never store your full card details.
              </p>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary Floating Card */}
        <aside className="lg:col-span-5 relative mt-8 lg:mt-0">
          <div className="sticky top-28 bg-white rounded-2xl border border-outline-variant p-6 space-y-6 shadow-[0px_6px_16px_rgba(0,0,0,0.12)]">
            <div className="flex gap-4">
              <img 
                alt="The Azure Estate" 
                className="w-28 h-28 object-cover rounded-xl" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2pi_Bt_-iEGYmIfh4vewPJiz3n0-qr4ityMQo81XeckOL6DAndqx6eU6zYBfrVyochmy7KvF2_vtJ-vCkyyIgWcm6xE9uIjGgfB7iLDhQ7MYf2jIBR0Jh_4ihN49sjBdjBoCxJ6HxfBXfCd3cy7tF6kHPb8XbSBbGKckyz0QL-mvbFfI8aNiYaSw-9fjAmngOFZP5P1qxNJkTjHruR5bwgSIX-xsEryMatuMF4z6ohTg0fPnyU-dW6XlMtLC8YYFUNeuC9d4H94N_"
              />
              <div className="flex flex-col justify-center">
                <p className="text-sm text-on-surface-variant">Panoramic Suite</p>
                <h3 className="font-bold text-lg">The Azure Estate</h3>
                <p className="text-sm text-on-surface-variant mt-1 flex items-center gap-1 font-semibold">
                  <span className="text-[14px]">★</span> 4.9 (128 reviews)
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-outline-variant"></div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Price details</h4>
              <div className="space-y-3 font-medium">
                <div className="flex justify-between text-on-surface">
                  <span className="underline decoration-on-surface-variant/30">$1,250 x 5 nights</span>
                  <span>$6,250.00</span>
                </div>
                <div className="flex justify-between text-on-surface">
                  <span className="underline decoration-on-surface-variant/30">Service fee</span>
                  <span>$145.00</span>
                </div>
                <div className="flex justify-between text-on-surface">
                  <span className="underline decoration-on-surface-variant/30">Occupancy taxes</span>
                  <span>$312.50</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-outline-variant"></div>

            <div className="flex justify-between items-center font-bold text-on-surface text-lg">
              <span>Total (USD)</span>
              <span>$6,707.50</span>
            </div>

            <button 
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:brightness-110 transition-all active:scale-[0.98] text-lg text-center"
              onClick={() => {
                alert('Booking Confirmed!');
                onNavigate('home');
              }}
            >
              Confirm Booking
            </button>
            <p className="text-center text-sm text-on-surface-variant font-medium">
              You won't be charged yet
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
