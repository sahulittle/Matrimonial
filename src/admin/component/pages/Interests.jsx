import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const Interests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 15;

    const names = [
        "James Smith", "Maria Garcia", "Robert Johnson", "Mary Williams", "Michael Brown", "Patricia Jones", "David Miller", "Jennifer Davis",
        "William Rodriguez", "Linda Martinez", "Richard Hernandez", "Elizabeth Lopez", "Joseph Gonzalez", "Susan Wilson", "Thomas Anderson", "Jessica Thomas",
        "Charles Taylor", "Sarah Moore", "Christopher Jackson", "Karen Martin", "Daniel Lee", "Nancy Perez", "Matthew Thompson", "Lisa White",
        "Anthony Harris", "Betty Sanchez", "Mark Clark", "Dorothy Ramirez", "Donald Lewis", "Sandra Robinson", "Steven Walker", "Ashley Young",
        "Paul Allen", "Kimberly King", "Andrew Wright", "Donna Scott", "Joshua Torres", "Carol Nguyen", "Kevin Hill", "Michelle Flores",
        "Brian Green", "Emily Adams", "George Nelson", "Helen Carter", "Edward Mitchell", "Amanda Perez", "Ronald Roberts", "Melissa Turner",
        "Timothy Phillips", "Deborah Campbell", "Jason Parker", "Stephanie Evans", "Jeffrey Edwards", "Rebecca Collins", "Ryan Stewart", "Laura Morris",
        "Jacob Rogers", "Sharon Reed", "Gary Cook", "Cynthia Morgan", "Nicholas Bell", "Kathleen Murphy", "Eric Bailey", "Amy Rivera",
        "Jonathan Cooper", "Shirley Richardson", "Stephen Cox", "Angela Howard", "Larry Ward", "Brenda Torres", "Justin Peterson", "Pamela Gray",
        "Scott Ramirez", "Nicole James", "Brandon Watson", "Emma Brooks", "Benjamin Kelly", "Rachel Sanders", "Samuel Price", "Catherine Bennett",
        "Gregory Wood", "Heather Barnes", "Frank Ross", "Diane Henderson", "Patrick Coleman", "Teresa Jenkins", "Walter Perry", "Evelyn Powell",
        "Dennis Long", "Christina Patterson", "Jerry Hughes", "Judith Flores", "Tyler Washington", "Martha Simmons", "Aaron Foster", "Cheryl Butler",
        "Henry Hughes", "Janet Washington", "Adam Simmons", "Joyce Foster", "Peter Butler", "Debra Hughes", "Willie Washington", "Frances Simmons"
    ];

    // Mock data for 100 user interests
    const interests = Array.from({ length: 100 }, (_, i) => {
        const userName = names[i];
        const profileName = names[99 - i];
        const userUsername = userName.toLowerCase().replace(/\s/g, '');
        const profileUsername = profileName.toLowerCase().replace(/\s/g, '');

        return {
            id: i + 1,
            user: { name: userName, username: userUsername, avatar: `https://i.pravatar.cc/150?u=${userUsername}` },
            profile: { name: profileName, username: profileUsername, avatar: `https://i.pravatar.cc/150?u=${profileUsername}` },
            status: i % 3 === 0 ? 'Accepted' : 'Pending'
        };
    });

    const filteredInterests = interests.filter(interest =>
        interest.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interest.profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentInterests = filteredInterests.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredInterests.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h4 className="text-2xl font-bold text-gray-800">User Interests</h4>
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search by user or profile..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Interests Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">S.N</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">User</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Profile</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Accept Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {currentInterests.map((interest, index) => (
                            <tr key={interest.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">{indexOfFirstUser + index + 1}</td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center">
                                        <img src={interest.user.avatar} alt={interest.user.name} className="w-10 h-10 rounded-full mr-4" />
                                        <div>
                                            <p className="font-medium text-gray-800">{interest.user.name}</p>
                                            <p className="text-sm text-gray-500">@{interest.user.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center">
                                        <img src={interest.profile.avatar} alt={interest.profile.name} className="w-10 h-10 rounded-full mr-4" />
                                        <div>
                                            <p className="font-medium text-gray-800">{interest.profile.name}</p>
                                            <p className="text-sm text-gray-500">@{interest.profile.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${interest.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {interest.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 mx-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 mx-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Interests;