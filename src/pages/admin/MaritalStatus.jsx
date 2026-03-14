import React, { useState } from 'react';
import { FiPlus, FiX, FiEdit, FiTrash2 } from 'react-icons/fi';

const MaritalStatus = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaritalStatus, setEditingMaritalStatus] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [maritalStatuses, setMaritalStatuses] = useState([
        { id: 1, name: 'Single' },
        { id: 2, name: 'Married' },
        { id: 3, name: 'Divorced' },
        { id: 4, name: 'Widowed' },
        { id: 5, name: 'Annulled' },
    ]);

    const openAddModal = () => {
        setEditingMaritalStatus(null);
        setFormData({ name: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (status) => {
        setEditingMaritalStatus(status);
        setFormData({ name: status.name });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMaritalStatus(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, name: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingMaritalStatus) {
            setMaritalStatuses(maritalStatuses.map(s => s.id === editingMaritalStatus.id ? { ...s, name: formData.name } : s));
        } else {
            setMaritalStatuses([...maritalStatuses, { id: Date.now(), name: formData.name }]);
        }
        closeModal();
    };

    const handleDelete = (id) => {
        setMaritalStatuses(maritalStatuses.filter(s => s.id !== id));
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-2xl font-bold text-gray-800">Marital Status</h4>
                <button
                    onClick={openAddModal}
                    className="flex items-center bg-pink-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-700 transition-colors"
                >
                    <FiPlus className="mr-2" /> Add New
                </button>
            </div>

            {/* Marital Statuses Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase w-1/6">S.N</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Name</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase w-1/4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {maritalStatuses.map((status, index) => (
                            <tr key={status.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4 font-medium">{status.name}</td>
                                <td className="py-3 px-4 flex items-center space-x-4">
                                    <button onClick={() => openEditModal(status)} className="text-blue-500 hover:text-blue-700 p-1"><FiEdit size={18} /></button>
                                    <button onClick={() => handleDelete(status.id)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Marital Status Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-gray-800">{editingMaritalStatus ? 'Edit' : 'Add'} Marital Status</h4>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg mr-4 hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="bg-pink-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-pink-700">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaritalStatus;