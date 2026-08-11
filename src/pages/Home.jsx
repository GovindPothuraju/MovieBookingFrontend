
import HeroSection from "../components/HeroSection";
import SpecialOfferBar from "../components/SpecialOfferBar";
import Movies from "./Movies";
import MoreThanMovie from "../components/MoreThanMovie";
import BookingProcess from "../components/BookingProcess";
import CustomerReviews from "../components/CustomerReviews";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA"

const Home = () => {
  return (
    <div className="min-h-screen bg-[#080809] text-white">
      

      <main>
        <HeroSection />

        <SpecialOfferBar />

        <Movies />

        <MoreThanMovie />

        <BookingProcess />

        <CustomerReviews />

        <FAQ />

        <FinalCTA />

      </main>
    </div>
  );
};

export default Home;