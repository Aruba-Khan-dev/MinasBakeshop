export const metadata = {
  title: 'About Us - Minas Bakeshop',
  description: 'Learn about the story of Minas Bakeshop - born from passion, crafting sweet memories since day one.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-6 md:px-12 bg-gradient-to-b from-[#F0E8DF]/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif text-[#2C2C2C] mb-6">About Minas Bakeshop</h1>
          <p className="text-xl text-[#98898D] leading-relaxed">
            A small, sweet part of your homes and your happiest moments.
          </p>
        </div>
      </section>

      {/* Story Section - Exact content from requirements */}
      <section className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-[#2C2C2C] mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none text-[#2C2C2C] space-y-6 leading-relaxed">
            <p>
              Minas Bake Shop was born at a turning point in my life—right after I finished high school at 19. I had been wanting to take a baking class for almost a year and a half but wasn&apos;t able to due to many reasons. After graduating, I finally took that step, and it made me realize that things truly happen at the right time, exactly when they&apos;re meant to.
            </p>
            <p>
              What started as a long-awaited passion quickly turned into something more, with the encouragement of my cousins and friends who pushed me to share my work and create this space.
            </p>
            <p>
              Minas Bake Shop is all about becoming a small, sweet part of your homes and your happiest moments. From everyday cravings to your biggest celebrations, every cake is made with love, care, and a personal touch—because it&apos;s never just dessert, it&apos;s part of your memories.
            </p>
            <p>
              Now, it&apos;s been two years, and we&apos;ve been part of countless celebrations—from first-month birthdays to weddings, we&apos;ve covered it all. Minas Bake Shop slowly became a name people trusted; friends recommended our page to each other, and customers became more like friends.
            </p>
            <p className="text-[#F283AE] font-medium italic">
              And this is just the beginning. I&apos;ve always dreamt of having my own small bakery one day—and slowly, that dream is starting to feel real.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 px-6 md:px-12 bg-[#F0E8DF]/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-[#2C2C2C] mb-12 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Made with Love',
                description: 'Every cake is handcrafted with care and a personal touch.',
                color: '#F283AE',
              },
              {
                title: 'Premium Quality',
                description: 'We use only the finest ingredients to ensure every bite is a delight.',
                color: '#98B8B9',
              },
              {
                title: 'Custom Designs',
                description: 'Create your dream cake with our bespoke customization options.',
                color: '#C59FBE',
              },
              {
                title: 'Fresh Baked',
                description: 'Every cake is freshly baked to order, ensuring maximum freshness.',
                color: '#C6C870',
              },
              {
                title: 'Trusted by Many',
                description: 'Two years of countless celebrations and happy customers.',
                color: '#FAC1B5',
              },
              {
                title: 'Personal Service',
                description: 'WhatsApp support available for all your queries and concerns.',
                color: '#F283AE',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#FAC1B5]/20"
              >
                <div 
                  className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#2C2C2C] mb-2">{item.title}</h3>
                <p className="text-[#98898D]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
