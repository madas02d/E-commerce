import React from 'react';

const TypographyShowcase = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <h1 className="text-5xl font-black text-gray-900 mb-8 font-merriweather tracking-tight">
        Merriweather Typography
      </h1>
      
      <div className="space-y-8">
        {/* Font Weights */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-merriweather">Font Weights</h2>
          <div className="space-y-2">
            <p className="text-xl font-light text-gray-700">Light (300) - Elegant and refined</p>
            <p className="text-xl font-normal text-gray-700">Normal (400) - Clean and readable</p>
            <p className="text-xl font-bold text-gray-700">Bold (700) - Strong and impactful</p>
            <p className="text-xl font-black text-gray-700">Black (900) - Maximum impact</p>
          </div>
        </section>

        {/* Headings */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-merriweather">Heading Styles</h2>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 font-merriweather tracking-tight">Heading 1 - Main Titles</h1>
            <h2 className="text-3xl font-bold text-gray-800 font-merriweather">Heading 2 - Section Titles</h2>
            <h3 className="text-2xl font-semibold text-gray-700 font-merriweather">Heading 3 - Subsection Titles</h3>
            <h4 className="text-xl font-medium text-gray-600 font-merriweather">Heading 4 - Card Titles</h4>
          </div>
        </section>

        {/* Body Text */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-merriweather">Body Text</h2>
          <div className="space-y-4">
            <p className="text-lg font-normal text-gray-700 leading-relaxed">
              This is body text with normal weight. Merriweather is a serif typeface designed for on-screen reading. 
              It features a very large x-height, slightly condensed letterforms, a mild diagonal stress, sturdy serifs 
              and open forms.
            </p>
            <p className="text-base font-light text-gray-600 leading-relaxed">
              This is lighter body text for secondary information. The font works well for both headings and body text, 
              making it versatile for various design applications.
            </p>
          </div>
        </section>

        {/* Product Text Examples */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-merriweather">E-commerce Examples</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-merriweather">Casual Cotton T-Shirt</h3>
              <p className="text-sm font-normal text-gray-600 mb-2">Soft and breathable cotton T-shirt, perfect for everyday wear.</p>
              <p className="text-lg font-bold text-orange-600">€19.99</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-merriweather">Elegant Summer Dress</h3>
              <p className="text-sm font-normal text-gray-600 mb-2">A beautiful floral summer dress, lightweight and stylish.</p>
              <p className="text-lg font-bold text-orange-600">€39.99</p>
            </div>
          </div>
        </section>

        {/* Utility Classes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-merriweather">Available Utility Classes</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-light">font-light (300)</p>
              <p className="font-normal">font-normal (400)</p>
              <p className="font-medium">font-medium (500)</p>
              <p className="font-semibold">font-semibold (600)</p>
              <p className="font-bold">font-bold (700)</p>
              <p className="font-extrabold">font-extrabold (800)</p>
              <p className="font-black">font-black (900)</p>
            </div>
            <div>
              <p className="font-merriweather">font-merriweather</p>
              <p className="font-sans">font-sans (Merriweather)</p>
              <p className="font-serif">font-serif (Merriweather)</p>
              <p className="tracking-tight">tracking-tight</p>
              <p className="tracking-normal">tracking-normal</p>
              <p className="tracking-wide">tracking-wide</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TypographyShowcase; 