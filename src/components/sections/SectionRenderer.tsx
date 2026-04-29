import type { SectionConfig, HotelData } from '@/lib/data'
import Hero from './Hero'
import BannerHero from './BannerHero'
import BannerWithCta from './BannerWithCta'
import WhyBookDirectWithUs from './WhyBookDirectWithUs'
import AboutHotel from './AboutHotel'
import AboutThePlace from './AboutThePlace'
import RoomTypeList from './RoomTypeList'
import RoomList from './RoomList'
import RoomDetails from './RoomDetails'
import RulesAndPolicies from './RulesAndPolicies'
import Amenities from './Amenities'
import FeaturedAmenities from './FeaturedAmenities'
import RoomAmenities from './RoomAmenities'
import HotelAmenities from './HotelAmenities'
import Gallery from './Gallery'
import GalleryPage from './GalleryPage'
import Restaurant from './Restaurant'
import RestaurantDescription from './RestaurantDescription'
import RestaurantTiming from './RestaurantTiming'
import Reviews from './Reviews'
import Faqs from './Faqs'
import HowToReachUs from './HowToReachUs'
import MapAndLocation from './MapAndLocation'
import InstagramFeed from './InstagramFeed'
import LocalAttraction from './LocalAttraction'
import Experiences from './Experiences'
import FeaturedExperiences from './FeaturedExperiences'
import ContactUs from './ContactUs'
import TermsAndConditions from './TermsAndConditions'

const COMPONENTS: Record<string, React.ComponentType<{ section: SectionConfig; hotelData: HotelData }>> = {
  Hero,
  BannerHero,
  BannerWithCta,
  WhyBookDirectWithUs,
  AboutHotel,
  AboutThePlace,
  RoomTypeList,
  RoomList,
  RoomDetails,
  RulesAndPolicies,
  Amenities,
  FeaturedAmenities,
  RoomAmenities,
  HotelAmenities,
  Gallery,
  GalleryPage,
  Restaurant,
  RestaurantDescription,
  RestaurantTiming,
  Reviews,
  Faqs,
  HowToReachUs,
  MapAndLocation,
  InstagramFeed,
  LocalAttraction,
  Experiences,
  FeaturedExperiences,
  ContactUs,
  TermsAndConditions,
}

interface Props {
  section: SectionConfig
  hotelData: HotelData
}

export default function SectionRenderer({ section, hotelData }: Props) {
  if (!section.isVisible) return null
  const Component = COMPONENTS[section.component]
  if (!Component) return null
  return <Component section={section} hotelData={hotelData} />
}
