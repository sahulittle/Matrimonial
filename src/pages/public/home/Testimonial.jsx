import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaQuoteLeft } from "react-icons/fa";
import "swiper/css";
import "swiper/css/autoplay";

const Testimonial = () => {
  const testimonials = [
    {
      quote:
        "Marathi Shubha Vivah made my partner search simple and stress-free. The profiles are genuine and perfectly match our community values.",
      name: "Pooja Deshmukh",
      location: "Pune, Maharashtra",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      quote:
        "I was unsure about online matrimony, but this platform gave me confidence. Within a few months, I found the right person. Truly thankful!",
      name: "Amit Patil",
      location: "Kolhapur, Maharashtra",
      image: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      quote:
        "The best part is the quality and authenticity of profiles. It feels safe and trustworthy for both families and individuals.",
      name: "Snehal Joshi",
      location: "Nagpur, Maharashtra",
      image: "https://randomuser.me/api/portraits/women/46.jpg",
    },
    {
      quote:
        "A wonderful experience! The platform is easy to use and the support team is very helpful. I found my life partner here.",
      name: "Rahul Kulkarni",
      location: "Nashik, Maharashtra",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      quote:
        "I loved the advanced filters and detailed profiles. It helped me find someone who truly matches my expectations and values.",
      name: "Vaishnavi Chavan",
      location: "Aurangabad, Maharashtra",
      image: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
      quote:
        "Marathi Shubha Vivah connected us in the most beautiful way. Today, we are happily married and grateful for this platform.",
      name: "Siddharth Pawar",
      location: "Mumbai, Maharashtra",
      image: "https://randomuser.me/api/portraits/men/47.jpg",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-4">Testimonials</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          Real stories, real love: Hear from our happy couples who found their
          perfect match through Matrilab. See how our platform helped them
          fulfill their dreams.
        </p>

        <div className="py-12">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="px-4">
                  <div className="bg-fuchsia-200 rounded-lg shadow-lg p-8 h-full flex flex-col justify-between min-h-80">
                    <FaQuoteLeft className="text-pink-400 text-3xl mb-4" />
                    <p className="text-gray-600 italic mb-6 grow">
                      "{testimonial.quote}"
                    </p>

                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full mr-4 border-2 border-pink-200"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800 text-left">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-500 text-sm text-left">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
