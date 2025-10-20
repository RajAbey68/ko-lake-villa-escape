import PoolSunset from '@/assets/PoolSunset.jpg';
import Villa1 from '@/assets/1 (3).jpg';
import Villa2 from '@/assets/2 (5).jpg';
import Villa3 from '@/assets/3 (3).jpg';
import { mockGallery } from '@/lib/mockData';

const SimpleIndex = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-playfair font-bold text-tropical-700">Ko Lake</h1>
            <div className="flex gap-6">
              <a href="#rooms" className="hover:text-tropical-600">Rooms</a>
              <a href="#gallery" className="hover:text-tropical-600">Gallery</a>
              <a href="#contact" className="hover:text-tropical-600">Contact</a>
              <button className="bg-tropical-600 text-white px-6 py-2 rounded-lg hover:bg-tropical-700">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Legacy-style Hero Section */}
      <section 
        className="relative h-[70vh] md:h-[75vh] flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${PoolSunset})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        data-testid="hero"
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-4">Ko Lake</h1>
          <p className="text-xl md:text-2xl mb-2">Luxury Lakefront Accommodation in Sri Lanka</p>
          <p className="text-lg md:text-xl mb-6 font-light italic">Relax, Revive, Connect</p>
          <div className="flex items-center justify-center gap-6 mb-8 text-base md:text-lg">
            <div className="flex items-center gap-2"><span className="material-icons text-yellow-300">place</span>Koggala Lake, Galle District</div>
            <div className="flex items-center gap-2"><span className="material-icons text-yellow-300">call</span><a href="tel:+94711730345" className="hover:text-amber-200">+94711730345</a></div>
            <div className="flex items-center gap-2"><span className="material-icons text-green-300">chat</span><a href="https://wa.me/94711730345" target="_blank" rel="noreferrer" className="hover:text-amber-200">WhatsApp</a></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/accommodation" className="inline-block">
              <button className="bg-white text-amber-900 hover:bg-amber-50 hover:text-amber-900 w-full px-6 py-3 rounded-lg shadow">
                View Rooms & Rates
              </button>
            </a>
            <a href="/gallery" className="inline-block">
              <button className="border border-white text-white hover:bg-white hover:text-amber-900 w-full px-6 py-3 rounded-lg">
                Explore Gallery
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Legacy-style Quick Stats */}
      <section className="py-12 bg-gray-50" data-testid="stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-800 mb-2">12</div>
              <div className="text-gray-600">Max Guests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-800 mb-2">6</div>
              <div className="text-gray-600">Bedrooms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-800 mb-2">4.9</div>
              <div className="text-gray-600">Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-800 mb-2">15%</div>
              <div className="text-gray-600">Save Direct</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 bg-gray-50" data-testid="rooms-section">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-playfair font-bold text-center mb-12">Our Accommodations</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Room 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
              <img src={Villa1} alt="Lakeside Master Suite" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-playfair font-bold mb-2">Lakeside Master Suite</h3>
                <p className="text-gray-600 mb-4">Panoramic lake views with king-size bed</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-tropical-600">$150</span>
                  <span className="text-sm text-gray-500">per night</span>
                </div>
              </div>
            </div>

            {/* Room 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
              <img src={Villa2} alt="Garden Villa" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-playfair font-bold mb-2">Garden Villa</h3>
                <p className="text-gray-600 mb-4">Charming garden-facing room</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-tropical-600">$120</span>
                  <span className="text-sm text-gray-500">per night</span>
                </div>
              </div>
            </div>

            {/* Room 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
              <img src={Villa3} alt="Entire Villa" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-playfair font-bold mb-2">Entire Villa</h3>
                <p className="text-gray-600 mb-4">Book the entire villa for 8 guests</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-tropical-600">$500</span>
                  <span className="text-sm text-gray-500">per night</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 bg-white" data-testid="gallery-section">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-playfair font-bold text-center mb-12">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockGallery.slice(0, 12).map(item => (
              <div key={item.id} className="relative rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <img src={(item as any).image_url} alt={item.title} className="w-full h-48 md:h-56 object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/40 text-white px-3 py-2 text-sm">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-gray-50" data-testid="contact-section">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-playfair font-bold text-center mb-6">Contact</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">Have questions or want to book directly? Reach out and we’ll get back within 24 hours.</p>
          <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Phone</div>
              <a href="tel:+94771234567" className="text-lg font-semibold text-tropical-600">+94 77 123 4567</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Email</div>
              <a href="mailto:info@kolakevilla.com" className="text-lg font-semibold text-tropical-600">info@kolakevilla.com</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-sm text-gray-500 mb-2">Message Us</div>
              <a href="/contact" className="inline-block bg-tropical-600 text-white px-5 py-2 rounded-lg hover:bg-tropical-700">Open Contact Page</a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-tropical-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-4">Ready to Experience Paradise?</h2>
          <p className="text-xl mb-8">Book your stay at Ko Lake today</p>
          <button className="bg-white text-tropical-600 px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition">
            Check Availability
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-playfair font-bold mb-4">Ko Lake</h3>
          <p className="text-gray-400 mb-4">Ahangama, Sri Lanka</p>
          <p className="text-gray-400">© 2025 Ko Lake. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleIndex;
