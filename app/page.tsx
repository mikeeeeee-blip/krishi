import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Carousel from "@/components/Carousel";
import BestSellers from "@/components/BestSellers";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      <TopBar />
      <Header />
      <Navigation />
      <Carousel />
      <BestSellers />
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
