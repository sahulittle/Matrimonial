import React, { useState } from 'react';

const Members = () => {
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
    ];

    const [height, setHeight] = useState(5); // Default height 5ft

    const formatHeight = (value) => {
        const feet = Math.floor(value);
        const inches = Math.round((value - feet) * 12);
        if (inches === 12) {
            return `${feet + 1} ft 0 in`;
        }
        return `${feet} ft ${inches} in`;
    };

   const userNames = [
        "Aarav Sharma", "Vivaan Singh", "Aditya Kumar", "Vihaan Patel", "Arjun Gupta",
        "Sai Reddy", "Reyansh Joshi", "Ayaan Khan", "Krishna Mehta", "Ishaan Ali",
        "Saanvi Sharma", "Aanya Singh", "Aadhya Kumar", "Ananya Patel", "Diya Gupta",
        "Pari Reddy", "Myra Joshi", "Aarohi Khan", "Riya Mehta", "Anika Ali",
        "Rohan Verma", "Priya Jain", "Amit Das", "Sneha Rao", "Vikram Nair",
        "Anjali Menon", "Sameer Iyer", "Meera Pillai", "Rajesh Kumar", "Kavita Shah",
        "Arjun Reddy", "Deepika Singh", "Imran Khan", "Aisha Begum", "Karan Malhotra",
        "Riya Kapoor", "Suresh Babu", "Lakshmi Devi", "Manoj Tiwari", "Sunita Yadav",
        "Anil Agarwal", "Pooja Mishra", "Sanjay Reddy", "Geeta Sharma", "Vijay Patil",
        "Rekha Desai", "Ashok Kumar", "Usha Rani", "Naresh Gupta", "Sarita Choudhary"
    ];

    // Generate 50 dummy members
    const membersData = Array.from({ length: 50 }, (_, i) => {
        const maritalStatuses = ['Single', 'Divorced', 'Widow'];
        const genders = ['Male', 'Female'];
        const lookingForGenders = ['Female', 'Male'];
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const languages = ['Hindi', 'English', 'Marathi', 'Bengali', 'Tamil', 'Telugu'];
        const gender = genders[i % 2];
        const lookingFor = lookingForGenders[i % 2];

        return {
            id: i + 1,
            username: userNames[i],
            lookingFor: lookingFor,
            age: 22 + (i % 24), // Ages 22 to 45
            maritalStatus: maritalStatuses[i % maritalStatuses.length],
            language: languages[i % languages.length],
            presentAddress: `City ${i + 1}, ${indianStates[i % indianStates.length]}, India`,
            permanentAddress: `City ${i + 1}, ${indianStates[i % indianStates.length]}, India`,
            gender: gender,
            bloodGroup: bloodGroups[i % bloodGroups.length],
            height: `${5 + Math.floor(i / 10)} ft ${i % 12} in`,
            photo: `https://randomuser.me/api/portraits/${gender.toLowerCase()}/${i}.jpg`
        };
    });

    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 10;

    // Get current members for the page
    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = membersData.slice(indexOfFirstMember, indexOfLastMember);
    const totalPages = Math.ceil(membersData.length / membersPerPage);

    return (
        <div className="container mx-auto px-6 py-16 mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Side - Filter Section */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
                    <h4 className="text-xl font-bold text-gray-800 mb-6">Member Filter</h4>
                    <form className="space-y-6">
                        {/* Height Range */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Height</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="0.0833"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-center text-gray-600 mt-2">{formatHeight(height)}</div>
                        </div>

                        {/* Looking For */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Looking For</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-700">
                                <option value="bride">Bride</option>
                                <option value="groom">Groom</option>
                            </select>
                        </div>

                        {/* Marital Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Marital Status</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-700">
                                <option value="">Select Status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                                <option value="widow">Widow</option>
                            </select>
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">State</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-700">
                                <option value="">Select State</option>
                                {indianStates.map((state, idx) => (
                                    <option key={idx} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        {/* Profession */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Profession</label>
                            <input type="text" placeholder="Profession" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">City</label>
                            <input type="text" placeholder="City" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
                        </div>

                        {/* Smoking Habits */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Smoking Habits</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-700">
                                <option value="non-smoker">Non-Smoker</option>
                                <option value="smoker">Smoker</option>
                            </select>
                        </div>

                        {/* Drinking Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Drinking Status</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-700">
                                <option value="non-drinker">Non-Drinker</option>
                                <option value="drinker">Drinker</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full py-3 mt-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg">
                            Search
                        </button>
                    </form>
                </div>

                {/* Right Side - Members List */}
                <div className="lg:col-span-3 space-y-6">
                    {currentMembers.map(member => (
                        <div key={member.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row gap-6">
                            {/* Profile Photo */}
                            <div className="w-36 h-36 flex-shrink-0">
                                <img
                                    src={member.photo}
                                    alt="Profile"
                                    className="rounded-lg w-full h-full object-cover"
                                />
                            </div>
                            {/* Member Details */}
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-pink-600">{member.username}</h3>
                                <p className="text-gray-500 mb-4">Looking For: {member.lookingFor}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                                    <p><span className="font-semibold">Age:</span> {member.age} Years</p>
                                    <p><span className="font-semibold">Gender:</span> {member.gender}</p>
                                    <p><span className="font-semibold">Marital Status:</span> {member.maritalStatus}</p>
                                    <p><span className="font-semibold">Blood Group:</span> {member.bloodGroup}</p>
                                    <p><span className="font-semibold">Language:</span> {member.language}</p>
                                    <p><span className="font-semibold">Height:</span> {member.height}</p>
                                    <p className="md:col-span-2"><span className="font-semibold">Present Address:</span> {member.presentAddress}</p>
                                    <p className="md:col-span-2"><span className="font-semibold">Permanent Address:</span> {member.permanentAddress}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-8 space-x-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-700 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Members;