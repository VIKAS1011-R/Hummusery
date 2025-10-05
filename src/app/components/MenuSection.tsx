import React from "react";

type MenuItem = {
  name: string;
  price: string;
  desc: string;
  img: string;
};

const MenuSection: React.FC = () => {
  const menuItems: MenuItem[] = [
    { name: "Grilled Salmon", price: "$28", desc: "Fresh Atlantic salmon with herbs", img: "🐟" },
    { name: "Beef Tenderloin", price: "$32", desc: "Prime cut with truffle sauce", img: "🥩" },
    { name: "Pasta Carbonara", price: "$22", desc: "Classic Italian recipe", img: "🍝" },
    { name: "Caesar Salad", price: "$14", desc: "Crispy romaine with parmesan", img: "🥗" }
  ];

  return (
    <section id="menu" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">Our Signature Dishes</h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Handcrafted with love and the finest ingredients</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, idx) => (
            <div key={idx} className="bg-gray-900 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="text-6xl text-center py-8 bg-gradient-to-br from-orange-500/20 to-gray-800">{item.img}</div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-500">{item.price}</span>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm transition-colors" type="button">Order</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
