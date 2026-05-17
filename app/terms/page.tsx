export const metadata = {
  title: 'Terms & Conditions - Minas Bakeshop',
  description: 'Read our terms and conditions before placing an order at Minas Bakeshop.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 px-6 md:px-12 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-[#2C2C2C] mb-8">Terms & Conditions</h1>

        <div className="bg-white rounded-xl p-8 border border-[#FAC1B5]/20 shadow-sm">
          <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6">General Terms</h2>
          
          <ul className="space-y-4 text-[#2C2C2C] leading-relaxed list-disc list-outside pl-5">
            <li>
              All details must be clearly provided in the details section. We will not be responsible for any errors or missing information if the required details are not included.
            </li>
            <li>
              All orders must be placed at least 48 hours in advance to ensure sufficient time for processing and preparation.
            </li>
            <li>
              Once the order is placed, our team will contact you on WhatsApp within 12 hours with complete payment and account details. Please share the payment screenshot there, after which your order will be confirmed.
            </li>
            <li>
              Add-ons are sourced from third-party vendors; therefore, Minas Bakeshop does not assume any responsibility for their quality.
            </li>
            <li>
              Fresh flowers and chocolates are procured on the day of the order; therefore, availability may vary. The company reserves the right to substitute the type or design of flowers based on market availability. Additionally, color differences in flowers may occur based on the best match available in the market.
            </li>
            <li>
              For deliveries, please check the delivery charges from Nawab Town to your desired location. Delivery is handled by a third-party company, and Minas Bakeshop acts solely as a facilitating party. Minas Bakeshop is not liable for any product damage, delays, or cancellation caused by the third-party delivery service. Customers are advised to check the product before making payment. Once payment has been made, Minas Bakeshop will not be responsible for any damage claims.
            </li>
          </ul>

          <h3 className="text-xl font-serif text-[#2C2C2C] mt-8 mb-4">Custom Orders</h3>
          
          <p className="text-[#2C2C2C] leading-relaxed mb-4">
            Custom orders are subject to all general terms and conditions stated above, in addition to the following terms:
          </p>
          
          <ul className="space-y-4 text-[#2C2C2C] leading-relaxed list-disc list-outside pl-5">
            <li>
              The custom order form must be completed only after finalizing the order with our representative via Instagram or WhatsApp.
            </li>
            <li>
              We do not guarantee 100% replication of designs. Minor variations may occur due to technical limitations.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
