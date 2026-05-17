import Link from 'next/link';

const toSlug = (name: string | undefined) =>
  name
    ?.toString()
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[\/&]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || '';

const productDatabase: Record<string, any> = {
  'w1': { name: 'Elegant White Pearl', category: 'Wedding', emoji: '💍', description: 'A timeless white pearl cake with delicate details, perfect for your elegant wedding ceremony.' },
  'w2': { name: 'Rose Garden Romance', category: 'Wedding', emoji: '🌹', description: 'Beautiful rose-adorned cake with romantic pink tones for your special day.' },
  'v1': { name: 'Rose Garden', category: 'Vintage', emoji: '🌹', description: 'Classic vintage rose design with nostalgic charm.' },
  'b1': { name: 'Teddy Bear', category: 'Baby', emoji: '🧸', description: 'Adorable teddy bear design perfect for baby celebrations.' },
  'f1': { name: 'Rose Bloom', category: 'Floral', emoji: '🌹', description: 'Fresh rose petals creating a stunning floral arrangement.' },
  'l1': { name: '2 Cupcake Bento', category: 'Luxury', emoji: '🎁', description: 'Elegant bento box with 2 premium cupcakes.' },
};

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = productDatabase[resolvedParams.id];

  if (!product) {
    return (
      <div className="min-h-screen pt-24 px-6 md:px-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-[#2C2C2C] mb-4">Product Not Found</h1>
          <Link href="/" className="text-[#F283AE] font-semibold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="px-6 md:px-12 py-6">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link href="/" className="text-[#98898D] hover:text-[#2C2C2C]">Home</Link>
          <span className="text-[#98898D]">/</span>
          <Link href={`/shop/${toSlug(product.category)}`} className="text-[#98898D] hover:text-[#2C2C2C]">
            {product.category}
          </Link>
          <span className="text-[#98898D]">/</span>
          <span className="text-[#2C2C2C] font-semibold">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <section className="px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="flex flex-col gap-6">
            <div
              className="w-full h-96 rounded-2xl flex items-center justify-center text-9xl bg-gradient-to-br from-[#FAC1B5]/40 to-[#F283AE]/20"
            >
              {product.emoji}
            </div>
            
            {/* Related Products */}
            <div>
              <h3 className="font-semibold text-[#2C2C2C] mb-4">Similar Cakes</h3>
              <div className="grid grid-cols-3 gap-3">
                {['💍', '🌹', '✨'].map((emoji, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-lg bg-[#F0E8DF] flex items-center justify-center text-4xl hover:scale-105 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-serif text-[#2C2C2C] mb-3">
              {product.name}
            </h1>
            <p className="text-[#98898D] text-lg mb-6">
              {product.category} Collection
            </p>
            
            {/* Description */}
            <div className="bg-[#F0E8DF]/30 rounded-lg p-6 mb-8">
              <p className="text-[#2C2C2C] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="mb-8">
              <h3 className="font-semibold text-[#2C2C2C] mb-4">Why Choose This Cake?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#F283AE] font-bold text-xl">✓</span>
                  <span className="text-[#2C2C2C]">Premium quality ingredients with no artificial flavors</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F283AE] font-bold text-xl">✓</span>
                  <span className="text-[#2C2C2C]">Handcrafted design with attention to detail</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F283AE] font-bold text-xl">✓</span>
                  <span className="text-[#2C2C2C]">Fully customizable flavors, size, and design</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F283AE] font-bold text-xl">✓</span>
                  <span className="text-[#2C2C2C]">Delivery available across Lahore</span>
                </li>
              </ul>
            </div>

            {/* Customization Options */}
            <div className="bg-[#F0E8DF]/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-[#2C2C2C] mb-4">Customization Options</h3>
              <div className="space-y-3 text-sm text-[#98898D]">
                <div>
                  <p className="font-semibold text-[#2C2C2C]">Available Sizes</p>
                  <p>0.5lb, 1lb, 2lb, 2.5lb</p>
                </div>
                <div>
                  <p className="font-semibold text-[#2C2C2C]">Flavour Options</p>
                  <p>French Vanilla, Celestial Caramel, Cherry Chocolate Fantasy, Chocolate Amour, Nutella Caramel</p>
                </div>
                <div>
                  <p className="font-semibold text-[#2C2C2C]">Add-ons</p>
                  <p>Cards, Candles, Toppers, Balloons, and more</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={`/customize?productId=${resolvedParams.id}`}
                className="w-full px-8 py-4 bg-[#F283AE] text-white rounded-full font-semibold hover:bg-[#E86FA3] transition-colors text-center"
              >
                Customize This Cake
              </a>
              <a
                href="/"
                className="w-full px-8 py-4 border-2 border-[#FAC1B5] text-[#2C2C2C] rounded-full font-semibold hover:bg-[#F0E8DF] transition-colors text-center"
              >
                Continue Shopping
              </a>
            </div>

            {/* Info Message */}
            <div className="mt-8 p-4 bg-[#C59FBE]/10 rounded-lg border border-[#C59FBE]/30">
              <p className="text-sm text-[#98898D]">
                <span className="font-semibold text-[#2C2C2C]">Note:</span> All cakes are made to order. Please place your order at least 48 hours in advance for the best results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 px-6 md:px-12 bg-[#F0E8DF]/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-[#2C2C2C] mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'Zainab M.', rating: 5, text: 'Absolutely stunning and delicious!' },
              { name: 'Saira K.', rating: 5, text: 'Perfect for our wedding. Highly recommend!' },
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <span key={j} className="text-[#F283AE]">★</span>
                  ))}
                </div>
                <p className="text-[#2C2C2C] mb-3">{review.text}</p>
                <p className="font-semibold text-[#98898D] text-sm">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
