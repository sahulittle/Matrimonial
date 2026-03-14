import React from "react";

const SuccessStory = () => {
  const stories = [
    {
      img: "https://whatknotin.wordpress.com/wp-content/uploads/2014/11/candid_wedding_photography-2431.jpg?w=584&h=390",
      title: "Priya & Rohan",
      description: "Found my soulmate when I least expected it. Thank you, MatriLab!",
    },
    {
      img: "https://d397bfy4gvgcdm.cloudfront.net/316996-Ceremony.jpeg",
      title: "Anjali & Vikram",
      description: "A perfect match that turned into a beautiful journey for life.",
    },
    {
      img: "https://harshstudiophotography.in/wp-content/uploads/2022/08/IMG_4150-1024x683.jpg",
      title: "Sneha & Amit",
      description: "Our families connected instantly, and so did we. It was magical.",
    },
    {
      img: "https://www.findbanquet.com/blog/wp-content/uploads/2023/10/79779-maharashtrian-wedding-the-dawn-studio-lead-image.jpeg",
      title: "Meera & Sameer",
      description: "From online chats to a lifetime of togetherness. A true blessing.",
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKoagtayjHCHagjmQJRT-6k85afWbJSb7J4A&s",
      title: "Kavita & Raj",
      description: "We shared the same values and dreams. It felt like destiny.",
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLDf9uNcvVAiR_1yBKZ7r7KKTV_ztf4L6Cgw&s",
      title: "Deepika & Arjun",
      description: "The search was long, but finding her was worth the wait.",
    },
    {
      img: "https://celebritieswedding.wordpress.com/wp-content/uploads/2017/02/candid-wedding-photography-651.jpg",
      title: "Aisha & Imran",
      description: "A modern love story with traditional roots. We are so happy.",
    },
    {
      img: "https://www.pixelworks.in/wp-content/uploads/2019/12/Saloni-Ishan-Wedding-Pixelworks-1023.jpg",
      title: "Riya & Karan",
      description: "Never thought I'd find love online, but MatriLab proved me wrong.",
    },
  ];

  return (
    <div className="py-16 bg-black">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-4xl font-bold text-white mb-4">Success Stories</h3>
        <p className="text-lg text-white max-w-3xl mx-auto mb-12">
          Our successful stories are too verse. These are awesome, romantic, like a dream.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {stories.map((story, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
              <img src={story.img} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-pink-600 bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex flex-col items-center justify-center p-4 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                <h4 className="text-xl font-bold mb-2">{story.title}</h4>
                <p className="text-sm text-center">{story.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStory;