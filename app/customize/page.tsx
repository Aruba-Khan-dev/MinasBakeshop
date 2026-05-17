import MultiStepForm from '@/components/multi-step-form';

export const metadata = {
  title: 'Create Your Perfect Custom Cake - Minas Bakeshop',
  description: 'Design your custom cake with our easy 6-step form. Choose flavours, sizes, customization options, and delivery details.',
};

export default function CustomizePage() {
  return (
    <>
      <MultiStepForm />
    </>
  );
}
