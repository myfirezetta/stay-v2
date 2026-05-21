import { ChevronLeft } from 'lucide-react';
import type { ScreenType } from '../types';

export function DetailsScreen({
  onNavigate,
}: {
  onNavigate: (screen: ScreenType) => void;
}) {
  return (
    <div className="pt-8 pb-20">
      <div className="max-w-max-width mx-auto px-margin-desktop mb-6">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center text-sm font-medium hover:text-primary transition-colors text-on-surface-variant mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Home
        </button>
      </div>
      
      {/* Gallery Section */}
      <section className="max-w-max-width mx-auto px-margin-desktop mb-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 relative group cursor-pointer">
            <img alt="Main Resort View" className="w-full h-full object-cover hover:brightness-90 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbVva7e_KyAsSlOzKSTNDsKys_Nv_93IaYAcK_U2apB4_WV8oooPnn22LYfhCoSqCwB3ifR7Pr_kHnXavJ3rHKFRKToaFjkvqIV_rntNOwucw7Zo7IoPjE7iYjcRYuJ57Ibg49GzU-4rSQy7NffV7sQTk9VBEXoBZPnDRKYSMVAZkWTRd7I7BICWsWe_IY53-uc2iwhly_XaRt0bmiKPY3tO3_5-Fwssy7X9VaanljSZjRIy3KTRyTXl8TgtraW7fs7tEYY2kuEr91" />
          </div>
          <div className="group cursor-pointer relative">
            <img alt="Suite Interior" className="w-full h-full object-cover hover:brightness-90 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhVahjmPks-c94kJGznQObqFwrFNvw45MKE5Svlelo3i-Ikrc3f73zSOvsRYVxJ2u0XY-9Y6OdLnwf_Ym9Vv-SpKSsqTCrY4dH5x8OW3i7XXbt5fOU5PFuRj8Aqpptp5OHGTUq8lwH3vrhqmPXTVAju0TYsAZv_8xGV6I64m0uETEeXUCNXoT348n_OaND9FBlOpfq5lxCthn7JMZki6KqM8xz32s0E-iaO3R2lP536V2yygdPHL59Z-s81XrilAbgGXI43U5-HLpP"/>
          </div>
          <div className="group cursor-pointer relative">
            <img alt="Balcony View" className="w-full h-full object-cover hover:brightness-90 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuJRaB7drA0JDkTXWbOiw8q37jNXqKTQ-Sxp6LWqz5uN6AKNMk_Nn9gaJeXo8VuY8i34iv-lq3yrO89MvMbUV5FqRVW_Bnru7Y-9JRW8d-75dsjVpAKRM6Z4sMnIkLxocibEU-7uzdA3mdgvnvpIzRuK-H3Jm_e86rfkx1t5_Ago3fn_6yjPmYNfoDFSyqY6N1mrn1ImPsv45OgW52YbvlJxTc9XQXDXr1KRZSzWbfU9X7xgimPVLZEN-AVOLjC3SQ4X1k26uNqCBT"/>
          </div>
          <div className="col-span-1 group cursor-pointer relative">
            <img alt="Michelin Dining" className="w-full h-full object-cover hover:brightness-90 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2M34FaL1xQn0lcjZRVAbr8rzJ7wPTyr9XZyAluLh8s5Ncn8gjVmrDJQTX3FyGi1kG2RoFW1Po4v8srBtKpIL87j-ocaaM8OHJ5tDGvKLZv7x2CdEdXlMQAEziXHrrPu3rIhXpSK66YsgdMJjouGlycr-9C08RMsv1If5YsX0lynUpQytvCQQ80LvOixqJm6eZqKFnsqUwQz6-InxFSa4IzhD8vI5gCao9R0zYjrKSIkD3hKYjukWFhciwlcGp3Lih1J5vDuRVnMgR"/>
          </div>
          <div className="group cursor-pointer relative">
            <img alt="Spa View" className="w-full h-full object-cover hover:brightness-90 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9nhD3iKVHB7aA8PKtZEc5QtCxEZNgcxkBrWW0tYOsnafbrHsM8XADBoPukAsHorLJcivdwSnj4rUT5CtzuBLi4CpDsBjsy7gtfwL3yKKigG9itvQYVrCk9-HKT-QqxB4Zy4bu73HtpJqY81FfzBzlMKIhlfhs2Hx-YuR_EmsozGFEPQzz5CAeOxojZP0zqoV9injLym2B8q6gqi4SpIgOoRTyS_00_3Zzb_w_WersBrLxHWjJmZS6ZMYGt1JzplsvF_FtUYxlDp_O"/>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-max-width mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-on-surface mb-2 tracking-tight">The Grand Azure Resort</h1>
            <div className="flex items-center gap-2 text-sm text-on-surface">
              <div className="flex items-center font-semibold">
                <span className="mr-1">★</span> 4.98
                <span className="mx-2 text-on-surface-variant font-normal">·</span>
                <span className="underline">2,450 reviews</span>
              </div>
              <span className="mx-1 text-on-surface-variant">·</span>
              <span className="underline font-semibold">Amalfi Coast, Italy</span>
            </div>
          </div>

          <hr className="border-surface-container-highest my-8" />

          <article className="mb-12">
            <h2 className="text-2xl font-semibold text-on-surface mb-6">About this sanctuary</h2>
            <div className="space-y-6 text-on-surface text-[16px] leading-relaxed">
              <p>Perched atop the jagged cliffs of the Amalfi Coast, The Grand Azure Resort is an architectural masterpiece that redefines modern coastal luxury. Our philosophy centers on "quiet luxury"—providing an unobtrusive yet deeply personalized service that allows the breathtaking natural surroundings to take center stage.</p>
              <p>Every suite has been meticulously designed with sustainable materials and local craftsmanship, offering panoramic Mediterranean views through expansive glass walls.</p>
            </div>
          </article>

          <hr className="border-surface-container-highest my-8" />

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-on-surface mb-8">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-center gap-4 text-on-surface">
                <span className="text-xl">🏊</span>
                <span className="text-[16px]">Infinity pool</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface">
                <span className="text-xl">🌿</span>
                <span className="text-[16px]">Aromatherapy spa</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface">
                <span className="text-xl">🍽️</span>
                <span className="text-[16px]">Michelin dining</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface">
                <span className="text-xl">🏋️</span>
                <span className="text-[16px]">Elite gym</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface">
                <span className="text-xl">🏖️</span>
                <span className="text-[16px]">Private beach</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface">
                <span className="text-xl">🛎️</span>
                <span className="text-[16px]">24/7 Concierge</span>
              </div>
            </div>
            <button className="mt-8 px-6 py-3 border border-on-surface rounded-lg font-semibold hover:bg-surface-container transition-colors">
              Show all 45 amenities
            </button>
          </div>

          <hr className="border-surface-container-highest my-8" />

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-on-surface mb-8">Where you'll sleep</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 border border-surface-container-highest rounded-xl flex flex-col gap-4">
                <span className="text-2xl">🛏️</span>
                <div>
                  <p className="font-semibold">Azure Horizon Suite</p>
                  <p className="text-sm text-on-surface-variant">1 king bed</p>
                </div>
              </div>
              <div className="p-6 border border-surface-container-highest rounded-xl flex flex-col gap-4">
                <span className="text-2xl">🛏️</span>
                <div>
                  <p className="font-semibold">Guest Bedroom</p>
                  <p className="text-sm text-on-surface-variant">1 queen bed</p>
                </div>
              </div>
            </div>
          </div>
          
          <hr className="border-surface-container-highest my-8" />

          <div className="mb-12">
            <div className="flex items-center gap-2 text-2xl font-semibold text-on-surface mb-8">
              <span>★ 4.98 · 2,450 reviews</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 mb-12">
              <div className="flex items-center justify-between">
                <span className="text-[16px]">Cleanliness</span>
                <div className="flex items-center gap-3 w-48">
                  <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden"><div className="w-[98%] h-full bg-on-surface"></div></div>
                  <span className="text-xs font-semibold">4.9</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[16px]">Communication</span>
                <div className="flex items-center gap-3 w-48">
                  <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden"><div className="w-[100%] h-full bg-on-surface"></div></div>
                  <span className="text-xs font-semibold">5.0</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[16px]">Check-in</span>
                <div className="flex items-center gap-3 w-48">
                  <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden"><div className="w-[96%] h-full bg-on-surface"></div></div>
                  <span className="text-xs font-semibold">4.8</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[16px]">Accuracy</span>
                <div className="flex items-center gap-3 w-48">
                  <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden"><div className="w-[98%] h-full bg-on-surface"></div></div>
                  <span className="text-xs font-semibold">4.9</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img alt="Reviewer" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu-mjsewb7Uojkk0WBxgN2u3AFrBXOlH-sHIOjt4MNayd7LqV0Bi23NKg70JfpJfDcXAv9I6HZKITAok_o8Q7hUXl6uJCyIn3qJJx-9Iy43vGq9eg-I7xZbK7G7mSLRLqytM0CUpzKABm4nIaHKNfiBgYK_RJ3VzveCuGunLhq2WyTTTfJGBzFlmPmL-w3c_cgHM5GffvQKNRlZ6864ekeC2tU3vFh_J-Ct7XRGE8wm7nl2Cf_zhdWmUN6pgfHyOrduRF2GP-_1hOY"/>
                  <div>
                    <h4 className="font-semibold">Marcus</h4>
                    <p className="text-sm text-on-surface-variant">September 2023</p>
                  </div>
                </div>
                <p className="text-[16px] text-on-surface leading-relaxed w-[100%] max-w-[400px]">"The attention to detail is unparalleled. From the scent of the lobby to the curated art in my room, everything breathed excellence. The infinity pool at sunset is an experience everyone should have at least once in their life."</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">S</div>
                  <div>
                    <h4 className="font-semibold">Sarah</h4>
                    <p className="text-sm text-on-surface-variant">August 2023</p>
                  </div>
                </div>
                <p className="text-[16px] text-on-surface leading-relaxed w-[100%] max-w-[400px]">"An incredible stay. The staff anticipate your every need. The views from the private balcony are something I will never forget. Truly a world-class destination."</p>
              </div>
            </div>
            
            <button className="mt-12 px-6 py-3 border border-on-surface rounded-lg font-semibold hover:bg-surface-container transition-colors">
              Show all 2,450 reviews
            </button>
          </div>
        </div>

        {/* Right Sidebar - Floating Booking Card */}
        <aside className="lg:col-span-4 relative">
          <div className="sticky top-28 p-6 bg-white rounded-2xl border border-surface-container-highest shadow-[0px_6px_20px_rgba(0,0,0,0.12)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-2xl font-bold text-on-surface">$1,250</span>
                <span className="text-on-surface-variant text-[16px] ml-1">night</span>
              </div>
            </div>

            <div className="border border-outline rounded-xl overflow-hidden mb-4">
              <div className="grid grid-cols-2 border-b border-outline">
                <div className="p-3 border-r border-outline flex flex-col hover:bg-surface-container-low transition-colors">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-on-surface">Check-in</label>
                  <span className="text-sm">10/12/2024</span>
                </div>
                <div className="p-3 flex flex-col hover:bg-surface-container-low transition-colors">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-on-surface">Checkout</label>
                  <span className="text-sm">10/19/2024</span>
                </div>
              </div>
              <div className="p-3 flex flex-col hover:bg-surface-container-low transition-colors">
                <label className="text-[10px] font-bold uppercase tracking-wide text-on-surface">Guests</label>
                <div className="flex justify-between items-center">
                  <span className="text-sm">2 guests</span>
                  <span>▼</span>
                </div>
              </div>
            </div>

            <button 
              className="w-full py-4 bg-primary text-white font-bold text-[16px] rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-md mb-4"
              onClick={() => onNavigate('checkout')}
            >
              Reserve
            </button>
            
            <p className="text-center text-sm text-on-surface-variant mb-6">You won't be charged yet</p>
            
            <div className="space-y-4">
              <div className="flex justify-between text-[16px] text-on-surface">
                <span className="underline">$1,250 x 7 nights</span>
                <span>$8,750</span>
              </div>
              <div className="flex justify-between text-[16px] text-on-surface">
                <span className="underline">LuxeStay service fee</span>
                <span>$420</span>
              </div>
              <div className="flex justify-between text-[16px] text-on-surface">
                <span className="underline">Occupancy taxes and fees</span>
                <span>$150</span>
              </div>
              <hr className="border-surface-container-highest pt-2" />
              <div className="flex justify-between font-bold text-lg text-on-surface">
                <span>Total before taxes</span>
                <span>$9,320</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4 text-xs text-on-surface-variant border-t border-surface-container-highest pt-6">
              <span className="text-primary text-xl">🛡️</span>
              <span>LuxeStay Protection included for every booking.</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
