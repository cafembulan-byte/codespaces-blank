import AnalyticsSection from '@/components/AnalyticsSection'
import GallerySection from '@/components/GallerySection'
import HeroSection from '@/components/HeroSection'
import MenuSection from '@/components/MenuSection'
import ReviewSection from '@/components/ReviewSection'

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <GallerySection />
      <MenuSection />
      <AnalyticsSection />
      <ReviewSection />
      <footer className="bg-[#2f1f16] py-10 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-amber-200/90">
            Harvest Grounds Coffee • Organic plantation tours, locally roasted beans, and a warm community experience.
          </p>
          <p className="mt-4 text-xs text-amber-200/70">Built with Next.js, Tailwind CSS, and a simple live analytics integration.</p>
        </div>
      </footer>
    </main>
  )
}
