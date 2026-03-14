import React, { useState } from 'react';
import { FiPlus, FiX, FiEdit } from 'react-icons/fi';

const ManagePackages = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        interestLimit: '',
        profileLimit: '',
        imageLimit: '',
        validity: '',
    });
    const [packages, setPackages] = useState([
        { id: 1, name: 'Basic', interestLimit: 50, profileLimit: 100, imageLimit: 5, validity: 30, price: 499, status: 'Active' },
        { id: 2, name: 'Premium', interestLimit: 150, profileLimit: 300, imageLimit: 10, validity: 90, price: 1299, status: 'Active' },
        { id: 3, name: 'VIP', interestLimit: -1, profileLimit: -1, imageLimit: 20, validity: 365, price: 4999, status: 'Disabled' },
    ]);

    const handleStatusToggle = (id) => {
        setPackages(packages.map(pkg =>
            pkg.id === id ? { ...pkg, status: pkg.status === 'Active' ? 'Disabled' : 'Active' } : pkg
        ));
    };

    const openAddModal = () => {
        setEditingPackage(null);
        setFormData({
            name: '',
            price: '',
            interestLimit: '',
            profileLimit: '',
            imageLimit: '',
            validity: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (pkg) => {
        setEditingPackage(pkg);
        setFormData({ ...pkg });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPackage(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const packageData = { ...formData, price: Number(formData.price), interestLimit: Number(formData.interestLimit), profileLimit: Number(formData.profileLimit), imageLimit: Number(formData.imageLimit), validity: Number(formData.validity) };

        if (editingPackage) {
            // Update existing package
            setPackages(packages.map(p => p.id === editingPackage.id ? { ...p, ...packageData } : p));
        } else {
            // Add new package
            setPackages([...packages, { ...packageData, id: Date.now(), status: 'Active' }]);
        }
        closeModal();
    };

    const renderLimit = (limit) => {
        return limit === -1 ? <span className="font-semibold text-green-600">Unlimited</span> : limit;
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-2xl font-bold text-gray-800">All Packages</h4>
                <button
                    onClick={openAddModal}
                    className="flex items-center bg-pink-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-700 transition-colors"
                >
                    <FiPlus className="mr-2" /> Add New
                </button>
            </div>

            {/* Packages Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">S.N</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Name</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Interest Express Limit</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Profile Show Limit</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Image Upload Limit</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Validity Period</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Price</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Status</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {packages.map((pkg, index) => (
                            <tr key={pkg.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4 font-medium">{pkg.name}</td>
                                <td className="py-3 px-4">{renderLimit(pkg.interestLimit)}</td>
                                <td className="py-3 px-4">{renderLimit(pkg.profileLimit)}</td>
                                <td className="py-3 px-4">{renderLimit(pkg.imageLimit)}</td>
                                <td className="py-3 px-4">{pkg.validity === -1 ? renderLimit(pkg.validity) : `${pkg.validity} Days`}</td>
                                <td className="py-3 px-4">₹{pkg.price.toLocaleString()}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pkg.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {pkg.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 flex items-center space-x-2">
                                    <button onClick={() => openEditModal(pkg)} className="text-blue-500 hover:text-blue-700 p-1"><FiEdit size={18} /></button>
                                    <button
                                        onClick={() => handleStatusToggle(pkg.id)}
                                        className={`px-3 py-1 text-xs rounded-md text-white ${pkg.status === 'Active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                    >
                                        {pkg.status === 'Active' ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Package Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-gray-800">{editingPackage ? 'Edit' : 'Add New'} Package</h4>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                                <FiX size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (in Rupees)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Express Limit</label>
                                    <input type="number" name="interestLimit" value={formData.interestLimit} onChange={handleChange} required placeholder="Enter -1 for unlimited" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Show Limit</label>
                                    <input type="number" name="profileLimit" value={formData.profileLimit} onChange={handleChange} required placeholder="Enter -1 for unlimited" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload Limit</label>
                                    <input type="number" name="imageLimit" value={formData.imageLimit} onChange={handleChange} required placeholder="Enter -1 for unlimited" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Validity Period (In Days)</label>
                                    <input type="number" name="validity" value={formData.validity} onChange={handleChange} required placeholder="Enter -1 for unlimited" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg mr-4 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-pink-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-pink-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePackages;