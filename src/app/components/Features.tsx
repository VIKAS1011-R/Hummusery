import React from "react";
import { ChefHat, Clock, Star } from "lucide-react";

type Feature = {
  icon: React.ReactElement;
  title: string;
  desc: string;
};

const Features: React.FC = () => {
  const features: Feature[] = [
    { icon: <ChefHat className="h-8 w-8" />, title: "Expert Chefs", desc: "Award-winning culinary team" },
    { icon: <Clock className="h-8 w-8" />, title: "Quick Service", desc: "Fast and efficient dining" },
    { icon: <Star className="h-8 w-8" />, title: "Premium Quality", desc: "Fresh, locally sourced ingredients" }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="text-orange-500 flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
